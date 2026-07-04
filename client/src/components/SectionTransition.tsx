import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SectionTransitionProps {
  isTransitioning: boolean;
  targetSection?: string;
  onComplete?: () => void;
}

// Animated circuit trace that draws itself
function CircuitTrace({ delay, x1, y1, x2, y2, color = '#00ff88' }: {
  delay: number; x1: number; y1: number; x2: number; y2: number; color?: string;
}) {
  return (
    <motion.line
      x1={x1} y1={y1} x2={x2} y2={y2}
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity: [0, 1, 1, 0] }}
      transition={{ duration: 0.6, delay, ease: 'easeInOut' }}
    />
  );
}

function CircuitNode({ cx, cy, delay, color = '#00ff88' }: {
  cx: number; cy: number; delay: number; color?: string;
}) {
  return (
    <motion.circle
      cx={cx} cy={cy} r={4}
      fill={color}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: [0, 1.5, 1], opacity: [0, 1, 1, 0] }}
      transition={{ duration: 0.4, delay }}
    />
  );
}

const SECTION_LABELS: Record<string, string> = {
  projects: 'ROBOT POV LAB',
  about: 'BUSINESS CARD STACK',
  experience: 'ELEVATOR FLOORS',
  research: 'ELECTRON JOURNEY',
  skills: 'MAGNETIC FIELD SIM',
  achievements: 'OSCILLOSCOPE VIEWER',
};

export default function SectionTransition({ isTransitioning, targetSection, onComplete }: SectionTransitionProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number>(0);
  const [phase, setPhase] = useState<'in' | 'hold' | 'out'>('in');

  useEffect(() => {
    if (!isTransitioning) { setPhase('in'); return; }
    setPhase('in');
    const t1 = setTimeout(() => setPhase('hold'), 400);
    const t2 = setTimeout(() => setPhase('out'), 900);
    const t3 = setTimeout(() => { onComplete?.(); }, 1300);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [isTransitioning, onComplete]);

  // Canvas scanline + particle effect
  useEffect(() => {
    if (!isTransitioning) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: { x: number; y: number; vx: number; vy: number; life: number; maxLife: number }[] = [];
    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 3,
        vy: (Math.random() - 0.5) * 3,
        life: Math.random() * 60,
        maxLife: 60 + Math.random() * 40,
      });
    }

    let frame = 0;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Scanlines
      for (let y = 0; y < canvas.height; y += 4) {
        ctx.fillStyle = 'rgba(0,255,136,0.015)';
        ctx.fillRect(0, y, canvas.width, 1);
      }

      // Moving scan line
      const scanY = (frame * 4) % canvas.height;
      const grad = ctx.createLinearGradient(0, scanY - 20, 0, scanY + 20);
      grad.addColorStop(0, 'rgba(0,255,136,0)');
      grad.addColorStop(0.5, 'rgba(0,255,136,0.15)');
      grad.addColorStop(1, 'rgba(0,255,136,0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, scanY - 20, canvas.width, 40);

      // Particles
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.life++;
        if (p.life > p.maxLife) {
          p.x = Math.random() * canvas.width;
          p.y = Math.random() * canvas.height;
          p.life = 0;
        }
        const alpha = Math.sin((p.life / p.maxLife) * Math.PI) * 0.6;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0,255,136,${alpha})`;
        ctx.fill();
      });

      frame++;
      animFrameRef.current = requestAnimationFrame(animate);
    };
    animate();
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [isTransitioning]);

  const label = targetSection ? SECTION_LABELS[targetSection] || targetSection.toUpperCase() : '';

  return (
    <AnimatePresence>
      {isTransitioning && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
          style={{ backgroundColor: '#000000' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: phase === 'out' ? 0 : 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35, ease: 'easeInOut' }}
        >
          {/* Canvas particle layer */}
          <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

          {/* SVG circuit traces */}
          <svg className="absolute inset-0 w-full h-full" style={{ opacity: 0.6 }}>
            <CircuitTrace delay={0.05} x1={0} y1={360} x2={300} y2={360} />
            <CircuitTrace delay={0.1} x1={300} y1={360} x2={300} y2={200} />
            <CircuitTrace delay={0.15} x1={300} y1={200} x2={640} y2={200} />
            <CircuitTrace delay={0.2} x1={640} y1={200} x2={640} y2={360} />
            <CircuitTrace delay={0.25} x1={640} y1={360} x2={980} y2={360} />
            <CircuitTrace delay={0.1} x1={0} y1={520} x2={200} y2={520} color="#0088ff" />
            <CircuitTrace delay={0.15} x1={200} y1={520} x2={200} y2={460} color="#0088ff" />
            <CircuitTrace delay={0.2} x1={200} y1={460} x2={500} y2={460} color="#0088ff" />
            <CircuitTrace delay={0.1} x1={1280} y1={300} x2={1080} y2={300} color="#ffaa00" />
            <CircuitTrace delay={0.15} x1={1080} y1={300} x2={1080} y2={420} color="#ffaa00" />
            <CircuitTrace delay={0.2} x1={1080} y1={420} x2={800} y2={420} color="#ffaa00" />
            <CircuitNode cx={300} cy={360} delay={0.1} />
            <CircuitNode cx={640} cy={360} delay={0.25} />
            <CircuitNode cx={300} cy={200} delay={0.15} />
            <CircuitNode cx={640} cy={200} delay={0.2} />
            <CircuitNode cx={200} cy={520} delay={0.1} color="#0088ff" />
            <CircuitNode cx={1080} cy={300} delay={0.15} color="#ffaa00" />
          </svg>

          {/* Central ESP32 chip graphic */}
          <motion.div
            className="relative z-10 flex flex-col items-center gap-6"
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: phase === 'hold' ? 1 : 0.85, opacity: 1 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            {/* Chip */}
            <div className="relative">
              <motion.div
                className="w-32 h-24 border-2 rounded flex items-center justify-center"
                style={{ borderColor: '#00ff88', backgroundColor: '#0a1a0f' }}
                animate={{ boxShadow: ['0 0 10px #00ff88', '0 0 30px #00ff88', '0 0 10px #00ff88'] }}
                transition={{ duration: 0.6, repeat: Infinity }}
              >
                <span className="text-xs font-bold text-center leading-tight" style={{ color: '#00ff88', fontFamily: "'JetBrains Mono', monospace" }}>
                  ESP32<br/>WROOM-32
                </span>
              </motion.div>
              {/* Pin rows */}
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={`l${i}`}
                  className="absolute w-3 h-1"
                  style={{ backgroundColor: '#00ff88', left: -12, top: 12 + i * 14, opacity: 0.7 }}
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 0.3, delay: i * 0.05, repeat: Infinity }}
                />
              ))}
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={`r${i}`}
                  className="absolute w-3 h-1"
                  style={{ backgroundColor: '#00ff88', right: -12, top: 12 + i * 14, opacity: 0.7 }}
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 0.3, delay: i * 0.05 + 0.15, repeat: Infinity }}
                />
              ))}
            </div>

            {/* Loading text */}
            <div className="text-center space-y-1">
              <motion.p
                className="text-xs tracking-widest"
                style={{ color: '#00ff88', fontFamily: "'JetBrains Mono', monospace" }}
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 0.8, repeat: Infinity }}
              >
                LOADING WORLD
              </motion.p>
              {label && (
                <motion.p
                  className="text-lg font-bold tracking-wider"
                  style={{ color: '#ffffff', fontFamily: "'Space Grotesk', sans-serif" }}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  {label}
                </motion.p>
              )}
            </div>

            {/* Progress bar */}
            <div className="w-48 h-1 rounded-full overflow-hidden" style={{ backgroundColor: '#0d2815' }}>
              <motion.div
                className="h-full rounded-full"
                style={{ backgroundColor: '#00ff88' }}
                initial={{ width: '0%' }}
                animate={{ width: phase === 'hold' ? '70%' : phase === 'out' ? '100%' : '30%' }}
                transition={{ duration: 0.4, ease: 'easeInOut' }}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
