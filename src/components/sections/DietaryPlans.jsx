import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Utensils, Sparkles, Loader2, Apple, Target, ClipboardCheck, UtensilsCrossed, CheckCircle } from 'lucide-react';
import { GoogleGenerativeAI } from "@google/generative-ai";

const GEMINI_API_KEY = "AIzaSyB7H5bhn8y8Z4Ah-vTCqnMNWVw6ovxTrDs".trim();
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const DietaryPlans = () => {
  const [goal, setGoal] = useState("Weight Loss");
  const [pref, setPref] = useState("Veg");
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState("");

  const generatePlan = async () => {
    setLoading(true);
    setPlan("");

    const prompt = `Generate a ONE-DAY personalized dietary plan for a health goal: ${goal} and dietary preference: ${pref}. 
    Include Breakfast, Lunch, Dinner, and 2 healthy snacks. 
    Format it with clear bold headers and bullet points. 
    Keep it professional and nutritionally balanced. 
    Add one "Expert Health Tip" at the end.`;

    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      let text = response.text();
      
      // Basic Markdown-to-HTML Formatter
      text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>'); // Bold
      text = text.replace(/\n\* (.*?)/g, '\n<li class="ml-4 list-disc">$1</li>'); // Bullet points
      text = text.replace(/\n- (.*?)/g, '\n<li class="ml-4 list-disc">$1</li>'); // Alternate bullets
      text = text.replace(/\n\n/g, '<br/><br/>'); // Paragraphs
      text = text.replace(/\n/g, '<br/>'); // Lines
      
      setPlan(text);
    } catch (e) {
      setPlan("Error generating plan. Please try again later. 🍎");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto font-sans pb-20">
      <div className="mb-14 flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-gray-100">
        <div>
          <h2 className="text-2xl font-extrabold text-secondary mb-3 uppercase tracking-tight">🥗 AI Dietary Plans</h2>
          <p className="text-sm font-bold text-text-dim italic leading-relaxed">Personalized meal plans optimized for your fitness goals and health data.</p>
        </div>
        <button 
          onClick={generatePlan}
          disabled={loading}
          className={`${loading ? 'bg-gray-400' : 'bg-primary hover:bg-green-700'} text-white px-8 py-3.5 rounded-2xl font-black shadow-lg shadow-primary/20 transition-all flex items-center gap-2 active:scale-95`}
        >
          {loading ? <Loader2 size={20} className="animate-spin" /> : <Sparkles size={20} />} 
          {loading ? 'GENERATING...' : 'GENERATE AI PLAN'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
        <div className="lg:col-span-1 space-y-6">
           <div className="bg-white p-6 rounded-[2.5rem] border border-border shadow-sm group hover:border-primary transition-all">
              <h3 className="text-xl font-black text-secondary mb-6 flex items-center gap-2 uppercase tracking-tighter">
                <Target size={20} className="text-primary group-hover:scale-125 transition-transform" /> Nutrition Profile
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2 ml-1">Health Goal</label>
                  <select 
                    value={goal}
                    onChange={(e) => setGoal(e.target.value)}
                    className="w-full bg-gray-50 border border-border p-4 rounded-3xl font-black text-secondary outline-none focus:border-primary transition-all shadow-inner text-sm tracking-tight"
                  >
                    <option>Weight Loss</option>
                    <option>Diabetes Friendly</option>
                    <option>Heart Healthy</option>
                    <option>Muscle Gain</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2 ml-1">Dietary Preference</label>
                  <select 
                    value={pref}
                    onChange={(e) => setPref(e.target.value)}
                    className="w-full bg-gray-50 border border-border p-4 rounded-3xl font-black text-secondary outline-none focus:border-primary transition-all shadow-inner text-sm tracking-tight"
                  >
                    <option>Veg</option>
                    <option>Non-Veg</option>
                    <option>Vegan</option>
                    <option>Paleo</option>
                  </select>
                </div>

                <div className="pt-2">
                    <div className="bg-primary/5 p-4 rounded-2xl border border-primary/10 flex items-start gap-3">
                        <CheckCircle size={16} className="text-primary mt-0.5 shrink-0" />
                        <p className="text-[10px] font-bold text-primary leading-relaxed uppercase tracking-tighter">AI will factor in your metabolic age and current activity stats.</p>
                    </div>
                </div>
              </div>
           </div>

           <div className="bg-secondary p-8 rounded-[2.5rem] text-white relative overflow-hidden group">
              <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mb-6 border border-white/5 group-hover:bg-primary group-hover:scale-110 transition-all"><Apple size={24} className="text-primary group-hover:text-white" /></div>
              <h4 className="text-xl font-black mb-2 uppercase tracking-tighter">Smart Nutrition</h4>
              <p className="text-gray-400 font-bold leading-relaxed mb-8 italic text-sm">"Good health is not something we can buy. However, it can be a valuable savings account."</p>
              <div className="flex -space-x-2">
                 {[1,2,3,4].map(i => <div key={i} className="w-9 h-9 rounded-full border-2 border-secondary overflow-hidden bg-gray-200"><img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=Food${i}`} alt="user" /></div>)}
                 <div className="w-9 h-9 rounded-full border-2 border-secondary bg-primary text-[10px] font-black flex items-center justify-center shadow-lg">+2k Users</div>
              </div>
              <div className="absolute -bottom-10 -right-10 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity"><Utensils size={180} /></div>
           </div>
        </div>

        <div className="lg:col-span-2">
           <AnimatePresence mode="wait">
              {!plan && !loading ? (
                 <motion.div 
                   key="empty"
                   initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                   className="h-full min-h-[500px] flex flex-col items-center justify-center bg-gray-50 rounded-[3rem] border-4 border-dashed border-border p-12 text-center"
                 >
                    <div className="w-24 h-24 bg-white shadow-2xl rounded-[2rem] flex items-center justify-center mb-6 text-primary border border-gray-100 animate-bounce transition-all duration-3000">
                      <ClipboardCheck size={40} />
                    </div>
                    <h3 className="text-3xl font-black text-secondary mb-3 tracking-tighter uppercase">Ready to generate your plan?</h3>
                    <p className="text-text-dim font-bold max-w-sm italic tracking-tight text-sm leading-relaxed">Select your goals and hit the generate button to receive your AI nutrition guide.</p>
                 </motion.div>
              ) : (
                <motion.div
                  key="content"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white p-10 rounded-[3rem] border border-border shadow-soft h-full relative group min-h-[500px]"
                >
                   {loading ? (
                     <div className="h-full min-h-[400px] flex flex-col items-center justify-center gap-6">
                        <div className="relative">
                            <Loader2 className="animate-spin text-primary" size={64} />
                            <Sparkles className="absolute -top-2 -right-2 text-primary animate-pulse" size={24} />
                        </div>
                        <div className="space-y-2 text-center">
                            <span className="font-black text-secondary tracking-[0.2em] uppercase text-xs block">CareBot Formulation Engine</span>
                            <span className="font-bold text-text-dim italic text-xs">Optimizing macros for your ${goal} goal...</span>
                        </div>
                     </div>
                   ) : (
                     <div className="relative z-10">
                        <div className="flex justify-between items-start mb-10 border-b border-gray-100 pb-6">
                           <div className="bg-primary text-white text-[10px] font-black uppercase tracking-[0.2em] px-5 py-2 rounded-xl shadow-lg shadow-primary/30">AI Nutrition Guide</div>
                           <button 
                             onClick={() => {
                               const textToCopy = plan.replace(/<[^>]*>/g, ''); // Strip HTML
                               navigator.clipboard.writeText(textToCopy);
                               alert("Plan copied to clipboard! 📋");
                             }}
                             className="text-text-dim font-black text-[10px] hover:text-primary transition-all flex items-center gap-2 uppercase tracking-widest bg-gray-50 px-4 py-2 rounded-xl hover:shadow-md"
                           >
                             <ClipboardCheck size={14} /> Copy
                           </button>
                        </div>
                        <div 
                          className="prose prose-slate max-w-none text-secondary font-sans space-y-4"
                          dangerouslySetInnerHTML={{ __html: plan }}
                        />
                     </div>
                   )}
                   <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity"><UtensilsCrossed size={160} /></div>
                </motion.div>
              )}
           </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default DietaryPlans;
