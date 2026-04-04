import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Vitals from './sections/Vitals';
import Journal from './sections/Journal';
import Hydration from './sections/Hydration';
import Fitness from './sections/Fitness';
import MentalHealth from './sections/MentalHealth';
import WomenHealth from './sections/WomenHealth';
import Moodometer from './sections/Moodometer';
import FamilyProfiles from './sections/FamilyProfiles';
import Medications from './sections/Medications';
import Vaccinations from './sections/Vaccinations';
import Hospitals from './sections/Hospitals';
import Caretakers from './sections/Caretakers';
import DietaryPlans from './sections/DietaryPlans';

const MainContent = (props) => {
  const { activeSection } = props;

  const renderSection = () => {
    switch (activeSection) {
      case 'vitalsSection': return <Vitals {...props} />;
      case 'journalSection': return <Journal {...props} />;
      case 'hydrationSection': return <Hydration {...props} />;
      case 'fitnessSection': return <Fitness {...props} />;
      case 'mentalSection': return <MentalHealth {...props} />;
      case 'womenSection': return <WomenHealth {...props} />;
      case 'moodSection': return <Moodometer {...props} />;
      case 'familyProfiles': return <FamilyProfiles {...props} />;
      case 'medications': return <Medications {...props} />;
      case 'vaccinations': return <Vaccinations {...props} />;
      case 'hospitals': return <Hospitals {...props} />;
      case 'caretakers': return <Caretakers {...props} />;
      case 'dietaryPlans': return <DietaryPlans {...props} />;
      default: return <div className="text-center py-20 text-text-dim font-bold">Section Under Development 🚀</div>;
    }
  };

  return (
    <main className="ml-64 flex-1 p-8">
      <AnimatePresence mode="wait">
        <motion.div
          key={activeSection}
          initial={{ opacity: 0, scale: 0.98, filter: 'blur(4px)' }}
          animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          exit={{ opacity: 0, scale: 0.98, filter: 'blur(4px)' }}
          transition={{ 
            duration: 0.4, 
            ease: [0.23, 1, 0.32, 1] // Custom ease-out cubic for silk feel 
          }}
        >
          {renderSection()}
        </motion.div>
      </AnimatePresence>
    </main>
  );
};

export default MainContent;
