import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../utils/auth';
import { Settings, User, LogOut, Edit2, Shield, Globe, Sun } from 'lucide-react';

const Navbar = ({ mode, setMode, userName, setUserName }) => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const navigate = useNavigate();
  
  const userMenuRef = useRef(null);
  const settingsRef = useRef(null);

  // Fetch real user email
  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserEmail(user.email);
      }
    };
    fetchUser();
  }, []);

  // Close menus on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
      if (settingsRef.current && !settingsRef.current.contains(event.target)) {
        setIsSettingsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const handleChangeName = () => {
    const newName = prompt("Enter your new name:", userName);
    if (newName && newName.trim() !== "") {
      setUserName(newName.trim());
      setIsUserMenuOpen(false);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 h-20 bg-white border-b border-border z-50 flex items-center justify-between px-8 shadow-sm">
      <div className="flex-1 flex items-center">
         <h1 className="text-2xl font-black text-secondary tracking-tighter">Care<span className="text-primary italic">Buddy</span></h1>
      </div>
      
      <div className="flex flex-col items-center gap-2">
        <h2 className="text-lg font-extrabold text-secondary tracking-tight">
          Hello <span className="text-primary">{userName || 'User'}</span>, welcome to your health hub
        </h2>
        
        <div className="flex bg-[#f0f4f2] p-1 rounded-full border-2 border-primary/20 overflow-hidden">
          <button 
            onClick={() => setMode('personal')}
            className={`px-6 py-1.5 rounded-full text-xs font-black uppercase tracking-widest transition-all ${mode === 'personal' ? 'bg-primary text-white shadow-lg' : 'text-text-dim hover:bg-gray-200'}`}
          >
            👤 Personal
          </button>
          <button 
            onClick={() => setMode('family')}
            className={`px-6 py-1.5 rounded-full text-xs font-black uppercase tracking-widest transition-all ${mode === 'family' ? 'bg-primary text-white shadow-lg' : 'text-text-dim hover:bg-gray-200'}`}
          >
            🏠 Family
          </button>
        </div>
      </div>

      <div className="flex-1 flex justify-end gap-5 items-center">
        <button className="text-text-dim font-black text-[10px] uppercase tracking-[0.2em] hover:text-primary transition-colors">About Us</button>
        
        {/* Settings Gear */}
        <div className="relative" ref={settingsRef}>
          <motion.div 
            whileHover={{ rotate: 90, scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => {
                setIsSettingsOpen(!isSettingsOpen);
                setIsUserMenuOpen(false);
            }}
            className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-xl cursor-pointer border border-border hover:bg-white hover:shadow-md transition-all"
          >
            <Settings size={20} className="text-text-dim" />
          </motion.div>

          <AnimatePresence>
            {isSettingsOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-xl border border-border p-2 overflow-hidden overflow-y-auto max-h-[80vh]"
              >
                <div className="px-4 py-3 mb-1 border-b border-gray-50">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Dashboard Settings</p>
                </div>
                <button className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-secondary hover:bg-gray-50 rounded-xl transition-colors">
                    <Sun size={16} className="text-primary" /> Theme: Green/Light
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-secondary hover:bg-gray-50 rounded-xl transition-colors">
                    <Globe size={16} className="text-primary" /> Language: English
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-secondary hover:bg-gray-50 rounded-xl transition-colors">
                    <Shield size={16} className="text-primary" /> Security: High
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Profile Pic */}
        <div className="relative" ref={userMenuRef}>
          <motion.div 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
                setIsUserMenuOpen(!isUserMenuOpen);
                setIsSettingsOpen(false);
            }}
            className="w-10 h-10 bg-gray-50 rounded-full overflow-hidden border-2 border-border cursor-pointer hover:border-primary transition-all shadow-sm"
          >
            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${userName}`} alt="user" />
          </motion.div>

          <AnimatePresence>
            {isUserMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-xl border border-border p-2"
              >
                 <div className="px-4 py-4 mb-2 bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-100">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">User Settings</p>
                    <p className="text-sm font-black text-secondary truncate">{userName}</p>
                    {userEmail && <p className="text-[10px] font-medium text-gray-400 truncate opacity-70">{userEmail}</p>}
                </div>
                
                <button 
                  onClick={handleChangeName}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-secondary hover:bg-gray-50 rounded-xl transition-colors mb-1"
                >
                  <Edit2 size={16} className="text-primary" /> Change Name
                </button>
                
                <button 
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-secondary hover:bg-gray-50 rounded-xl transition-colors mb-1"
                >
                  <User size={16} className="text-primary" /> Profile Details
                </button>

                <div className="h-px bg-gray-100 my-1 mx-2" />
                
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                >
                  <LogOut size={16} /> Log Out
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
