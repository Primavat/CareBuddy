import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserPlus, Trash2, ShieldCheck, Heart } from 'lucide-react';

const FamilyProfiles = ({ members, setMembers }) => {
  const [name, setName] = useState("");
  const [relation, setRelation] = useState("");
  const [age, setAge] = useState("");

  const addMember = () => {
    if (!name || !relation || !age) return;
    const newMember = {
      id: Date.now(),
      name,
      relation,
      age: parseInt(age),
      vitals: { bp: '120/80', hr: '72', temp: '98.6' }
    };
    setMembers([...members, newMember]);
    setName("");
    setRelation("");
    setAge("");
  };

  const removeMember = (id) => {
    setMembers(members.filter(m => m.id !== id));
  };

  return (
    <div className="max-w-6xl mx-auto font-sans">
      <div className="mb-14 flex justify-between items-center pb-6 border-b border-gray-100">
        <div>
          <h2 className="text-2xl font-extrabold text-secondary mb-3 uppercase tracking-tight">🏠 Family Profiles</h2>
          <p className="text-sm font-bold text-text-dim italic leading-relaxed">Manage your family’s healthcare records and vitals in one place.</p>
        </div>
        <div className="bg-primary/10 px-4 py-2 rounded-2xl flex items-center gap-2 text-primary font-bold border border-primary/20">
          <ShieldCheck size={20} /> Verified Family Account
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
        <div className="md:col-span-1 bg-white p-6 rounded-3xl border border-border shadow-sm h-fit sticky top-28">
          <h3 className="text-xl font-bold text-secondary mb-6 flex items-center gap-2">
            <UserPlus size={20} className="text-primary" /> Add New Member
          </h3>
          <div className="flex flex-col gap-4">
            <input 
              value={name} 
              onChange={(e) => setName(e.target.value)}
              placeholder="Name" 
              className="bg-gray-50 border border-border p-3 rounded-2xl font-bold outline-none focus:border-primary transition-all shadow-sm"
            />
            <input 
              value={relation} 
              onChange={(e) => setRelation(e.target.value)}
              placeholder="Relation" 
              className="bg-gray-50 border border-border p-3 rounded-2xl font-bold outline-none focus:border-primary transition-all shadow-sm"
            />
            <input 
              value={age} 
              onChange={(e) => setAge(e.target.value)}
              placeholder="Age" 
              type="number"
              className="bg-gray-50 border border-border p-3 rounded-2xl font-bold outline-none focus:border-primary transition-all shadow-sm"
            />
            <button 
              onClick={addMember}
              className="bg-primary text-white p-4 rounded-2xl font-bold mt-2 shadow-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
            >
              <UserPlus size={18} /> Register Member
            </button>
          </div>
        </div>

        <div className="md:col-span-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <AnimatePresence>
              {members.length === 0 ? (
                <div className="col-span-full py-12 text-center bg-gray-50 rounded-3xl border-2 border-dashed border-border text-text-dim font-bold">
                  No family members added yet. Add one to get started! 🏠
                </div>
              ) : (
                members.map((m, index) => (
                  <motion.div
                    key={m.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-white p-6 rounded-3xl border border-border shadow-sm flex flex-col gap-6 relative group overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                       <button onClick={() => removeMember(m.id)} className="text-gray-300 hover:text-red-500 transition-colors">
                        <Trash2 size={20} />
                       </button>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-primary to-green-300 rounded-2xl flex items-center justify-center text-white text-2xl font-black shadow-lg">
                        {m.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="text-xl font-bold text-secondary">{m.name}</h4>
                        <span className="text-sm font-bold bg-gray-100 text-text-dim px-2 py-0.5 rounded-lg">{m.relation} • {m.age} Years</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                      <div className="text-center">
                        <span className="block text-[10px] font-black text-gray-400 uppercase tracking-tighter">BP</span>
                        <span className="text-xs font-bold text-secondary">{m.vitals.bp}</span>
                      </div>
                      <div className="text-center border-x border-gray-200">
                        <span className="block text-[10px] font-black text-gray-400 uppercase tracking-tighter">HR</span>
                        <span className="text-xs font-bold text-secondary">{m.vitals.hr}</span>
                      </div>
                      <div className="text-center">
                        <span className="block text-[10px] font-black text-gray-400 uppercase tracking-tighter">TEMP</span>
                        <span className="text-xs font-bold text-secondary">{m.vitals.temp}°</span>
                      </div>
                    </div>

                    <button className="flex items-center justify-center gap-2 w-full py-3 bg-white border-2 border-primary/20 text-primary rounded-xl text-xs font-bold hover:bg-primary hover:text-white transition-all">
                      <Heart size={14} /> Full Medical Report
                    </button>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FamilyProfiles;
