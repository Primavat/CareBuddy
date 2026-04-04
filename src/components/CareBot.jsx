import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, X, MessageSquare } from 'lucide-react';
import { GoogleGenerativeAI } from "@google/generative-ai";

const GEMINI_API_KEY = "AIzaSyB7H5bhn8y8Z4Ah-vTCqnMNWVw6ovxTrDs".trim();
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ 
  model: "gemini-1.5-flash",
  systemInstruction: "Your name is CareBot. You are a friendly, professional, and knowledgeable medical assistant for the CareBuddy app. Provide concise, helpful, and empathetic health advice. Always remind the user to consult a professional for serious concerns." 
});

const CareBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { role: 'bot', text: 'Hello! I am CareBot. How can I help you and your family today? 😊' }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const chatRef = useRef(null);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    
    const userMsg = input.trim();
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput("");
    setIsTyping(true);

    try {
      const result = await model.generateContent(userMsg);
      const response = await result.response;
      setMessages(prev => [...prev, { role: 'bot', text: response.text() }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'bot', text: "Error connecting to CareBot. Please try again later." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] hidden md:block font-sans">
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="mb-4 w-72 max-h-[480px] flex flex-col bg-white rounded-[2rem] shadow-2xl border border-border overflow-hidden"
          >
            <div className="bg-primary p-3.5 flex items-center justify-between text-white">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <Bot size={18} />
                </div>
                <div>
                  <h3 className="font-bold text-sm">CareBot</h3>
                  <span className="text-[9px] bg-white/20 px-2 py-0.5 rounded-full">AI Assistant</span>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="hover:bg-white/10 p-1 rounded-full transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <div 
              ref={chatRef}
              className="flex-1 p-3.5 flex flex-col gap-3 overflow-y-auto min-h-[320px] bg-gray-50"
            >
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`
                    max-w-[85%] p-3 rounded-xl text-[13px] font-semibold leading-snug shadow-sm
                    ${m.role === 'user' ? 'bg-primary text-white' : 'bg-white text-secondary border border-border'}
                  `}>
                    {m.text}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white border border-border p-2.5 rounded-xl flex gap-1">
                    <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1 }} className="w-1 h-1 bg-primary/40 rounded-full"></motion.div>
                    <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1 h-1 bg-primary/40 rounded-full"></motion.div>
                    <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1 h-1 bg-primary/40 rounded-full"></motion.div>
                  </div>
                </div>
              )}
            </div>

            <div className="p-3 bg-white border-t border-border flex gap-2">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Type here..."
                className="flex-1 bg-gray-100 border border-border px-3.5 py-2.5 rounded-xl text-[13px] font-semibold outline-none focus:border-primary transition-colors"
              />
              <button 
                onClick={sendMessage}
                className="bg-primary p-2.5 rounded-xl text-white shadow-lg hover:bg-green-700 transition-colors"
              >
                <Send size={18} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-primary rounded-full flex items-center justify-center text-white shadow-2xl hover:bg-green-700 transition-colors border-4 border-white/20"
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
      </motion.button>
    </div>
  );
};

export default CareBot;
