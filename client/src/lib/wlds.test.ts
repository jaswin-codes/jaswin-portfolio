import { describe, expect, it } from 'vitest';
import { buzzerMode, comparatorOutputs, tankLevel } from './wlds';

describe('WLDS alarm logic', () => {
  it('splits the tank at 1/3 and 2/3 of 5 V', () => {
    expect(tankLevel(0.5)).toBe('empty');
    expect(tankLevel(1.66)).toBe('empty');
    expect(tankLevel(1.67)).toBe('half');
    expect(tankLevel(3.3)).toBe('half');
    expect(tankLevel(3.34)).toBe('full');
    expect(tankLevel(5)).toBe('full');
  });

  it('lights exactly one comparator output', () => {
    for (const v of [0, 2.5, 4.5]) {
      const out = comparatorOutputs(v);
      expect([out.high, out.med, out.low].filter(Boolean)).toHaveLength(1);
    }
  });

  it('is silent unless empty, and pulses when empty during loadshedding', () => {
    expect(buzzerMode('full', true)).toBe('off');
    expect(buzzerMode('half', true)).toBe('off');
    expect(buzzerMode('empty', false)).toBe('continuous');
    expect(buzzerMode('empty', true)).toBe('pulsing');
  });
});
