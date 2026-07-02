import { useState, useEffect, useRef } from 'react';
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
  proficiency: number;
}

const roleMagnets = [
  { id: 'embedded', label: 'Embedded Intern', color: '#0088ff' },
  { id: 'ml', label: 'ML Research', color: '#00ff88' },
  { id: 'ai-safety', label: 'AI Safety', color: '#ff0088' },
  { id: 'web', label: 'Full-Stack', color: '#ff6600' },
];

export default function SkillsSection() {
  const [, setLocation] = useLocation();
  const [particles, setParticles] = useState<SkillParticle[]>([]);
  const [selectedMagnet, setSelectedMagnet] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | undefined>(undefined);

  // Initialize particles
  useEffect(() => {
    const allSkills: SkillParticle[] = [];
    let id = 0;

    skillClusters.forEach((cluster) => {
      cluster.skills.forEach((skill) => {
        allSkills.push({
          id: `skill-${id++}`,
          name: skill.name,
          x: Math.random() * 800,
          y: Math.random() * 600,
          vx: (Math.random() - 0.5) * 2,
          vy: (Math.random() - 0.5) * 2,
          cluster: cluster.name,
          proficiency: skill.proficiency,
        });
      });
    });

    setParticles(allSkills);
  }, []);

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

          // Bounce off walls
          if (x < 0 || x > 800) vx *= -1;
          if (y < 0 || y > 600) vy *= -1;

          x = Math.max(0, Math.min(800, x));
          y = Math.max(0, Math.min(600, y));

          // Magnet attraction
          if (selectedMagnet) {
            const magnetX = selectedMagnet === 'embedded' ? 100 : selectedMagnet === 'ml' ? 700 : selectedMagnet === 'ai-safety' ? 100 : 700;
            const magnetY = selectedMagnet === 'embedded' || selectedMagnet === 'ml' ? 100 : 500;

            const dx = magnetX - x;
            const dy = magnetY - y;
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
  }, [selectedMagnet]);

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
                left: `${(particle.x / 800) * 100}%`,
                top: `${(particle.y / 600) * 100}%`,
                transform: 'translate(-50%, -50%)',
              }}
              whileHover={{ scale: 1.2 }}
            >
              {/* Skill Bubble */}
              <motion.div
                className="w-full h-full rounded-full flex items-center justify-center text-center text-xs font-bold relative overflow-hidden"
                style={{
                  backgroundColor: `${clusterColor}20`,
                  border: `2px solid ${clusterColor}`,
                  color: clusterColor,
                }}
                animate={{
                  boxShadow: `0 0 ${10 + particle.proficiency / 10}px ${clusterColor}`,
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
            const positions: Record<string, [string, string]> = {
              embedded: ['5%', '10%'],
              ml: ['85%', '10%'],
              'ai-safety': ['5%', '85%'],
              web: ['85%', '85%'],
            };
            const [left, top] = positions[magnet.id];

            return (
              <motion.div
                key={magnet.id}
                className="absolute w-24 h-24 flex items-center justify-center cursor-pointer pointer-events-auto"
                style={{ left, top, transform: 'translate(-50%, -50%)' }}
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
                  animate={selectedMagnet === magnet.id ? {
                    boxShadow: `0 0 30px ${magnet.color}`,
                    scale: 1.1,
                  } : {
                    boxShadow: `0 0 10px ${magnet.color}`,
                  }}
                >
                  🧲<br />{magnet.label}
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute bottom-8 left-8 bg-black/50 border border-green-500/30 rounded p-4 max-w-xs"
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
              <span className="text-gray-300 text-xs">{cluster.label}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Instructions */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute bottom-8 right-8 text-right"
      >
        <p className="text-green-400 text-sm" style={{
          fontFamily: "'JetBrains Mono', monospace",
        }}>
          click a magnet to attract skills
        </p>
      </motion.div>
    </div>
  );
}
