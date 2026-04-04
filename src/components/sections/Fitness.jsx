import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Dumbbell, Activity, Timer, Zap, Plus, Flame } from 'lucide-react';

const Fitness = () => {
    const stats = [
        { name: 'Steps Today', value: '8,432', unit: 'steps', icon: Activity, color: 'text-primary' },
        { name: 'Active Time', value: '45', unit: 'mins', icon: Timer, color: 'text-amber-500' },
        { name: 'Calories', value: '320', unit: 'kcal', icon: Flame, color: 'text-red-500' }
    ];

    return (
        <div className="max-w-6xl mx-auto font-sans">
            <div className="mb-14 flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-gray-100">
                <div>
                    <h2 className="text-2xl font-extrabold text-secondary mb-3 uppercase tracking-tight">🏃 Fitness Tracker</h2>
                    <p className="text-sm font-bold text-text-dim italic leading-relaxed">Monitor your physical activity and hit your daily workout milestones.</p>
                </div>
                <button className="bg-primary text-white px-8 py-3.5 rounded-2xl font-black shadow-lg hover:bg-green-700 transition-all flex items-center gap-2">
                    <Plus size={20} /> Add Workout
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                {stats.map((s, i) => (
                    <motion.div
                        key={s.name}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-white p-8 rounded-[3rem] border border-border shadow-sm flex items-center gap-6 group hover:border-primary transition-all overflow-hidden relative"
                    >
                        <div className={`absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity`}>
                            <s.icon size={120} />
                        </div>
                        <div className={`w-14 h-14 bg-gray-50 ${s.color} rounded-2xl flex items-center justify-center border border-gray-100 group-hover:bg-primary group-hover:text-white transition-all`}>
                            <s.icon size={28} />
                        </div>
                        <div className="relative z-10">
                            <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest">{s.name}</h4>
                            <div className="flex items-baseline gap-1">
                                <span className="text-3xl font-black text-secondary tracking-tighter">{s.value}</span>
                                <span className="text-sm font-bold text-text-dim uppercase tracking-widest">{s.unit}</span>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-secondary p-10 rounded-[3rem] text-white flex flex-col justify-between overflow-hidden relative group">
                    <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:opacity-20 transition-opacity"><Zap size={160} /></div>
                    <div className="relative z-10 flex flex-col gap-6">
                        <div className="bg-primary/20 w-12 h-12 rounded-2xl flex items-center justify-center text-primary border border-primary/20">
                            <Zap size={24} />
                        </div>
                        <h3 className="text-2xl font-bold">Weekly Fitness Score: 84</h3>
                        <p className="text-gray-400 font-bold leading-relaxed mb-6 italic">"You are in the top 15% of active users this week! Maintaining this streak will boost your cardiovascular health by up to 20% over 6 months."</p>
                        <div className="w-full bg-white/10 h-3 rounded-full overflow-hidden">
                            <motion.div animate={{ width: '84%' }} className="h-full bg-primary shadow-[0_0_15px_rgba(39,174,96,0.5)]" />
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-1 bg-white p-10 rounded-[3rem] border border-border shadow-sm flex flex-col items-center justify-center text-center">
                    <div className="w-16 h-16 bg-gray-50 rounded-[2.5rem] flex items-center justify-center mb-6 text-primary border border-gray-100 shadow-xl">
                        <Dumbbell size={32} />
                    </div>
                    <h4 className="text-xl font-bold text-secondary mb-2">Detailed Reports</h4>
                    <p className="text-text-dim font-bold italic max-w-xs leading-relaxed">Workout heatmaps and heart-rate recovery analytics coming soon. 📉</p>
                </div>
            </div>
        </div>
    );
};

export default Fitness;
