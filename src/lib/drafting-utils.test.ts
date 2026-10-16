import { describe, expect, it } from 'vitest';
import {
  snapDraftPoint,
  isClosedLoop,
  polygonArea,
  dedupePoints,
  validatePolygon,
} from './drafting-utils';

describe('drafting-utils', () => {
  it('snaps draft points to the grid step when enabled', () => {
    expect(snapDraftPoint({ x: 12, y: 13 }, 5, true)).toEqual({ x: 10, y: 15 });
    expect(snapDraftPoint({ x: 12, y: 13 }, 5, false)).toEqual({ x: 12, y: 13 });
  });

  it('detects closed loops within tolerance', () => {
    expect(isClosedLoop([{ x: 0, y: 0 }, { x: 10, y: 0 }, { x: 0, y: 0 }])).toBe(true);
    expect(isClosedLoop([{ x: 0, y: 0 }, { x: 10, y: 0 }, { x: 50, y: 50 }])).toBe(false);
    expect(isClosedLoop([{ x: 0, y: 0 }])).toBe(false);
  });

  it('computes polygon area via shoelace', () => {
    expect(polygonArea([{ x: 0, y: 0 }, { x: 10, y: 0 }, { x: 10, y: 10 }, { x: 0, y: 10 }])).toBe(100);
    expect(polygonArea([])).toBe(0);
  });

  it('dedupes consecutive duplicate points', () => {
    expect(dedupePoints([{ x: 0, y: 0 }, { x: 0, y: 0 }, { x: 5, y: 5 }])).toEqual([
      { x: 0, y: 0 },
      { x: 5, y: 5 },
    ]);
  });

  it('validates polygons before extrusion commit', () => {
    expect(validatePolygon([{ x: 0, y: 0 }, { x: 1, y: 1 }]).ok).toBe(false);
    expect(validatePolygon([{ x: 0, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 0 }]).ok).toBe(false);
    expect(
      validatePolygon([{ x: 0, y: 0 }, { x: 10, y: 0 }, { x: 0, y: 10 }]).ok
    ).toBe(true);
  });
});
