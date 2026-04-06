class MedicationHistory {
  constructor() {
    this.storageKey = 'carebuddy_medication_history';
  }

  logDose(medicationId, medicationName, patient, dosage, status = 'taken') {
    const history = this.getHistory();
    const doseEntry = {
      id: Date.now(),
      medicationId,
      medicationName,
      patient,
      dosage,
      status,
      timestamp: new Date().toISOString(),
      date: new Date().toLocaleDateString()
    };

    history.push(doseEntry);
    this.saveHistory(history);
    return doseEntry;
  }

  getHistory(medicationId = null, patient = null, dateRange = null) {
    const history = JSON.parse(localStorage.getItem(this.storageKey) || '[]');
    
    let filteredHistory = history;
    
    if (medicationId) {
      filteredHistory = filteredHistory.filter(entry => entry.medicationId === medicationId);
    }
    
    if (patient) {
      filteredHistory = filteredHistory.filter(entry => entry.patient === patient);
    }
    
    if (dateRange) {
      const { start, end } = dateRange;
      filteredHistory = filteredHistory.filter(entry => {
        const entryDate = new Date(entry.timestamp);
        return entryDate >= start && entryDate <= end;
      });
    }
    
    return filteredHistory.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  }

  getComplianceStats(medicationId, days = 30) {
    const history = this.getHistory(medicationId);
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    const recentHistory = history.filter(entry => new Date(entry.timestamp) >= cutoffDate);
    
    const totalDoses = recentHistory.length;
    const takenDoses = recentHistory.filter(entry => entry.status === 'taken').length;
    const missedDoses = recentHistory.filter(entry => entry.status === 'missed').length;
    
    const complianceRate = totalDoses > 0 ? (takenDoses / totalDoses) * 100 : 0;
    
    return {
      totalDoses,
      takenDoses,
      missedDoses,
      complianceRate: Math.round(complianceRate),
      period: days
    };
  }

  getPatientCompliance(patient, days = 30) {
    const history = this.getHistory(null, patient);
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    const recentHistory = history.filter(entry => new Date(entry.timestamp) >= cutoffDate);
    
    const medicationStats = {};
    
    recentHistory.forEach(entry => {
      if (!medicationStats[entry.medicationName]) {
        medicationStats[entry.medicationName] = {
          total: 0,
          taken: 0,
          missed: 0
        };
      }
      
      medicationStats[entry.medicationName].total++;
      if (entry.status === 'taken') {
        medicationStats[entry.medicationName].taken++;
      } else if (entry.status === 'missed') {
        medicationStats[entry.medicationName].missed++;
      }
    });
    
    Object.keys(medicationStats).forEach(med => {
      const stats = medicationStats[med];
      stats.complianceRate = stats.total > 0 ? Math.round((stats.taken / stats.total) * 100) : 0;
    });
    
    return medicationStats;
  }

  markMissedDose(medicationId, medicationName, patient, dosage) {
    return this.logDose(medicationId, medicationName, patient, dosage, 'missed');
  }

  saveHistory(history) {
    localStorage.setItem(this.storageKey, JSON.stringify(history));
  }

  clearHistory() {
    localStorage.removeItem(this.storageKey);
  }
}

export const medicationHistory = new MedicationHistory();
