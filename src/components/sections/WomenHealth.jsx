import React from 'react';
import { motion } from 'framer-motion';
import { Venus, Calendar, Heart, Baby, Plus, Sparkles } from 'lucide-react';

const WomenHealth = () => {
    return (
        <div className="max-w-6xl mx-auto font-sans pb-20">
            <div className="mb-14 flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-gray-100">
                <div>
                    <h2 className="text-2xl font-extrabold text-secondary mb-3 uppercase tracking-tight">🚺 Women's Health Hub</h2>
                    <p className="text-sm font-bold text-text-dim italic leading-relaxed">Comprehensive tracking for menstrual cycles, pregnancy, and fertility.</p>
                </div>
                <button className="bg-primary text-white px-8 py-3.5 rounded-2xl font-black shadow-lg hover:bg-green-700 transition-all flex items-center gap-2">
                    <Plus size={20} /> New Entry
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                <div className="bg-white p-10 rounded-[3rem] border border-border shadow-sm flex flex-col justify-between group hover:border-primary transition-all relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity"><Venus size={160} /></div>
                    <div className="relative z-10 font-bold">
                        <div className="w-16 h-16 bg-pink-50 text-pink-500 rounded-2xl flex items-center justify-center mb-6 border border-pink-100 shadow-sm group-hover:bg-pink-500 group-hover:text-white transition-all">
                            <Calendar size={32} />
                        </div>
                        <h3 className="text-2xl font-bold text-secondary mb-2">Menstrual Cycle</h3>
                        <p className="text-text-dim mb-8 italic">Next cycle expected in <span className="text-pink-500 font-black">12 Days</span>.</p>
                        
                        <div className="flex gap-4">
                            <div className="bg-gray-50 px-4 py-2 rounded-xl text-xs font-black text-secondary tracking-widest border border-gray-100">Day 14 (Ovulation)</div>
                            <div className="bg-gray-50 px-4 py-2 rounded-xl text-xs font-black text-secondary tracking-widest border border-gray-100">Normal Flow</div>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-10 rounded-[3rem] border border-border shadow-sm flex flex-col justify-between group hover:border-primary transition-all relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity"><Baby size={160} /></div>
                    <div className="relative z-10 font-bold">
                        <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center mb-6 border border-blue-100 shadow-sm group-hover:bg-blue-500 group-hover:text-white transition-all">
                            <Baby size={32} />
                        </div>
                        <h3 className="text-2xl font-bold text-secondary mb-2">Pregnancy Tracker</h3>
                        <p className="text-text-dim mb-8 italic">Week <span className="text-blue-500 font-black">24</span> of your journey.</p>
                        
                        <div className="flex gap-4">
                            <div className="bg-gray-50 px-4 py-2 rounded-xl text-xs font-black text-secondary tracking-widest border border-gray-100">Second Trimester</div>
                            <div className="bg-gray-50 px-4 py-2 rounded-xl text-xs font-black text-secondary tracking-widest border border-gray-100">Stable Vitals</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-secondary p-12 rounded-[3.5rem] text-white flex flex-col lg:flex-row items-center gap-10 overflow-hidden relative group">
                <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:opacity-20 transition-opacity"><Sparkles size={160} /></div>
                <div className="lg:w-1/2 relative z-10 flex flex-col gap-6 font-bold">
                    <div className="w-14 h-14 bg-primary/20 rounded-2xl flex items-center justify-center text-primary border border-primary/20 shadow-lg">
                        <Heart size={28} />
                    </div>
                    <h3 className="text-3xl font-black tracking-tight leading-tight">Insight: Optimal Nutrition for Cycle Health</h3>
                    <p className="text-gray-400 leading-relaxed italic">"Increasing your Iron and Magnesium intake this week can significantly reduce common cycle fatigue. Try incorporating more spinach and dark chocolate into your diet! 🥬🍫"</p>
                    <button className="w-fit bg-primary text-white px-10 py-4 rounded-[2rem] font-black text-sm uppercase tracking-widest hover:bg-green-700 transition-colors shadow-2xl">Personalized Advice</button>
                </div>
                <div className="lg:w-1/2 flex items-center justify-center relative translate-y-10 group-hover:translate-y-0 transition-transform duration-700">
                    <div className="w-64 h-64 bg-primary/5 rounded-full border-4 border-dashed border-primary/20 p-8 flex items-center justify-center">
                        <Venus size={120} className="text-primary opacity-40 blur-[1px]" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WomenHealth;
