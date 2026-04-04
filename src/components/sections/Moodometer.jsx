import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Smile, Frown, Meh, SmilePlus, Angry, Sparkles, Loader2 } from 'lucide-react';
import { GoogleGenerativeAI } from "@google/generative-ai";

const GEMINI_API_KEY = "AIzaSyB7H5bhn8y8Z4Ah-vTCqnMNWVw6ovxTrDs".trim();
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const Moodometer = () => {
  const [selectedMood, setSelectedMood] = useState(null);
  const [tip, setTip] = useState("");
  const [loading, setLoading] = useState(false);

  const moods = [
    { type: 'Calm', emoji: '😌', icon: Meh, color: '#a8dadc' },
    { type: 'Happy', emoji: '😊', icon: Smile, color: '#ffb703' },
    { type: 'Excited', emoji: '🤩', icon: SmilePlus, color: '#fb8500' },
    { type: 'Sad', emoji: '😢', icon: Frown, color: '#457b9d' },
    { type: 'Angry', emoji: '😠', icon: Angry, color: '#e63946' },
  ];

  const selectMood = async (mood) => {
    setCurrentMood(mood);
    setLoading(true);
    
    const newEntry = { id: Date.now(), mood: mood.emoji, label: mood.type, date: new Date().toLocaleTimeString() };
    setMoodHistory(prev => [newEntry, ...prev].slice(0, 5));

    const prompt = `The user at CareBuddy just logged their mood as ${mood.type} (${mood.emoji}). 
    As an empathetic health assistant, provide a ONE-SENTENCE relaxation tip or mindfulness advice for this specific mood. 
    Be warm, brief, and helpful.`;

    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      setTip(response.text());
    } catch (e) {
      setTip("Take a deep breath and remember you're doing great! 🌿");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto font-sans">
      <div className="text-center mb-20 pb-4 border-b border-gray-100">
        <h2 className="text-2xl font-extrabold text-secondary mb-3 tracking-tight uppercase">How are you feeling today?</h2>
        <p className="text-sm font-bold text-text-dim max-w-xl mx-auto leading-relaxed italic">
          Select an emoji that matches your mood today. CareBot will provide a personalized mindfulness tip.
        </p>
      </div>

      <div className="relative h-60 flex items-center justify-center mb-20">
        <div className="absolute w-full max-w-2xl h-[400px] border-[3px] border-dashed border-gray-100 rounded-[50%] -bottom-[320px]"></div>
        
        <div className="flex gap-4 md:gap-8 justify-center items-end h-full">
          {moods.map((m, i) => (
            <motion.button
              key={m.type}
              whileHover={{ y: -20, scale: 1.15 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => logMood(m)}
              className={`
                flex flex-col items-center gap-4 transition-all
                ${selectedMood?.type === m.type ? 'scale-110' : 'opacity-60 grayscale-[0.5] hover:opacity-100 hover:grayscale-0'}
              `}
            >
              <div className="w-20 h-20 rounded-[28px] bg-white border-2 border-gray-100 shadow-xl flex items-center justify-center text-5xl relative overflow-hidden group">
                <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <span className="relative z-10">{m.emoji}</span>
              </div>
              <span className="text-xs font-black uppercase text-secondary tracking-widest">{m.type}</span>
            </motion.button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {selectedMood && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="bg-primary p-8 rounded-[40px] text-white shadow-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-8 opacity-20"><Sparkles size={120} /></div>
            <div className="relative z-10">
              <span className="text-xs font-black uppercase tracking-widest bg-white/20 px-3 py-1 rounded-full border border-white/20">CareBot Mindfulness Tip</span>
              <h3 className="text-2xl font-bold mt-4 mb-4 flex items-center gap-3">
                Current Mood: {selectedMood.emoji} {selectedMood.type}
              </h3>
              
              {loading ? (
                <div className="flex items-center gap-3 font-bold italic text-white/80 py-4">
                  <Loader2 className="animate-spin" size={20} /> CareBot is thinking...
                </div>
              ) : (
                <p className="text-xl font-bold leading-relaxed max-w-2xl">
                  {tip || "Remember to take care of yourself today. You are doing amazing! 🌿"}
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Moodometer;
