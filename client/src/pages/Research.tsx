import { useState } from 'react';
import { useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { research, RESEARCH_POSTER_URL } from '@/data/portfolioData';
import { X, Github, ExternalLink, FileText, Image } from 'lucide-react';

interface ResearchComponent {
  id: string;
  position: { x: number; y: number };
  title: string;
  color: string;
}

const researchComponents: ResearchComponent[] = [
  { id: 'hyperspectral',     position: { x: 30, y: 38 }, title: 'Hyperspectral Imaging', color: '#00ff88' },
  { id: 'swappable-battery', position: { x: 68, y: 62 }, title: 'Swappable Battery',    color: '#ffaa00' },
];

export default function ResearchSection() {
  const [, setLocation] = useLocation();
  const [selectedResearch, setSelectedResearch] = useState<string | null>(null);
  const [electronPos, setElectronPos] = useState({ x: 50, y: 50 });
  const [showPoster, setShowPoster] = useState(false);

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
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={() => setLocation('/')}
        className="absolute top-6 left-6 z-10 flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-semibold"
        style={{ backgroundColor: 'rgba(0,0,0,0.7)', borderColor: '#00ff88', color: '#00ff88', fontFamily: "'JetBrains Mono', monospace", backdropFilter: 'blur(8px)' }}
        whileHover={{ backgroundColor: 'rgba(0,255,136,0.1)' }}
      >
        ← ESP32
      </motion.button>

      {/* Section title */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute top-6 left-1/2 -translate-x-1/2 z-10 text-center pointer-events-none"
      >
        <h1 className="text-3xl font-bold" style={{ color: '#ffffff', fontFamily: "'Space Grotesk', sans-serif", textShadow: '0 0 20px rgba(0,255,136,0.5)' }}>
          ELECTRON JOURNEY
        </h1>
        <p className="text-xs mt-1" style={{ color: '#00ff88', fontFamily: "'JetBrains Mono', monospace" }}>
          CP2102 · RESEARCH
        </p>
      </motion.div>

      {/* PCB Interactive Area */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        onMouseMove={handleMouseMove}
        className="relative w-full h-screen overflow-hidden"
        style={{ background: 'radial-gradient(ellipse at center, #0a1a0f 0%, #050a05 60%, #000000 100%)' }}
      >
        {/* PCB Grid */}
        <svg className="absolute inset-0 w-full h-full opacity-10 pointer-events-none">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#00ff88" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>

        {/* PCB Traces connecting components */}
        <svg className="absolute inset-0 w-full h-full opacity-25 pointer-events-none">
          <line x1="28%" y1="40%" x2="72%" y2="55%" stroke="#00ff88" strokeWidth="2" strokeDasharray="8 4" />
          <circle cx="28%" cy="40%" r="3" fill="#00ff88" />
          <circle cx="72%" cy="55%" r="3" fill="#ff0088" />
          <circle cx="50%" cy="47.5%" r="5" fill="none" stroke="#00ff88" strokeWidth="1" />
          {/* Extra traces */}
          <line x1="5%" y1="50%" x2="28%" y2="40%" stroke="#00ff88" strokeWidth="1.5" opacity="0.5" />
          <line x1="72%" y1="55%" x2="95%" y2="45%" stroke="#ff0088" strokeWidth="1.5" opacity="0.5" />
          <line x1="28%" y1="40%" x2="20%" y2="80%" stroke="#00ff88" strokeWidth="1" opacity="0.3" />
          <line x1="72%" y1="55%" x2="80%" y2="20%" stroke="#ff0088" strokeWidth="1" opacity="0.3" />
        </svg>

        {/* Research Component Chips */}
        {researchComponents.map((comp) => (
          <motion.div
            key={comp.id}
            className="absolute cursor-pointer select-none"
            style={{
              left: `${comp.position.x}%`,
              top: `${comp.position.y}%`,
              transform: 'translate(-50%, -50%)',
              zIndex: 10,
            }}
            onClick={() => setSelectedResearch(selectedResearch === comp.id ? null : comp.id)}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
          >
            {/* Chip body */}
            <motion.div
              className="w-44 h-28 rounded-lg flex flex-col items-center justify-center relative overflow-hidden border-2"
              style={{ borderColor: comp.color, backgroundColor: 'rgba(0,0,0,0.85)' }}
              animate={{
                boxShadow: selectedResearch === comp.id
                  ? `0 0 30px ${comp.color}99`
                  : `0 0 12px ${comp.color}44`,
              }}
            >
              {/* Chip inner glow */}
              <motion.div
                className="absolute inset-0 rounded-lg"
                style={{ backgroundColor: comp.color }}
                animate={{ opacity: [0.05, 0.12, 0.05] }}
                transition={{ duration: 2.5, repeat: Infinity }}
              />
              <p className="text-xs font-bold text-center z-10 px-2 leading-tight" style={{ color: comp.color, fontFamily: "'JetBrains Mono', monospace" }}>
                {comp.title}
              </p>
              <p className="text-xs mt-1 z-10" style={{ color: comp.color + '99', fontFamily: "'JetBrains Mono', monospace" }}>
                [ CLICK ]
              </p>
              {/* Pin rows */}
              {[0,1,2,3].map((i) => (
                <div key={`l${i}`} className="absolute w-2 h-0.5 left-0 -translate-x-full" style={{ backgroundColor: comp.color, top: `${25 + i * 18}%`, opacity: 0.7 }} />
              ))}
              {[0,1,2,3].map((i) => (
                <div key={`r${i}`} className="absolute w-2 h-0.5 right-0 translate-x-full" style={{ backgroundColor: comp.color, top: `${25 + i * 18}%`, opacity: 0.7 }} />
              ))}
            </motion.div>

            {/* Floating label */}
            <motion.div
              className="absolute -top-9 left-1/2 -translate-x-1/2 px-2 py-1 rounded text-xs font-bold whitespace-nowrap"
              style={{ backgroundColor: comp.color, color: '#000000', fontFamily: "'JetBrains Mono', monospace" }}
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 2.2, repeat: Infinity }}
            >
              {comp.id.toUpperCase()}
            </motion.div>
          </motion.div>
        ))}

        {/* Electron cursor */}
        <motion.div
          className="fixed pointer-events-none z-50"
          style={{ left: `${electronPos.x}%`, top: `${electronPos.y}%`, transform: 'translate(-50%, -50%)' }}
        >
          <motion.div className="w-4 h-4 bg-green-400 rounded-full" animate={{ scale: [1, 1.5, 1] }} transition={{ duration: 0.8, repeat: Infinity }} />
          <motion.div className="absolute inset-0 bg-green-400 rounded-full" animate={{ scale: [1, 2.5, 1], opacity: [0.5, 0, 0.5] }} transition={{ duration: 0.8, repeat: Infinity }} />
        </motion.div>

        {/* Electron trail */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          <line x1="50%" y1="50%" x2={`${electronPos.x}%`} y2={`${electronPos.y}%`} stroke="#00ff88" strokeWidth="1.5" opacity="0.25" />
        </svg>

        {/* Instructions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center"
          style={{ color: '#00ff8888', fontFamily: "'JetBrains Mono', monospace", fontSize: '0.75rem' }}
        >
          move electron with mouse · click chip to explore research
        </motion.div>
      </motion.div>

      {/* Research Detail Modal */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            key="research-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-20 flex items-center justify-center"
            style={{ backgroundColor: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(4px)' }}
            onClick={() => setSelectedResearch(null)}
          >
            <motion.div
              key="research-modal"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', stiffness: 280, damping: 24 }}
              onClick={(e) => e.stopPropagation()}
              className="relative rounded-xl border overflow-hidden max-w-2xl w-full mx-4"
              style={{ backgroundColor: '#080f08', borderColor: selectedItem.id === 'hyperspectral' ? '#00ff88' : '#ff0088', maxHeight: '90vh' }}
            >
              {/* Poster thumbnail for hyperspectral */}
              {selectedItem.id === 'hyperspectral' && (
                <div className="relative h-44 overflow-hidden cursor-pointer" onClick={() => setShowPoster(true)}>
                  <img
                    src={RESEARCH_POSTER_URL}
                    alt="Research Poster"
                    className="w-full h-full object-cover object-top"
                    style={{ filter: 'brightness(0.65) saturate(1.1)' }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.3)' }}>
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-bold" style={{ backgroundColor: 'rgba(0,0,0,0.7)', borderColor: '#00ff88', color: '#00ff88' }}>
                      <Image size={14} /> Click to view full poster
                    </div>
                  </div>
                  <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, transparent 50%, #080f08)' }} />
                  <div className="absolute bottom-3 left-6">
                    <h2 className="text-xl font-bold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif", textShadow: '0 0 10px rgba(0,255,136,0.8)' }}>
                      {selectedItem.title}
                    </h2>
                  </div>
                </div>
              )}

              <div className="p-6 overflow-y-auto" style={{ maxHeight: selectedItem.id === 'hyperspectral' ? 'calc(90vh - 11rem)' : '90vh' }}>
                {selectedItem.id !== 'hyperspectral' && (
                  <h2 className="text-2xl font-bold text-white mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                    {selectedItem.title}
                  </h2>
                )}

                <p className="text-sm mb-4" style={{ color: selectedItem.id === 'hyperspectral' ? '#00ff88' : '#ff0088', fontFamily: "'JetBrains Mono', monospace" }}>
                  {selectedItem.organization} · {selectedItem.date}
                </p>

                <div className="space-y-4 text-sm">
                  <div>
                    <p className="font-bold mb-1" style={{ color: selectedItem.id === 'hyperspectral' ? '#00ff88' : '#ff0088' }}>Summary</p>
                    <p className="text-gray-300 leading-relaxed">{selectedItem.summary}</p>
                  </div>
                  <div>
                    <p className="font-bold mb-1" style={{ color: selectedItem.id === 'hyperspectral' ? '#00ff88' : '#ff0088' }}>Methodology</p>
                    <p className="text-gray-300 leading-relaxed">{selectedItem.methodology}</p>
                  </div>
                  <div>
                    <p className="font-bold mb-1" style={{ color: selectedItem.id === 'hyperspectral' ? '#00ff88' : '#ff0088' }}>Outcome</p>
                    <p className="text-gray-300 leading-relaxed">{selectedItem.outcome}</p>
                  </div>

                  {/* Skills */}
                  <div className="flex flex-wrap gap-2">
                    {selectedItem.skills.map((skill) => (
                      <span key={skill} className="px-2 py-1 text-xs rounded border" style={{ backgroundColor: 'rgba(0,255,136,0.08)', borderColor: '#00ff8850', color: '#00ff88' }}>
                        {skill}
                      </span>
                    ))}
                  </div>

                  {/* Asset links */}
                  <div className="flex flex-wrap gap-3 pt-2">
                    {selectedItem.assets?.poster && (
                      <button
                        onClick={() => setShowPoster(true)}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-semibold transition-colors"
                        style={{ backgroundColor: 'rgba(0,255,136,0.1)', borderColor: '#00ff88', color: '#00ff88' }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(0,255,136,0.2)')}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'rgba(0,255,136,0.1)')}
                      >
                        <FileText size={15} /> View Poster
                      </button>
                    )}
                    {selectedItem.assets?.paper && (
                      <a
                        href={selectedItem.assets.paper}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-semibold transition-colors"
                        style={{ backgroundColor: 'rgba(255,0,136,0.1)', borderColor: '#ff0088', color: '#ff0088' }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255,0,136,0.2)')}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255,0,136,0.1)')}
                      >
                        <Github size={15} /> GitHub
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {/* Close */}
              <button
                onClick={() => setSelectedResearch(null)}
                className="absolute top-4 right-4 p-1 rounded-full"
                style={{ color: '#00ff88', backgroundColor: 'rgba(0,0,0,0.6)' }}
              >
                <X size={20} />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Full-screen poster lightbox */}
      <AnimatePresence>
        {showPoster && (
          <motion.div
            key="poster-lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ backgroundColor: 'rgba(0,0,0,0.95)' }}
            onClick={() => setShowPoster(false)}
          >
            <motion.img
              src={RESEARCH_POSTER_URL}
              alt="Research Poster — Predicting Post-Harvest Freshness Using Simulated Hyperspectral Signatures"
              className="max-w-full max-h-full object-contain rounded-lg"
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 280, damping: 24 }}
              onClick={(e) => e.stopPropagation()}
            />
            <button
              onClick={() => setShowPoster(false)}
              className="absolute top-6 right-6 p-2 rounded-full border"
              style={{ color: '#00ff88', borderColor: '#00ff88', backgroundColor: 'rgba(0,0,0,0.8)' }}
            >
              <X size={22} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
