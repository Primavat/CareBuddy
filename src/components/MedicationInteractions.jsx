import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Info, Shield, X, ChevronDown, ChevronUp } from 'lucide-react';
import { medicationInteractionChecker } from '../utils/medicationInteractions';

const MedicationInteractions = ({ medications, patientConditions = [] }) => {
  const [interactions, setInteractions] = useState([]);
  const [contraindications, setContraindications] = useState([]);
  const [expandedInteraction, setExpandedInteraction] = useState(null);

  useEffect(() => {
    updateInteractions();
  }, [medications, patientConditions]);

  const updateInteractions = () => {
    const interactionList = medicationInteractionChecker.checkInteractions(medications);
    const contraindicationList = [];
    
    medications.forEach(med => {
      const medContraindications = medicationInteractionChecker.checkContraindications(med.name, patientConditions);
      contraindicationList.push(...medContraindications);
    });
    
    setInteractions(interactionList);
    setContraindications(contraindicationList);
  };

  const getSeverityColor = (severity) => {
    return medicationInteractionChecker.getInteractionSeverityColor(severity);
  };

  const getSeverityIcon = (severity) => {
    return medicationInteractionChecker.getInteractionIcon(severity);
  };

  const hasHighRiskInteractions = interactions.some(i => i.severity === 'High') || 
                                 contraindications.some(c => c.severity === 'High');

  return (
    <div className="bg-white dark:bg-card-bg rounded-3xl shadow-lg border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-secondary flex items-center gap-2">
          <Shield size={20} className="text-primary" />
          Medication Interactions
        </h3>
        
        {hasHighRiskInteractions && (
          <div className="flex items-center gap-2 px-3 py-1 bg-red-100 dark:bg-red-900/30 rounded-full">
            <AlertTriangle size={16} className="text-red-600" />
            <span className="text-xs font-semibold text-red-600">High Risk Detected</span>
          </div>
        )}
      </div>

      {/* Contraindications */}
      {contraindications.length > 0 && (
        <div className="mb-6">
          <h4 className="text-sm font-bold text-red-600 mb-3 flex items-center gap-2">
            <AlertTriangle size={16} />
            Contraindications ({contraindications.length})
          </h4>
          <div className="space-y-2">
            {contraindications.map((contraindication, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-3 rounded-lg border ${getSeverityColor(contraindication.severity)}`}
              >
                <div className="flex items-start gap-2">
                  <span className="text-lg">{getSeverityIcon(contraindication.severity)}</span>
                  <div className="flex-1">
                    <p className="text-sm font-semibold">
                      {contraindication.medication} - {contraindication.condition}
                    </p>
                    <p className="text-xs mt-1 opacity-75">
                      This medication should not be used with this condition
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Drug Interactions */}
      {interactions.length > 0 && (
        <div>
          <h4 className="text-sm font-bold text-secondary mb-3 flex items-center gap-2">
            <Info size={16} />
            Drug Interactions ({interactions.length})
          </h4>
          <div className="space-y-2">
            {interactions.map((interaction, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div
                  className={`p-3 rounded-lg border ${getSeverityColor(interaction.severity)} cursor-pointer hover:shadow-md transition-shadow`}
                  onClick={() => setExpandedInteraction(
                    expandedInteraction === index ? null : index
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{getSeverityIcon(interaction.severity)}</span>
                      <div>
                        <p className="text-sm font-semibold">
                          {interaction.medication1} + {interaction.medication2}
                        </p>
                        <p className="text-xs opacity-75">
                          {interaction.severity} Risk
                        </p>
                      </div>
                    </div>
                    {expandedInteraction === index ? (
                      <ChevronUp size={16} />
                    ) : (
                      <ChevronDown size={16} />
                    )}
                  </div>
                  
                  {expandedInteraction === index && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-3 pt-3 border-t border-current/20"
                    >
                      <p className="text-xs leading-relaxed">
                        {interaction.description}
                      </p>
                      <div className="mt-2 flex gap-2">
                        <span className="text-xs px-2 py-1 bg-current/10 rounded">
                          {interaction.severity} Severity
                        </span>
                        <span className="text-xs px-2 py-1 bg-current/10 rounded">
                          Monitor closely
                        </span>
                      </div>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* No Interactions */}
      {interactions.length === 0 && contraindications.length === 0 && (
        <div className="text-center py-8 text-gray-500 dark:text-text-dim">
          <Shield size={48} className="mx-auto mb-3 opacity-30" />
          <p className="text-sm font-semibold">No interactions detected</p>
          <p className="text-xs mt-1">Current medications appear safe to use together</p>
        </div>
      )}

      {/* Disclaimer */}
      <div className="mt-6 p-4 bg-gray-50 dark:bg-bg-main rounded-xl border border-border">
        <p className="text-xs text-gray-500 dark:text-text-dim leading-relaxed">
          <strong>Disclaimer:</strong> This interaction checker provides general information only and should not replace professional medical advice. Always consult with your healthcare provider or pharmacist about potential medication interactions. This tool may not detect all possible interactions.
        </p>
      </div>
    </div>
  );
};

export default MedicationInteractions;
