import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { research } from '@/data/portfolioData';
import { X } from 'lucide-react';

interface ResearchComponent {
  id: string;
  position: { x: number; y: number };
  title: string;
}

const researchComponents: ResearchComponent[] = [
  { id: 'hyperspectral', position: { x: 20, y: 30 }, title: 'Hyperspectral' },
  { id: 'afriguard', position: { x: 70, y: 60 }, title: 'AfriGuard' },
];

export default function ResearchSection() {
  const [, setLocation] = useLocation();
  const [selectedResearch, setSelectedResearch] = useState<string | null>(null);
  const [electronPos, setElectronPos] = useState({ x: 50, y: 50 });

  const selectedItem = selectedResearch ? research.find((r) => r.id === selectedResearch) : null;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setElectronPos({ x, y });
  };

  return (
    <div className="relative w-full min-h-screen bg-black overflow-hidden">
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
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-5 text-center pointer-events-none"
      >
        <h1 className="text-5xl font-bold text-white" style={{
          fontFamily: "'Space Grotesk', sans-serif",
          textShadow: '0 0 20px rgba(0, 255, 136, 0.5)',
        }}>
          RESEARCH
        </h1>
        <p className="text-green-400 text-sm mt-4" style={{
          fontFamily: "'JetBrains Mono', monospace",
        }}>
          CP2102
        </p>
      </motion.div>

      {/* PCB Board - Interactive Area */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        onMouseMove={handleMouseMove}
        className="relative w-full h-screen bg-gradient-to-br from-gray-950 via-black to-gray-950 overflow-hidden"
      >
        {/* PCB Grid Background */}
        <svg className="absolute inset-0 w-full h-full opacity-10">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#00ff88" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>

        {/* PCB Traces */}
        <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none">
          <line x1="10%" y1="20%" x2="90%" y2="80%" stroke="#00ff88" strokeWidth="2" />
          <line x1="90%" y1="20%" x2="10%" y2="80%" stroke="#00ff88" strokeWidth="2" />
          <circle cx="50%" cy="50%" r="30%" fill="none" stroke="#00ff88" strokeWidth="1" />
        </svg>

        {/* Research Components */}
        {researchComponents.map((comp) => (
          <motion.div
            key={comp.id}
            className="absolute w-32 h-24 cursor-pointer"
            style={{
              left: `${comp.position.x}%`,
              top: `${comp.position.y}%`,
              transform: 'translate(-50%, -50%)',
            }}
            onClick={() => setSelectedResearch(comp.id)}
            whileHover={{ scale: 1.1 }}
          >
            {/* Component Box */}
            <motion.div
              className="w-full h-full bg-gradient-to-br from-green-900/50 to-black border-2 border-green-500 rounded-lg flex items-center justify-center relative overflow-hidden"
              animate={{
                boxShadow: selectedResearch === comp.id
                  ? '0 0 20px rgba(0, 255, 136, 0.8)'
                  : '0 0 10px rgba(0, 255, 136, 0.3)',
              }}
            >
              <div className="text-center z-10">
                <p className="text-green-400 font-bold text-sm" style={{
                  fontFamily: "'JetBrains Mono', monospace",
                }}>
                  {comp.title}
                </p>
                <p className="text-green-300 text-xs mt-1">Press E</p>
              </div>

              {/* Pulsing glow */}
              <motion.div
                className="absolute inset-0 bg-green-500/20 rounded-lg"
                animate={{ opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </motion.div>

            {/* Component Label Flag */}
            <motion.div
              className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-green-500 text-black px-2 py-1 rounded text-xs font-bold whitespace-nowrap"
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {comp.id.toUpperCase()}
            </motion.div>
          </motion.div>
        ))}

        {/* Electron Cursor */}
        <motion.div
          className="fixed w-4 h-4 pointer-events-none z-50"
          style={{
            left: `${electronPos.x}%`,
            top: `${electronPos.y}%`,
            transform: 'translate(-50%, -50%)',
          }}
        >
          <motion.div
            className="w-full h-full bg-green-400 rounded-full"
            animate={{ scale: [1, 1.5, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          />
          <motion.div
            className="absolute inset-0 bg-green-400 rounded-full opacity-50"
            animate={{ scale: [1, 2, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          />
        </motion.div>

        {/* Electron Trail */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          <line
            x1="50%"
            y1="50%"
            x2={`${electronPos.x}%`}
            y2={`${electronPos.y}%`}
            stroke="#00ff88"
            strokeWidth="1"
            opacity="0.3"
          />
        </svg>
      </motion.div>

      {/* Research Detail Modal */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center z-20 bg-black/70"
            onClick={() => setSelectedResearch(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gray-900 border-2 border-green-500 rounded-lg p-8 max-w-md w-full mx-4"
            >
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold text-white">{selectedItem.title}</h2>
                <button
                  onClick={() => setSelectedResearch(null)}
                  className="text-green-400 hover:text-green-300"
                >
                  <X size={24} />
                </button>
              </div>

              <p className="text-green-400 text-sm mb-4">
                {selectedItem.organization} • {selectedItem.date}
              </p>

              <div className="space-y-4">
                <div>
                  <p className="text-green-400 font-bold text-sm mb-1">Summary</p>
                  <p className="text-gray-300 text-sm">{selectedItem.summary}</p>
                </div>

                <div>
                  <p className="text-green-400 font-bold text-sm mb-1">Methodology</p>
                  <p className="text-gray-300 text-sm">{selectedItem.methodology}</p>
                </div>

                <div>
                  <p className="text-green-400 font-bold text-sm mb-1">Outcome</p>
                  <p className="text-gray-300 text-sm">{selectedItem.outcome}</p>
                </div>

                {selectedItem.skills.length > 0 && (
                  <div>
                    <p className="text-green-400 font-bold text-sm mb-2">Skills</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedItem.skills.map((skill) => (
                        <span
                          key={skill}
                          className="px-3 py-1 bg-green-500/20 text-green-400 text-xs rounded-full border border-green-500/50"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Instructions */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-center"
      >
        <p className="text-green-400 text-sm" style={{
          fontFamily: "'JetBrains Mono', monospace",
        }}>
          move electron with mouse • click component to explore
        </p>
      </motion.div>
    </div>
  );
}
