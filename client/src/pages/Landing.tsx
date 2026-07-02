import { useEffect, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { PerspectiveCamera, OrbitControls } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { useAppStore } from '@/stores/appStore';
import { ESP32Model } from '@/components/ESP32Model';
import { Button } from '@/components/ui/button';
import { useLocation } from 'wouter';
import { motion } from 'framer-motion';

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

  useEffect(() => {
    if (!isIntroComplete) {
      skipTimerRef.current = setTimeout(() => setShowSkipButton(true), 2000);
    }

    return () => {
      if (skipTimerRef.current) clearTimeout(skipTimerRef.current);
      if (hintTimerRef.current) clearTimeout(hintTimerRef.current);
    };
  }, [isIntroComplete]);

  useEffect(() => {
    if (isIntroComplete) {
      hintTimerRef.current = setTimeout(() => setShowHint(true), 7000);
    }

    return () => {
      if (hintTimerRef.current) clearTimeout(hintTimerRef.current);
    };
  }, [isIntroComplete]);

  const handleSkipIntro = () => {
    setIntroComplete();
    setShowSkipButton(false);
  };

  const handleComponentClick = (componentId: string) => {
    const sectionMap: Record<string, any> = {
      'esp-wroom': 'projects',
      'usb-port': 'about',
      'voltage-reg': 'experience',
      'cp2102': 'research',
      'gpio-pins': 'skills',
      'crystal': 'achievements',
    };

    const section = sectionMap[componentId];
    if (section) {
      setCurrentSection(section);
      setLocation(`/${section}`);
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

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">
      {/* 3D Canvas */}
      <Canvas className="w-full h-full">
        <PerspectiveCamera makeDefault position={[0, 0, 4]} fov={75} />
        <OrbitControls enableZoom={true} enablePan={true} autoRotate={false} />
        
        <color attach="background" args={['#000000']} />
        
        {/* Lighting */}
        <ambientLight intensity={0.5} />
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
        <EffectComposer>
          <Bloom luminanceThreshold={0.2} luminanceSmoothing={0.9} intensity={1.5} />
        </EffectComposer>
      </Canvas>

      {/* Name Text - Animated */}
      {isIntroComplete && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
        >
          <h1 className="text-6xl md:text-7xl font-bold text-center text-white" style={{
            fontFamily: "'Space Grotesk', sans-serif",
            textShadow: '0 0 20px rgba(0, 255, 136, 0.5)',
          }}>
            Jaswin Chinthala
          </h1>
        </motion.div>
      )}

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
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10"
        >
          <p className="text-green-400 text-center" style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '14px',
          }}>
            click a component to explore →
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
            {hoveredComponent.toUpperCase()}
          </p>
        </motion.div>
      )}

      {/* Recruiter Mode Toggle */}
      {isIntroComplete && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute top-8 right-8 z-10"
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
