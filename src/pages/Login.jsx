import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import FloatingEmojis from '../components/visuals/FloatingEmojis';
import LoginBox from '../components/auth/LoginBox';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://idbratjfnpkzmbfzcehr.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlkYnJhdGpmbnBrem1iZnpjZWhyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUyMTYyMzMsImV4cCI6MjA5MDc5MjIzM30._SHhi4Q7MTDE12L4tsl6yaLKAWvxZoVmmLZB5wdV59g';
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const Login = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const checkSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session) {
                navigate('/dashboard');
            }
        };
        checkSession();
    }, [navigate]);

    return (
        <div className="relative min-h-screen bg-gradient-to-br from-[#0a0e0b] to-[#112218] flex items-center justify-center p-6 overflow-hidden text-center">
            <FloatingEmojis />
            
            <motion.div
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="z-10 w-full flex justify-center"
            >
              <LoginBox />
            </motion.div>
        </div>
    );
};

export default Login;
