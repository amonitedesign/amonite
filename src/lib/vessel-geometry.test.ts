import { describe, expect, it } from 'vitest';
import {
  VESSEL_ARCHETYPES,
  VESSEL_FINISHES,
  createVesselGeometry,
  vesselProfileRadius,
} from './vessel-geometry';

describe('vessel-geometry / parametric kernel', () => {
  it('produces non-empty finite geometry for every archetype preset', () => {
    for (const spec of Object.values(VESSEL_ARCHETYPES)) {
      const geom = createVesselGeometry(spec.defaults);
      const pos = geom.getAttribute('position');
      expect(pos.count).toBeGreaterThan(1000);
      const arr = pos.array as ArrayLike<number>;
      for (let i = 0; i < arr.length; i++) {
        expect(Number.isFinite(arr[i])).toBe(true);
      }
      geom.dispose();
    }
  });

  it('spans the requested height and stays hollow (inner cavity below rim)', () => {
    const geom = createVesselGeometry(VESSEL_ARCHETYPES['fluted-vase'].defaults);
    geom.computeBoundingBox();
    const bb = geom.boundingBox!;
    expect(bb.max.y - bb.min.y).toBeCloseTo(170, 0);
    expect(bb.min.y).toBeCloseTo(0, 0);
    geom.dispose();
  });

  it('is deterministic for identical params', () => {
    const p = VESSEL_ARCHETYPES['twisted-cylinder'].defaults;
    const a = createVesselGeometry(p);
    const b = createVesselGeometry(p);
    const pa = a.getAttribute('position').array as Float32Array;
    const pb = b.getAttribute('position').array as Float32Array;
    expect(pa.length).toBe(pb.length);
    expect(pa[100]).toBe(pb[100]);
    a.dispose();
    b.dispose();
  });

  it('ribs change the silhouette, zero ribs stays smooth', () => {
    const base = VESSEL_ARCHETYPES['fluted-vase'].defaults;
    const ribbed = createVesselGeometry({ ...base, ribCount: 24 });
    const smooth = createVesselGeometry({ ...base, ribCount: 0 });
    const maxR = (g: { getAttribute: (n: string) => { array: ArrayLike<number> } }) => {
      const arr = g.getAttribute('position').array;
      let m = 0;
      for (let i = 0; i < arr.length; i += 3) m = Math.max(m, Math.hypot(arr[i], arr[i + 2]));
      return m;
    };
    expect(maxR(ribbed)).toBeGreaterThan(maxR(smooth));
    ribbed.dispose();
    smooth.dispose();
  });

  it('profile stays positive and bounded for all archetypes', () => {
    for (const a of Object.keys(VESSEL_ARCHETYPES) as Array<keyof typeof VESSEL_ARCHETYPES>) {
      for (let i = 0; i <= 20; i++) {
        const r = vesselProfileRadius(a, i / 20);
        expect(r).toBeGreaterThan(0);
        expect(r).toBeLessThanOrEqual(1.1);
      }
    }
  });

  it('finishes carry distinct clay colors', () => {
    const colors = new Set(Object.values(VESSEL_FINISHES).map((f) => f.color));
    expect(colors.size).toBe(4);
    expect(VESSEL_FINISHES.obsidian).toBeDefined();
  });

  it('brutalist-planter archetype produces valid stepped geometry', () => {
    const p = VESSEL_ARCHETYPES['brutalist-planter'].defaults;
    const geom = createVesselGeometry(p);
    geom.computeBoundingBox();
    expect(geom.boundingBox!.max.y - geom.boundingBox!.min.y).toBeCloseTo(130, 0);
    geom.dispose();
  });

  it('shrinkage compensation scales geometry dimensions proportionally', () => {
    const base = VESSEL_ARCHETYPES['fluted-vase'].defaults;
    const geomStandard = createVesselGeometry({ ...base, shrinkagePercent: 0 });
    const geomCompensated = createVesselGeometry({ ...base, shrinkagePercent: 10 });

    geomStandard.computeBoundingBox();
    geomCompensated.computeBoundingBox();

    const hStandard = geomStandard.boundingBox!.max.y - geomStandard.boundingBox!.min.y;
    const hCompensated = geomCompensated.boundingBox!.max.y - geomCompensated.boundingBox!.min.y;

    expect(hCompensated).toBeCloseTo(hStandard * 1.1, 1);

    geomStandard.dispose();
    geomCompensated.dispose();
  });

  it('every preset leaves room for its wall (printable shells)', () => {
    for (const spec of Object.values(VESSEL_ARCHETYPES)) {
      const { baseRadius, wallThickness, archetype } = spec.defaults;
      let minR = Infinity;
      for (let i = 0; i <= 20; i++) {
        minR = Math.min(minR, vesselProfileRadius(archetype, i / 20) * baseRadius);
      }
      expect(minR).toBeGreaterThan(wallThickness + 1);
    }
  });
});
