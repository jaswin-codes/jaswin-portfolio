import { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX, Lightbulb, LightbulbOff } from 'lucide-react';
import {
  BEEP_MS,
  HIGH_THRESHOLD,
  LOW_THRESHOLD,
  PULSE_HZ,
  VCC,
  buzzerMode,
  comparatorOutputs,
  tankLevel,
  type TankLevel,
} from '@/lib/wlds';

const MONO = { fontFamily: "'JetBrains Mono', monospace" };

// Interactive version of the WLDS alarm: drag the tank level, cut the lights, hear the buzzer
export default function WldsDemo() {
  const [volts, setVolts] = useState(4.2);
  const [loadshedding, setLoadshedding] = useState(false);
  const [soundOn, setSoundOn] = useState(false);
  const [beeping, setBeeping] = useState(false);
  const [pulsePhase, setPulsePhase] = useState(true);

  const level = tankLevel(volts);
  const outputs = comparatorOutputs(volts);
  const steady = buzzerMode(level, loadshedding);
  const buzzerOn = beeping || steady === 'continuous' || (steady === 'pulsing' && pulsePhase);

  // Monostable: one 1.1 s beep whenever the level enters the half band
  const prevLevel = useRef<TankLevel>(level);
  useEffect(() => {
    if (level === 'half' && prevLevel.current !== 'half') {
      setBeeping(true);
      const t = setTimeout(() => setBeeping(false), BEEP_MS);
      prevLevel.current = level;
      return () => clearTimeout(t);
    }
    prevLevel.current = level;
  }, [level]);

  // Astable: 1.4 Hz on/off while empty during loadshedding
  useEffect(() => {
    if (steady !== 'pulsing') return;
    setPulsePhase(true);
    const id = setInterval(() => setPulsePhase((p) => !p), 1000 / PULSE_HZ / 2);
    return () => clearInterval(id);
  }, [steady]);

  // Web Audio buzzer, created only after the user turns sound on (browsers require a gesture)
  const audio = useRef<{ ctx: AudioContext; gain: GainNode } | null>(null);
  const toggleSound = () => {
    if (!audio.current) {
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'square';
      osc.frequency.value = 2300;
      gain.gain.value = 0;
      osc.connect(gain).connect(ctx.destination);
      osc.start();
      audio.current = { ctx, gain };
    }
    audio.current.ctx.resume();
    setSoundOn((s) => !s);
  };
  useEffect(() => {
    const a = audio.current;
    if (a) a.gain.gain.setTargetAtTime(soundOn && buzzerOn ? 0.03 : 0, a.ctx.currentTime, 0.005);
  }, [soundOn, buzzerOn]);
  useEffect(() => () => { audio.current?.ctx.close(); }, []);

  const buzzerText = beeping
    ? 'one 1.1 s beep (entered half)'
    : steady === 'continuous'
      ? 'continuous tone (empty)'
      : steady === 'pulsing'
        ? 'beeping at 1.4 Hz (empty + loadshedding)'
        : 'off';

  const ledColor = level === 'empty' ? '#ff2a2a' : '#22ff66';
  const fillPct = (volts / VCC) * 100;

  return (
    <div className="rounded-lg border border-green-500/40 bg-black/60 p-4 text-sm" style={MONO}>
      <div className="flex items-center justify-between gap-2 mb-3">
        <p className="text-green-400 font-bold text-xs tracking-wider">LIVE DEMO · TRY THE ALARM</p>
        <button
          onClick={toggleSound}
          className="flex items-center gap-1 rounded border border-green-500/50 px-2 py-1 text-xs text-green-400 hover:bg-green-500/10"
          aria-pressed={soundOn}
        >
          {soundOn ? <Volume2 size={14} /> : <VolumeX size={14} />} {soundOn ? 'Sound on' : 'Sound off'}
        </button>
      </div>

      <div className="flex gap-4">
        {/* Tank with the two comparator thresholds */}
        <div className="relative w-16 h-40 shrink-0 rounded-b-md border-2 border-gray-500 overflow-hidden bg-gray-900" aria-hidden="true">
          <div className="absolute bottom-0 inset-x-0 bg-sky-500/70 transition-[height] duration-150" style={{ height: `${fillPct}%` }} />
          {[HIGH_THRESHOLD, LOW_THRESHOLD].map((t) => (
            <div key={t} className="absolute inset-x-0 border-t border-dashed border-gray-300/70" style={{ bottom: `${(t / VCC) * 100}%` }}>
              <span className="absolute -top-3.5 right-0.5 text-[9px] text-gray-300">{t.toFixed(2)}V</span>
            </div>
          ))}
        </div>

        <div className="flex-1 min-w-0 space-y-3">
          {/* Status LED + level */}
          <div className="flex items-center gap-3">
            <span
              className="inline-block w-5 h-5 rounded-full shrink-0"
              style={{ backgroundColor: ledColor, boxShadow: `0 0 12px ${ledColor}` }}
              aria-label={`LED ${level === 'empty' ? 'red' : 'green'}`}
            />
            <span className="text-white font-bold uppercase">{level}</span>
            <span className="text-gray-400 text-xs">{volts.toFixed(2)} V</span>
          </div>

          {/* Comparator outputs */}
          <div className="flex gap-1.5">
            {([['HIGH', outputs.high, '#22aa44'], ['MED', outputs.med, '#ffaa00'], ['LOW', outputs.low, '#ff3333']] as const).map(([name, on, c]) => (
              <span
                key={name}
                className="px-1.5 py-0.5 rounded text-[10px] border"
                style={{ borderColor: c, color: on ? '#000' : c, backgroundColor: on ? c : 'transparent' }}
              >
                {name}
              </span>
            ))}
          </div>

          {/* Buzzer */}
          <div className="flex items-start gap-2">
            <span
              className="mt-0.5 inline-block w-3 h-3 rounded-full shrink-0 transition-colors"
              style={{ backgroundColor: buzzerOn ? '#ffee00' : '#333', boxShadow: buzzerOn ? '0 0 10px #ffee00' : 'none' }}
            />
            <span className="text-gray-300 text-xs leading-snug">Buzzer: {buzzerText}</span>
          </div>

          <button
            onClick={() => setLoadshedding((l) => !l)}
            className="flex items-center gap-1.5 rounded border px-2 py-1 text-xs"
            style={{ borderColor: loadshedding ? '#ffaa00' : '#22ff6680', color: loadshedding ? '#ffaa00' : '#22ff66' }}
            aria-pressed={loadshedding}
          >
            {loadshedding ? <LightbulbOff size={14} /> : <Lightbulb size={14} />}
            {loadshedding ? 'Lights off (loadshedding)' : 'Lights on (mains power)'}
          </button>
        </div>
      </div>

      <label className="block mt-4 text-xs text-gray-400">
        Float sensor: drag to fill or drain the tank
        <input
          type="range"
          min={0}
          max={VCC}
          step={0.05}
          value={volts}
          onChange={(e) => setVolts(Number(e.target.value))}
          className="w-full mt-1 accent-green-400"
        />
      </label>
    </div>
  );
}
