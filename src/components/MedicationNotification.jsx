import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Pill, X, Clock, AlertTriangle, Package } from 'lucide-react';

const MedicationNotification = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const handleMedicationReminder = (event) => {
      const medication = event.detail;
      
      setNotifications(prev => [
        ...prev,
        {
          id: `${medication.id}-${Date.now()}-reminder`,
          type: 'reminder',
          medication,
          timestamp: new Date()
        }
      ]);

      // Auto-remove after 10 seconds
      setTimeout(() => {
        setNotifications(prev => prev.filter(n => 
          n.id !== `${medication.id}-${Date.now()}-reminder`
        ));
      }, 10000);
    };

    const handleMedicationAlert = (event) => {
      const alert = event.detail;
      
      setNotifications(prev => [
        ...prev,
        {
          id: `${alert.medication.id}-${Date.now()}-alert`,
          type: 'alert',
          alert,
          timestamp: new Date()
        }
      ]);

      // Auto-remove after 15 seconds for alerts
      setTimeout(() => {
        setNotifications(prev => prev.filter(n => 
          n.id !== `${alert.medication.id}-${Date.now()}-alert`
        ));
      }, 15000);
    };

    window.addEventListener('medicationReminder', handleMedicationReminder);
    window.addEventListener('medicationAlert', handleMedicationAlert);
    
    return () => {
      window.removeEventListener('medicationReminder', handleMedicationReminder);
      window.removeEventListener('medicationAlert', handleMedicationAlert);
    };
  }, []);

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <div className="fixed top-4 right-4 z-[200] space-y-2 max-w-sm">
      <AnimatePresence>
        {notifications.map((notification) => (
        <motion.div
          key={notification.id}
          initial={{ opacity: 0, x: 300, scale: 0.8 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 300, scale: 0.8 }}
          className={`bg-white dark:bg-card-bg border-l-4 rounded-lg shadow-lg p-4 flex items-start gap-3 ${
            notification.type === 'alert' 
              ? 'border-orange-500' 
              : 'border-red-500'
          }`}
        >
          <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
            notification.type === 'alert'
              ? 'bg-orange-100 dark:bg-orange-900/30'
              : 'bg-red-100 dark:bg-red-900/30'
          }`}>
            {notification.type === 'alert' ? (
              <AlertTriangle size={20} className="text-orange-600 dark:text-orange-400" />
            ) : (
              <Pill size={20} className="text-red-600 dark:text-red-400" />
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <h4 className="font-bold text-sm text-gray-900 dark:text-secondary mb-1">
              {notification.type === 'alert' ? 'Medication Alert' : 'Medication Reminder'}
            </h4>
            
            {notification.type === 'alert' ? (
              <p className="text-xs text-gray-600 dark:text-text-dim">
                {notification.alert.message}
              </p>
            ) : (
              <>
                <p className="text-xs text-gray-600 dark:text-text-dim">
                  Time to take <span className="font-semibold">{notification.medication.name}</span> ({notification.medication.dosage})
                </p>
                <p className="text-xs text-gray-500 dark:text-text-dim/70 mt-1">
                  Patient: {notification.medication.patient}
                </p>
              </>
            )}
          </div>
          
          <button
            onClick={() => removeNotification(notification.id)}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <X size={16} />
          </button>
        </motion.div>
      ))}
      </AnimatePresence>
    </div>
  );
};

export default MedicationNotification;
