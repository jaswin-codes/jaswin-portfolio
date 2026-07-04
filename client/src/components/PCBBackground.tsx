import { useEffect, useRef } from 'react';

interface TraceSegment {
  x: number;
  y: number;
  direction: 'h' | 'v';
  length: number;
  opacity: number;
}

interface SolderPad {
  x: number;
  y: number;
  radius: number;
  opacity: number;
}

// Seeded pseudo-random number generator for consistent trace layout
function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
}

function generatePCBLayout(width: number, height: number) {
  const rand = seededRandom(42);
  const segments: TraceSegment[] = [];
  const pads: SolderPad[] = [];

  // Grid spacing for trace routing
  const gridSize = 28;
  const cols = Math.ceil(width / gridSize);
  const rows = Math.ceil(height / gridSize);

  // Generate traces along the edges (denser near edges, sparse in centre)
  for (let i = 0; i < 320; i++) {
    const edgeBias = rand();
    let x: number, y: number;

    // Bias heavily toward edges — centre stays dark
    if (edgeBias < 0.3) {
      // Top/bottom strip
      x = rand() * width;
      y = edgeBias < 0.15
        ? rand() * height * 0.22
        : height - rand() * height * 0.22;
    } else if (edgeBias < 0.6) {
      // Left/right strip
      x = edgeBias < 0.45
        ? rand() * width * 0.22
        : width - rand() * width * 0.22;
      y = rand() * height;
    } else {
      // Corner clusters
      const corner = Math.floor(rand() * 4);
      const spread = 0.28;
      x = corner % 2 === 0 ? rand() * width * spread : width - rand() * width * spread;
      y = corner < 2 ? rand() * height * spread : height - rand() * height * spread;
    }

    // Snap to grid
    x = Math.round(x / gridSize) * gridSize;
    y = Math.round(y / gridSize) * gridSize;

    const isHorizontal = rand() > 0.5;
    const length = (Math.floor(rand() * 5) + 1) * gridSize;

    // Distance from centre — traces fade toward centre
    const cx = Math.abs(x - width / 2) / (width / 2);
    const cy = Math.abs(y - height / 2) / (height / 2);
    const edgeDist = Math.max(cx, cy); // 0 = centre, 1 = edge
    const opacity = Math.max(0.04, Math.min(0.35, edgeDist * 0.4 + rand() * 0.08));

    segments.push({ x, y, direction: isHorizontal ? 'h' : 'v', length, opacity });

    // Add solder pads at trace endpoints
    if (rand() > 0.45) {
      pads.push({ x, y, radius: 2.5 + rand() * 2, opacity: opacity * 1.4 });
      const endX = isHorizontal ? x + length : x;
      const endY = isHorizontal ? y : y + length;
      pads.push({ x: endX, y: endY, radius: 2.5 + rand() * 2, opacity: opacity * 1.4 });
    }
  }

  // Add via holes (small circles with rings)
  const vias: SolderPad[] = [];
  for (let i = 0; i < 60; i++) {
    const edgeBias = rand();
    let x: number, y: number;
    if (edgeBias < 0.5) {
      x = rand() * width;
      y = edgeBias < 0.25 ? rand() * height * 0.2 : height - rand() * height * 0.2;
    } else {
      x = edgeBias < 0.75 ? rand() * width * 0.2 : width - rand() * width * 0.2;
      y = rand() * height;
    }
    const cx = Math.abs(x - width / 2) / (width / 2);
    const cy = Math.abs(y - height / 2) / (height / 2);
    const edgeDist = Math.max(cx, cy);
    vias.push({ x, y, radius: 3.5, opacity: Math.max(0.08, edgeDist * 0.3) });
  }

  return { segments, pads, vias };
}

export default function PCBBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number>(0);
  const layoutRef = useRef<ReturnType<typeof generatePCBLayout> | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      layoutRef.current = generatePCBLayout(canvas.width, canvas.height);
    };

    resize();
    window.addEventListener('resize', resize);

    const GREEN = '0, 255, 80';
    const BRIGHT_GREEN = '57, 255, 20';

    let startTime = performance.now();

    const draw = (now: number) => {
      const elapsed = (now - startTime) / 1000; // seconds
      const w = canvas.width;
      const h = canvas.height;

      ctx.clearRect(0, 0, w, h);

      // ── PCB Traces ──────────────────────────────────────────────
      const layout = layoutRef.current;
      if (layout) {
        ctx.lineCap = 'square';

        // Draw trace segments
        for (const seg of layout.segments) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(${GREEN}, ${seg.opacity})`;
          ctx.lineWidth = 1.2;
          ctx.moveTo(seg.x, seg.y);
          if (seg.direction === 'h') {
            ctx.lineTo(seg.x + seg.length, seg.y);
          } else {
            ctx.lineTo(seg.x, seg.y + seg.length);
          }
          ctx.stroke();
        }

        // Draw solder pads
        for (const pad of layout.pads) {
          ctx.beginPath();
          ctx.fillStyle = `rgba(${GREEN}, ${pad.opacity})`;
          ctx.arc(pad.x, pad.y, pad.radius, 0, Math.PI * 2);
          ctx.fill();
        }

        // Draw vias (ring + centre dot)
        for (const via of layout.vias) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(${GREEN}, ${via.opacity})`;
          ctx.lineWidth = 1;
          ctx.arc(via.x, via.y, via.radius, 0, Math.PI * 2);
          ctx.stroke();
          ctx.beginPath();
          ctx.fillStyle = `rgba(${GREEN}, ${via.opacity * 0.5})`;
          ctx.arc(via.x, via.y, 1.2, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // ── Animated Edge Glow ──────────────────────────────────────
      // Slow pulse: period ~4 seconds, amplitude subtle
      const pulse = 0.75 + 0.25 * Math.sin(elapsed * (Math.PI * 2 / 4));
      const glowWidth = 90 * pulse;
      const glowAlpha = 0.9 * pulse;
      const innerAlpha = 0.35 * pulse;

      // Top edge
      const topGrad = ctx.createLinearGradient(0, 0, 0, glowWidth);
      topGrad.addColorStop(0, `rgba(${BRIGHT_GREEN}, ${glowAlpha})`);
      topGrad.addColorStop(0.3, `rgba(${GREEN}, ${innerAlpha})`);
      topGrad.addColorStop(1, `rgba(${GREEN}, 0)`);
      ctx.fillStyle = topGrad;
      ctx.fillRect(0, 0, w, glowWidth);

      // Bottom edge
      const botGrad = ctx.createLinearGradient(0, h, 0, h - glowWidth);
      botGrad.addColorStop(0, `rgba(${BRIGHT_GREEN}, ${glowAlpha})`);
      botGrad.addColorStop(0.3, `rgba(${GREEN}, ${innerAlpha})`);
      botGrad.addColorStop(1, `rgba(${GREEN}, 0)`);
      ctx.fillStyle = botGrad;
      ctx.fillRect(0, h - glowWidth, w, glowWidth);

      // Left edge
      const leftGrad = ctx.createLinearGradient(0, 0, glowWidth, 0);
      leftGrad.addColorStop(0, `rgba(${BRIGHT_GREEN}, ${glowAlpha})`);
      leftGrad.addColorStop(0.3, `rgba(${GREEN}, ${innerAlpha})`);
      leftGrad.addColorStop(1, `rgba(${GREEN}, 0)`);
      ctx.fillStyle = leftGrad;
      ctx.fillRect(0, 0, glowWidth, h);

      // Right edge
      const rightGrad = ctx.createLinearGradient(w, 0, w - glowWidth, 0);
      rightGrad.addColorStop(0, `rgba(${BRIGHT_GREEN}, ${glowAlpha})`);
      rightGrad.addColorStop(0.3, `rgba(${GREEN}, ${innerAlpha})`);
      rightGrad.addColorStop(1, `rgba(${GREEN}, 0)`);
      ctx.fillStyle = rightGrad;
      ctx.fillRect(w - glowWidth, 0, glowWidth, h);

      // ── Bright border line (1px neon outline) ──────────────────
      const lineAlpha = 0.7 + 0.3 * Math.sin(elapsed * (Math.PI * 2 / 4));
      const inset = 4;
      const radius = 8;
      ctx.beginPath();
      ctx.moveTo(inset + radius, inset);
      ctx.lineTo(w - inset - radius, inset);
      ctx.quadraticCurveTo(w - inset, inset, w - inset, inset + radius);
      ctx.lineTo(w - inset, h - inset - radius);
      ctx.quadraticCurveTo(w - inset, h - inset, w - inset - radius, h - inset);
      ctx.lineTo(inset + radius, h - inset);
      ctx.quadraticCurveTo(inset, h - inset, inset, h - inset - radius);
      ctx.lineTo(inset, inset + radius);
      ctx.quadraticCurveTo(inset, inset, inset + radius, inset);
      ctx.closePath();

      ctx.strokeStyle = `rgba(${BRIGHT_GREEN}, ${lineAlpha})`;
      ctx.lineWidth = 1.5;
      ctx.shadowColor = `rgba(${BRIGHT_GREEN}, 0.9)`;
      ctx.shadowBlur = 12 * pulse;
      ctx.stroke();
      ctx.shadowBlur = 0;

      // ── Scanline texture on border ──────────────────────────────
      const scanAlpha = 0.06 * pulse;
      ctx.fillStyle = `rgba(${GREEN}, ${scanAlpha})`;
      for (let y = 0; y < h; y += 3) {
        // Only draw scanlines near edges
        const distFromEdge = Math.min(y, h - y, 80);
        if (distFromEdge < 80) {
          ctx.fillRect(0, y, w, 1);
        }
      }

      animFrameRef.current = requestAnimationFrame(draw);
    };

    animFrameRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
      aria-hidden="true"
    />
  );
}
