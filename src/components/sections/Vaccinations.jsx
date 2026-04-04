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

                <div className="lg:col-span-1">
                    <div className="bg-secondary p-8 rounded-[3rem] text-white space-y-8 sticky top-28 shadow-2xl border border-white/5">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="text-2xl font-black mb-1">📊 Rate</h3>
                                <p className="text-gray-400 font-bold text-xs uppercase tracking-widest">{completedCount} of {vaccines.length} Secure</p>
                            </div>
                            <div className="p-3 bg-white/10 rounded-2xl">
                                <FileText size={24} className="text-primary" />
                            </div>
                        </div>
                        
                        <div className="space-y-6">
                            <div className="bg-white/5 p-6 rounded-3xl border border-white/10">
                                <div className="flex justify-between text-[10px] font-black uppercase mb-3 text-gray-300 tracking-[0.2em]">
                                    <span>Total Progress</span>
                                    <span className="text-primary">{progressPerc}%</span>
                                </div>
                                <div className="h-2.5 w-full bg-white/10 rounded-full overflow-hidden">
                                    <motion.div 
                                        initial={{ width: 0 }} 
                                        animate={{ width: `${progressPerc}%` }} 
                                        className="h-full bg-primary shadow-[0_0_15px_rgba(46,204,113,0.5)]" 
                                    />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h4 className="text-[10px] font-black uppercase text-white/40 tracking-[0.3em] ml-1">Recent Activity</h4>
                                <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/5 group hover:bg-white/10 transition-all cursor-default">
                                    <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform"><CheckCircle2 size={18} /></div>
                                    <div>
                                        <div className="text-xs font-black text-gray-200">BCG Dose</div>
                                        <div className="text-[10px] font-bold text-gray-500 uppercase">Immunity Active</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <button className="w-full py-5 bg-primary text-white text-xs font-black rounded-2xl shadow-xl hover:bg-green-700 transition-all uppercase tracking-widest border border-primary/50 flex items-center justify-center gap-2">
                             Download Report
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Vaccinations;
