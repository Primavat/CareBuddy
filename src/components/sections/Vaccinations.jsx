import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Syringe, Calendar, CheckCircle2, Clock, Plus, FileText } from 'lucide-react';
import { VACCINE_SCHEDULE } from '../../constants/healthData';

const Vaccinations = () => {
    const [filter, setFilter] = useState('all');
    const [vaccines, setVaccines] = useState(() => {
        // Initialize from constants and add a status field
        return VACCINE_SCHEDULE.map(v => ({
            ...v,
            status: v.ageMonths === 0 ? 'Completed' : 'Upcoming',
            member: 'Current User'
        }));
    });

    const markAsDone = (id) => {
        setVaccines(vaccines.map(v => 
            v.id === id ? { ...v, status: 'Completed' } : v
        ));
    };

    const filteredVaccines = filter === 'all' 
        ? vaccines 
        : vaccines.filter(v => v.status.toLowerCase() === filter.toLowerCase());

    const completedCount = vaccines.filter(v => v.status === 'Completed').length;
    const progressPerc = Math.round((completedCount / vaccines.length) * 100);

    return (
        <div className="max-w-6xl mx-auto font-sans">
            <div className="mb-14 flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-gray-100">
                <div>
                    <h2 className="text-2xl font-extrabold text-secondary mb-3 uppercase tracking-tight">💉 Immunization Hub</h2>
                    <p className="text-sm font-bold text-text-dim italic leading-relaxed">Keep track of essential healthcare milestones for you and your family.</p>
                </div>
                <div className="flex bg-gray-100 p-1 rounded-xl">
                    {['all', 'upcoming', 'completed'].map((f) => (
                        <button 
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-4 py-2 rounded-lg text-xs font-black uppercase transition-all ${filter === f ? 'bg-primary text-white shadow-md' : 'text-gray-400 hover:text-secondary'}`}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
                <div className="lg:col-span-2 space-y-4">
                    <AnimatePresence mode='popLayout'>
                        {filteredVaccines.map((v, i) => (
                            <motion.div 
                                key={v.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ delay: i * 0.05 }}
                                className="bg-white p-6 rounded-[2.5rem] border border-border flex items-center gap-6 group hover:border-primary transition-all shadow-sm"
                            >
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border transition-all ${v.status === 'Completed' ? 'bg-green-50 text-primary border-primary/20' : 'bg-gray-50 text-gray-400 border-gray-100 group-hover:bg-primary group-hover:text-white group-hover:border-primary'}`}>
                                    <Syringe size={24} />
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h4 className="text-lg font-black text-secondary leading-tight">{v.name}</h4>
                                        {v.status === 'Completed' && <CheckCircle2 size={14} className="text-primary" />}
                                    </div>
                                    <p className="text-xs font-bold text-text-dim leading-relaxed italic mb-3">{v.description}</p>
                                    <div className="flex gap-4">
                                        <span className="flex items-center gap-1.5 text-[10px] font-black text-primary bg-primary/5 px-2.5 py-1 rounded-lg uppercase tracking-widest">
                                            <Calendar size={12} /> {v.ageMonths === 0 ? 'Birth' : v.ageMonths < 12 ? `${v.ageMonths}M` : `${Math.floor(v.ageMonths/12)}Y+`}
                                        </span>
                                        <span className={`flex items-center gap-1.5 text-[10px] font-black px-2.5 py-1 rounded-lg uppercase tracking-widest ${v.status === 'Completed' ? 'bg-green-100 text-primary' : 'bg-amber-50 text-amber-600'}`}>
                                            <Clock size={12} /> {v.status}
                                        </span>
                                    </div>
                                </div>
                                {v.status !== 'Completed' && (
                                    <button 
                                      onClick={() => markAsDone(v.id)}
                                      className="px-6 py-3 bg-secondary text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-primary transition-all shadow-md active:scale-95"
                                    >
                                        Mark Done
                                    </button>
                                )}
                            </motion.div>
                        ))}
                    </AnimatePresence>
                    
                    {filteredVaccines.length === 0 && (
                        <div className="py-20 text-center border-2 border-dashed border-border rounded-[3rem] bg-gray-50">
                            <p className="text-lg font-bold text-text-dim uppercase tracking-widest opacity-50 italic">No {filter} vaccines found. 💉</p>
                        </div>
                    )}
                </div>

                <div className="lg:col-span-1 relative">
                    <div className="fixed top-24 right-10 w-64 bg-secondary p-5 rounded-[2rem] text-white space-y-5 shadow-2xl border border-white/5 z-40 scale-75 origin-top-right">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="text-xl font-black mb-0.5">📊 Rate</h3>
                                <p className="text-gray-400 font-bold text-[10px] uppercase tracking-widest">{completedCount} of {vaccines.length} Secure</p>
                            </div>
                            <div className="p-2 bg-white/10 rounded-xl">
                                <FileText size={18} className="text-primary" />
                            </div>
                        </div>
                        
                        <div className="space-y-4">
                            <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                                <div className="flex justify-between text-[9px] font-black uppercase mb-2 text-gray-300 tracking-widest">
                                    <span>Progress</span>
                                    <span className="text-primary">{progressPerc}%</span>
                                </div>
                                <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                                    <motion.div 
                                        initial={{ width: 0 }} 
                                        animate={{ width: `${progressPerc}%` }} 
                                        className="h-full bg-primary shadow-[0_0_10px_rgba(46,204,113,0.5)]" 
                                    />
                                </div>
                            </div>

                            <div className="space-y-2.5">
                                <h4 className="text-[9px] font-black uppercase text-white/40 tracking-widest ml-1">Recent</h4>
                                <div className="flex items-center gap-3 bg-white/5 p-3 rounded-xl border border-white/5">
                                    <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center text-primary"><CheckCircle2 size={14} /></div>
                                    <div>
                                        <div className="text-[10px] font-black text-gray-200">BCG Dose</div>
                                        <div className="text-[8px] font-bold text-gray-500 uppercase">Active</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <button className="w-full py-3.5 bg-primary text-white text-[10px] font-black rounded-xl shadow-lg hover:bg-green-700 transition-all uppercase tracking-widest border border-primary/50">
                             Report
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Vaccinations;
