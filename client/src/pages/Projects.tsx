import { useState, useRef } from 'react';
import { Canvas, useFrame, ThreeEvent } from '@react-three/fiber';
import { PerspectiveCamera, OrbitControls, Text } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import { projects } from '@/data/portfolioData';
import { X, Github, ExternalLink } from 'lucide-react';
import { Mesh } from 'three';
import WorldHeader from '@/components/WorldHeader';
import WldsDemo from '@/components/WldsDemo';

// ── Individual project screen mesh ──────────────────────────────────────────
function ProjectScreen({
  id,
  position,
  rotation,
  label,
  isSelected,
  onSelect,
}: {
  id: string;
  position: [number, number, number];
  rotation: [number, number, number];
  label: string;
  isSelected: boolean;
  onSelect: (id: string) => void;
}) {
  const meshRef = useRef<Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame(() => {
    if (!meshRef.current) return;
    const target = hovered || isSelected ? 0.5 : 0;
    // @ts-ignore
    meshRef.current.material.emissiveIntensity +=
      (target - (meshRef.current.material as any).emissiveIntensity) * 0.1;
  });

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    onSelect(id);
  };

  return (
    <group position={position} rotation={rotation}>
      {/* Screen bezel */}
      <mesh
        ref={meshRef}
        onClick={handleClick}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
        castShadow
      >
        <boxGeometry args={[2.4, 1.6, 0.12]} />
        <meshStandardMaterial
          color={isSelected ? '#003318' : hovered ? '#0d2a1a' : '#1c1f22'}
          metalness={0.7}
          roughness={0.3}
          emissive="#00ff88"
          emissiveIntensity={0}
        />
      </mesh>

      {/* Screen display surface */}
      <mesh position={[0, 0, 0.07]} onClick={handleClick}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}>
        <boxGeometry args={[2.1, 1.35, 0.01]} />
        <meshStandardMaterial
          color={isSelected ? '#001a0d' : hovered ? '#0a1a0f' : '#04140b'}
          emissive="#00ff88"
          emissiveIntensity={isSelected ? 0.15 : hovered ? 0.1 : 0.04}
        />
      </mesh>

      {/* Project label on screen */}
      <Text
        position={[0, 0.25, 0.09]}
        fontSize={0.18}
        maxWidth={2}
        textAlign="center"
        color={hovered || isSelected ? '#ffffff' : '#00ff88'}
        anchorX="center"
        anchorY="middle"
        font={undefined}
      >
        {label}
      </Text>

      {/* "CLICK TO VIEW" hint */}
      <Text
        position={[0, -0.35, 0.09]}
        fontSize={0.1}
        color={hovered ? '#00ff88' : '#00aa55'}
        anchorX="center"
        anchorY="middle"
      >
        {hovered ? '[ CLICK TO VIEW ]' : '[ OPEN ]'}
      </Text>

      {/* Glow light when hovered */}
      {(hovered || isSelected) && (
        <pointLight
          position={[0, 0, 0.5]}
          intensity={hovered ? 1 : 2}
          color="#00ff88"
          distance={3}
        />
      )}
    </group>
  );
}

// ── Main Projects section ────────────────────────────────────────────────────
export default function ProjectsSection() {
  const [selectedProject, setSelectedProject] = useState<string | null>(null);

  const project = selectedProject ? projects.find((p) => p.id === selectedProject) : null;

  // Screens sit on an arc facing the centre, so any number of projects fits
  const screenData = projects.map((p, i) => {
    // First project (WLDS) faces the camera; the rest alternate right and left
    const slot = i === 0 ? 0 : i % 2 ? (i + 1) / 2 : -i / 2;
    const angle = slot * 0.42;
    return {
      id: p.id,
      position: [Math.sin(angle) * 6, 0.2, 1 - Math.cos(angle) * 6] as [number, number, number],
      rotation: [0, -angle, 0] as [number, number, number],
    };
  });
  // Portrait phones stand at the centre of the arc and drag to look around, like the robot's POV
  const portrait = typeof window !== 'undefined' && window.innerWidth < window.innerHeight;

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">
      {/* 3D Canvas */}
      <Canvas className="w-full h-full">
        <PerspectiveCamera makeDefault position={portrait ? [0, 0.3, 1.05] : [0, 0.5, 4]} fov={70} />
        <OrbitControls
          target={portrait ? [0, 0.3, 1] : [0, 0, 0]}
          enableZoom={!portrait}
          enablePan={false}
          rotateSpeed={portrait ? -0.5 : 1}
          minDistance={portrait ? 0.01 : 2}
          maxDistance={portrait ? 0.1 : 8}
          minPolarAngle={portrait ? Math.PI * 0.4 : 0}
          maxPolarAngle={Math.PI * (portrait ? 0.6 : 0.65)}
        />

        <color attach="background" args={['#050505']} />
        <fog attach="fog" args={['#050505', 8, 20]} />

        {/* Lighting */}
        <ambientLight intensity={0.4} />
        <pointLight position={[0, 4, 2]} intensity={2} color="#ffffff" />
        <pointLight position={[-5, 2, 0]} intensity={1} color="#00ff88" />
        <pointLight position={[5, 2, 0]} intensity={1} color="#0088ff" />

        {/* Floor with grid */}
        <mesh position={[0, -1.8, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[30, 30, 30, 30]} />
          <meshStandardMaterial color="#0a0a0a" wireframe={false} metalness={0.2} roughness={0.9} />
        </mesh>
        {/* Grid lines on floor */}
        <gridHelper args={[30, 30, '#001a0d', '#001a0d']} position={[0, -1.79, 0]} />

        {/* Back wall */}
        <mesh position={[0, 2, -8]} receiveShadow>
          <planeGeometry args={[30, 12]} />
          <meshStandardMaterial color="#080808" metalness={0.1} roughness={0.95} />
        </mesh>

        {/* Side walls */}
        <mesh position={[-8, 2, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
          <planeGeometry args={[16, 12]} />
          <meshStandardMaterial color="#080808" />
        </mesh>
        <mesh position={[8, 2, 0]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
          <planeGeometry args={[16, 12]} />
          <meshStandardMaterial color="#080808" />
        </mesh>

        {/* Project screens */}
        {screenData.map((s) => {
          const proj = projects.find((p) => p.id === s.id);
          return (
            <ProjectScreen
              key={s.id}
              id={s.id}
              position={s.position}
              rotation={s.rotation}
              label={proj?.name || s.id}
              isSelected={selectedProject === s.id}
              onSelect={(id) => {
                setSelectedProject((prev) => (prev === id ? null : id));
              }}
            />
          );
        })}

        {/* Robot POV indicator */}
        <group position={[0, -1.4, 1.5]}>
          {/* Body */}
          <mesh castShadow>
            <boxGeometry args={[0.4, 0.7, 0.4]} />
            <meshStandardMaterial color="#00ff88" metalness={0.6} roughness={0.4} emissive="#00ff88" emissiveIntensity={0.2} />
          </mesh>
          {/* Head */}
          <mesh position={[0, 0.55, 0]} castShadow>
            <boxGeometry args={[0.35, 0.3, 0.35]} />
            <meshStandardMaterial color="#00cc66" metalness={0.6} roughness={0.4} />
          </mesh>
          {/* Eyes */}
          <mesh position={[-0.08, 0.58, 0.18]}>
            <sphereGeometry args={[0.05, 8, 8]} />
            <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={1} />
          </mesh>
          <mesh position={[0.08, 0.58, 0.18]}>
            <sphereGeometry args={[0.05, 8, 8]} />
            <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={1} />
          </mesh>
          <pointLight position={[0, 0.5, 0.3]} intensity={1.5} color="#00ff88" distance={4} />
        </group>
      </Canvas>

      <WorldHeader title="ROBOT POV LAB" part="ESP-WROOM-32 · PROJECTS" />

      {/* Instructions */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="absolute bottom-16 left-6 z-10 rounded-lg border p-3 text-xs pointer-events-none"
        style={{ backgroundColor: 'rgba(0,0,0,0.7)', borderColor: '#00ff8840', color: '#00ff88', fontFamily: "'JetBrains Mono', monospace", backdropFilter: 'blur(8px)' }}
      >
        <p className="font-bold mb-1">CONTROLS</p>
        <p>• Click or tap a screen to open a project</p>
        <p>{portrait ? '• Drag sideways to turn and see the other screens' : '• Drag to look around · Scroll to zoom'}</p>
      </motion.div>

      {/* Project Detail Modal */}
      <AnimatePresence>
        {project && (
          <motion.div
            key="modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-20 flex items-center justify-center"
            style={{ backgroundColor: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(4px)' }}
            onClick={() => setSelectedProject(null)}
          >
            <motion.div
              key="modal-content"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              className="relative rounded-xl border overflow-hidden max-w-2xl w-full mx-4"
              style={{ backgroundColor: '#0a0f0a', borderColor: '#00ff88', maxHeight: '85vh' }}
            >
              {/* Thumbnail */}
              {project.thumbnail && (
                <div className="relative h-40 overflow-hidden">
                  <img
                    src={project.thumbnail}
                    alt={project.name}
                    className="w-full h-full"
                    style={{
                      objectFit: project.id === 'afriguard' ? 'contain' : 'cover',
                      filter: project.id === 'afriguard' ? 'none' : 'brightness(0.7) saturate(1.2)',
                      background: project.id === 'afriguard' ? '#1a2332' : 'transparent',
                    }}
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                  />
                  <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, transparent 40%, #0a0f0a)' }} />
                  <div className="absolute bottom-3 left-6">
                    <h2 className="text-2xl font-bold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif", textShadow: '0 0 10px rgba(0,255,136,0.8)' }}>
                      {project.name}
                    </h2>
                  </div>
                </div>
              )}

              <div className="p-6 overflow-y-auto" style={{ maxHeight: project.thumbnail ? 'calc(85vh - 10rem)' : '85vh' }}>
                {!project.thumbnail && (
                  <div className="flex justify-between items-start mb-4">
                    <h2 className="text-2xl font-bold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{project.name}</h2>
                  </div>
                )}

                <p className="text-sm mb-4" style={{ color: '#00ff88', fontFamily: "'JetBrains Mono', monospace" }}>
                  {project.shortDescription}
                </p>

                <p className="text-xs mb-4 text-gray-400" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                  {project.period} · {project.role}
                  {project.status === 'in-progress' && <span className="ml-2 text-amber-400">IN PROGRESS</span>}
                </p>

                {project.id === 'wlds' && (
                  <div className="mb-5">
                    <WldsDemo />
                  </div>
                )}

                <div className="text-gray-300 text-sm leading-relaxed mb-5 whitespace-pre-line">
                  {project.details}
                </div>

                {project.images && (
                  <div className="grid grid-cols-1 gap-3 mb-5">
                    {project.images.map((img) => (
                      <a key={img.src} href={img.src} target="_blank" rel="noopener noreferrer" className="block">
                        <img src={img.src} alt={img.caption} loading="lazy" className="w-full rounded border bg-white" style={{ borderColor: '#00ff8840' }} />
                        <p className="text-xs text-gray-400 mt-1">{img.caption}</p>
                      </a>
                    ))}
                  </div>
                )}

                {/* Tech stack */}
                <div className="flex flex-wrap gap-2 mb-5">
                  {project.techStack.map((tech) => (
                    <span key={tech} className="px-2 py-1 text-xs rounded border" style={{ backgroundColor: 'rgba(0,255,136,0.1)', borderColor: '#00ff8860', color: '#00ff88' }}>
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Links */}
                <div className="flex gap-3">
                  {project.githubLink && (
                    <a href={project.githubLink} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-semibold transition-colors"
                      style={{ backgroundColor: 'rgba(0,255,136,0.1)', borderColor: '#00ff88', color: '#00ff88' }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(0,255,136,0.25)')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'rgba(0,255,136,0.1)')}
                    >
                      <Github size={16} /> GitHub
                    </a>
                  )}
                  {project.liveLink && (
                    <a href={project.liveLink} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-semibold transition-colors"
                      style={{ backgroundColor: 'rgba(0,136,255,0.1)', borderColor: '#0088ff', color: '#0088ff' }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(0,136,255,0.25)')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'rgba(0,136,255,0.1)')}
                    >
                      <ExternalLink size={16} /> Live Dashboard
                    </a>
                  )}
                </div>
              </div>

              {/* Close button */}
              <button
                onClick={() => setSelectedProject(null)}
                className="absolute top-4 right-4 p-1 rounded-full transition-colors"
                style={{ color: '#00ff88', backgroundColor: 'rgba(0,0,0,0.5)' }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(0,255,136,0.2)')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.5)')}
              >
                <X size={20} />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
