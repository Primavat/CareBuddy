import React from 'react';
import { motion } from 'framer-motion';

const emojis = [
  { char: '🏥', top: '5%', left: '10%', delay: 0 },
  { char: '💊', top: '10%', left: '30%', delay: 1 },
  { char: '❤️', top: '5%', left: '50%', delay: 2 },
  { char: '💉', top: '8%', left: '70%', delay: 0.5 },
  { char: '🩺', top: '12%', left: '90%', delay: 1.5 },
  { char: '💉', top: '25%', left: '5%', delay: 2 },
  { char: '🩺', top: '28%', left: '25%', delay: 0.5 },
  { char: '💊', top: '26%', left: '65%', delay: 2.5 },
  { char: '❤️', top: '25%', left: '85%', delay: 0.8 },
  { char: '❤️', top: '50%', left: '15%', delay: 1.1 },
  { char: '💉', top: '55%', left: '55%', delay: 0 },
  { char: '🩺', top: '48%', left: '75%', delay: 1.8 },
  { char: '💊', top: '52%', left: '95%', delay: 0.3 },
  { char: '💊', top: '75%', left: '8%', delay: 2.8 },
  { char: '💉', top: '70%', left: '28%', delay: 0.7 },
  { char: '❤️', top: '80%', left: '48%', delay: 1.4 },
  { char: '🏥', top: '75%', left: '68%', delay: 2.2 },
  { char: '🩺', top: '72%', left: '88%', delay: 0.9 },
  { char: '🩺', top: '90%', left: '18%', delay: 1.7 },
  { char: '❤️', top: '95%', left: '38%', delay: 0.2 },
  { char: '💊', top: '88%', left: '58%', delay: 2.6 },
  { char: '💉', top: '92%', left: '78%', delay: 1.1 },
  { char: '🏥', top: '96%', left: '90%', delay: 0.6 }
];

const FloatingEmojis = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none">
      {emojis.map((e, i) => (
        <motion.span
          key={i}
          initial={{ y: 0, rotate: 0 }}
          animate={{ 
            y: [-10, 10, -10],
            rotate: [0, 10, 0]
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: e.delay
          }}
          style={{ 
            position: 'absolute',
            top: e.top, 
            left: e.left,
            fontSize: '2.8rem',
            opacity: 0.15,
            filter: 'sepia(100%) hue-rotate(85deg) saturate(300%) brightness(1.2)'
          }}
        >
          {e.char}
        </motion.span>
      ))}
    </div>
  );
};

export default FloatingEmojis;
