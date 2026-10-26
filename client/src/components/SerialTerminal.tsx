import { useEffect, useRef, useState } from 'react';
import { useAppStore } from '@/stores/appStore';
import { runCommand } from '@/lib/terminal';

const PROMPT = 'jaswin@esp32:~$';
const WELCOME = ['JC-2026 serial console. type "help" to see what I can do.'];

// Easter-egg serial terminal, opened with the backtick key or the >_ button
export default function SerialTerminal() {
  const [open, setOpen] = useState(false);
  const [lines, setLines] = useState<string[]>(WELCOME);
  const [input, setInput] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const typing = e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement;
      if (e.key === '`' && (!typing || e.target === inputRef.current)) {
        e.preventDefault();
        setOpen((o) => !o);
      } else if (e.key === 'Escape') {
        setOpen(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: 'end' });
  }, [lines]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const { lines: out, action } = runCommand(input);
    setInput('');
    if (action === 'clear') return setLines([]);
    setLines((prev) => [...prev, `${PROMPT} ${input}`, ...out]);
    if (!action) return;
    const store = useAppStore.getState();
    if (action === 'close') setOpen(false);
    else if (action === 'contact') store.setShowContactForm(true);
    else if (action === 'mode-3d') store.setMode('3d');
    else if (action === 'mode-recruiter') store.setMode('recruiter');
    else window.open(action.open, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="print:hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-6 right-6 z-40 rounded-lg border border-[#00ff88] bg-black/75 px-3 py-2 text-sm font-bold text-[#00ff88] backdrop-blur hover:bg-[#00ff88]/15"
        style={{ fontFamily: "'JetBrains Mono', monospace" }}
        aria-label={open ? 'Close serial terminal' : 'Open serial terminal'}
        aria-expanded={open}
        title="Serial terminal (` key)"
      >
        &gt;_
      </button>

      {open && (
        <div
          className="fixed bottom-20 right-4 left-4 sm:left-auto sm:w-[32rem] z-50 rounded-lg border border-[#00ff88] bg-black/95 shadow-[0_0_30px_rgba(0,255,136,0.25)]"
          style={{ fontFamily: "'JetBrains Mono', monospace" }}
          role="dialog"
          aria-label="Serial terminal"
          onClick={() => inputRef.current?.focus()}
        >
          <div className="flex items-center justify-between border-b border-[#00ff88]/30 px-3 py-1.5 text-[11px] text-[#00ff88]/70">
            <span>/dev/ttyUSB0 · 115200 baud</span>
            <button onClick={() => setOpen(false)} className="hover:text-[#00ff88]" aria-label="Close">✕</button>
          </div>
          <div className="h-64 overflow-y-auto px-3 py-2 text-xs leading-relaxed text-[#00ff88]">
            {lines.map((line, i) => (
              <pre key={i} className="whitespace-pre-wrap break-words font-[inherit]">{line}</pre>
            ))}
            <form onSubmit={submit} className="flex gap-2">
              <label htmlFor="serial-input" className="shrink-0 text-[#7fbf9a]">{PROMPT}</label>
              <input
                id="serial-input"
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="min-w-0 flex-1 bg-transparent text-[#00ff88] outline-none caret-[#00ff88]"
                autoComplete="off"
                autoCapitalize="off"
                spellCheck={false}
              />
            </form>
            <div ref={endRef} />
          </div>
        </div>
      )}
    </div>
  );
}
