import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Pill, Clock, Plus, Trash2, CheckCircle2, Bell, BarChart3, Shield } from 'lucide-react';
import { medicationReminderSystem } from '../../utils/medicationReminders';
import { medicationHistory } from '../../utils/medicationHistory';
import { refillMonitor } from '../../utils/refillMonitor';
import { medicationInteractionChecker } from '../../utils/medicationInteractions';
import MedicationModal from '../MedicationModal';
import MedicationCompliance from '../MedicationCompliance';
import MedicationInteractions from '../MedicationInteractions';

const Medications = ({ members, medications, setMedications }) => {
  const [meds, setMeds] = React.useState(medications.length > 0 ? medications : [
    { id: 1, name: 'Paracetamol', dosage: '500mg', time: '08:00 AM', status: 'taken', patient: 'Rahul' },
    { id: 2, name: 'Amoxicillin', dosage: '250mg', time: '12:00 PM', status: 'urgent', patient: 'Priyanshu' },
    { id: 3, name: 'Vitamin D3', dosage: '60k IU', time: '09:00 PM', status: 'upcoming', patient: 'Anjali' }
  ]);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showCompliance, setShowCompliance] = useState(false);
  const [showInteractions, setShowInteractions] = useState(false);

  // Sync with parent component state
  useEffect(() => {
    setMedications(meds);
  }, [meds, setMedications]);

  useEffect(() => {
    // Initialize reminder system
    medicationReminderSystem.initialize();
    
    // Initialize refill monitor
    refillMonitor.initialize();

    // Add all current medications to reminder system
    meds.forEach(med => {
      if (med.status !== 'taken') {
        medicationReminderSystem.addReminder(med);
      }
    });

    return () => {
      medicationReminderSystem.destroy();
      refillMonitor.destroy();
    };
  }, []);

  useEffect(() => {
    // Update reminders when meds change
    meds.forEach(med => {
      if (med.status !== 'taken') {
        medicationReminderSystem.updateReminder(med);
      } else {
        medicationReminderSystem.removeReminder(med.id);
      }
    });
  }, [meds]);

  const toggleStatus = (id) => {
    const medication = meds.find(m => m.id === id);
    const newStatus = medication.status === 'taken' ? 'upcoming' : 'taken';
    
    setMeds(meds.map(m => 
      m.id === id ? { ...m, status: newStatus } : m
    ));
    
    // Log to history
    if (newStatus === 'taken') {
      medicationHistory.logDose(
        medication.id,
        medication.name,
        medication.patient,
        medication.dosage,
        'taken'
      );
    }
  };

  const addMedication = (newMedication) => {
    setMeds([...meds, newMedication]);
  };

  const deleteMedication = (id) => {
    setMeds(meds.filter(m => m.id !== id));
  };

  const testPhoneNotification = async () => {
    try {
      const result = await medicationReminderSystem.testNotifications('9913390910');
      if (result.success) {
        alert('Test notification sent successfully to 9913390910! Check console for details.');
      } else {
        alert('Test notification failed. Check console for details.');
      }
    } catch (error) {
      console.error('Test notification error:', error);
      alert('Test notification failed. Check console for details.');
    }
  };

  const formatTime = (time) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  return (
    <div className="max-w-6xl mx-auto font-sans">
      <div className="mb-10 flex justify-between items-center pb-6 border-b border-gray-100 dark:border-border">
        <div>
          <h2 className="text-2xl font-extrabold text-secondary mb-3 uppercase tracking-tight">💊 Medication Tracker</h2>
          <p className="text-sm font-bold text-text-dim italic leading-relaxed">Stay on top of your family's prescriptions and daily vitamins.</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button 
            onClick={() => setShowCompliance(!showCompliance)}
            className={`px-4 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-lg transition-colors ${
              showCompliance 
                ? 'bg-primary text-white' 
                : 'bg-gray-100 dark:bg-border text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            <BarChart3 size={20} /> {showCompliance ? 'Hide' : 'Show'} Compliance
          </button>
          <button 
            onClick={() => setShowInteractions(!showInteractions)}
            className={`px-4 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-lg transition-colors ${
              showInteractions 
                ? 'bg-primary text-white' 
                : 'bg-gray-100 dark:bg-border text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            <Shield size={20} /> {showInteractions ? 'Hide' : 'Show'} Interactions
          </button>
          <button 
            onClick={testPhoneNotification}
            className="px-4 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors"
          >
            📱 Test SMS
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-primary text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-lg hover:bg-green-700 transition-colors"
          >
            <Plus size={20} /> Add Medication
          </button>
        </div>
      </div>
      
      {/* Interaction Checker Section */}
      <AnimatePresence>
        {showInteractions && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-8 overflow-hidden"
          >
            <MedicationInteractions medications={meds} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Compliance Tracking Section */}
      <AnimatePresence>
        {showCompliance && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-8 overflow-hidden"
          >
            <MedicationCompliance medications={meds} members={members} />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Sticky Progress Summarry (Compact) */}
        <div className="w-full lg:w-64 sticky top-24 z-10">
            <div className="bg-secondary p-5 rounded-[2rem] shadow-xl border border-white/10 text-text-on-filled">
                <div className="flex items-center justify-between mb-4">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">Today's Progress</p>
                    <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center">
                        <CheckCircle2 size={16} className="text-primary" />
                    </div>
                </div>
                <div className="mb-4">
                    <h3 className="text-3xl font-black">{Math.round((meds.filter(m => m.status === 'taken').length / meds.length) * 100)}%</h3>
                    <p className="text-[10px] font-bold text-text-on-filled/50 uppercase mt-1">Doses Completed</p>
                </div>
                <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${(meds.filter(m => m.status === 'taken').length / meds.length) * 100}%` }}
                        className="h-full bg-primary"
                    />
                </div>
                <div className="mt-4 flex gap-2">
                    <span className="text-[9px] font-black bg-white/10 px-2 py-1 rounded-md uppercase tracking-tighter">Taken: {meds.filter(m => m.status === 'taken').length}</span>
                    <span className="text-[9px] font-black bg-white/10 px-2 py-1 rounded-md uppercase tracking-tighter">Left: {meds.filter(m => m.status !== 'taken').length}</span>
                </div>
            </div>
        </div>

        {/* Scrolling Med List */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
        <AnimatePresence>
          {meds.map((m, index) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`p-6 rounded-3xl border border-border shadow-sm flex flex-col gap-4 relative overflow-hidden transition-all bg-card-bg group hover:border-primary`}
            >
              <div className="flex justify-between items-start">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg transition-colors ${m.status === 'urgent' ? 'bg-[#ff7675] animate-pulse text-white' : m.status === 'taken' ? 'bg-primary text-white' : 'bg-secondary text-text-on-filled'}`}>
                  <Pill size={24} />
                </div>
                <div className="text-right">
                   <span className="text-[10px] font-black uppercase text-gray-400 block tracking-widest">Scheduled For</span>
                   <span className="text-sm font-black text-secondary uppercase px-2 py-1 bg-gray-100 dark:bg-border rounded-lg">{m.time}</span>
                </div>
              </div>

              <div>
                <h4 className="text-xl font-bold text-secondary">{m.name} ({m.dosage})</h4>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs font-bold text-primary px-2 py-0.5 bg-primary/10 rounded-md">Patient: {m.patient}</span>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${m.status === 'urgent' ? 'bg-red-100 text-red-600' : m.status === 'taken' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'}`}>
                    {m.status.toUpperCase()}
                  </span>
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-50 dark:border-border">
                <button 
                  onClick={() => toggleStatus(m.id)}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-black transition-all ${m.status === 'taken' ? 'bg-gray-100 dark:bg-border text-gray-400' : 'bg-primary text-white shadow-md hover:bg-green-700'}`}
                >
                  {m.status === 'taken' ? <CheckCircle2 size={16} /> : <Clock size={16} />} 
                  {m.status === 'taken' ? 'TAKEN' : 'MARK TAKEN'}
                </button>
                <button 
                  onClick={() => deleteMedication(m.id)}
                  className="p-3 bg-gray-50 dark:bg-bg-main text-gray-300 rounded-xl hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      </div>
      
      <MedicationModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddMedication={addMedication}
        members={members}
      />
    </div>
  );
};

export default Medications;
