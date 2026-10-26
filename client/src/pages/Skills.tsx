import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { skillClusters } from '@/data/portfolioData';
import WorldHeader from '@/components/WorldHeader';

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

const createInitialMagnetPositions = (width: number, height: number): Record<string, MagnetPosition> => {
  const left = Math.max(56, width * 0.08);
  const right = Math.min(width - 56, width * 0.86);
  const top = Math.max(130, height * 0.14);
  return {
    embedded: { x: left, y: top, isDragging: false },
    ml: { x: right, y: top, isDragging: false },
    'ai-safety': { x: left, y: height * 0.78, isDragging: false },
    web: { x: right, y: height * 0.78, isDragging: false },
    power: { x: width * 0.5, y: top, isDragging: false },
    tools: { x: width * 0.5, y: height * 0.84, isDragging: false },
  };
};

const roleMagnets = [
  { id: 'embedded', label: 'Electronics', color: '#0088ff' },
  { id: 'ml', label: 'Data & ML', color: '#00ff88' },
  { id: 'ai-safety', label: 'AI Safety', color: '#ff0088' },
  { id: 'web', label: 'Web', color: '#ff6600' },
  { id: 'power', label: 'Power / EV', color: '#ffaa00' },
  { id: 'tools', label: 'Tools', color: '#cccccc' },
];

export default function SkillsSection() {
  const [particles, setParticles] = useState<SkillParticle[]>([]);
  const [selectedMagnet, setSelectedMagnet] = useState<string | null>(null);
  const [dimensions, setDimensions] = useState(getViewportDimensions);
  const [magnetPositions, setMagnetPositions] = useState<Record<string, MagnetPosition>>(() =>
    createInitialMagnetPositions(getViewportDimensions().width, getViewportDimensions().height)
  );
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | undefined>(undefined);
  const dragRef = useRef<string | null>(null);

  // wider margin on phones so long skill pills stay on screen
  const BOUNDARY_PADDING = dimensions.width < 768 ? 90 : 48;
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
      <WorldHeader title="SKILLS & TOOLS" part="GPIO PINS" />

      {/* Magnetic Field Simulator */}
      <div
        ref={containerRef}
        className="relative w-full h-screen bg-gradient-to-br from-gray-950 via-black to-gray-950 overflow-hidden"
        onPointerMove={handleMouseMove}
        onPointerUp={handleMouseUp}
        onPointerLeave={handleMouseUp}
        style={{ touchAction: 'none' }}
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
              className="absolute flex items-center justify-center cursor-pointer transition-opacity"
              style={{
                left: `${particle.x}px`,
                top: `${particle.y}px`,
                transform: 'translate(-50%, -50%)',
                opacity: selectedMagnet && selectedMagnet !== particle.cluster ? 0.25 : 1,
              }}
              whileHover={{ scale: 1.2 }}
            >
              {/* Skill Bubble */}
              <motion.div
                className="rounded-full whitespace-nowrap px-2 py-1 text-[10px] md:text-xs font-bold"
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
                className="absolute w-20 h-20 md:w-24 md:h-24 flex items-center justify-center cursor-grab pointer-events-auto active:cursor-grabbing"
                style={{
                  left: `${pos.x}px`,
                  top: `${pos.y}px`,
                  transform: 'translate(-50%, -50%)',
                }}
                onPointerDown={() => handleMagnetMouseDown(magnet.id)}
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
          className="absolute bottom-20 left-4 right-4 md:bottom-20 md:left-auto md:right-6 bg-black/70 border border-green-500/30 rounded p-3 md:p-4 md:max-w-xs text-green-400 text-xs md:text-sm pointer-events-none"
          style={{ fontFamily: "'JetBrains Mono', monospace" }}
        >
          <p className="font-bold mb-2">CONTROLS:</p>
          <p>• Drag a magnet to move it</p>
          <p>• Tap a magnet to pull in its skills</p>
        </motion.div>
      </div>

      {/* Legend */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="hidden md:block absolute bottom-24 left-8 bg-black/50 border border-green-500/30 rounded p-4 max-w-xs pointer-events-none"
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
                {cluster.label}
              </span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
