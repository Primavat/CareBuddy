import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Calendar, User, Pill, CheckCircle, XCircle } from 'lucide-react';
import { medicationHistory } from '../utils/medicationHistory';

const MedicationCompliance = ({ medications, members }) => {
  const [complianceData, setComplianceData] = useState({});
  const [selectedPeriod, setSelectedPeriod] = useState(7);
  const [selectedPatient, setSelectedPatient] = useState('all');

  useEffect(() => {
    updateComplianceData();
  }, [medications, selectedPeriod, selectedPatient]);

  const updateComplianceData = () => {
    const data = {};
    
    medications.forEach(med => {
      if (selectedPatient !== 'all' && med.patient !== selectedPatient) return;
      
      const stats = medicationHistory.getComplianceStats(med.id, selectedPeriod);
      data[med.name] = stats;
    });
    
    setComplianceData(data);
  };

  const getOverallCompliance = () => {
    const values = Object.values(complianceData);
    if (values.length === 0) return 0;
    
    const totalCompliance = values.reduce((sum, stat) => sum + stat.complianceRate, 0);
    return Math.round(totalCompliance / values.length);
  };

  const getComplianceColor = (rate) => {
    if (rate >= 80) return 'text-green-600 bg-green-100';
    if (rate >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getComplianceIcon = (rate) => {
    if (rate >= 80) return <TrendingUp size={16} className="text-green-600" />;
    if (rate >= 60) return <TrendingDown size={16} className="text-yellow-600" />;
    return <TrendingDown size={16} className="text-red-600" />;
  };

  return (
    <div className="bg-white dark:bg-card-bg rounded-3xl shadow-lg border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-secondary flex items-center gap-2">
          <CheckCircle size={20} className="text-primary" />
          Compliance Tracking
        </h3>
        
        <div className="flex gap-2">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(Number(e.target.value))}
            className="px-3 py-2 text-sm rounded-lg border border-border bg-gray-50 dark:bg-bg-main focus:border-primary focus:outline-none"
          >
            <option value={7}>Last 7 days</option>
            <option value={30}>Last 30 days</option>
            <option value={90}>Last 90 days</option>
          </select>
          
          <select
            value={selectedPatient}
            onChange={(e) => setSelectedPatient(e.target.value)}
            className="px-3 py-2 text-sm rounded-lg border border-border bg-gray-50 dark:bg-bg-main focus:border-primary focus:outline-none"
          >
            <option value="all">All Patients</option>
            {members.map(member => (
              <option key={member.id} value={member.name}>{member.name}</option>
            ))}
            <option value="Self">Self</option>
          </select>
        </div>
      </div>

      {/* Overall Compliance */}
      <div className="mb-6 p-4 bg-gradient-to-r from-primary/10 to-blue-50 dark:from-primary/20 dark:to-blue-900/20 rounded-2xl">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-gray-600 dark:text-text-dim">Overall Compliance</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-2xl font-bold text-primary">{getOverallCompliance()}%</span>
              {getComplianceIcon(getOverallCompliance())}
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500 dark:text-text-dim/70">Period: {selectedPeriod} days</p>
            <p className="text-xs text-gray-500 dark:text-text-dim/70">{Object.keys(complianceData).length} medications</p>
          </div>
        </div>
      </div>

      {/* Individual Medication Compliance */}
      <div className="space-y-3">
        {Object.entries(complianceData).map(([medName, stats], index) => (
          <motion.div
            key={medName}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-4 border border-border rounded-xl hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Pill size={16} className="text-primary" />
                <span className="font-semibold text-secondary">{medName}</span>
              </div>
              <span className={`px-2 py-1 rounded-lg text-xs font-semibold ${getComplianceColor(stats.complianceRate)}`}>
                {stats.complianceRate}%
              </span>
            </div>
            
            <div className="grid grid-cols-3 gap-4 text-xs">
              <div className="text-center">
                <p className="text-gray-500 dark:text-text-dim">Taken</p>
                <p className="font-semibold text-green-600">{stats.takenDoses}</p>
              </div>
              <div className="text-center">
                <p className="text-gray-500 dark:text-text-dim">Missed</p>
                <p className="font-semibold text-red-600">{stats.missedDoses}</p>
              </div>
              <div className="text-center">
                <p className="text-gray-500 dark:text-text-dim">Total</p>
                <p className="font-semibold text-secondary">{stats.totalDoses}</p>
              </div>
            </div>
            
            <div className="mt-3">
              <div className="w-full h-2 bg-gray-200 dark:bg-border rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${stats.complianceRate}%` }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className={`h-full ${stats.complianceRate >= 80 ? 'bg-green-500' : stats.complianceRate >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`}
                />
              </div>
            </div>
          </motion.div>
        ))}
        
        {Object.keys(complianceData).length === 0 && (
          <div className="text-center py-8 text-gray-500 dark:text-text-dim">
            <Pill size={48} className="mx-auto mb-3 opacity-30" />
            <p className="text-sm font-semibold">No compliance data available</p>
            <p className="text-xs mt-1">Start taking medications to see compliance tracking</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MedicationCompliance;
