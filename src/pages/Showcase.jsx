import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import FloatingEmojis from '../components/visuals/FloatingEmojis';
import { createClient } from '@supabase/supabase-js';
const SUPABASE_URL = 'https://idbratjfnpkzmbfzcehr.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlkYnJhdGpmbnBrem1iZnpjZWhyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUyMTYyMzMsImV4cCI6MjA5MDc5MjIzM30._SHhi4Q7MTDE12L4tsl6yaLKAWvxZoVmmLZB5wdV59g';
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const Showcase = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const checkSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session) {
                navigate('/dashboard');
            }
        };
        checkSession();

        const timer = setTimeout(() => {
            navigate('/login');
        }, 2400);
        return () => clearTimeout(timer);
    }, [navigate]);

    return (
        <div className="relative min-h-screen bg-gradient-to-br from-[#0a0e0b] to-[#112218] dark:from-bg-main dark:to-sidebar-active flex items-center justify-center overflow-hidden transition-colors duration-700">
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
                    <h1 className="text-6xl font-black text-white dark:text-secondary m-0 tracking-tight transition-colors duration-700">
                        Care<span className="text-primary italic">Buddy</span>
                    </h1>
                    <p className="text-xl font-bold text-[#a3b8ad] dark:text-text-dim mt-4 italic opacity-80 uppercase tracking-widest leading-loose transition-colors duration-700">
                        Your personal healthcare companion
                    </p>
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

export default Showcase;
