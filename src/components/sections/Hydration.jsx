import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Droplet, Plus, Trophy, Waves, Droplets } from 'lucide-react';

const Hydration = () => {
  const [glasses, setGlasses] = useState(6);
  const [target] = useState(12);

  const addGlass = () => {
    if (glasses < target) {
      setGlasses(prev => prev + 1);
    }
  };

  return (
    <div className="max-w-4xl mx-auto font-sans">
      <div className="mb-14 text-center pb-6 border-b border-gray-100 dark:border-border">
        <h2 className="text-2xl font-extrabold text-secondary mb-3 uppercase tracking-tight">💧 Hydration Tracker</h2>
        <p className="text-sm font-bold text-text-dim italic leading-relaxed">Stay refreshed and earn health points for every glass of water.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div className="bg-card-bg p-8 rounded-[2.5rem] border border-border shadow-sm text-center">
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6">Daily Progress</h3>
            <div className="relative w-48 h-48 mx-auto flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                    <circle cx="96" cy="96" r="88" fill="none" stroke="#f3f4f6" strokeWidth="12" />
                    <motion.circle 
                        cx="96" cy="96" r="88" fill="none" stroke="#3498db" strokeWidth="12" 
                        strokeDasharray={552}
                        animate={{ strokeDashoffset: 552 - (552 * (glasses / target)) }}
                        transition={{ duration: 1 }}
                    />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-4xl font-black text-secondary">{glasses}</span>
                    <span className="text-[10px] font-bold text-text-dim uppercase tracking-tighter">of {target} glasses</span>
                </div>
            </div>
            <button 
              onClick={addGlass}
              className="mt-10 bg-[#3498db] text-white px-10 py-4 rounded-2xl font-black shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 mx-auto"
            >
                <Droplets size={20} /> Log Water Glass
            </button>
        </div>

        <div className="bg-secondary p-10 rounded-[3rem] text-white flex flex-col justify-between overflow-hidden relative group">
           <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:opacity-20 transition-opacity"><Trophy size={120} /></div>
           <div className="relative z-10">
              <h3 className="text-2xl font-bold mb-4 flex items-center gap-3"><Trophy className="text-primary" /> Daily Milestone</h3>
              <p className="text-gray-400 font-bold leading-relaxed mb-10 italic">"Drinking 8 glasses a day keeps your metabolism high and skin glowing! You're {Math.min(100, Math.round((glasses/8)*100))}% of the way there."</p>
              <div className="w-full bg-white/10 h-3 rounded-full overflow-hidden">
                <motion.div animate={{ width: `${Math.min(100, (glasses/8)*100)}%` }} className="h-full bg-primary" />
              </div>
           </div>
           <p className="mt-8 text-[10px] font-black uppercase text-gray-500 tracking-widest">Points Earned: {glasses * 10} HP</p>
        </div>
      </div>
    </div>
  );
};

export default Hydration;
