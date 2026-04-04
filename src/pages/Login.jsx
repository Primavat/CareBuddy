import React from 'react';
import { motion } from 'framer-motion';
import FloatingEmojis from '../components/visuals/FloatingEmojis';
import LoginBox from '../components/auth/LoginBox';

const Login = () => {
    return (
        <div className="relative min-h-screen bg-gradient-to-br from-[#0a0e0b] to-[#112218] flex items-center justify-center p-6 overflow-hidden">
            <FloatingEmojis />
            
            <motion.div
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="z-10"
            >
              <LoginBox />
            </motion.div>
        </div>
    );
};

export default Login;
