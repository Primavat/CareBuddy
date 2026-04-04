import React from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../../utils/auth';

const LoginBox = () => {
  const loginWithGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin + '/dashboard',
        }
      });
      if (error) throw error;
    } catch (err) {
      console.error("Supabase Auth Error:", err.message);
      alert("Auth Error: " + err.message);
    }
  };

  return (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="w-full max-w-[420px] bg-[#181d1a] p-8 rounded-[2rem] shadow-2xl border border-[#334038] z-10"
    >
      <div className="text-center mb-8">
        <h1 className="text-3xl font-black text-white m-0">Care<span className="text-primary">Buddy</span></h1>
        <p className="text-sm font-bold text-[#77847c] mt-1 italic uppercase tracking-widest">Your AI Health Companion</p>
      </div>

      <div className="bg-[#232b26] p-4 rounded-2xl mb-8">
        <p className="text-[15px] font-bold text-[#e0e0e0] leading-relaxed">
          Welcome to CareBuddy. 🌿<br />
          Experience premium AI healthcare. Please sign in with your Google account.
        </p>
      </div>

      <motion.button
        whileHover={{ y: -2, scale: 1.01, borderColor: '#2ecc71', boxShadow: '0 4px 12px rgba(46, 204, 113, 0.1)' }}
        whileTap={{ scale: 0.98 }}
        onClick={loginWithGoogle}
        className="w-full flex items-center justify-center gap-3 bg-[#181d1a] border border-[#334038] hover:border-primary px-6 py-4 rounded-2xl text-[#e0e0e0] font-bold text-sm transition-all duration-300"
      >
        <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5" alt="google" />
        Continue with Google
      </motion.button>

      <div className="mt-8 pt-6 border-t border-[#334038] text-center">
        <p className="text-[10px] font-black text-[#555] uppercase tracking-widest leading-relaxed">
          🔒 Your health data is <span className="text-primary">secure</span> and never shared.
        </p>
      </div>
    </motion.div>
  );
};

export default LoginBox;
