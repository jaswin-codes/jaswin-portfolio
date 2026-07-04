import { useRef, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Group, Mesh, Material } from 'three';
import { useSpring, animated } from '@react-spring/three';

interface ESP32ModelProps {
  isIntroAnimating: boolean;
  onIntroComplete?: () => void;
  onComponentHover?: (componentId: string | null) => void;
  onComponentClick?: (componentId: string) => void;
}

interface RotationState {
  x: number;
  y: number;
  vx: number;
  vy: number;
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
  const [introPhase, setIntroPhase] = useState<'flying' | 'led' | 'name' | 'settle'>(
    isIntroAnimating ? 'flying' : 'settle'
  );
  const [ledBlinks, setLedBlinks] = useState(0);
  const ledBlinkRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined);
  const rotationRef = useRef<RotationState>({
    x: 0,
    y: 0,
    vx: 0,
    vy: 0,
    lastInteractionTime: 0,
  });
  const INTERACTION_PAUSE_TIME = 3000; // 3 seconds pause after user interaction

  // LED blink animation
  useEffect(() => {
    if (introPhase === 'led') {
      let blinkCount = 0;
      let isOn = true;

      ledBlinkRef.current = setInterval(() => {
        if (isOn) {
          blinkCount++;
          if (blinkCount >= 3) {
            // After 3 blinks, trigger explosion and move to name phase
            clearInterval(ledBlinkRef.current);
            setIntroPhase('name');
            setTimeout(() => {
              setIntroPhase('settle');
              onIntroComplete?.();
            }, 800); // Faster name reveal
            return;
          }
        }
        isOn = !isOn;
      }, 800); // 800ms per blink state = ~1.6s for 2 full blinks

      return () => {
        if (ledBlinkRef.current) clearInterval(ledBlinkRef.current);
      };
    }
  }, [introPhase, onIntroComplete]);

  // Intro animation spring
  const introSpring = useSpring({
    from: { posY: -5, rotX: Math.PI, rotY: 0, rotZ: 0, scale: 0.5 },
    to: {
      posY: introPhase === 'flying' ? 0 : 0,
      rotX: introPhase === 'flying' ? 0 : 0,
      rotY: introPhase === 'flying' ? Math.PI * 2 : 0,
      rotZ: introPhase === 'flying' ? Math.PI * 0.5 : 0,
      scale: 1,
    },
    config: { duration: 2000 },
    onRest: () => {
      if (introPhase === 'flying') {
        setIntroPhase('led');
      }
    },
  });

  // Idle rotation with inertia damping
  useFrame(() => {
    if (!groupRef.current || introPhase !== 'settle' || isIntroAnimating) return;

    const now = Date.now();
    const timeSinceInteraction = now - rotationRef.current.lastInteractionTime;
    const isInPausePeriod = timeSinceInteraction < INTERACTION_PAUSE_TIME;

    if (isInPausePeriod) {
      // During pause period, apply damping to velocity
      rotationRef.current.vx *= 0.95;
      rotationRef.current.vy *= 0.95;
    } else {
      // After pause, apply slow idle rotation
      rotationRef.current.vx = 0.0005; // Much slower than before
      rotationRef.current.vy = 0.001;
    }

    // Apply rotation
    groupRef.current.rotation.x += rotationRef.current.vx;
    groupRef.current.rotation.y += rotationRef.current.vy;
  });

  // Track user interaction (from OrbitControls)
  useEffect(() => {
    const handleMouseMove = () => {
      rotationRef.current.lastInteractionTime = Date.now();
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const components = [
    { id: 'esp-wroom', label: 'ESP-WROOM-32', position: [0, 0, 0.15], size: [0.8, 0.6, 0.1] },
    { id: 'usb-port', label: 'USB-PORT', position: [-1.5, 0, 0.1], size: [0.3, 0.2, 0.15] },
    { id: 'voltage-reg', label: 'AMS1117-3.3', position: [1.2, -0.8, 0.08], size: [0.25, 0.2, 0.08] },
    { id: 'cp2102', label: 'CP2102', position: [-1.2, -0.8, 0.08], size: [0.3, 0.25, 0.08] },
    { id: 'gpio-pins', label: 'GPIO PINS', position: [0, 1.5, 0.05], size: [2.5, 0.15, 0.08] },
    { id: 'crystal', label: '40MHz XTAL', position: [0.8, 0.6, 0.08], size: [0.2, 0.2, 0.08] },
  ];

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Main PCB Board */}
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[3, 2, 0.08] as [number, number, number]} />
        <meshStandardMaterial color="#1a6b2e" metalness={0.3} roughness={0.7} />
      </mesh>

      {/* PCB Texture/Grid */}
      <mesh position={[0, 0, 0.05]}>
        <boxGeometry args={[3, 2, 0.01] as [number, number, number]} />
        <meshStandardMaterial color="#0d4620" metalness={0.2} roughness={0.8} />
      </mesh>

      {/* Components */}
      {components.map((comp) => (
        <group key={comp.id}>
          {/* Component Box */}
          <mesh
            position={[comp.position[0], comp.position[1], comp.position[2]]}
            onPointerEnter={() => {
              setHoveredComponent(comp.id);
              onComponentHover?.(comp.id);
            }}
            onPointerLeave={() => {
              setHoveredComponent(null);
              onComponentHover?.(null);
            }}
            onClick={() => onComponentClick?.(comp.id)}
            castShadow
            receiveShadow
          >
            <boxGeometry args={comp.size as [number, number, number]} />
            <meshStandardMaterial
              color={hoveredComponent === comp.id ? '#00ff88' : '#0d2815'}
              metalness={0.4}
              roughness={0.6}
              emissive={hoveredComponent === comp.id ? '#00ff88' : '#000000'}
              emissiveIntensity={hoveredComponent === comp.id ? 0.5 : 0}
            />
          </mesh>

          {/* Component Label */}
          <mesh position={[comp.position[0], comp.position[1], comp.position[2] + 0.3]}>
            <boxGeometry args={[0.1, 0.1, 0.01]} />
            <meshStandardMaterial
              color="#00ff88"
              emissive="#00ff88"
              emissiveIntensity={0.8}
            />
          </mesh>
        </group>
      ))}

      {/* LED Indicator */}
      <mesh position={[0.5, 0.3, 0.2]} castShadow>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial
          color="#ff0000"
          emissive="#ff0000"
          emissiveIntensity={introPhase === 'led' && ledBlinks < 3 ? (ledBlinks % 2 === 0 ? 1 : 0.1) : introPhase === 'name' ? 2 : 0.2}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>

      {/* Ambient Light Glow */}
      <pointLight position={[0, 0, 1]} intensity={1.5} color="#00ff88" distance={5} />
    </group>
  );
};
