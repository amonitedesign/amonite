import { describe, expect, it } from 'vitest';
import { SNAP_OPTIONS, gridDivisionsFor } from './grid-utils';

describe('grid-utils / adaptive subdivision', () => {
  it('derives divisions from gridSize / snapStep', () => {
    expect(gridDivisionsFor(200, 5)).toBe(40);
    expect(gridDivisionsFor(100, 10)).toBe(10);
    expect(gridDivisionsFor(100, 1)).toBe(100);
  });

  it('clamps to readable 10–100 range', () => {
    expect(gridDivisionsFor(1000, 1)).toBe(100); // raw 1000 -> clamp
    expect(gridDivisionsFor(10, 25)).toBe(10); // raw 0 -> clamp
  });

  it('falls back for non-positive snapStep', () => {
    expect(gridDivisionsFor(200, 0)).toBe(20);
    expect(gridDivisionsFor(200, -5)).toBe(20);
  });

  it('exposes the documented snap options', () => {
    expect(SNAP_OPTIONS).toEqual([1, 5, 10, 25]);
  });
});
