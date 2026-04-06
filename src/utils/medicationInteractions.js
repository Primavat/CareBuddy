class MedicationInteractionChecker {
  constructor() {
    // Common medication interactions database
    this.interactionDatabase = {
      'Warfarin': {
        'Aspirin': 'High risk - Increased bleeding risk',
        'Ibuprofen': 'High risk - Increased bleeding risk',
        'NSAIDs': 'High risk - Increased bleeding risk',
        'Amoxicillin': 'Moderate risk - May affect INR levels',
        'Ciprofloxacin': 'Moderate risk - May affect INR levels'
      },
      'Aspirin': {
        'Warfarin': 'High risk - Increased bleeding risk',
        'Ibuprofen': 'High risk - Increased gastrointestinal bleeding risk',
        'NSAIDs': 'High risk - Increased gastrointestinal bleeding risk',
        'Alcohol': 'Moderate risk - Increased stomach irritation'
      },
      'Ibuprofen': {
        'Warfarin': 'High risk - Increased bleeding risk',
        'Aspirin': 'High risk - Increased gastrointestinal bleeding risk',
        'NSAIDs': 'High risk - Increased gastrointestinal bleeding risk',
        'ACE Inhibitors': 'Moderate risk - May reduce kidney function',
        'Diuretics': 'Moderate risk - May reduce kidney function'
      },
      'Lisinopril': {
        'Potassium Supplements': 'High risk - Hyperkalemia',
        'Potassium-sparing Diuretics': 'High risk - Hyperkalemia',
        'NSAIDs': 'Moderate risk - May reduce kidney function',
        'Alcohol': 'Low risk - May increase blood pressure'
      },
      'Metformin': {
        'Iodinated Contrast': 'High risk - Lactic acidosis',
        'Alcohol': 'Moderate risk - Increased lactic acidosis risk',
        'Diuretics': 'Low risk - May affect blood sugar'
      },
      'Simvastatin': {
        'Grapefruit Juice': 'High risk - Increased statin levels',
        'Clarithromycin': 'High risk - Increased risk of muscle damage',
        'Erythromycin': 'High risk - Increased risk of muscle damage',
        'Fibrates': 'Moderate risk - Increased risk of muscle damage'
      },
      'Sertraline': {
        'MAO Inhibitors': 'High risk - Serotonin syndrome',
        'Tramadol': 'Moderate risk - Increased seizure risk',
        'NSAIDs': 'Low risk - Increased bleeding risk'
      },
      'Alcohol': {
        'Aspirin': 'Moderate risk - Increased stomach irritation',
        'Ibuprofen': 'Moderate risk - Increased stomach irritation',
        'Metformin': 'Moderate risk - Increased lactic acidosis risk',
        'Benzodiazepines': 'High risk - Increased sedation',
        'Opioids': 'High risk - Increased sedation and respiratory depression'
      }
    };

    // Common contraindications
    this.contraindications = {
      'Warfarin': [
        'Active bleeding',
        'Severe liver disease',
        'Pregnancy (especially first trimester)',
        'Recent major surgery'
      ],
      'Aspirin': [
        'Active ulcer disease',
        'Bleeding disorders',
        'Severe kidney disease',
        'Children with viral illnesses (Reye syndrome risk)'
      ],
      'NSAIDs': [
        'Active ulcer disease',
        'Severe heart failure',
        'Severe kidney disease',
        'Pregnancy (third trimester)'
      ],
      'Metformin': [
        'Severe kidney disease',
        'Acute or unstable heart failure',
        'Metabolic acidosis'
      ],
      'Beta Blockers': [
        'Severe asthma',
        'Severe COPD',
        'Heart block without pacemaker'
      ]
    };
  }

  checkInteractions(medications) {
    const interactions = [];
    const medicationNames = medications.map(med => this.normalizeMedicationName(med.name));
    
    for (let i = 0; i < medicationNames.length; i++) {
      for (let j = i + 1; j < medicationNames.length; j++) {
        const med1 = medicationNames[i];
        const med2 = medicationNames[j];
        
        // Check both directions in the interaction database
        const interaction1 = this.findInteraction(med1, med2);
        const interaction2 = this.findInteraction(med2, med1);
        
        if (interaction1) {
          interactions.push({
            medication1: med1,
            medication2: med2,
            severity: this.getSeverity(interaction1),
            description: interaction1
          });
        } else if (interaction2) {
          interactions.push({
            medication1: med2,
            medication2: med1,
            severity: this.getSeverity(interaction2),
            description: interaction2
          });
        }
      }
    }
    
    return interactions.sort((a, b) => {
      const severityOrder = { 'High': 3, 'Moderate': 2, 'Low': 1 };
      return severityOrder[b.severity] - severityOrder[a.severity];
    });
  }

  findInteraction(med1, med2) {
    // Direct match
    if (this.interactionDatabase[med1] && this.interactionDatabase[med1][med2]) {
      return this.interactionDatabase[med1][med2];
    }
    
    // Check for class-based interactions
    return this.checkClassInteractions(med1, med2);
  }

  checkClassInteractions(med1, med2) {
    const classes = {
      'NSAIDs': ['Ibuprofen', 'Naproxen', 'Diclofenac', 'Celecoxib', 'Aspirin'],
      'Beta Blockers': ['Metoprolol', 'Propranolol', 'Atenolol', 'Lisinopril'],
      'ACE Inhibitors': ['Lisinopril', 'Enalapril', 'Ramipril'],
      'Statins': ['Simvastatin', 'Atorvastatin', 'Rosuvastatin'],
      'SSRIs': ['Sertraline', 'Fluoxetine', 'Escitalopram'],
      'MAO Inhibitors': ['Phenelzine', 'Selegiline', 'Isocarboxazid']
    };
    
    // Find classes for each medication
    const med1Class = Object.keys(classes).find(className => 
      classes[className].some(med => med.toLowerCase().includes(med1.toLowerCase()) || 
                                   med1.toLowerCase().includes(med.toLowerCase()))
    );
    
    const med2Class = Object.keys(classes).find(className => 
      classes[className].some(med => med.toLowerCase().includes(med2.toLowerCase()) || 
                                   med2.toLowerCase().includes(med.toLowerCase()))
    );
    
    if (med1Class && med2Class && this.interactionDatabase[med1Class] && this.interactionDatabase[med1Class][med2Class]) {
      return this.interactionDatabase[med1Class][med2Class];
    }
    
    return null;
  }

  getSeverity(interaction) {
    if (interaction.includes('High risk')) return 'High';
    if (interaction.includes('Moderate risk')) return 'Moderate';
    if (interaction.includes('Low risk')) return 'Low';
    return 'Moderate'; // Default
  }

  normalizeMedicationName(name) {
    // Remove common dosage and format information
    return name
      .replace(/\d+mg/gi, '')
      .replace(/\d+IU/gi, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  checkContraindications(medication, patientConditions = []) {
    const normalizedMed = this.normalizeMedicationName(medication);
    const contraindications = [];
    
    // Check medication-specific contraindications
    Object.keys(this.contraindications).forEach(med => {
      if (normalizedMed.toLowerCase().includes(med.toLowerCase()) || 
          med.toLowerCase().includes(normalizedMed.toLowerCase())) {
        this.contraindications[med].forEach(condition => {
          if (patientConditions.some(pc => 
            pc.toLowerCase().includes(condition.toLowerCase()) || 
            condition.toLowerCase().includes(pc.toLowerCase()))) {
            contraindications.push({
              medication: med,
              condition: condition,
              severity: 'High'
            });
          }
        });
      }
    });
    
    return contraindications;
  }

  getInteractionSeverityColor(severity) {
    switch (severity) {
      case 'High': return 'text-red-600 bg-red-100 border-red-200';
      case 'Moderate': return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      case 'Low': return 'text-blue-600 bg-blue-100 border-blue-200';
      default: return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  }

  getInteractionIcon(severity) {
    switch (severity) {
      case 'High': return '⚠️';
      case 'Moderate': return '⚡';
      case 'Low': return 'ℹ️';
      default: return '📋';
    }
  }
}

export const medicationInteractionChecker = new MedicationInteractionChecker();
