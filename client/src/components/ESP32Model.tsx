import { useRef, useState, useEffect, useMemo, Suspense, ComponentProps } from 'react';
import { useFrame, ThreeEvent } from '@react-three/fiber';
import { Group, Mesh, Vector3 } from 'three';
import { useSpring, animated } from '@react-spring/three';
import { Text } from '@react-three/drei';

interface ESP32ModelProps {
  isIntroAnimating: boolean;
  onIntroComplete?: () => void;
  onComponentHover?: (componentId: string | null) => void;
  onComponentClick?: (componentId: string, worldPoint: Vector3) => void;
}

type V2 = [number, number];

// drei Text suspends while its font loads; isolate it so the board renders straight away
function T(props: ComponentProps<typeof Text>) {
  return (
    <Suspense fallback={null}>
      <Text {...props} />
    </Suspense>
  );
}

// Board is 3 x 2 units; everything sits on its top copper layer
const TOP = 0.055;
const COPPER = '#c8873a';
const GOLD = '#a8860f';
const SILK = '#e8f5e9';

// Each clickable part: where it sits, what it opens, and the traces that feed it.
// Pulses start at the USB port (power in) and run to the part.
const PARTS: {
  id: string;
  section: string;
  label: [number, number];
  traces: V2[][];
}[] = [
  { id: 'esp-wroom', section: 'PROJECTS', label: [0.3, -0.5],
    traces: [[[-1.23, 0.05], [-0.2, 0.05]], [[-1.23, -0.05], [-0.6, -0.05], [-0.6, -0.2], [-0.2, -0.2]]] },
  { id: 'usb-port', section: 'ABOUT', label: [-1.38, -0.3],
    traces: [[[-0.2, 0.15], [-0.7, 0.15], [-0.7, 0.22], [-1.23, 0.22]]] },
  { id: 'voltage-reg', section: 'EXPERIENCE', label: [-0.85, 0.3],
    traces: [[[-1.23, 0.12], [-1.05, 0.12], [-1.05, 0.5], [-0.98, 0.5]]] },
  { id: 'cp2102', section: 'RESEARCH', label: [-0.85, -0.62],
    traces: [[[-1.23, -0.12], [-1.05, -0.12], [-1.05, -0.42], [-0.975, -0.42]]] },
  { id: 'crystal', section: 'ACHIEVEMENTS', label: [-0.3, -0.64],
    traces: [[[-0.2, -0.3], [-0.38, -0.3], [-0.38, -0.44]]] },
  { id: 'gpio-pins', section: 'SKILLS', label: [0, 0.68],
    traces: [-0.6, -0.2, 0.2, 0.6, 1.0].flatMap((x): V2[][] => [
      [[x, 0.525], [x, 0.8]],
      [[x, -0.425], [x, -0.8]],
    ]) },
];

// Decorative copper with no pulses, so the board doesn't look empty
const DECOR_TRACES: V2[][] = [
  [[-1.0, 0.62], [-0.55, 0.62]],
  [[-1.12, -0.42], [-1.12, -0.6]],
  [[1.15, 0.5], [1.15, -0.4]],
  [[-0.4, 0.2], [-0.4, 0.4], [-0.2, 0.4]],
];

function TraceSegments({ path, color = COPPER, opacity = 0.9 }: { path: V2[]; color?: string; opacity?: number }) {
  return (
    <>
      {path.slice(1).map((p, i) => {
        const a = path[i];
        const dx = p[0] - a[0];
        const dy = p[1] - a[1];
        const len = Math.hypot(dx, dy);
        return (
          <mesh key={i} position={[(a[0] + p[0]) / 2, (a[1] + p[1]) / 2, TOP + 0.002]} rotation={[0, 0, Math.atan2(dy, dx)]}>
            <boxGeometry args={[len + 0.022, 0.022, 0.004]} />
            <meshStandardMaterial color={color} metalness={0.8} roughness={0.35} transparent opacity={opacity} />
          </mesh>
        );
      })}
    </>
  );
}

// A glowing dot that runs along a polyline. `active` makes it brighter and faster.
function Pulse({ path, offset, active }: { path: V2[]; offset: number; active: boolean }) {
  const ref = useRef<Mesh>(null);
  const lengths = useMemo(() => path.slice(1).map((p, i) => Math.hypot(p[0] - path[i][0], p[1] - path[i][1])), [path]);
  const total = lengths.reduce((s, l) => s + l, 0);
  const t = useRef(offset);

  useFrame((_, dt) => {
    if (!ref.current) return;
    t.current = (t.current + dt * (active ? 0.9 : 0.18)) % 1;
    let d = t.current * total;
    let i = 0;
    while (i < lengths.length - 1 && d > lengths[i]) d -= lengths[i++];
    const f = lengths[i] ? d / lengths[i] : 0;
    ref.current.position.set(
      path[i][0] + (path[i + 1][0] - path[i][0]) * f,
      path[i][1] + (path[i + 1][1] - path[i][1]) * f,
      TOP + 0.012,
    );
  });

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[active ? 0.03 : 0.018, 10, 10]} />
      <meshStandardMaterial color="#00ff88" emissive="#00ff88" emissiveIntensity={active ? 4 : 1.2} toneMapped={false} />
    </mesh>
  );
}

function Silk({ position, children, size = 0.06, color = SILK }: { position: [number, number]; children: string; size?: number; color?: string }) {
  return (
    <T position={[position[0], position[1], TOP + 0.003]} fontSize={size} color={color} anchorX="center" anchorY="middle">
      {children}
    </T>
  );
}

export const ESP32Model = ({
  isIntroAnimating,
  onIntroComplete,
  onComponentHover,
  onComponentClick,
}: ESP32ModelProps) => {
  const swayRef = useRef<Group>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  // intro phases: 'fly-in' → 'blink' → 'power' → 'settle'
  const [introPhase, setIntroPhase] = useState<'fly-in' | 'blink' | 'power' | 'settle'>(
    isIntroAnimating ? 'fly-in' : 'settle'
  );
  const [ledOn, setLedOn] = useState(false);
  const lastInteraction = useRef(0);

  // Skip Intro (or reduced motion) jumps straight to the settled board
  useEffect(() => {
    if (!isIntroAnimating) setIntroPhase('settle');
  }, [isIntroAnimating]);

  // ── Intro sequence ──────────────────────────────────────────────────────────
  const flyInSpring = useSpring({
    from: { posY: -4, rotY: Math.PI, scale: 0.4 },
    to: { posY: 0, rotY: 0, scale: 1 },
    immediate: !isIntroAnimating,
    config: { tension: 120, friction: 20 },
    onRest: () => {
      setIntroPhase((p) => (p === 'fly-in' ? 'blink' : p));
    },
  });

  // Power LED blinks twice, like a board being plugged in
  useEffect(() => {
    if (introPhase !== 'blink') return;
    let count = 0;
    setLedOn(true);
    const interval = setInterval(() => {
      count++;
      setLedOn((v) => !v);
      if (count >= 4) {
        clearInterval(interval);
        setLedOn(true);
        setIntroPhase('power');
      }
    }, 350);
    return () => clearInterval(interval);
  }, [introPhase]);

  useEffect(() => {
    if (introPhase !== 'power') return;
    const t = setTimeout(() => {
      setIntroPhase('settle');
      onIntroComplete?.();
    }, 600);
    return () => clearTimeout(t);
  }, [introPhase, onIntroComplete]);

  // ── Gentle sway (never turns edge-on); pauses while the user is interacting ──
  useFrame(({ clock }) => {
    if (!swayRef.current || introPhase !== 'settle') return;
    if (Date.now() - lastInteraction.current < 3000) return;
    const t = clock.getElapsedTime();
    swayRef.current.rotation.y += (Math.sin(t * 0.35) * 0.35 - swayRef.current.rotation.y) * 0.02;
    swayRef.current.rotation.x += (-0.25 + Math.sin(t * 0.22) * 0.08 - swayRef.current.rotation.x) * 0.02;
  });

  useEffect(() => {
    const mark = () => { lastInteraction.current = Date.now(); };
    window.addEventListener('pointermove', mark);
    window.addEventListener('pointerdown', mark);
    return () => {
      window.removeEventListener('pointermove', mark);
      window.removeEventListener('pointerdown', mark);
    };
  }, []);

  const powered = introPhase === 'power' || introPhase === 'settle';
  const ledIntensity = introPhase === 'blink' ? (ledOn ? 3 : 0.05) : powered ? 2 : 0.05;

  // Shared pointer handlers for a clickable part
  const partEvents = (id: string) => ({
    onPointerOver: (e: ThreeEvent<PointerEvent>) => {
      e.stopPropagation();
      setHovered(id);
      onComponentHover?.(id);
      document.body.style.cursor = 'pointer';
    },
    onPointerOut: () => {
      setHovered((h) => (h === id ? null : h));
      onComponentHover?.(null);
      document.body.style.cursor = '';
    },
    onClick: (e: ThreeEvent<MouseEvent>) => {
      e.stopPropagation();
      onComponentClick?.(id, e.point.clone());
    },
  });

  const glow = (id: string) => (hovered === id ? { emissive: '#00ff88', emissiveIntensity: 0.5 } : { emissive: '#000000', emissiveIntensity: 0 });

  const headerPins = useMemo(() => Array.from({ length: 15 }, (_, i) => -1.12 + i * 0.16), []);

  return (
    // @ts-ignore – animated.group is valid at runtime
    <animated.group position-y={flyInSpring.posY} rotation-y={flyInSpring.rotY} scale={flyInSpring.scale}>
      <group ref={swayRef} rotation={[-0.25, 0, 0]}>
        {/* PCB: FR4 core and solder mask */}
        <mesh receiveShadow>
          <boxGeometry args={[3, 2, 0.08]} />
          <meshStandardMaterial color="#0b3d1c" metalness={0.2} roughness={0.75} />
        </mesh>
        <mesh position={[0, 0, 0.05]}>
          <boxGeometry args={[2.98, 1.98, 0.01]} />
          <meshStandardMaterial color="#0f5427" metalness={0.15} roughness={0.6} />
        </mesh>

        {/* Mounting holes */}
        {[[-1.38, 0.88], [1.38, 0.88], [-1.38, -0.88], [1.38, -0.88]].map(([x, y]) => (
          <mesh key={`${x}${y}`} position={[x, y, TOP]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.05, 0.018, 8, 20]} />
            <meshStandardMaterial color={GOLD} metalness={0.9} roughness={0.25} />
          </mesh>
        ))}

        {/* Copper traces */}
        {DECOR_TRACES.map((p, i) => <TraceSegments key={`d${i}`} path={p} opacity={0.6} />)}
        {PARTS.map((part) => part.traces.map((p, i) => (
          <TraceSegments key={`${part.id}${i}`} path={p} color={hovered === part.id ? '#ffd27a' : COPPER} />
        )))}

        {/* Current pulses */}
        {powered && PARTS.map((part) => part.traces.map((p, i) => (
          <group key={`p${part.id}${i}`}>
            <Pulse path={p} offset={i * 0.37} active={hovered === part.id} />
            {hovered === part.id && <Pulse path={p} offset={i * 0.37 + 0.5} active />}
          </group>
        )))}

        {/* ── ESP-WROOM-32 module: PCB, RF shield can, antenna ── */}
        <group {...partEvents('esp-wroom')}>
          <mesh position={[0.45, 0.05, TOP + 0.02]}>
            <boxGeometry args={[1.3, 0.95, 0.03]} />
            <meshStandardMaterial color="#141a24" roughness={0.6} {...glow('esp-wroom')} />
          </mesh>
          <mesh position={[0.3, 0.05, TOP + 0.08]} castShadow>
            <boxGeometry args={[0.92, 0.84, 0.09]} />
            <meshStandardMaterial color="#8f959d" metalness={0.7} roughness={0.5} {...glow('esp-wroom')} />
          </mesh>
          <T position={[0.3, 0.12, TOP + 0.126]} fontSize={0.07} color="#2a2e34" anchorX="center">ESP-WROOM-32</T>
          <T position={[0.3, 0.0, TOP + 0.126]} fontSize={0.045} color="#555b63" anchorX="center">WiFi + BT · 240 MHz</T>
          {/* PCB antenna meander */}
          <TraceSegments
            path={[[0.85, 0.42], [1.05, 0.42], [1.05, 0.3], [0.88, 0.3], [0.88, 0.18], [1.05, 0.18], [1.05, 0.06], [0.88, 0.06], [0.88, -0.06], [1.05, -0.06]].map(([x, y]) => [x, y] as V2)}
            color={GOLD}
          />
        </group>

        {/* ── Micro-USB connector, overhanging the board edge ── */}
        <group {...partEvents('usb-port')}>
          <mesh position={[-1.4, 0, TOP + 0.06]} castShadow>
            <boxGeometry args={[0.32, 0.4, 0.13]} />
            <meshStandardMaterial color="#8f959d" metalness={0.7} roughness={0.5} {...glow('usb-port')} />
          </mesh>
          <mesh position={[-1.565, 0, TOP + 0.06]}>
            <boxGeometry args={[0.01, 0.3, 0.06]} />
            <meshStandardMaterial color="#111" />
          </mesh>
        </group>

        {/* ── AMS1117-3.3 regulator (SOT-223 with tab) ── */}
        <group {...partEvents('voltage-reg')}>
          <mesh position={[-0.85, 0.5, TOP + 0.04]} castShadow>
            <boxGeometry args={[0.26, 0.18, 0.07]} />
            <meshStandardMaterial color="#1b1b1b" roughness={0.5} {...glow('voltage-reg')} />
          </mesh>
          <mesh position={[-0.85, 0.63, TOP + 0.01]}>
            <boxGeometry args={[0.24, 0.07, 0.015]} />
            <meshStandardMaterial color="#c9ced6" metalness={0.9} roughness={0.3} />
          </mesh>
          <T position={[-0.85, 0.5, TOP + 0.076]} fontSize={0.035} color="#888" anchorX="center">AMS1117</T>
        </group>

        {/* ── CP2102 USB-UART bridge (QFN) ── */}
        <group {...partEvents('cp2102')}>
          <mesh position={[-0.85, -0.42, TOP + 0.025]} castShadow>
            <boxGeometry args={[0.25, 0.25, 0.04]} />
            <meshStandardMaterial color="#1b1b1b" roughness={0.5} {...glow('cp2102')} />
          </mesh>
          <T position={[-0.85, -0.42, TOP + 0.047]} fontSize={0.035} color="#888" anchorX="center">CP2102</T>
        </group>

        {/* ── 40 MHz crystal (HC-49 can) ── */}
        <group {...partEvents('crystal')}>
          <mesh position={[-0.38, -0.5, TOP + 0.045]} rotation={[0, 0, Math.PI / 2]} castShadow>
            <capsuleGeometry args={[0.045, 0.14, 4, 12]} />
            <meshStandardMaterial color="#c9ced6" metalness={0.95} roughness={0.25} {...glow('crystal')} />
          </mesh>
        </group>

        {/* ── Pin headers: two rows of 15, black plastic with gold pins ── */}
        <group {...partEvents('gpio-pins')}>
          {[0.85, -0.85].map((y) => (
            <group key={y}>
              <mesh position={[0, y, TOP + 0.05]} castShadow>
                <boxGeometry args={[2.46, 0.12, 0.1]} />
                <meshStandardMaterial color="#141414" roughness={0.7} {...glow('gpio-pins')} />
              </mesh>
              {headerPins.map((x) => (
                <mesh key={x} position={[x, y, TOP + 0.14]}>
                  <boxGeometry args={[0.03, 0.03, 0.1]} />
                  <meshStandardMaterial color={GOLD} metalness={0.6} roughness={0.5} />
                </mesh>
              ))}
            </group>
          ))}
        </group>

        {/* EN / BOOT tactile buttons (decor) */}
        {[[-1.12, -0.62, 'EN'], [-1.12, 0.62, 'BOOT']].map(([x, y, name]) => (
          <group key={name as string}>
            <mesh position={[x as number, y as number, TOP + 0.03]}>
              <boxGeometry args={[0.16, 0.12, 0.05]} />
              <meshStandardMaterial color="#c9ced6" metalness={0.9} roughness={0.3} />
            </mesh>
            <mesh position={[x as number, y as number, TOP + 0.06]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.035, 0.035, 0.02, 16]} />
              <meshStandardMaterial color="#222" />
            </mesh>
            <Silk position={[x as number, (y as number) + ((y as number) > 0 ? 0.1 : -0.1)]} size={0.04}>{name as string}</Silk>
          </group>
        ))}

        {/* Power LED */}
        <mesh position={[-0.5, 0.62, TOP + 0.02]}>
          <boxGeometry args={[0.06, 0.04, 0.03]} />
          <meshStandardMaterial color="#ff2200" emissive="#ff2200" emissiveIntensity={ledIntensity} toneMapped={false} />
        </mesh>
        <Silk position={[-0.5, 0.7]} size={0.035}>PWR</Silk>

        {/* Silkscreen */}
        <Silk position={[1.05, -0.62]} size={0.05}>ESP32 DEVKIT</Silk>
        <Silk position={[1.05, -0.69]} size={0.035} color="#9fd8b0">JC-2026 · REV B</Silk>
        {introPhase === 'settle' && PARTS.map((part) => (
          <Silk key={part.id} position={part.label} size={0.075} color={hovered === part.id ? '#00ff88' : SILK}>
            {part.section}
          </Silk>
        ))}

        {/* Board glow; stronger the moment it powers on */}
        <pointLight position={[0, 0, 1]} intensity={introPhase === 'power' ? 6 : 1.2} color="#00ff88" distance={5} />
      </group>
    </animated.group>
  );
};
