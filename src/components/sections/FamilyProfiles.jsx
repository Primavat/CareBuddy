import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Plus, Trash2, Heart, ShieldCheck } from 'lucide-react';

const FamilyProfiles = ({ members, setMembers }) => {
    const handleAddMember = () => {
        const name = prompt("Family Member Name:");
        if (!name) return;
        const relation = prompt("Relation? (e.g., Father, Sister, Son)");
        if (!relation) return;

        const newMember = {
            id: Date.now(),
            name: name,
            relation: relation,
            age: prompt("Age?") || "N/A",
            bloodGroup: prompt("Blood Group?") || "N/A",
            image: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`
        };

        setMembers([...members, newMember]);
    };

    const removeMember = (id) => {
        setMembers(members.filter(m => m.id !== id));
    };

    return (
        <div className="max-w-6xl mx-auto">
            <div className="mb-14 flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-gray-100">
                <div>
                    <h2 className="text-2xl font-extrabold text-secondary mb-3 uppercase tracking-tight">👪 Family Profiles</h2>
                    <p className="text-text-dim font-bold italic leading-relaxed text-sm">Manage and monitor the health records of your loved ones in one place.</p>
                </div>
                <button 
                  onClick={handleAddMember}
                  className="bg-primary text-white px-8 py-3.5 rounded-2xl font-black shadow-lg hover:bg-green-700 transition-all flex items-center gap-2"
                >
                    <Plus size={20} /> Add Member
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <AnimatePresence>
                    {members.map((member, index) => (
                        <motion.div
                            key={member.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white p-8 rounded-[2.5rem] border border-border shadow-sm hover:shadow-xl hover:border-primary transition-all group relative overflow-hidden"
                        >
                            <div className="flex items-center gap-5 mb-6">
                                <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-border group-hover:border-primary transition-colors bg-gray-50">
                                    <img src={member.image} alt={member.name} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-black text-secondary">{member.name}</h3>
                                    <p className="text-xs font-bold text-primary uppercase tracking-widest">{member.relation}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-8">
                                <div className="bg-gray-50 p-3 rounded-2xl text-center">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Age</p>
                                    <p className="text-sm font-black text-secondary">{member.age}</p>
                                </div>
                                <div className="bg-gray-50 p-3 rounded-2xl text-center">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Blood</p>
                                    <p className="text-sm font-black text-secondary">{member.bloodGroup}</p>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <button className="flex-1 bg-secondary text-white py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-800 transition-colors">
                                    View Health Card
                                </button>
                                <button 
                                  onClick={() => removeMember(member.id)}
                                  className="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-100 transition-colors"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>

                            <div className="absolute top-4 right-4 bg-green-50 text-green-600 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                                <ShieldCheck size={14} />
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
                
                {members.length === 0 && (
                    <div className="col-span-full py-20 text-center border-2 border-dashed border-border rounded-[3rem] bg-gray-50">
                        <p className="text-lg font-bold text-text-dim">No family members added yet. Start by adding a loved one! 👪</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FamilyProfiles;
