import { describe, expect, it } from 'vitest';
import { STUDIO_THEME } from './studio-theme';
import { fromMM, toMM, formatMeasure } from './units';

describe('studio-theme / token completeness', () => {
  it('defines every chrome + stage token in both modes', () => {
    const darkKeys = Object.keys(STUDIO_THEME.dark.chrome).sort();
    const lightKeys = Object.keys(STUDIO_THEME.light.chrome).sort();
    expect(lightKeys).toEqual(darkKeys);
    expect(darkKeys.length).toBeGreaterThan(10);
    const darkStage = Object.keys(STUDIO_THEME.dark.stage).sort();
    const lightStage = Object.keys(STUDIO_THEME.light.stage).sort();
    expect(lightStage).toEqual(darkStage);
  });

  it('keeps one accent voice across modes', () => {
    expect(STUDIO_THEME.dark.chrome.accent).toBe(STUDIO_THEME.light.chrome.accent);
  });

  it('uses distinct stage backgrounds per mode', () => {
    expect(STUDIO_THEME.dark.stage.bg).not.toBe(STUDIO_THEME.light.stage.bg);
  });
});

describe('units / mm-in conversion', () => {
  it('converts both directions losslessly', () => {
    expect(fromMM(25.4, 'in')).toBeCloseTo(1, 6);
    expect(toMM(2, 'in')).toBeCloseTo(50.8, 6);
    expect(fromMM(42, 'mm')).toBe(42);
  });

  it('formats readouts per unit', () => {
    expect(formatMeasure(45, 'mm')).toBe('45 mm');
    expect(formatMeasure(4.5, 'mm')).toBe('4.5 mm');
    expect(formatMeasure(25.4, 'in')).toBe('1.00 in');
  });
});
