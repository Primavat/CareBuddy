import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserCheck, Star, Sparkles, Phone, ShieldCheck, MapPin, Search } from 'lucide-react';

const Caretakers = () => {
    const [filter, setFilter] = useState('All');
    const [caretakers] = useState([
        { id: 1, name: 'Dr. Sarah Wilson', role: 'Doctor', availability: 'On-Call', ratings: '4.9', image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah' },
        { id: 2, name: 'Nurse Michael Chen', role: 'Nurse', availability: 'Immediate', ratings: '4.7', image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael' },
        { id: 3, name: 'Elena Rodriguez', role: 'Specialist', availability: 'Scheduled', ratings: '4.8', image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Elena' },
        { id: 4, name: 'James Thompson', role: 'Nurse', availability: 'On-Call', ratings: '4.5', image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=James' }
    ]);

    const filteredCaretakers = filter === 'All' ? caretakers : caretakers.filter(c => c.role === filter);

    return (
        <div className="max-w-6xl mx-auto font-sans">
            <div className="mb-14 flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-gray-100 dark:border-border">
                <div>
                    <h2 className="text-2xl font-extrabold text-secondary mb-3 uppercase tracking-tight">👩‍⚕️ Caretaker Connection</h2>
                    <p className="text-sm font-bold text-text-dim italic leading-relaxed">Connect with certified healthcare professionals for personalized home support.</p>
                </div>
                <div className="flex bg-gray-100 dark:bg-bg-main p-1 rounded-xl border border-transparent dark:border-border">
                    {['All', 'Doctor', 'Nurse', 'Specialist'].map((role) => (
                        <button 
                            key={role}
                            onClick={() => setFilter(role)}
                            className={`px-4 py-2 rounded-lg text-xs font-black uppercase transition-all ${filter === role ? 'bg-primary text-white shadow-md' : 'text-gray-400 hover:text-secondary'}`}
                        >
                            {role}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <AnimatePresence mode='popLayout'>
                    {filteredCaretakers.map((c, i) => (
                        <motion.div
                            key={c.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ delay: i * 0.05 }}
                            className="bg-card-bg p-6 rounded-[2.5rem] border border-border shadow-sm hover:shadow-xl hover:border-primary transition-all group relative overflow-hidden"
                        >
                            <div className="flex flex-col items-center text-center">
                                <div className="w-24 h-24 rounded-3xl overflow-hidden mb-4 border-2 border-border group-hover:border-primary transition-colors bg-gray-50 dark:bg-bg-main">
                                    <img src={c.image} alt={c.name} />
                                </div>
                                <h3 className="text-lg font-black text-secondary leading-tight mb-1">{c.name}</h3>
                                <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-4">{c.role}</p>

                                <div className="flex items-center gap-3 mb-6">
                                    <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-lg">
                                        <Star size={12} className="text-amber-500 fill-amber-500" />
                                        <span className="text-xs font-black text-amber-700">{c.ratings}</span>
                                    </div>
                                    <div className="bg-green-50 px-2 py-1 rounded-lg">
                                        <span className="text-[9px] font-black text-green-600 uppercase tracking-tighter">{c.availability}</span>
                                    </div>
                                </div>

                                <div className="flex w-full gap-2">
                                    <button className="flex-1 bg-secondary text-white py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-800 transition-colors flex items-center justify-center gap-2">
                                        <Phone size={14} /> Call
                                    </button>
                                    <button className="p-3 bg-gray-50 dark:bg-bg-main text-secondary border border-border rounded-xl hover:bg-card-bg hover:shadow-md transition-all">
                                        <Search size={14} />
                                    </button>
                                </div>
                            </div>

                            <div className="absolute top-4 right-4 bg-primary/10 text-primary p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                                <ShieldCheck size={14} />
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {filteredCaretakers.length === 0 && (
                <div className="py-20 text-center">
                    <p className="text-lg font-bold text-text-dim uppercase tracking-widest opacity-50 italic">No {filter}s available right now. 👩‍⚕️</p>
                </div>
            )}
        </div>
    );
};

export default Caretakers;
