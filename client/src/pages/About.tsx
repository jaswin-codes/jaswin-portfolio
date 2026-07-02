import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { businessCards } from '@/data/portfolioData';
import { ChevronDown } from 'lucide-react';

export default function AboutSection() {
  const [, setLocation] = useLocation();
  const [currentCardIndex, setCurrentCardIndex] = useState(0);

  const handleNextCard = () => {
    setCurrentCardIndex((prev) => (prev + 1) % businessCards.length);
  };

  const currentCard = businessCards[currentCardIndex];

  const cardVariants = {
    enter: (direction: number) => ({
      y: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      y: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      y: direction < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  };

  return (
    <div className="relative w-full min-h-screen bg-gradient-to-b from-black via-gray-900 to-black overflow-hidden py-20">
      {/* Back Button */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute top-8 left-8 z-10"
      >
        <Button
          onClick={() => setLocation('/')}
          variant="outline"
          className="bg-black/50 border-green-500 text-green-400 hover:bg-green-500/10"
        >
          ← ESP32
        </Button>
      </motion.div>

      {/* Section Label */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <h1 className="text-5xl font-bold text-white" style={{
          fontFamily: "'Space Grotesk', sans-serif",
          textShadow: '0 0 20px rgba(0, 255, 136, 0.5)',
        }}>
          ABOUT ME
        </h1>
        <p className="text-green-400 text-sm mt-4" style={{
          fontFamily: "'JetBrains Mono', monospace",
        }}>
          USB-PORT
        </p>
      </motion.div>

      {/* Business Card Stack */}
      <div className="flex items-center justify-center min-h-[500px] px-4">
        <div className="relative w-full max-w-md h-96">
          <AnimatePresence mode="wait" custom={1}>
            <motion.div
              key={currentCardIndex}
              custom={1}
              variants={cardVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                y: { type: 'spring', stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 },
              }}
              className="absolute inset-0"
            >
              {/* Card Back */}
              <motion.div
                initial={{ rotateY: 0 }}
                animate={{ rotateY: 180 }}
                transition={{ duration: 0.6 }}
                className="w-full h-full"
                style={{ perspective: '1000px' }}
              >
                <div
                  className="w-full h-full bg-gradient-to-br from-green-900 to-black rounded-lg shadow-2xl p-8 flex flex-col justify-between border border-green-500/30"
                  style={{
                    backfaceVisibility: 'hidden',
                    transform: 'rotateY(180deg)',
                  }}
                >
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-4" style={{
                      fontFamily: "'Space Grotesk', sans-serif",
                    }}>
                      {currentCard.title}
                    </h2>
                    <div className="text-green-400 whitespace-pre-wrap text-sm leading-relaxed" style={{
                      fontFamily: "'JetBrains Mono', monospace",
                    }}>
                      {currentCard.content}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-green-500/30">
                    <span className="text-green-400 text-xs" style={{
                      fontFamily: "'JetBrains Mono', monospace",
                    }}>
                      Card {currentCardIndex + 1} of {businessCards.length}
                    </span>
                    <span className="text-green-400 text-xs" style={{
                      fontFamily: "'JetBrains Mono', monospace",
                    }}>
                      JASWIN CHINTHALA
                    </span>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </AnimatePresence>

          {/* Card Stack Shadow Effect */}
          {[2, 1].map((offset) => (
            <motion.div
              key={`shadow-${offset}`}
              className="absolute inset-0 bg-gradient-to-br from-green-900 to-black rounded-lg border border-green-500/20"
              style={{
                transform: `translateY(${offset * 8}px) translateX(${offset * 4}px)`,
                zIndex: -offset,
              }}
            />
          ))}
        </div>
      </div>

      {/* Click to Next Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="flex flex-col items-center justify-center gap-4 mt-12"
      >
        <Button
          onClick={handleNextCard}
          className="bg-green-500/20 text-green-400 border border-green-500/50 hover:bg-green-500/30"
        >
          Next Card
          <ChevronDown className="ml-2 w-4 h-4" />
        </Button>
        <p className="text-green-400 text-sm text-center" style={{
          fontFamily: "'JetBrains Mono', monospace",
        }}>
          click to reveal more →
        </p>
      </motion.div>

      {/* Card Indicators */}
      <div className="flex justify-center gap-2 mt-8">
        {businessCards.map((_, index) => (
          <motion.button
            key={index}
            onClick={() => setCurrentCardIndex(index)}
            className={`w-2 h-2 rounded-full transition-colors ${
              index === currentCardIndex ? 'bg-green-400' : 'bg-green-400/30'
            }`}
            whileHover={{ scale: 1.2 }}
          />
        ))}
      </div>
    </div>
  );
}
