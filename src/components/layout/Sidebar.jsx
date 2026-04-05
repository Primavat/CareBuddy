import React from 'react';
import { motion } from 'framer-motion';
import { 
  Activity, Smile, BookOpen, Droplets, Dumbbell, Brain, Venus,
  Users, Pill, Syringe, Hospital, UserPlus, Utensils
} from 'lucide-react';

const Sidebar = ({ mode, activeSection, setActiveSection, vaccineCount = 0 }) => {
  const sections = mode === 'personal' ? [
    { id: 'vitalsSection', name: 'My Vitals', icon: Activity },
    { id: 'moodSection', name: 'Moodometer', icon: Smile },
    { id: 'journalSection', name: 'My Journal', icon: BookOpen },
    { id: 'hydrationSection', name: 'Hydration', icon: Droplets },
    { id: 'fitnessSection', name: 'Fitness', icon: Dumbbell },
    { id: 'mentalSection', name: 'Mental Health', icon: Brain },
    { id: 'womenSection', name: "Women's Health", icon: Venus },
  ] : [
    { id: 'familyProfiles', name: 'Family Profiles', icon: Users },
    { id: 'medications', name: 'Medications', icon: Pill },
    { id: 'vaccinations', name: 'Vaccinations', icon: Syringe, badge: vaccineCount },
    { id: 'hospitals', name: 'Nearby Hospitals', icon: Hospital },
    { id: 'caretakers', name: 'Caretakers', icon: UserPlus },
    { id: 'dietaryPlans', name: 'Dietary Plans', icon: Utensils },
  ];

  return (
    <aside className="fixed left-0 top-20 bottom-0 w-64 bg-card-bg border-r border-border p-4 flex flex-col gap-2 overflow-y-auto z-40">
      {sections.map((section, index) => (
        <motion.button
          key={section.id}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={{ x: 8 }}
          whileTap={{ scale: 0.98 }}
          transition={{ 
            type: 'spring', 
            stiffness: 400, 
            damping: 30,
            delay: index * 0.03 
          }}
          onClick={() => setActiveSection(section.id)}
          className={`
            flex items-center gap-3 w-full px-4 py-3 rounded-xl text-left font-bold text-sm transition-colors
            ${activeSection === section.id 
              ? 'bg-sidebar-active text-primary shadow-sm' 
              : 'text-secondary hover:bg-bg-main'
            }
          `}
        >
          <section.icon size={20} className={activeSection === section.id ? 'text-primary' : 'text-text-dim'} />
          <span className="flex-1">{section.name}</span>
          {section.badge > 0 && (
            <span className="bg-[#ff7675] text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold">
              {section.badge}
            </span>
          )}
        </motion.button>
      ))}
    </aside>
  );
};

export default Sidebar;
