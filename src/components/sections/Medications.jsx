import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Pill, Clock, Plus, Trash2, CheckCircle2 } from 'lucide-react';

const Medications = ({ members }) => {
  const [meds, setMeds] = React.useState([
    { id: 1, name: 'Paracetamol', dosage: '500mg', time: '08:00 AM', status: 'taken', patient: 'Rahul' },
    { id: 2, name: 'Amoxicillin', dosage: '250mg', time: '12:00 PM', status: 'urgent', patient: 'Priyanshu' },
    { id: 3, name: 'Vitamin D3', dosage: '60k IU', time: '09:00 PM', status: 'upcoming', patient: 'Anjali' }
  ]);

  const toggleStatus = (id) => {
    setMeds(meds.map(m => 
      m.id === id ? { ...m, status: m.status === 'taken' ? 'upcoming' : 'taken' } : m
    ));
  };

  return (
    <div className="max-w-6xl mx-auto font-sans">
      <div className="mb-14 flex justify-between items-center pb-6 border-b border-gray-100">
        <div>
          <h2 className="text-2xl font-extrabold text-secondary mb-3 uppercase tracking-tight">💊 Medication Tracker</h2>
          <p className="text-sm font-bold text-text-dim italic leading-relaxed">Stay on top of your family's prescriptions and daily vitamins.</p>
        </div>
        <button className="bg-primary text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-lg hover:bg-green-700 transition-colors">
          <Plus size={20} /> Add Medication
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {meds.map((m, index) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`p-6 rounded-3xl border border-border shadow-sm flex flex-col gap-4 relative overflow-hidden transition-all bg-white group hover:border-primary`}
            >
              <div className="flex justify-between items-start">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg transition-colors ${m.status === 'urgent' ? 'bg-[#ff7675] animate-pulse' : m.status === 'taken' ? 'bg-primary' : 'bg-secondary'}`}>
                  <Pill size={24} />
                </div>
                <div className="text-right">
                   <span className="text-[10px] font-black uppercase text-gray-400 block tracking-widest">Scheduled For</span>
                   <span className="text-sm font-black text-secondary uppercase px-2 py-1 bg-gray-100 rounded-lg">{m.time}</span>
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

              <div className="flex gap-3 pt-4 border-t border-gray-50">
                <button 
                  onClick={() => toggleStatus(m.id)}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-black transition-all ${m.status === 'taken' ? 'bg-gray-100 text-gray-400' : 'bg-primary text-white shadow-md hover:bg-green-700'}`}
                >
                  {m.status === 'taken' ? <CheckCircle2 size={16} /> : <Clock size={16} />} 
                  {m.status === 'taken' ? 'TAKEN' : 'MARK TAKEN'}
                </button>
                <button className="p-3 bg-gray-50 text-gray-300 rounded-xl hover:text-red-500 hover:bg-red-50 transition-all">
                  <Trash2 size={16} />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Medications;
