import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Clock, Pill, User } from 'lucide-react';

const MedicationModal = ({ isOpen, onClose, onAddMedication, members }) => {
  const [formData, setFormData] = useState({
    name: '',
    dosage: '',
    time: '',
    patient: '',
    frequency: 'daily',
    notes: '',
    currentStock: 30,
    lowStockThreshold: 7,
    refillReminder: true,
    refillDaysBefore: 7
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.dosage || !formData.time || !formData.patient) {
      alert('Please fill in all required fields');
      return;
    }

    const newMedication = {
      id: Date.now(),
      name: formData.name,
      dosage: formData.dosage,
      time: formData.time,
      patient: formData.patient,
      frequency: formData.frequency,
      notes: formData.notes,
      currentStock: formData.currentStock,
      lowStockThreshold: formData.lowStockThreshold,
      refillReminder: formData.refillReminder,
      refillDaysBefore: formData.refillDaysBefore,
      status: 'upcoming',
      addedDate: new Date().toISOString()
    };

    onAddMedication(newMedication);
    setFormData({
      name: '',
      dosage: '',
      time: '',
      patient: '',
      frequency: 'daily',
      notes: '',
      currentStock: 30,
      lowStockThreshold: 7,
      refillReminder: true,
      refillDaysBefore: 7
    });
    onClose();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[300] flex items-start justify-center pt-20 p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative bg-white dark:bg-card-bg rounded-3xl shadow-2xl w-full max-w-md p-6 max-h-[calc(100vh-6rem)] overflow-y-auto mt-4"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <Pill size={20} className="text-primary" />
              </div>
              <h2 className="text-xl font-bold text-secondary">Add Medication</h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-secondary mb-2">
                Medication Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="e.g., Paracetamol"
                className="w-full px-4 py-3 rounded-xl border border-border bg-gray-50 dark:bg-bg-main focus:border-primary focus:outline-none transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-secondary mb-2">
                Dosage *
              </label>
              <input
                type="text"
                name="dosage"
                value={formData.dosage}
                onChange={handleInputChange}
                placeholder="e.g., 500mg"
                className="w-full px-4 py-3 rounded-xl border border-border bg-gray-50 dark:bg-bg-main focus:border-primary focus:outline-none transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-secondary mb-2">
                Time *
              </label>
              <input
                type="time"
                name="time"
                value={formData.time}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-xl border border-border bg-gray-50 dark:bg-bg-main focus:border-primary focus:outline-none transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-secondary mb-2">
                Patient *
              </label>
              <select
                name="patient"
                value={formData.patient}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-xl border border-border bg-gray-50 dark:bg-bg-main focus:border-primary focus:outline-none transition-colors"
                required
              >
                <option value="">Select Patient</option>
                {members.map((member) => (
                  <option key={member.id} value={member.name}>
                    {member.name}
                  </option>
                ))}
                <option value="Self">Self</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-secondary mb-2">
                Frequency
              </label>
              <select
                name="frequency"
                value={formData.frequency}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-xl border border-border bg-gray-50 dark:bg-bg-main focus:border-primary focus:outline-none transition-colors"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="as_needed">As Needed</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-secondary mb-2">
                Notes
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                placeholder="Additional notes or instructions..."
                rows={3}
                className="w-full px-4 py-3 rounded-xl border border-border bg-gray-50 dark:bg-bg-main focus:border-primary focus:outline-none transition-colors resize-none"
              />
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-bold text-secondary border-b border-border pb-2">Stock & Refill Settings</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-secondary mb-2">
                    Current Stock
                  </label>
                  <input
                    type="number"
                    name="currentStock"
                    value={formData.currentStock}
                    onChange={handleInputChange}
                    min="0"
                    className="w-full px-4 py-3 rounded-xl border border-border bg-gray-50 dark:bg-bg-main focus:border-primary focus:outline-none transition-colors"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-secondary mb-2">
                    Low Stock Alert
                  </label>
                  <input
                    type="number"
                    name="lowStockThreshold"
                    value={formData.lowStockThreshold}
                    onChange={handleInputChange}
                    min="0"
                    className="w-full px-4 py-3 rounded-xl border border-border bg-gray-50 dark:bg-bg-main focus:border-primary focus:outline-none transition-colors"
                  />
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <label className="block text-sm font-semibold text-secondary mb-2">
                  Refill Reminder
                </label>
                <input
                  type="checkbox"
                  name="refillReminder"
                  checked={formData.refillReminder}
                  onChange={(e) => setFormData(prev => ({ ...prev, refillReminder: e.target.checked }))}
                  className="w-5 h-5 text-primary rounded focus:ring-primary"
                />
              </div>
              
              {formData.refillReminder && (
                <div>
                  <label className="block text-sm font-semibold text-secondary mb-2">
                    Remind {formData.refillDaysBefore} days before running out
                  </label>
                  <input
                    type="range"
                    name="refillDaysBefore"
                    value={formData.refillDaysBefore}
                    onChange={handleInputChange}
                    min="1"
                    max="14"
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>1 day</span>
                    <span>{formData.refillDaysBefore} days</span>
                    <span>14 days</span>
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-3 rounded-xl border border-border text-gray-600 dark:text-gray-400 font-semibold hover:bg-gray-50 dark:hover:bg-bg-main transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-6 py-3 rounded-xl bg-primary text-white font-semibold shadow-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
              >
                <Plus size={18} />
                Add Medication
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default MedicationModal;
