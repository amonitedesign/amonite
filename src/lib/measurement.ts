import type { LengthUnit, Vector3Data } from "./cad-types";

export const MM_PER_IN = 25.4;
export const MM_PER_CM = 10;
export const MM_PER_M = 1000;

export const SNAP_STEPS_MM: number[] = [1, 5, 10, 25];

export function toMM(value: number, unit: LengthUnit): number {
  switch (unit) {
    case "in":
      return value * MM_PER_IN;
    case "cm":
      return value * MM_PER_CM;
    case "m":
      return value * MM_PER_M;
    case "mm":
    default:
      return value;
  }
}

export function fromMM(mm: number, unit: LengthUnit): number {
  switch (unit) {
    case "in":
      return mm / MM_PER_IN;
    case "cm":
      return mm / MM_PER_CM;
    case "m":
      return mm / MM_PER_M;
    case "mm":
    default:
      return mm;
  }
}

export function formatLength(mm: number, unit: LengthUnit, fractionDigits = 2): string {
  const v = fromMM(mm, unit);
  return `${v.toFixed(fractionDigits)} ${unit}`;
}

export function distanceBetween(a: Vector3Data, b: Vector3Data): number {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const dz = b.z - a.z;
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

export function angleXYDeg(a: Vector3Data, b: Vector3Data): number {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  return (Math.atan2(dy, dx) * 180) / Math.PI;
}

export function snapValue(mm: number, snapStep: number, enabled: boolean): number {
  if (!enabled || snapStep <= 0) return mm;
  return Math.round(mm / snapStep) * snapStep;
}
