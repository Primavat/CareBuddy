import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import FloatingEmojis from '../components/visuals/FloatingEmojis';

const Showcase = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const timer = setTimeout(() => {
            navigate('/login');
        }, 2400);
        return () => clearTimeout(timer);
    }, [navigate]);

    return (
        <div className="relative min-h-screen bg-gradient-to-br from-[#0a0e0b] to-[#112218] flex items-center justify-center overflow-hidden">
            <FloatingEmojis />
            
            <AnimatePresence>
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ 
                        opacity: [0, 1, 1, 0.5, 0],
                        y: [-15, -10, -10, -5, 0]
                    }}
                    transition={{
                        duration: 2.5,
                        ease: "easeInOut",
                        times: [0, 0.2, 0.8, 0.9, 1]
                    }}
                    className="text-center z-10"
                >
                    <h1 className="text-6xl font-black text-white m-0 tracking-tight">
                        Care<span className="text-primary italic">Buddy</span>
                    </h1>
                    <p className="text-xl font-bold text-[#a3b8ad] mt-4 italic opacity-80 uppercase tracking-widest leading-loose">
                        Your personal healthcare companion
                    </p>
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

export default Showcase;
