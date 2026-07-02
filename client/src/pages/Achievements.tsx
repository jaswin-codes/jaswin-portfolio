import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { achievements } from '@/data/portfolioData';
import { X } from 'lucide-react';

interface Waveform {
  type: 'sine' | 'square' | 'ramp' | 'flatline';
  points: Array<[number, number]>;
}

const generateWaveform = (type: 'sine' | 'square' | 'ramp' | 'flatline'): Waveform => {
  const points: Array<[number, number]> = [];
  const width = 300;
  const height = 100;
  const centerY = height / 2;

  switch (type) {
    case 'sine':
      for (let x = 0; x <= width; x += 5) {
        const y = centerY - Math.sin((x / width) * Math.PI * 4) * (height * 0.3);
        points.push([x, y]);
      }
      break;
    case 'square':
      for (let x = 0; x <= width; x += 5) {
        const cycle = (x / (width / 4)) % 4;
        const y = cycle < 2 ? centerY - height * 0.3 : centerY + height * 0.3;
        points.push([x, y]);
      }
      break;
    case 'ramp':
      for (let x = 0; x <= width; x += 5) {
        const y = centerY - (x / width) * (height * 0.4);
        points.push([x, y]);
      }
      break;
    case 'flatline':
      for (let x = 0; x <= width; x += 5) {
        points.push([x, centerY]);
      }
      break;
  }

  return { type, points };
};

export default function AchievementsSection() {
  const [, setLocation] = useLocation();
  const [selectedAchievement, setSelectedAchievement] = useState<string | null>(null);
  const [probePos, setProbePos] = useState({ x: 50, y: 50 });

  const selectedItem = selectedAchievement
    ? achievements.find((a) => a.id === selectedAchievement)
    : null;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setProbePos({ x, y });
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
          ACHIEVEMENTS
        </h1>
        <p className="text-green-400 text-sm mt-4" style={{
          fontFamily: "'JetBrains Mono', monospace",
        }}>
          40MHz XTAL
        </p>
      </motion.div>

      {/* Oscilloscope Screen */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        onMouseMove={handleMouseMove}
        className="relative w-full h-screen flex items-center justify-center p-8 bg-gradient-to-b from-gray-900 via-black to-gray-900"
      >
        {/* Oscilloscope Frame */}
        <div className="w-full max-w-4xl bg-gradient-to-b from-gray-700 to-gray-800 rounded-lg shadow-2xl p-8 border-8 border-gray-600">
          {/* Screen Bezel */}
          <div className="bg-black rounded p-4 relative overflow-hidden" style={{
            aspectRatio: '16 / 9',
          }}>
            {/* CRT Phosphor Glow */}
            <div className="absolute inset-0 bg-gradient-radial from-green-900/30 to-transparent rounded" />

            {/* Scanlines */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.15) 0px, rgba(0,0,0,0.15) 1px, transparent 1px, transparent 2px)',
              }}
            />

            {/* Waveforms */}
            <div className="absolute inset-0 flex flex-col justify-around p-8">
              {achievements.map((achievement, idx) => {
                const waveform = generateWaveform(achievement.waveformType);
                const pathData = `M ${waveform.points.map((p) => `${p[0]},${p[1]}`).join(' L ')}`;

                return (
                  <motion.div
                    key={achievement.id}
                    className="relative h-20 cursor-pointer"
                    onClick={() => setSelectedAchievement(achievement.id)}
                    whileHover={{ scale: 1.02 }}
                  >
                    {/* Waveform SVG */}
                    <svg
                      className="w-full h-full"
                      viewBox="0 0 300 100"
                      preserveAspectRatio="none"
                    >
                      <path
                        d={pathData}
                        stroke="#00ff88"
                        strokeWidth="2"
                        fill="none"
                        style={{
                          filter: 'drop-shadow(0 0 4px #00ff88)',
                        }}
                      />
                    </svg>

                    {/* Achievement Label */}
                    <div className="absolute left-0 top-1/2 transform -translate-y-1/2 text-green-400 text-xs font-bold" style={{
                      fontFamily: "'JetBrains Mono', monospace",
                    }}>
                      {achievement.date}
                    </div>

                    {/* Hover Highlight */}
                    {selectedAchievement === achievement.id && (
                      <motion.div
                        className="absolute inset-0 border-2 border-green-400 rounded"
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 1, repeat: Infinity }}
                      />
                    )}
                  </motion.div>
                );
              })}
            </div>

            {/* Probe Cursor */}
            <motion.div
              className="absolute w-1 h-full bg-yellow-300 pointer-events-none"
              style={{
                left: `${probePos.x}%`,
                boxShadow: '0 0 10px rgba(255, 255, 0, 0.8)',
              }}
            >
              <div className="absolute -top-2 -left-1 w-3 h-3 bg-yellow-300 rounded-full" />
            </motion.div>

            {/* Grid */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-10">
              <defs>
                <pattern id="grid-crt" width="30" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 30 0 L 0 0 0 20" fill="none" stroke="#00ff88" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid-crt)" />
            </svg>
          </div>

          {/* Control Panel */}
          <div className="mt-6 flex justify-between items-center px-4">
            <div className="text-green-400 text-xs font-bold" style={{
              fontFamily: "'JetBrains Mono', monospace",
            }}>
              CH1: 1V/DIV
            </div>
            <div className="text-green-400 text-xs font-bold" style={{
              fontFamily: "'JetBrains Mono', monospace",
            }}>
              TIME: 10ms/DIV
            </div>
            <div className="text-green-400 text-xs font-bold" style={{
              fontFamily: "'JetBrains Mono', monospace",
            }}>
              TRIG: AUTO
            </div>
          </div>
        </div>

        {/* Probe Label */}
        <motion.div
          className="absolute top-4 right-4 text-yellow-300 font-bold text-sm"
          style={{
            fontFamily: "'JetBrains Mono', monospace",
          }}
        >
          PROBE
        </motion.div>
      </motion.div>

      {/* Achievement Detail Modal */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center z-20 bg-black/70"
            onClick={() => setSelectedAchievement(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gray-900 border-2 border-green-500 rounded-lg p-8 max-w-md w-full mx-4"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-white">{selectedItem.title}</h2>
                  <p className="text-green-400 text-sm mt-1">{selectedItem.type}</p>
                </div>
                <button
                  onClick={() => setSelectedAchievement(null)}
                  className="text-green-400 hover:text-green-300"
                >
                  <X size={24} />
                </button>
              </div>

              <p className="text-gray-400 text-sm mb-4" style={{
                fontFamily: "'JetBrains Mono', monospace",
              }}>
                {selectedItem.date}
              </p>

              <p className="text-gray-300 text-sm leading-relaxed">
                {selectedItem.description}
              </p>
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
          move probe • click waveform to explore
        </p>
      </motion.div>
    </div>
  );
}
