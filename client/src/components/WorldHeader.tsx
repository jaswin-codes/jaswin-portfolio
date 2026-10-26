import { useLocation } from 'wouter';

// Shared top bar for every section world: back to the board on the left, title on the right
export default function WorldHeader({ title, part }: { title: string; part: string }) {
  const [, setLocation] = useLocation();
  return (
    <div className="absolute top-0 inset-x-0 z-30 flex items-start justify-between gap-3 px-4 py-4 md:px-8 md:py-6 pointer-events-none">
      <button
        onClick={() => setLocation('/')}
        className="pointer-events-auto shrink-0 rounded-lg border border-[#00ff88] bg-black/70 px-3 py-2 text-sm font-semibold text-[#00ff88] backdrop-blur hover:bg-[#00ff88]/10"
        style={{ fontFamily: "'JetBrains Mono', monospace" }}
      >
        ← ESP32
      </button>
      <div className="text-right min-w-0">
        <h1
          className="text-xl md:text-3xl font-bold text-white leading-tight"
          style={{ fontFamily: "'Space Grotesk', sans-serif", textShadow: '0 0 20px rgba(0,255,136,0.5)' }}
        >
          {title}
        </h1>
        <p className="text-[10px] md:text-xs mt-1 text-[#00ff88]" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
          {part}
        </p>
      </div>
    </div>
  );
}
