import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Activity, Thermometer, Droplet, Plus, TrendingUp } from 'lucide-react';

const Vitals = () => {
    const [vitals, setVitals] = useState([
        { id: 1, name: 'Blood Pressure', value: '120/80', unit: 'mmHg', icon: Heart, color: 'text-red-500', bg: 'bg-red-50' },
        { id: 2, name: 'Heart Rate', value: '72', unit: 'BPM', icon: Activity, color: 'text-primary', bg: 'bg-primary/10' },
        { id: 3, name: 'SpO2 Level', value: '98', unit: '%', icon: Thermometer, color: 'text-amber-500', bg: 'bg-amber-50' },
        { id: 4, name: 'Glucose', value: '95', unit: 'mg/dL', icon: Droplet, color: 'text-blue-500', bg: 'bg-blue-50' },
    ]);

    const handleUpdate = () => {
        const item = prompt("Which vital to update? (Blood Pressure, Heart Rate, SpO2, Glucose)");
        if (!item) return;
        const newVal = prompt(`Enter new value for ${item}:`);
        if (!newVal) return;

        setVitals(vitals.map(v => {
            if (v.name.toLowerCase().includes(item.toLowerCase())) {
                return { ...v, value: newVal };
            }
            return v;
        }));
    };

    return (
        <div className="max-w-6xl mx-auto">
            <div className="mb-14 flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-gray-100">
                <div>
                    <h2 className="text-2xl font-extrabold text-secondary mb-3 uppercase tracking-tight">💓 My Health Vitals</h2>
                    <p className="text-text-dim font-bold italic leading-relaxed text-sm">Real-time overview of your core health metrics.</p>
                </div>
                <button 
                  onClick={handleUpdate}
                  className="bg-primary text-white px-8 py-3.5 rounded-2xl font-black shadow-lg hover:bg-green-700 transition-all flex items-center gap-2"
                >
                    <Plus size={20} /> Update Vitals
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                {vitals.map((s, i) => (
                    <motion.div
                        key={s.name}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-white p-6 rounded-[2.5rem] border border-border flex flex-col items-center text-center group hover:border-primary transition-all shadow-sm"
                    >
                        <div className={`w-16 h-16 ${s.bg} ${s.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                            <s.icon size={32} />
                        </div>
                        <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">{s.name}</h4>
                        <div className="flex items-baseline gap-1">
                            <span className="text-3xl font-black text-secondary tracking-tighter">{s.value}</span>
                            <span className="text-sm font-bold text-text-dim">{s.unit}</span>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-secondary p-10 rounded-[3rem] text-white overflow-hidden relative group">
                    <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:opacity-20 transition-opacity"><TrendingUp size={120} /></div>
                    <div className="relative z-10">
                        <div className="bg-primary/20 w-12 h-12 rounded-2xl flex items-center justify-center mb-6 text-primary border border-primary/20">
                            <TrendingUp size={24} />
                        </div>
                        <h3 className="text-2xl font-bold mb-4">Vitals Summary</h3>
                        <p className="text-gray-400 font-bold leading-relaxed mb-8 italic">"Your heart rate is 72 BPM—exactly in the target range for optimal heart health. Keep up the good work!"</p>
                        <ul className="space-y-4">
                            <li className="flex items-center gap-3 text-sm font-bold text-gray-200">
                                <div className="w-2 h-2 bg-primary rounded-full" /> Normal Blood Pressure
                            </li>
                            <li className="flex items-center gap-3 text-sm font-bold text-gray-200">
                                <div className="w-2 h-2 bg-primary rounded-full" /> Resting Heart Rate Stable
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="bg-gray-50 border-2 border-dashed border-border rounded-[3rem] p-10 flex flex-col items-center justify-center text-center">
                    <div className="w-16 h-16 bg-white shadow-xl rounded-2xl flex items-center justify-center mb-6 text-primary">
                        <Activity size={32} />
                    </div>
                    <h4 className="text-xl font-bold text-secondary mb-2">History Analytics</h4>
                    <p className="text-text-dim font-bold italic max-w-xs leading-relaxed">Detailed graph analysis of your vitals over the last 30 days coming soon. 💹</p>
                </div>
            </div>
        </div>
    );
};

export default Vitals;
