import { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { PerspectiveCamera, OrbitControls } from '@react-three/drei';
import { useAppStore } from '@/stores/appStore';
import { Button } from '@/components/ui/button';
import { useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { projects } from '@/data/portfolioData';
import { X } from 'lucide-react';

interface ProjectScreen {
  id: string;
  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number, number];
}

const projectScreens: ProjectScreen[] = [
  {
    id: 'afriguard',
    position: [-3, 1.5, -5],
    rotation: [0, Math.PI / 4, 0],
    scale: [1, 1, 1],
  },
  {
    id: 'hyperspectral',
    position: [3, 1.5, -5],
    rotation: [0, -Math.PI / 4, 0],
    scale: [1, 1, 1],
  },
  {
    id: 'uct-racing',
    position: [-3, -1.5, -5],
    rotation: [0, Math.PI / 4, 0],
    scale: [1, 1, 1],
  },
  {
    id: 'emi-lab',
    position: [3, -1.5, -5],
    rotation: [0, -Math.PI / 4, 0],
    scale: [1, 1, 1],
  },
];

export default function ProjectsSection() {
  const [, setLocation] = useLocation();
  const [selectedProject, setSelectedProject] = useState<string | null>(null);

  const project = selectedProject ? projects.find((p) => p.id === selectedProject) : null;

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">
      {/* 3D Canvas */}
      <Canvas className="w-full h-full">
        <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={75} />
        <OrbitControls enableZoom={true} enablePan={true} />

        <color attach="background" args={['#0a0a0a']} />

        {/* Lighting */}
        <ambientLight intensity={0.6} />
        <pointLight position={[10, 10, 10]} intensity={1.5} />
        <pointLight position={[-10, -10, 10]} intensity={0.8} color="#00ff88" />

        {/* Room Floor */}
        <mesh position={[0, -2, 0]} receiveShadow>
          <planeGeometry args={[20, 20]} />
          <meshStandardMaterial color="#1a1a1a" metalness={0.1} roughness={0.9} />
        </mesh>

        {/* Room Walls */}
        <mesh position={[0, 0, -8]} receiveShadow>
          <planeGeometry args={[20, 10]} />
          <meshStandardMaterial color="#0d0d0d" metalness={0.1} roughness={0.95} />
        </mesh>

        <mesh position={[-10, 0, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
          <planeGeometry args={[16, 10]} />
          <meshStandardMaterial color="#0d0d0d" metalness={0.1} roughness={0.95} />
        </mesh>

        <mesh position={[10, 0, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
          <planeGeometry args={[16, 10]} />
          <meshStandardMaterial color="#0d0d0d" metalness={0.1} roughness={0.95} />
        </mesh>

        {/* Project Screens */}
        {projectScreens.map((screen) => (
          <group key={screen.id} position={screen.position} rotation={screen.rotation}>
            <mesh
              onClick={() => setSelectedProject(screen.id)}
              castShadow
              receiveShadow
            >
              <boxGeometry args={[2, 1.5, 0.1]} />
              <meshStandardMaterial
                color={selectedProject === screen.id ? '#00ff88' : '#1a1a1a'}
                metalness={0.6}
                roughness={0.4}
                emissive={selectedProject === screen.id ? '#00ff88' : '#000000'}
                emissiveIntensity={selectedProject === screen.id ? 0.3 : 0}
              />
            </mesh>

            <mesh position={[0, 0, 0.06]}>
              <boxGeometry args={[1.8, 1.3, 0.01]} />
              <meshStandardMaterial color="#0a0a0a" metalness={0.2} roughness={0.8} />
            </mesh>
          </group>
        ))}

        {/* Robot */}
        <group position={[0, -1.5, 2]}>
          <mesh castShadow>
            <boxGeometry args={[0.5, 1, 0.5]} />
            <meshStandardMaterial color="#00ff88" metalness={0.5} roughness={0.5} />
          </mesh>
          <pointLight position={[0, 0.5, 0]} intensity={1} color="#00ff88" distance={3} />
        </group>
      </Canvas>

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
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 text-center pointer-events-none"
      >
        <h1 className="text-5xl font-bold text-white" style={{
          fontFamily: "'Space Grotesk', sans-serif",
          textShadow: '0 0 20px rgba(0, 255, 136, 0.5)',
        }}>
          PROJECTS
        </h1>
        <p className="text-green-400 text-sm mt-4" style={{
          fontFamily: "'JetBrains Mono', monospace",
        }}>
          ESP-WROOM-32
        </p>
      </motion.div>

      {/* Instructions */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="absolute bottom-8 left-8 bg-black/70 border border-green-500/30 rounded p-4 text-green-400 text-sm"
        style={{ fontFamily: "'JetBrains Mono', monospace" }}
      >
        <p className="font-bold mb-2">CONTROLS:</p>
        <p>• Click project screens to view details</p>
        <p>• Use mouse to rotate the view</p>
      </motion.div>

      {/* Project Detail Modal */}
      {project && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="absolute inset-0 flex items-center justify-center z-20 bg-black/70"
          onClick={() => setSelectedProject(null)}
        >
          <motion.div
            onClick={(e) => e.stopPropagation()}
            className="bg-gray-900 border border-green-500 rounded-lg p-8 max-w-md w-full mx-4 max-h-96 overflow-y-auto"
          >
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-bold text-white">{project.name}</h2>
              <button
                onClick={() => setSelectedProject(null)}
                className="text-green-400 hover:text-green-300"
              >
                <X size={24} />
              </button>
            </div>

            <p className="text-green-400 text-sm mb-4">{project.shortDescription}</p>

            <div className="mb-4">
              <p className="text-gray-300 text-sm mb-2">{project.details}</p>
            </div>

            <div className="mb-4">
              <div className="flex flex-wrap gap-2">
                {project.techStack.map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1 bg-green-500/20 text-green-400 text-xs rounded-full border border-green-500/50"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {(project.githubLink || project.liveLink) && (
              <div className="flex gap-4">
                {project.githubLink && (
                  <a
                    href={project.githubLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 px-4 py-2 bg-green-500/20 text-green-400 text-sm rounded border border-green-500/50 hover:bg-green-500/30 text-center"
                  >
                    GitHub
                  </a>
                )}
                {project.liveLink && (
                  <a
                    href={project.liveLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 px-4 py-2 bg-green-500/20 text-green-400 text-sm rounded border border-green-500/50 hover:bg-green-500/30 text-center"
                  >
                    Live Demo
                  </a>
                )}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
