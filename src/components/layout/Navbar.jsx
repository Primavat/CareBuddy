import React from 'react';

const Navbar = ({ mode, setMode, userName }) => {
  return (
    <nav className="fixed top-0 left-0 right-0 h-20 bg-white border-b border-border z-50 flex items-center justify-between px-8">
      <div className="flex-1"></div>
      
      <div className="flex flex-col items-center gap-2">
        <h2 className="text-xl font-semibold">
          Hello <span className="text-primary">{userName || 'User'}</span>, welcome to <span className="text-secondary font-bold">Care</span><span className="text-primary font-extrabold">Buddy</span>
        </h2>
        
        <div className="flex bg-[#f0f4f2] p-1 rounded-full border-2 border-primary overflow-hidden">
          <button 
            onClick={() => setMode('personal')}
            className={`px-6 py-1.5 rounded-full text-sm font-bold transition-all ${mode === 'personal' ? 'bg-white shadow-md text-primary' : 'text-text-dim'}`}
          >
            👤 Personal
          </button>
          <button 
            onClick={() => setMode('family')}
            className={`px-6 py-1.5 rounded-full text-sm font-bold transition-all ${mode === 'family' ? 'bg-white shadow-md text-primary' : 'text-text-dim'}`}
          >
            🏠 Family
          </button>
        </div>
      </div>

      <div className="flex-1 flex justify-end gap-6 items-center">
        <button className="text-text-dim font-bold text-sm tracking-wide hover:text-primary">About Us</button>
        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-xl cursor-pointer border border-border">⚙️</div>
        <div className="w-10 h-10 bg-gray-100 rounded-full overflow-hidden border border-border">
          <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Priyanshu" alt="user" />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
