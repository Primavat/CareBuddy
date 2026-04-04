import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Moon, Sun, Wind, Sparkles, MessageSquareHeart } from 'lucide-react';

const MentalHealth = () => {
  const metrics = [
    { name: 'Sleep Quality', value: '7.5', unit: 'hrs', icon: Moon, color: 'text-indigo-500' },
    { name: 'Stress Level', value: 'Low', unit: 'Stable', icon: Wind, color: 'text-primary' },
    { name: 'Mindfulness', value: '20', unit: 'mins', icon: Sparkles, color: 'text-amber-500' }
  ];

  return (
    <div className="max-w-6xl mx-auto font-sans">
      <div className="mb-14 pb-6 border-b border-gray-100">
        <h2 className="text-2xl font-extrabold text-secondary mb-3 uppercase tracking-tight">🧠 Mental Health & Wellness</h2>
        <p className="text-sm font-bold text-text-dim italic leading-relaxed">Monitor your emotional landscape, sleep cycles, and stress trends over time.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        {metrics.map((m, i) => (
          <motion.div
            key={m.name}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-8 rounded-[3rem] border border-border flex items-center gap-6 group hover:border-primary transition-all shadow-sm"
          >
            <div className={`w-14 h-14 bg-gray-50 ${m.color} rounded-2xl flex items-center justify-center border border-gray-100 group-hover:bg-primary group-hover:text-white transition-all`}>
              <m.icon size={28} />
            </div>
            <div>
              <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{m.name}</h4>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-black text-secondary tracking-tighter">{m.value}</span>
                <span className="text-xs font-bold text-text-dim uppercase tracking-widest">{m.unit}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-secondary p-10 rounded-[3rem] text-white flex flex-col justify-between overflow-hidden relative group">
           <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:opacity-20 transition-opacity"><MessageSquareHeart size={160} /></div>
           <div className="relative z-10 flex flex-col gap-6">
              <div className="bg-primary/20 w-12 h-12 rounded-2xl flex items-center justify-center text-primary border border-primary/20 shadow-lg">
                <Brain size={24} />
              </div>
              <h3 className="text-2xl font-bold">Resilience Insights</h3>
              <p className="text-gray-400 font-bold leading-relaxed mb-6 italic">"Your stress levels are down by 14% compared to last week. Your consistent 7+ hours of sleep and daily mindfulness sessions are building significant psychological resilience!"</p>
              <div className="flex gap-4">
                 <button className="bg-primary text-white px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest shadow-md hover:bg-green-700 transition-colors">Start Meditation</button>
                 <button className="bg-white/10 text-white px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest border border-white/10 hover:bg-white/20 transition-colors">Log Emotion</button>
              </div>
           </div>
        </div>

        <div className="bg-gray-50 border-2 border-dashed border-border rounded-[3rem] p-10 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-white shadow-xl rounded-[2rem] flex items-center justify-center mb-6 text-primary border border-gray-100"><Sun size={32} /></div>
            <h4 className="text-xl font-bold text-secondary mb-2 uppercase tracking-tight">Therapy Companion</h4>
            <p className="text-text-dim font-bold italic max-w-sm leading-relaxed mb-6">Connect with professional therapists and emotional counselors directly from your CareBuddy dashboard. 🫂</p>
            <div className="bg-amber-100 text-amber-700 px-4 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest animate-pulse shadow-sm">Premium Feature - Launching Soon</div>
        </div>
      </div>
    </div>
  );
};

export default MentalHealth;
