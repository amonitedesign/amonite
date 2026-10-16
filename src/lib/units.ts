import type { LengthUnit } from './cad-types';

export const MM_PER_IN = 25.4;

/** Canonical millimetres → display value in the active unit. */
export function fromMM(mm: number, unit: LengthUnit): number {
  return unit === 'in' ? mm / MM_PER_IN : mm;
}

/** Display value → canonical millimetres. */
export function toMM(value: number, unit: LengthUnit): number {
  return unit === 'in' ? value * MM_PER_IN : value;
}

/** Format a canonical-mm length for atelier readouts. */
export function formatMeasure(mm: number, unit: LengthUnit): string {
  if (unit === 'in') return `${(mm / MM_PER_IN).toFixed(2)} in`;
  return `${Number(mm.toFixed(mm % 1 === 0 ? 0 : 1))} mm`;
}
