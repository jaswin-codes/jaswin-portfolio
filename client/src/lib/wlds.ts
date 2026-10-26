// Behaviour of Jaswin's EEE1009S water level & loadshedding alarm (WLDS).
// LM324 comparators split a 0–5 V float-sensor voltage at 1/3 and 2/3 of the supply.

export const VCC = 5;
export const LOW_THRESHOLD = VCC / 3; // 1.67 V
export const HIGH_THRESHOLD = (2 * VCC) / 3; // 3.33 V
export const BEEP_MS = 1100; // 555 monostable: one beep on entering the half band
export const PULSE_HZ = 1.4; // 555 astable: empty during loadshedding

export type TankLevel = 'full' | 'half' | 'empty';
export type BuzzerMode = 'off' | 'continuous' | 'pulsing';

export function tankLevel(volts: number): TankLevel {
  if (volts >= HIGH_THRESHOLD) return 'full';
  if (volts >= LOW_THRESHOLD) return 'half';
  return 'empty';
}

// Comparator outputs as shown in the LTspice plot (HIGH / MED / LOW lines)
export function comparatorOutputs(volts: number) {
  const level = tankLevel(volts);
  return { high: level === 'full', med: level === 'half', low: level === 'empty' };
}

// Steady buzzer state; the single half-band beep is a timed event handled by the caller
export function buzzerMode(level: TankLevel, loadshedding: boolean): BuzzerMode {
  if (level !== 'empty') return 'off';
  return loadshedding ? 'pulsing' : 'continuous';
}
