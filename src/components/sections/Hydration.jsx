import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Droplet, Plus, Trophy, Waves } from 'lucide-react';

const Hydration = () => {
  const [glasses, setGlasses] = useState(0);

  return (
    <div className="max-w-4xl mx-auto font-sans">
      <div className="mb-14 text-center pb-6 border-b border-gray-100">
        <h2 className="text-2xl font-extrabold text-secondary mb-3 uppercase tracking-tight">💧 Hydration Tracker</h2>
        <p className="text-sm font-bold text-text-dim italic leading-relaxed">Stay refreshed and earn health points for every glass of water.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div className="bg-white p-10 rounded-[3rem] border border-border shadow-soft flex flex-col items-center justify-center relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-10 text-primary opacity-5 group-hover:opacity-10 transition-opacity"><Waves size={160} /></div>
          
          <div className="relative z-10 flex flex-col items-center">
            <motion.div 
               animate={{ y: [0, -10, 0] }} 
               transition={{ repeat: Infinity, duration: 2 }}
               className="w-24 h-24 bg-primary/10 rounded-[2.5rem] flex items-center justify-center text-primary mb-8 border border-primary/20 shadow-inner shadow-primary/20"
            >
              <Droplet size={48} fill="currentColor" />
            </motion.div>
            
            <div className="flex items-baseline gap-2 mb-8">
              <span className="text-6xl font-black text-secondary tracking-tighter">{glasses}</span>
              <span className="text-xl font-bold text-text-dim uppercase tracking-widest">Glasses</span>
            </div>

            <button 
              onClick={() => setGlasses(glasses + 1)}
              className="bg-primary text-white w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg hover:bg-green-700 transition-all flex items-center justify-center gap-2"
            >
              <Plus size={18} fill="currentColor" /> Add 250ml Glass
            </button>
          </div>
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
