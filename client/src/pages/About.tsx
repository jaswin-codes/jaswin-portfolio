import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { businessCards } from '@/data/portfolioData';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function AboutSection() {
  const [, setLocation] = useLocation();
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [direction, setDirection] = useState(1); // 1 = forward, -1 = backward

  const handleNextCard = () => {
    setDirection(1);
    setCurrentCardIndex((prev) => (prev + 1) % businessCards.length);
  };

  const handlePrevCard = () => {
    setDirection(-1);
    setCurrentCardIndex((prev) => (prev - 1 + businessCards.length) % businessCards.length);
  };

  const handleDotClick = (index: number) => {
    setDirection(index > currentCardIndex ? 1 : -1);
    setCurrentCardIndex(index);
  };

  const currentCard = businessCards[currentCardIndex];

  const variants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 300 : -300,
      opacity: 0,
      scale: 0.95,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: { duration: 0.35, ease: [0.23, 1, 0.32, 1] as [number, number, number, number] },
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -300 : 300,
      opacity: 0,
      scale: 0.95,
      transition: { duration: 0.25, ease: [0.77, 0, 0.175, 1] as [number, number, number, number] },
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
        className="text-center mb-12"
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
      <div className="flex items-center justify-center px-4">
        <div className="relative w-full max-w-lg overflow-hidden">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentCardIndex}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              className="w-full"
            >
              <div
                className="rounded-xl shadow-2xl border border-green-500/30 min-h-[420px] flex flex-col"
                style={{
                  background: 'linear-gradient(135deg, rgba(0,40,20,0.95) 0%, rgba(0,10,5,0.98) 100%)',
                  boxShadow: '0 0 40px rgba(0,255,136,0.08), inset 0 0 60px rgba(0,255,136,0.03)',
                }}
              >
                {/* Card content — centred */}
                <div className="flex-1 flex flex-col items-center justify-center text-center px-8 py-10">
                  {currentCard.type !== 'name' && (
                    <h2
                      className="text-2xl font-bold text-white mb-5"
                      style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                    >
                      {currentCard.title}
                    </h2>
                  )}
                  <div
                    className="text-green-400 whitespace-pre-wrap text-sm leading-relaxed"
                    style={{ fontFamily: "'JetBrains Mono', monospace" }}
                  >
                    {currentCard.content}
                  </div>
                </div>

                {/* Card footer */}
                <div className="flex items-center justify-between px-8 py-4 border-t border-green-500/20">
                  <span className="text-green-400/60 text-xs" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                    {currentCardIndex + 1} / {businessCards.length}
                  </span>
                  <span className="text-green-400/60 text-xs" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                    JASWIN CHINTHALA
                  </span>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation controls */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="flex flex-col items-center gap-5 mt-8"
      >
        <div className="flex items-center gap-4">
          <Button
            onClick={handlePrevCard}
            variant="outline"
            className="bg-black/50 border-green-500/50 text-green-400 hover:bg-green-500/10 w-10 h-10 p-0"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <p className="text-green-400/70 text-xs" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
            click to reveal more →
          </p>
          <Button
            onClick={handleNextCard}
            variant="outline"
            className="bg-black/50 border-green-500/50 text-green-400 hover:bg-green-500/10 w-10 h-10 p-0"
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>

        {/* Dot indicators */}
        <div className="flex justify-center gap-2">
          {businessCards.map((_, index) => (
            <motion.button
              key={index}
              onClick={() => handleDotClick(index)}
              className={`rounded-full transition-all duration-200 ${
                index === currentCardIndex
                  ? 'w-4 h-2 bg-green-400'
                  : 'w-2 h-2 bg-green-400/30 hover:bg-green-400/60'
              }`}
              whileHover={{ scale: 1.2 }}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
}
