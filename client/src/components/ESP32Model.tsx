import { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Group } from 'three';
import { useSpring, animated } from '@react-spring/three';

interface ESP32ModelProps {
  isIntroAnimating: boolean;
  onIntroComplete?: () => void;
  onComponentHover?: (componentId: string | null) => void;
  onComponentClick?: (componentId: string) => void;
}

interface RotationState {
  lastInteractionTime: number;
}

export const ESP32Model = ({
  isIntroAnimating,
  onIntroComplete,
  onComponentHover,
  onComponentClick,
}: ESP32ModelProps) => {
  const groupRef = useRef<Group>(null);
  const [hoveredComponent, setHoveredComponent] = useState<string | null>(null);
  // intro phases: 'fly-in' → 'blink' → 'explode' → 'settle'
  const [introPhase, setIntroPhase] = useState<'fly-in' | 'blink' | 'explode' | 'settle'>(
    isIntroAnimating ? 'fly-in' : 'settle'
  );
  // ledOn drives the blink toggle
  const [ledOn, setLedOn] = useState(false);
  const [exploding, setExploding] = useState(false);

  const rotationRef = useRef<RotationState>({ lastInteractionTime: 0 });
  const INTERACTION_PAUSE_TIME = 3000;

  // ── Intro sequence ──────────────────────────────────────────────────────────
  // Phase 1: fly-in spring (0 → ~0.8s)
  const flyInSpring = useSpring({
    from: { posY: -6, rotY: Math.PI * 2, scale: 0.3 },
    to: {
      posY: introPhase !== 'settle' ? 0 : 0,
      rotY: 0,
      scale: 1,
    },
    config: { tension: 120, friction: 18 },
    onRest: () => {
      if (introPhase === 'fly-in') setIntroPhase('blink');
    },
  });

  // Phase 2: blink 2 times then explode (total ~1.2s)
  useEffect(() => {
    if (introPhase !== 'blink') return;
    let count = 0;
    setLedOn(true);
    const interval = setInterval(() => {
      count++;
      setLedOn((v) => !v);
      if (count >= 4) {
        // 4 toggles = 2 full blinks
        clearInterval(interval);
        setLedOn(true);
        setIntroPhase('explode');
      }
    }, 150); // 150ms per toggle → 4 toggles = 600ms
    return () => clearInterval(interval);
  }, [introPhase]);

  // Phase 3: explosion flash then settle (300ms)
  useEffect(() => {
    if (introPhase !== 'explode') return;
    setExploding(true);
    const t = setTimeout(() => {
      setExploding(false);
      setIntroPhase('settle');
      onIntroComplete?.();
    }, 300);
    return () => clearTimeout(t);
  }, [introPhase, onIntroComplete]);

  // ── Idle rotation with inertia damping ──────────────────────────────────────
  useFrame(() => {
    if (!groupRef.current || introPhase !== 'settle') return;
    const now = Date.now();
    const timeSinceInteraction = now - rotationRef.current.lastInteractionTime;
    if (timeSinceInteraction > INTERACTION_PAUSE_TIME) {
      groupRef.current.rotation.y += 0.003;
    }
  });

  useEffect(() => {
    const handleMouseMove = () => {
      rotationRef.current.lastInteractionTime = Date.now();
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // ── LED emissive intensity ──────────────────────────────────────────────────
  const ledIntensity = exploding ? 8 : introPhase === 'blink' ? (ledOn ? 2 : 0.05) : 0.3;

  const components = [
    { id: 'esp-wroom',    label: 'ESP-WROOM-32',  position: [0, 0, 0.15] as [number,number,number],      size: [0.8, 0.6, 0.1] as [number,number,number] },
    { id: 'usb-port',     label: 'USB-PORT',       position: [-1.5, 0, 0.1] as [number,number,number],    size: [0.3, 0.2, 0.15] as [number,number,number] },
    { id: 'voltage-reg',  label: 'AMS1117-3.3',    position: [1.2, -0.8, 0.08] as [number,number,number], size: [0.25, 0.2, 0.08] as [number,number,number] },
    { id: 'cp2102',       label: 'CP2102',         position: [-1.2, -0.8, 0.08] as [number,number,number],size: [0.3, 0.25, 0.08] as [number,number,number] },
    { id: 'gpio-pins',    label: 'GPIO PINS',      position: [0, 1.5, 0.05] as [number,number,number],    size: [2.5, 0.15, 0.08] as [number,number,number] },
    { id: 'crystal',      label: '40MHz XTAL',     position: [0.8, 0.6, 0.08] as [number,number,number],  size: [0.2, 0.2, 0.08] as [number,number,number] },
  ];

  return (
    // @ts-ignore – animated.group is valid at runtime
    <animated.group
      ref={groupRef}
      position-y={flyInSpring.posY}
      rotation-y={flyInSpring.rotY}
      scale={flyInSpring.scale}
    >
      {/* Main PCB Board */}
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[3, 2, 0.08]} />
        <meshStandardMaterial color="#1a6b2e" metalness={0.3} roughness={0.7} />
      </mesh>

      {/* PCB surface layer */}
      <mesh position={[0, 0, 0.05]}>
        <boxGeometry args={[3, 2, 0.01]} />
        <meshStandardMaterial color="#0d4620" metalness={0.2} roughness={0.8} />
      </mesh>

      {/* Components */}
      {components.map((comp) => (
        <group key={comp.id}>
          <mesh
            position={comp.position}
            onPointerEnter={(e) => { e.stopPropagation(); setHoveredComponent(comp.id); onComponentHover?.(comp.id); }}
            onPointerLeave={() => { setHoveredComponent(null); onComponentHover?.(null); }}
            onClick={(e) => { e.stopPropagation(); onComponentClick?.(comp.id); }}
            castShadow
          >
            <boxGeometry args={comp.size} />
            <meshStandardMaterial
              color={hoveredComponent === comp.id ? '#00ff88' : '#0d2815'}
              metalness={0.4}
              roughness={0.6}
              emissive={hoveredComponent === comp.id ? '#00ff88' : '#000000'}
              emissiveIntensity={hoveredComponent === comp.id ? 0.6 : 0}
            />
          </mesh>
          {/* flag dot above component */}
          <mesh position={[comp.position[0], comp.position[1], comp.position[2] + 0.3]}>
            <sphereGeometry args={[0.04, 8, 8]} />
            <meshStandardMaterial color="#00ff88" emissive="#00ff88" emissiveIntensity={0.9} />
          </mesh>
        </group>
      ))}

      {/* LED Indicator */}
      <mesh position={[0.5, 0.3, 0.22]} castShadow>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial
          color={exploding ? '#ffffff' : '#ff2200'}
          emissive={exploding ? '#ffffff' : '#ff2200'}
          emissiveIntensity={ledIntensity}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>

      {/* explosion point-light burst */}
      {exploding && (
        <pointLight position={[0, 0, 1]} intensity={20} color="#ff8800" distance={8} />
      )}

      {/* Ambient board glow */}
      <pointLight position={[0, 0, 1]} intensity={1.5} color="#00ff88" distance={5} />
    </animated.group>
  );
};
