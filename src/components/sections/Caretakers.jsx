import React from 'react';
import { motion } from 'framer-motion';
import { UserPlus, ShieldCheck, Heart, UserCheck, Star, Sparkles } from 'lucide-react';

const Caretakers = () => {
    return (
        <div className="max-w-6xl mx-auto font-sans">
            <div className="mb-14 pb-6 border-b border-gray-100">
                <h2 className="text-2xl font-extrabold text-secondary mb-3 uppercase tracking-tight">👩‍⚕️ Caretaker Connection</h2>
                <p className="text-sm font-bold text-text-dim italic leading-relaxed">Connect with certified healthcare professionals for personalized home support.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                <div className="bg-white p-10 rounded-[3rem] border border-border shadow-soft flex flex-col justify-between group hover:border-primary transition-all relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity"><UserCheck size={160} /></div>
                    <div className="relative z-10 font-bold">
                        <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-6 border border-primary/20 shadow-sm group-hover:bg-primary group-hover:text-white transition-all">
                            <UserPlus size={32} />
                        </div>
                        <h3 className="text-2xl font-bold text-secondary mb-2 uppercase tracking-tight">Post-Surgery Care</h3>
                        <p className="text-text-dim mb-8 italic">Find specialized nurses for immediate post-operative recovery support.</p>
                        
                        <div className="flex gap-4">
                            <div className="bg-gray-50 px-4 py-2 rounded-xl text-xs font-black text-secondary tracking-widest border border-gray-100">Certified Nurse</div>
                            <div className="bg-gray-50 px-4 py-2 rounded-xl text-xs font-black text-secondary tracking-widest border border-gray-100">24/7 Availability</div>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-10 rounded-[3rem] border border-border shadow-soft flex flex-col justify-between group hover:border-primary transition-all relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity"><Heart size={160} /></div>
                    <div className="relative z-10 font-bold">
                        <div className="w-16 h-16 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center mb-6 border border-amber-100 shadow-sm group-hover:bg-amber-500 group-hover:text-white transition-all">
                            <Star size={32} />
                        </div>
                        <h3 className="text-2xl font-bold text-secondary mb-2 uppercase tracking-tight">Elderly Companion</h3>
                        <p className="text-text-dim mb-8 italic">Compassionate companions for senior citizens with a focus on emotional and physical health.</p>
                        
                        <div className="flex gap-4">
                            <div className="bg-gray-50 px-4 py-2 rounded-xl text-xs font-black text-secondary tracking-widest border border-gray-100">Dementia Trained</div>
                            <div className="bg-gray-50 px-4 py-2 rounded-xl text-xs font-black text-secondary tracking-widest border border-gray-100">Physiotherapy Support</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-secondary p-12 rounded-[4rem] text-white flex flex-col items-center justify-center text-center gap-6 overflow-hidden relative group border-2 border-primary/20">
                <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:opacity-20 transition-opacity"><Sparkles size={160} /></div>
                <div className="relative z-10 font-bold">
                    <div className="bg-primary/20 w-16 h-16 rounded-[2rem] flex items-center justify-center mb-6 mx-auto text-primary border border-primary/20 shadow-lg">
                        <ShieldCheck size={32} />
                    </div>
                    <h3 className="text-3xl font-black tracking-tight leading-tight mb-4">Care Provider Portal Joining Soon</h3>
                    <p className="text-gray-400 font-bold leading-relaxed max-w-2xl mx-auto italic mb-10">"The CareBuddy professional network is currently undergoing rigorous vetting and verification for all nursing and caretaker staff. We are opening slots for verified healthcare providers soon."</p>
                    <button className="bg-primary text-white px-10 py-4 rounded-[2rem] font-black text-sm uppercase tracking-widest shadow-2xl hover:bg-green-700 transition-colors animate-pulse">Join the Network 🚀</button>
                </div>
            </div>
        </div>
    );
};

export default Caretakers;
