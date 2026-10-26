import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { experiences } from '@/data/portfolioData';
import { X } from 'lucide-react';
import WorldHeader from '@/components/WorldHeader';

export default function ExperienceSection() {
  const [selectedFloor, setSelectedFloor] = useState<number | null>(0);
  const [isMoving, setIsMoving] = useState(false);

  const handleFloorClick = (index: number) => {
    if (selectedFloor !== index) {
      setIsMoving(true);
      setTimeout(() => {
        setSelectedFloor(index);
        setIsMoving(false);
      }, 600);
    }
  };

  const selectedExperience = selectedFloor !== null ? experiences[selectedFloor] : null;

  return (
    <div className="relative w-full min-h-screen bg-black overflow-x-hidden">
      <WorldHeader title="EXPERIENCE" part="AMS1117-3.3" />

      <div className="flex flex-col md:flex-row min-h-screen pt-24 md:pt-0">
        {/* Elevator Panel - Left Side */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full md:w-1/2 flex items-center justify-center p-4 md:p-8"
        >
          <div className="bg-gray-800 border-4 border-gray-600 rounded-lg p-4 md:p-8 shadow-2xl w-full max-w-sm">
            {/* Floor Counter Display */}
            <div className="bg-black rounded p-4 mb-6 text-center border border-green-500/50">
              <div className="text-green-400 text-3xl font-bold" style={{
                fontFamily: "'JetBrains Mono', monospace",
              }}>
                {isMoving ? '...' : selectedFloor !== null ? `FLOOR ${selectedFloor + 1}` : '---'}
              </div>
            </div>

            {/* Floor Buttons */}
            <div className="grid grid-cols-2 md:grid-cols-1 gap-3">
              {experiences.map((exp, index) => (
                <motion.button
                  key={exp.id}
                  onClick={() => handleFloorClick(index)}
                  className={`w-full py-3 px-4 rounded font-bold transition-all ${
                    selectedFloor === index
                      ? 'bg-green-500 text-black border-2 border-green-400'
                      : 'bg-gray-700 text-green-400 border-2 border-gray-600 hover:bg-gray-600'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="text-sm" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                    FLOOR {index + 1}
                  </div>
                  <div className="text-xs mt-1">{exp.company}</div>
                </motion.button>
              ))}
            </div>

            {/* Elevator Door Animation */}
            <motion.div
              animate={isMoving ? { scaleX: 0 } : { scaleX: 1 }}
              transition={{ duration: 0.6 }}
              className="mt-6 h-2 bg-gradient-to-r from-green-500 to-green-400 rounded origin-center"
            />
          </div>
        </motion.div>

        {/* Experience Info Panel - Right Side */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full md:w-1/2 flex items-center justify-center p-4 pb-24 md:p-8"
        >
          <AnimatePresence mode="wait">
            {selectedExperience && (
              <motion.div
                key={selectedExperience.id}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.4 }}
                className="bg-gradient-to-br from-gray-900 to-black border-2 border-green-500/50 rounded-lg p-5 md:p-8 max-w-md w-full"
              >
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-2" style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                }}>
                  {selectedExperience.company}
                </h2>
                <p className="text-green-400 font-bold mb-1">{selectedExperience.role}</p>
                <p className="text-gray-400 text-sm mb-4" style={{
                  fontFamily: "'JetBrains Mono', monospace",
                }}>
                  {selectedExperience.duration}
                </p>
                <p className="text-gray-400 text-sm mb-4">{selectedExperience.location}</p>

                <p className="text-gray-300 text-sm mb-4 leading-relaxed">
                  {selectedExperience.description}
                </p>

                {selectedExperience.bulletPoints.length > 0 && (
                  <ul className="space-y-2 mb-4">
                    {selectedExperience.bulletPoints.map((point, idx) => (
                      <li key={idx} className="text-gray-300 text-sm flex gap-2">
                        <span className="text-green-400">▸</span>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {selectedExperience.skills.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {selectedExperience.skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-3 py-1 bg-green-500/20 text-green-400 text-xs rounded-full border border-green-500/50"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

    </div>
  );
}
