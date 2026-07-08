import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface LoadingScreenProps {
  isLoading: boolean;
  progress?: number;
}

export const LoadingScreen = ({
  isLoading,
  progress = 0,
}: LoadingScreenProps) => {
  const [displayProgress, setDisplayProgress] = useState(0);

  useEffect(() => {
    // Smooth progress animation
    const interval = setInterval(() => {
      setDisplayProgress(prev => {
        if (progress > prev) {
          return Math.min(prev + Math.random() * 15, progress);
        }
        return prev;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [progress]);

  if (!isLoading && displayProgress >= 100) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Animated Background Grid */}
      <div className="absolute inset-0 opacity-20">
        <svg className="w-full h-full" preserveAspectRatio="none">
          <defs>
            <pattern
              id="grid-loading"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke="#00ff88"
                strokeWidth="0.5"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid-loading)" />
        </svg>
      </div>

      {/* Animated Glow Orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute w-64 h-64 bg-green-500 rounded-full blur-3xl opacity-10"
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{ top: "20%", left: "10%" }}
        />
        <motion.div
          className="absolute w-64 h-64 bg-blue-500 rounded-full blur-3xl opacity-10"
          animate={{
            x: [0, -100, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{ bottom: "20%", right: "10%" }}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center gap-8">
        {/* Circuit Board Icon */}
        <motion.div
          className="relative w-24 h-24"
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        >
          <svg viewBox="0 0 100 100" className="w-full h-full">
            {/* Outer circle */}
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="#00ff88"
              strokeWidth="2"
            />

            {/* Inner circuit paths */}
            <path
              d="M 50 10 L 50 30 M 50 70 L 50 90 M 10 50 L 30 50 M 70 50 L 90 50"
              stroke="#00ff88"
              strokeWidth="2"
              fill="none"
            />

            {/* Corner nodes */}
            <circle cx="30" cy="30" r="3" fill="#00ff88" />
            <circle cx="70" cy="30" r="3" fill="#00ff88" />
            <circle cx="30" cy="70" r="3" fill="#00ff88" />
            <circle cx="70" cy="70" r="3" fill="#00ff88" />

            {/* Center node */}
            <circle cx="50" cy="50" r="4" fill="#00ff88" />

            {/* Connecting lines */}
            <path
              d="M 30 30 L 50 50 L 70 30 M 30 70 L 50 50 L 70 70"
              stroke="#00ff88"
              strokeWidth="1.5"
              fill="none"
              opacity="0.6"
            />
          </svg>

          {/* Pulsing glow */}
          <motion.div
            className="absolute inset-0 border-2 border-green-400 rounded-full"
            animate={{
              opacity: [0.3, 0.8, 0.3],
              scale: [0.9, 1.1, 0.9],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            style={{
              boxShadow: "0 0 20px rgba(0, 255, 136, 0.5)",
            }}
          />
        </motion.div>

        {/* Loading Text */}
        <div className="text-center">
          <h2
            className="text-2xl font-bold text-white mb-2"
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              textShadow: "0 0 10px rgba(0, 255, 136, 0.3)",
            }}
          >
            INITIALIZING
          </h2>
          <p
            className="text-green-400 text-sm"
            style={{
              fontFamily: "'JetBrains Mono', monospace",
            }}
          >
            Loading 3D environments...
          </p>
        </div>

        {/* Progress Bar Container */}
        <div className="w-64 mt-4">
          {/* Outer border */}
          <div className="border-2 border-green-500/50 rounded-lg p-1 bg-black/50">
            {/* Progress bar background */}
            <div className="h-2 bg-green-900/30 rounded relative overflow-hidden">
              {/* Progress fill */}
              <motion.div
                className="h-full bg-gradient-to-r from-green-400 to-green-500 rounded"
                style={{
                  width: `${displayProgress}%`,
                  boxShadow: "0 0 10px rgba(0, 255, 136, 0.8)",
                }}
                transition={{ duration: 0.3 }}
              />

              {/* Scanning line effect */}
              <motion.div
                className="absolute top-0 left-0 h-full w-8 bg-gradient-to-r from-transparent via-white to-transparent opacity-30"
                animate={{
                  x: ["-100%", "400%"],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </div>
          </div>

          {/* Progress percentage */}
          <div className="text-center mt-3">
            <p
              className="text-green-400 text-sm font-bold"
              style={{
                fontFamily: "'JetBrains Mono', monospace",
              }}
            >
              {Math.round(displayProgress)}%
            </p>
          </div>
        </div>

        {/* Loading dots */}
        <div className="flex gap-2 mt-4">
          {[0, 1, 2].map(i => (
            <motion.div
              key={i}
              className="w-2 h-2 bg-green-400 rounded-full"
              animate={{
                opacity: [0.3, 1, 0.3],
                scale: [0.8, 1, 0.8],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </div>

        {/* Status text */}
        <motion.p
          className="text-green-400/60 text-xs mt-6"
          style={{
            fontFamily: "'JetBrains Mono', monospace",
          }}
          animate={{
            opacity: [0.4, 0.8, 0.4],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
          }}
        >
          {displayProgress < 30
            ? "Loading textures..."
            : displayProgress < 60
              ? "Compiling shaders..."
              : displayProgress < 90
                ? "Initializing scenes..."
                : "Almost ready..."}
        </motion.p>
      </div>

      {/* Corner decorations */}
      <div className="absolute top-4 left-4 w-12 h-12 border-2 border-green-500/30 rounded opacity-50" />
      <div className="absolute top-4 right-4 w-12 h-12 border-2 border-green-500/30 rounded opacity-50" />
      <div className="absolute bottom-4 left-4 w-12 h-12 border-2 border-green-500/30 rounded opacity-50" />
      <div className="absolute bottom-4 right-4 w-12 h-12 border-2 border-green-500/30 rounded opacity-50" />
    </motion.div>
  );
};
