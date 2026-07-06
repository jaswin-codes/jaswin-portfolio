import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { skillClusters } from '@/data/portfolioData';

interface SkillParticle {
  id: string;
  name: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  cluster: string;
  proficiency: 'novice' | 'intermediate' | 'advanced';
}

interface MagnetPosition {
  x: number;
  y: number;
  isDragging: boolean;
}

const getViewportDimensions = () => ({
  width: typeof window !== 'undefined' ? window.innerWidth : 1280,
  height: typeof window !== 'undefined' ? window.innerHeight : 800,
});

const createInitialMagnetPositions = (width: number, height: number): Record<string, MagnetPosition> => ({
  embedded: { x: width * 0.08, y: height * 0.12, isDragging: false },
  ml: { x: width * 0.86, y: height * 0.12, isDragging: false },
  'ai-safety': { x: width * 0.08, y: height * 0.78, isDragging: false },
  web: { x: width * 0.86, y: height * 0.78, isDragging: false },
  power: { x: width * 0.46, y: height * 0.08, isDragging: false },
  tools: { x: width * 0.46, y: height * 0.84, isDragging: false },
});

const roleMagnets = [
  { id: 'embedded', label: 'Embedded Intern', color: '#0088ff' },
  { id: 'ml', label: 'ML Research', color: '#00ff88' },
  { id: 'ai-safety', label: 'AI Safety', color: '#ff0088' },
  { id: 'web', label: 'Full-Stack', color: '#ff6600' },
  { id: 'power', label: 'Power / Energy', color: '#ffaa00' },
  { id: 'tools', label: 'Tools', color: '#cccccc' },
];

export default function SkillsSection() {
  const [, setLocation] = useLocation();
  const [particles, setParticles] = useState<SkillParticle[]>([]);
  const [selectedMagnet, setSelectedMagnet] = useState<string | null>(null);
  const [dimensions, setDimensions] = useState(getViewportDimensions);
  const [magnetPositions, setMagnetPositions] = useState<Record<string, MagnetPosition>>(() =>
    createInitialMagnetPositions(getViewportDimensions().width, getViewportDimensions().height)
  );
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | undefined>(undefined);
  const dragRef = useRef<string | null>(null);

  const BOUNDARY_PADDING = 48;
  const CONTAINER_WIDTH = dimensions.width;
  const CONTAINER_HEIGHT = dimensions.height;

  useEffect(() => {
    const handleResize = () => setDimensions(getViewportDimensions());

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    setMagnetPositions(createInitialMagnetPositions(CONTAINER_WIDTH, CONTAINER_HEIGHT));
  }, [CONTAINER_WIDTH, CONTAINER_HEIGHT]);

  // Initialize particles
  useEffect(() => {
    if (particles.length > 0) return;

    const allSkills: SkillParticle[] = [];
    let id = 0;

    skillClusters.forEach((cluster) => {
      cluster.skills.forEach((skill) => {
        allSkills.push({
          id: `skill-${id++}`,
          name: skill.name,
          x: Math.random() * (CONTAINER_WIDTH - 100) + 50,
          y: Math.random() * (CONTAINER_HEIGHT - 100) + 50,
          vx: (Math.random() - 0.5) * 2,
          vy: (Math.random() - 0.5) * 2,
          cluster: cluster.name,
          proficiency: skill.proficiency,
        });
      });
    });

    setParticles(allSkills);
  }, [CONTAINER_HEIGHT, CONTAINER_WIDTH, particles.length]);

  // Physics simulation
  useEffect(() => {
    const animate = () => {
      if (!containerRef.current) return;

      setParticles((prev) => {
        const updated = prev.map((p) => {
          let x = p.x + p.vx;
          let y = p.y + p.vy;
          let vx = p.vx;
          let vy = p.vy;

          // Bounce off walls with padding
          if (x < BOUNDARY_PADDING || x > CONTAINER_WIDTH - BOUNDARY_PADDING) vx *= -0.8;
          if (y < BOUNDARY_PADDING || y > CONTAINER_HEIGHT - BOUNDARY_PADDING) vy *= -0.8;

          x = Math.max(BOUNDARY_PADDING, Math.min(CONTAINER_WIDTH - BOUNDARY_PADDING, x));
          y = Math.max(BOUNDARY_PADDING, Math.min(CONTAINER_HEIGHT - BOUNDARY_PADDING, y));

          // Magnet attraction
          if (selectedMagnet) {
            const magnet = magnetPositions[selectedMagnet];
            const dx = magnet.x - x;
            const dy = magnet.y - y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 300) {
              const attraction = p.cluster === selectedMagnet ? 0.3 : -0.1;
              vx += (dx / distance) * attraction;
              vy += (dy / distance) * attraction;
            }
          }

          // Damping
          vx *= 0.98;
          vy *= 0.98;

          return { ...p, x, y, vx, vy };
        });

        return updated;
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [selectedMagnet, magnetPositions]);

  const handleMagnetMouseDown = (magnetId: string) => {
    dragRef.current = magnetId;
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!dragRef.current || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Constrain to boundaries
    const constrainedX = Math.max(BOUNDARY_PADDING, Math.min(CONTAINER_WIDTH - BOUNDARY_PADDING, x));
    const constrainedY = Math.max(BOUNDARY_PADDING, Math.min(CONTAINER_HEIGHT - BOUNDARY_PADDING, y));

    setMagnetPositions((prev) => ({
      ...prev,
      [dragRef.current!]: {
        ...prev[dragRef.current!],
        x: constrainedX,
        y: constrainedY,
        isDragging: true,
      },
    }));
  };

  const handleMouseUp = () => {
    dragRef.current = null;
    setMagnetPositions((prev) => ({
      ...prev,
      ...Object.keys(prev).reduce((acc, key) => {
        acc[key] = { ...prev[key], isDragging: false };
        return acc;
      }, {} as Record<string, MagnetPosition>),
    }));
  };

  return (
    <div className="relative w-full min-h-screen bg-black overflow-hidden border-2 border-green-500/20">
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
          SKILLS & TOOLS
        </h1>
        <p className="text-green-400 text-sm mt-4" style={{
          fontFamily: "'JetBrains Mono', monospace",
        }}>
          GPIO PINS
        </p>
      </motion.div>

      {/* Magnetic Field Simulator */}
      <div
        ref={containerRef}
        className="relative w-full h-screen bg-gradient-to-br from-gray-950 via-black to-gray-950 overflow-hidden"
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* Magnetic Field Lines */}
        <svg className="absolute inset-0 w-full h-full opacity-10 pointer-events-none">
          <defs>
            <pattern id="field" width="50" height="50" patternUnits="userSpaceOnUse">
              <path d="M 0 25 Q 12.5 0 25 25 T 50 25" fill="none" stroke="#00ff88" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#field)" />
        </svg>

        {/* Skill Particles */}
        {particles.map((particle) => {
          const clusterColor = skillClusters.find((c) => c.name === particle.cluster)?.color || '#00ff88';
          return (
            <motion.div
              key={particle.id}
              className="absolute w-16 h-16 flex items-center justify-center rounded-full cursor-pointer"
              style={{
                left: `${particle.x}px`,
                top: `${particle.y}px`,
                transform: 'translate(-50%, -50%)',
              }}
              whileHover={{ scale: 1.2 }}
            >
              {/* Skill Bubble */}
              <motion.div
                className="w-full h-full rounded-full flex items-center justify-center text-center text-xs font-bold relative overflow-hidden p-1"
                style={{
                  backgroundColor: `${clusterColor}20`,
                  border: `2px solid ${clusterColor}`,
                  color: clusterColor,
                }}
              animate={{
                boxShadow: `0 0 ${10 + (particle.proficiency === 'advanced' ? 8 : particle.proficiency === 'intermediate' ? 5 : 2)}px ${clusterColor}`,
              }}
              >
                {particle.name}
              </motion.div>
            </motion.div>
          );
        })}

        {/* Role Magnets */}
        <div className="absolute inset-0 pointer-events-none">
          {roleMagnets.map((magnet) => {
            const pos = magnetPositions[magnet.id];
            return (
              <motion.div
                key={magnet.id}
                className="absolute w-24 h-24 flex items-center justify-center cursor-grab pointer-events-auto active:cursor-grabbing"
                style={{
                  left: `${pos.x}px`,
                  top: `${pos.y}px`,
                  transform: 'translate(-50%, -50%)',
                }}
                onMouseDown={() => handleMagnetMouseDown(magnet.id)}
                onClick={() => setSelectedMagnet(selectedMagnet === magnet.id ? null : magnet.id)}
                whileHover={{ scale: 1.1 }}
              >
                <motion.div
                  className="w-full h-full rounded-full flex items-center justify-center text-center text-xs font-bold"
                  style={{
                    backgroundColor: `${magnet.color}20`,
                    border: `2px solid ${magnet.color}`,
                    color: magnet.color,
                  }}
                  animate={{
                    boxShadow: `0 0 10px ${magnet.color}`,
                  }}
                >
                  🧲<br />{magnet.label}
                </motion.div>
              </motion.div>
            );
          })}
        </div>

        {/* Instructions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-6 right-6 bg-black/70 border border-green-500/30 rounded p-4 max-w-xs text-green-400 text-sm pointer-events-none"
          style={{ fontFamily: "'JetBrains Mono', monospace" }}
        >
          <p className="font-bold mb-2">CONTROLS:</p>
          <p>• Drag magnets to move them</p>
          <p>• Click magnet to attract skills</p>
        </motion.div>
      </div>

      {/* Legend */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute bottom-16 left-8 bg-black/50 border border-green-500/30 rounded p-4 max-w-xs pointer-events-none"
      >
        <p className="text-green-400 font-bold mb-3 text-sm" style={{
          fontFamily: "'JetBrains Mono', monospace",
        }}>
          SKILL CLUSTERS
        </p>
        <div className="space-y-2">
          {skillClusters.map((cluster) => (
            <div key={cluster.name} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: cluster.color }}
              />
              <span className="text-green-400 text-xs" style={{
                fontFamily: "'JetBrains Mono', monospace",
              }}>
                {cluster.name}
              </span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
