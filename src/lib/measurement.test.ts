import { describe, expect, expectTypeOf, it } from 'vitest';
import {
  MM_PER_IN,
  angleXYDeg,
  distanceBetween,
  formatLength,
  fromMM,
  snapValue,
  toMM,
} from './measurement';

describe('measurement / unit conversion (canonical mm)', () => {
  it('converts to MM from all units', () => {
    expect(toMM(1, 'mm')).toBe(1);
    expect(toMM(1, 'cm')).toBe(10);
    expect(toMM(1, 'm')).toBe(1000);
    expect(toMM(1, 'in')).toBeCloseTo(MM_PER_IN, 10);
    expect(toMM(2.5, 'in')).toBeCloseTo(63.5, 10);
  });

  it('converts from MM to all units', () => {
    expect(fromMM(10, 'mm')).toBe(10);
    expect(fromMM(10, 'cm')).toBe(1);
    expect(fromMM(1000, 'm')).toBe(1);
    expect(fromMM(25.4, 'in')).toBeCloseTo(1, 10);
  });

  it('round-trips mm -> unit -> mm', () => {
    for (const mm of [0, 1, 5, 40, 200]) {
      expect(toMM(fromMM(mm, 'in'), 'in')).toBeCloseTo(mm, 8);
      expect(toMM(fromMM(mm, 'cm'), 'cm')).toBeCloseTo(mm, 8);
    }
  });

  it('formats lengths with unit suffix', () => {
    expect(formatLength(40, 'mm')).toBe('40.00 mm');
    expect(formatLength(25.4, 'in')).toBe('1.00 in');
    expect(formatLength(5, 'mm', 0)).toBe('5 mm');
  });

  it('computes 3D distances', () => {
    expect(distanceBetween({ x: 0, y: 0, z: 0 }, { x: 3, y: 4, z: 0 })).toBeCloseTo(5, 10);
    expect(distanceBetween({ x: 1, y: 1, z: 1 }, { x: 1, y: 1, z: 1 })).toBe(0);
    // 3-4-12-13 cuboid diagonal
    expect(
      distanceBetween({ x: 0, y: 0, z: 0 }, { x: 3, y: 4, z: 12 })
    ).toBeCloseTo(13, 10);
  });

  it('computes XY-plane angles per quadrant', () => {
    const o = { x: 0, y: 0, z: 99 };
    expect(angleXYDeg(o, { x: 10, y: 0, z: 0 })).toBeCloseTo(0, 10);
    expect(angleXYDeg(o, { x: 0, y: 10, z: 0 })).toBeCloseTo(90, 10);
    expect(angleXYDeg(o, { x: -10, y: 0, z: 0 })).toBeCloseTo(180, 10);
    expect(angleXYDeg(o, { x: 0, y: -10, z: 0 })).toBeCloseTo(-90, 10);
  });

  it('snaps values to step when enabled', () => {
    expect(snapValue(12, 5, true)).toBe(10);
    expect(snapValue(13, 5, true)).toBe(15);
    expect(snapValue(12.4, 5, false)).toBe(12.4);
    expect(snapValue(12.4, 0, true)).toBe(12.4);
    expect(snapValue(-7, 5, true)).toBe(-5);
  });

  it('exposes numeric types', () => {
    expectTypeOf(toMM(1, 'mm')).toBeNumber();
    expectTypeOf(formatLength(1, 'mm')).toBeString();
  });
});
