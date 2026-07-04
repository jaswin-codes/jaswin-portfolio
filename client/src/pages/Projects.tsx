import { useState, useRef } from 'react';
import { Canvas, useFrame, ThreeEvent } from '@react-three/fiber';
import { PerspectiveCamera, OrbitControls, Text } from '@react-three/drei';
import { useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { projects } from '@/data/portfolioData';
import { X, Github, ExternalLink } from 'lucide-react';
import { Mesh } from 'three';

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
          color={isSelected ? '#003318' : hovered ? '#001a0d' : '#111111'}
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
          color={isSelected ? '#001a0d' : hovered ? '#0a1a0f' : '#050505'}
          emissive={isSelected ? '#00ff88' : hovered ? '#00aa55' : '#000000'}
          emissiveIntensity={isSelected ? 0.15 : hovered ? 0.08 : 0}
        />
      </mesh>

      {/* Project label on screen */}
      <Text
        position={[0, 0.25, 0.09]}
        fontSize={0.18}
        color={hovered || isSelected ? '#00ff88' : '#00aa55'}
        anchorX="center"
        anchorY="middle"
        font={undefined}
      >
        {label}
      </Text>

      {/* "CLICK TO VIEW" hint */}
      <Text
        position={[0, -0.1, 0.09]}
        fontSize={0.1}
        color={hovered ? '#00ff88' : '#004422'}
        anchorX="center"
        anchorY="middle"
      >
        {hovered ? '[ CLICK TO VIEW ]' : '[ HOVER TO INTERACT ]'}
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
  const [, setLocation] = useLocation();
  const [selectedProject, setSelectedProject] = useState<string | null>(null);

  const project = selectedProject ? projects.find((p) => p.id === selectedProject) : null;

  const screenData = [
    { id: 'afriguard',    position: [-3.5, 0.2, -4.5] as [number,number,number], rotation: [0, Math.PI / 8, 0] as [number,number,number] },
    { id: 'hyperspectral', position: [0, 0.2, -5.5] as [number,number,number], rotation: [0, 0, 0] as [number,number,number] },
    { id: 'vibecoded',   position: [3.5, 0.2, -4.5] as [number,number,number], rotation: [0, -Math.PI / 8, 0] as [number,number,number] },
  ];

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">
      {/* 3D Canvas */}
      <Canvas className="w-full h-full">
        <PerspectiveCamera makeDefault position={[0, 0.5, 4]} fov={70} />
        <OrbitControls
          enableZoom={true}
          enablePan={false}
          minDistance={2}
          maxDistance={8}
          maxPolarAngle={Math.PI * 0.65}
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

      {/* Back Button */}
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={() => setLocation('/')}
        className="absolute top-6 left-6 z-10 flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-semibold"
        style={{ backgroundColor: 'rgba(0,0,0,0.7)', borderColor: '#00ff88', color: '#00ff88', fontFamily: "'JetBrains Mono', monospace", backdropFilter: 'blur(8px)' }}
        whileHover={{ backgroundColor: 'rgba(0,255,136,0.1)' }}
      >
        ← ESP32
      </motion.button>

      {/* Section title */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute top-6 left-1/2 -translate-x-1/2 z-10 text-center pointer-events-none"
      >
        <h1 className="text-3xl font-bold" style={{ color: '#ffffff', fontFamily: "'Space Grotesk', sans-serif", textShadow: '0 0 20px rgba(0,255,136,0.5)' }}>
          ROBOT POV LAB
        </h1>
        <p className="text-xs mt-1" style={{ color: '#00ff88', fontFamily: "'JetBrains Mono', monospace" }}>
          ESP-WROOM-32 · PROJECTS
        </p>
      </motion.div>

      {/* Instructions */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="absolute bottom-6 left-6 z-10 rounded-lg border p-3 text-xs"
        style={{ backgroundColor: 'rgba(0,0,0,0.7)', borderColor: '#00ff8840', color: '#00ff88', fontFamily: "'JetBrains Mono', monospace", backdropFilter: 'blur(8px)' }}
      >
        <p className="font-bold mb-1">CONTROLS</p>
        <p>• Hover + click screens to view projects</p>
        <p>• Drag to rotate · Scroll to zoom</p>
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

                <div className="text-gray-300 text-sm leading-relaxed mb-5 whitespace-pre-line">
                  {project.details.split('**Coming Soon:**').map((part, i) =>
                    i === 0 ? part : (
                      <span key={i}><strong className="text-green-400 font-bold">Coming Soon:</strong>{part}</span>
                    )
                  )}
                </div>

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
