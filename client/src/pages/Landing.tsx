import { useEffect, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Vector3 } from 'three';
import { PerspectiveCamera, OrbitControls } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { useAppStore } from '@/stores/appStore';
import { ESP32Model } from '@/components/ESP32Model';
import { Button } from '@/components/ui/button';
import { useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { navigateWithTransition } from '@/App';

// Flies the camera towards the clicked part, then calls onArrive
function CameraFlyTo({ target, onArrive }: { target: Vector3 | null; onArrive: () => void }) {
  const { camera } = useThree();
  const dest = useRef<Vector3 | null>(null);
  const elapsed = useRef(0);

  useEffect(() => {
    dest.current = target ? target.clone().add(camera.position.clone().sub(target).normalize().multiplyScalar(0.6)) : null;
    elapsed.current = 0;
  }, [target, camera]);

  useFrame((_, dt) => {
    if (!target || !dest.current) return;
    elapsed.current += dt;
    camera.position.lerp(dest.current, 1 - Math.pow(0.002, dt));
    camera.lookAt(target);
    if (elapsed.current > 0.7) {
      dest.current = null;
      onArrive();
    }
  });
  return null;
}

const BOOT_LINES = [
  'ets Oct 26 2026  rst:0x1 (POWERON_RESET), boot:0x13 (SPI_FAST_FLASH_BOOT)',
  'configsip: 0, SPIWP:0xee',
  'load:0x3fff0030, len:1344',
  'entry 0x400805f0',
  'I (31) boot: ESP-IDF v5.2 2nd stage bootloader',
  'I (48) jaswin: mounting /projects /research /experience',
  'I (52) jaswin: location = Cape Town, ZA',
  'I (61) jaswin: ready. tap a part of the board to explore',
];

// Serial-monitor style boot log shown during the intro
function BootLog() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setCount((c) => Math.min(c + 1, BOOT_LINES.length)), 300);
    return () => clearInterval(id);
  }, []);
  return (
    <div
      className="absolute left-4 bottom-20 md:left-8 md:bottom-8 z-10 max-w-[92vw] md:max-w-xl pointer-events-none text-[10px] md:text-xs leading-relaxed"
      style={{ fontFamily: "'JetBrains Mono', monospace", color: '#00ff88' }}
      aria-hidden="true"
    >
      <p className="text-gray-500 mb-1">serial monitor @ 115200 baud</p>
      {BOOT_LINES.slice(0, count).map((line) => (
        <p key={line} className="truncate" style={{ color: line.startsWith('I (') ? '#00ff88' : '#7fbf9a' }}>{line}</p>
      ))}
      <span className="inline-block w-2 h-3 bg-green-400 animate-pulse align-middle" />
    </div>
  );
}

export default function Landing() {
  const [, setLocation] = useLocation();
  const setCurrentSection = useAppStore((state) => state.setCurrentSection);
  const isIntroComplete = useAppStore((state) => state.isIntroComplete);
  const setIntroComplete = useAppStore((state) => state.setIntroComplete);
  const [showSkipButton, setShowSkipButton] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const skipTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const hintTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const [hoveredComponent, setHoveredComponent] = useState<string | null>(null);
  const [namePosition, setNamePosition] = useState<'center' | 'top'>('center');
  const nameTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  // Portrait phones need the camera further back so the whole board fits
  const isPortrait = typeof window !== 'undefined' && window.innerWidth < window.innerHeight;
  const reducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const [flyTarget, setFlyTarget] = useState<Vector3 | null>(null);
  const pendingSection = useRef<string | null>(null);

  useEffect(() => {
    if (reducedMotion && !isIntroComplete) setIntroComplete();
  }, [reducedMotion, isIntroComplete, setIntroComplete]);

  useEffect(() => {
    if (!isIntroComplete) {
      skipTimerRef.current = setTimeout(() => setShowSkipButton(true), 2000);
    }

    return () => {
      if (skipTimerRef.current) clearTimeout(skipTimerRef.current);
      if (hintTimerRef.current) clearTimeout(hintTimerRef.current);
      if (nameTimerRef.current) clearTimeout(nameTimerRef.current);
    };
  }, [isIntroComplete]);

  useEffect(() => {
    if (isIntroComplete) {
      hintTimerRef.current = setTimeout(() => setShowHint(true), 7000);
      nameTimerRef.current = setTimeout(() => setNamePosition('top'), 2000);
    }

    return () => {
      if (hintTimerRef.current) clearTimeout(hintTimerRef.current);
      if (nameTimerRef.current) clearTimeout(nameTimerRef.current);
    };
  }, [isIntroComplete]);

  const handleSkipIntro = () => {
    setIntroComplete();
    setShowSkipButton(false);
  };

  const goToSection = () => {
    const section = pendingSection.current;
    pendingSection.current = null;
    if (section) navigateWithTransition(`/${section}`, section);
  };

  const handleComponentClick = (componentId: string, point: Vector3) => {
    const sectionMap: Record<string, string> = {
      'esp-wroom': 'projects',
      'usb-port': 'about',
      'voltage-reg': 'experience',
      'cp2102': 'research',
      'gpio-pins': 'skills',
      'crystal': 'achievements',
    };

    const section = sectionMap[componentId];
    if (section && !pendingSection.current) {
      setCurrentSection(section as any);
      pendingSection.current = section;
      if (reducedMotion) goToSection();
      else setFlyTarget(point);
    }
  };

  const componentLabels: Record<string, string> = {
    'esp-wroom': 'PROJECTS',
    'usb-port': 'ABOUT ME',
    'voltage-reg': 'EXPERIENCE',
    'cp2102': 'RESEARCH',
    'gpio-pins': 'SKILLS & TOOLS',
    'crystal': 'ACHIEVEMENTS',
  };

  const partNames: Record<string, string> = {
    'esp-wroom': 'ESP-WROOM-32 module',
    'usb-port': 'Micro-USB connector',
    'voltage-reg': 'AMS1117-3.3 regulator',
    'cp2102': 'CP2102 USB-UART bridge',
    'gpio-pins': 'GPIO headers',
    'crystal': '40 MHz crystal',
  };

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">
      {/* 3D Canvas */}
      <Canvas className="w-full h-full" dpr={[1, isPortrait ? 1.5 : 2]}>
        <PerspectiveCamera makeDefault position={[0, 0, isPortrait ? 5 : 4]} fov={75} />
        <OrbitControls enabled={!flyTarget} enableZoom={true} enablePan={false} autoRotate={false} minDistance={2.5} maxDistance={10} />
        <CameraFlyTo target={flyTarget} onArrive={goToSection} />
        
        <color attach="background" args={['#000000']} />
        
        {/* Lighting */}
        <ambientLight intensity={0.55} />
        <directionalLight position={[2, 3, 5]} intensity={1.2} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, 10]} intensity={0.5} color="#00ff88" />
        
        {/* ESP32 Model */}
        <ESP32Model
          isIntroAnimating={!isIntroComplete}
          onIntroComplete={handleSkipIntro}
          onComponentHover={setHoveredComponent}
          onComponentClick={handleComponentClick}
        />

        {/* Post-processing */}
        <EffectComposer multisampling={isPortrait ? 0 : 4}>
          <Bloom mipmapBlur luminanceThreshold={0.6} luminanceSmoothing={0.3} intensity={1.1} />
        </EffectComposer>
      </Canvas>

      {/* Name Text - Animated */}
      {isIntroComplete && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{
            opacity: 1,
            y: 0,
            ...(namePosition === 'top' && { y: '-34vh' })
          }}
          transition={{ duration: namePosition === 'top' ? 1.0 : 0.6 }}
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
        >
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold text-center text-white px-4" style={{
            fontFamily: "'Space Grotesk', sans-serif",
            textShadow: '0 0 20px rgba(0, 255, 136, 0.5)',
          }}>
            Jaswin Chinthala
          </h1>
        </motion.div>
      )}

      {!isIntroComplete && <BootLog />}

      {/* Skip Intro Button */}
      {showSkipButton && !isIntroComplete && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute top-8 right-8 z-10"
        >
          <Button
            onClick={handleSkipIntro}
            variant="outline"
            className="bg-black/50 border-green-500 text-green-400 hover:bg-green-500/10"
          >
            Skip Intro
          </Button>
        </motion.div>
      )}

      {/* Hint Text */}
      {showHint && isIntroComplete && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="absolute bottom-20 md:bottom-8 left-1/2 transform -translate-x-1/2 z-10 w-max max-w-[90vw]"
        >
          <p className="text-green-400 text-center" style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '14px',
          }}>
            tap or click a part of the board to explore
          </p>
        </motion.div>
      )}

      {/* Component Tooltip */}
      {hoveredComponent && isIntroComplete && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-8 left-1/2 transform -translate-x-1/2 z-10 text-center"
        >
          <p className="text-white font-bold text-lg" style={{
            fontFamily: "'Space Grotesk', sans-serif",
          }}>
            {componentLabels[hoveredComponent]}
          </p>
          <p className="text-green-400 text-sm" style={{
            fontFamily: "'JetBrains Mono', monospace",
          }}>
            {partNames[hoveredComponent]}
          </p>
        </motion.div>
      )}

      {/* Recruiter Mode Toggle */}
      {isIntroComplete && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute top-4 right-4 md:top-8 md:right-8 z-10"
        >
          <Button
            onClick={() => {
              const setMode = useAppStore.getState().setMode;
              setMode('recruiter');
            }}
            variant="outline"
            className="bg-black/50 border-blue-500 text-blue-400 hover:bg-blue-500/10"
          >
            Recruiter Mode
          </Button>
        </motion.div>
      )}
    </div>
  );
}
