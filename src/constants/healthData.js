export const VACCINE_SCHEDULE = [
    // --- INFANT (0-12 Months) ---
    { id: 'bcg', name: 'BCG (Tuberculosis)', ageMonths: 0, description: 'Single dose given at birth.' },
    { id: 'hepb1', name: 'Hepatitis B (Dose 1)', ageMonths: 0, description: 'At birth or within 24 hours.' },
    { id: 'polio1', name: 'Polio (IPV/OPV)', ageMonths: 1.5, description: '6 weeks old.' },
    { id: 'dtap1', name: 'DTaP (Dose 1)', ageMonths: 2, description: 'Protects against Diphtheria, Tetanus, Pertussis.' },
    { id: 'rota1', name: 'Rotavirus (Dose 1)', ageMonths: 2, description: 'Prevents severe diarrhea.' },
    { id: 'pneu1', name: 'Pneumococcal (Dose 1)', ageMonths: 2, description: 'Protects against pneumonia.' },
    { id: 'mmr1', name: 'MMR (Dose 1)', ageMonths: 9, description: 'Measles, Mumps, Rubella.' },

    // --- CHILD / TEEN (1-18 Years) ---
    { id: 'var1', name: 'Varicella (Chickenpox)', ageMonths: 12, description: '1 year old.' },
    { id: 'hepa1', name: 'Hepatitis A', ageMonths: 13, description: '1.5 years old.' },
    { id: 'typh1', name: 'Typhoid (Booster)', ageMonths: 24, description: 'Every 2-3 years.' },
    { id: 'hpv1', name: 'HPV (Dose 1)', ageMonths: 120, description: 'Around 10-12 years old.' },
    { id: 'mening', name: 'Meningococcal', ageMonths: 132, description: 'Prevents meningitis.' },

    // --- ADULT (18+) ---
    { id: 'tdap_boost', name: 'Tdap Booster', ageMonths: 240, description: 'Every 10 years for adults.' },
    { id: 'flu_annual', name: 'Annual Flu Vaccine', ageMonths: 6, description: 'Recommended seasonal vaccine.' },
    { id: 'covid_boost', name: 'COVID-19 Follow-up', ageMonths: 192, description: 'Annual recommended booster.' },
    { id: 'shing', name: 'Shingles Vaccine', ageMonths: 600, description: 'Recommended for age 50+.' }
];
