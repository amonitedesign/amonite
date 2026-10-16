import { describe, expect, it } from 'vitest';
import * as THREE from 'three';
import {
  analyzeEdges,
  analyzeOverhang,
  countClosedLoops,
  repairMesh,
  signedVolume,
  sliceLoopCounts,
  verifyVesselGeometry,
} from './mesh-verify';
import { createVesselGeometry } from './vessel-geometry';
import { VESSEL_ARCHETYPES } from './vessel-geometry';

function box(w = 10, h = 10, d = 10): THREE.BufferGeometry {
  return new THREE.BoxGeometry(w, h, d);
}

describe('mesh-verify / edge analysis', () => {
  it('passes a closed box: no boundary, no non-manifold, no degenerate', () => {
    expect(analyzeEdges(box())).toEqual({
      boundaryEdges: 0,
      nonManifoldEdges: 0,
      degenerateFaces: 0,
    });
  });

  it('flags an open plane by its boundary loop', () => {
    const stats = analyzeEdges(new THREE.PlaneGeometry(10, 10));
    expect(stats.boundaryEdges).toBeGreaterThan(0);
    expect(stats.nonManifoldEdges).toBe(0);
  });

  it('flags duplicated-face non-manifold edges', () => {
    const g = box();
    const pos = g.getAttribute('position');
    const idx = Array.from(g.getIndex()!.array);
    // Duplicate the first triangle => its 3 edges become non-manifold.
    const dup = new THREE.BufferGeometry();
    dup.setAttribute('position', pos.clone());
    dup.setIndex([...idx, idx[0], idx[1], idx[2]]);
    expect(analyzeEdges(dup).nonManifoldEdges).toBeGreaterThan(0);
  });
});

describe('mesh-verify / normals', () => {
  it('reports positive volume for an outward box', () => {
    expect(signedVolume(box())).toBeGreaterThan(0);
  });

  it('reports negative volume for inverted winding', () => {
    const g = box();
    const idx = Array.from(g.getIndex()!.array);
    const flipped: number[] = [];
    for (let i = 0; i < idx.length; i += 3) flipped.push(idx[i], idx[i + 2], idx[i + 1]);
    const inv = new THREE.BufferGeometry();
    inv.setAttribute('position', g.getAttribute('position').clone());
    inv.setIndex(flipped);
    expect(signedVolume(inv)).toBeLessThan(0);
  });
});

describe('mesh-verify / slice loops', () => {
  it('reads exactly 1 loop per slice for a closed box above its base', () => {
    // Box spans y -5..5; sample the shell band only.
    expect(sliceLoopCounts(box(), -4, 4, 6)).toEqual([1, 1, 1, 1, 1, 1]);
  });

  it('counts two loops for two islands', () => {
    const a = box().translate(-20, 0, 0);
    const b = box().translate(20, 0, 0);
    const merged = mergeBoxesForTest([a, b]);
    expect(sliceLoopCounts(merged, -4, 4, 3)).toEqual([2, 2, 2]);
  });

  it('counts zero loops for empty slices', () => {
    expect(countClosedLoops([])).toBe(0);
  });
});

function mergeBoxesForTest(geoms: THREE.BufferGeometry[]): THREE.BufferGeometry {
  // Minimal concat merge (positions + sequential index) for test fixtures.
  let vTotal = 0;
  let iTotal = 0;
  for (const g of geoms) {
    vTotal += g.getAttribute('position').count;
    iTotal += g.getIndex()!.count;
  }
  const pos = new Float32Array(vTotal * 3);
  const idx = new Uint32Array(iTotal);
  let vo = 0;
  let io = 0;
  for (const g of geoms) {
    pos.set(g.getAttribute('position').array as Float32Array, vo * 3);
    const gi = g.getIndex()!.array;
    for (let i = 0; i < gi.length; i++) idx[io + i] = gi[i] + vo;
    vo += g.getAttribute('position').count;
    io += gi.length;
  }
  const out = new THREE.BufferGeometry();
  out.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  out.setIndex(new THREE.BufferAttribute(idx, 1));
  return out;
}

describe('mesh-verify / overhang', () => {
  it('passes a box (base skipped, walls vertical)', () => {
    // Box spans y -5..5; base band below -4 ignored.
    const { maxOverhangDeg, steepAreaFraction } = analyzeOverhang(box(), -4);
    expect(maxOverhangDeg).toBe(0);
    expect(steepAreaFraction).toBe(0);
  });

  it('flags a downward cone spike', () => {
    // Wide skirt facing down-out: half-angle ~56° from vertical.
    const cone = new THREE.ConeGeometry(30, 20, 24);
    cone.rotateX(Math.PI); // apex down
    cone.translate(0, 20, 0);
    const { steepAreaFraction } = analyzeOverhang(cone, 0);
    expect(steepAreaFraction).toBeGreaterThan(0.02);
  });
});

describe('mesh-verify / full vessel report', () => {
  it('passes the generated fluted vase on all four checks', () => {
    const geom = createVesselGeometry(VESSEL_ARCHETYPES['fluted-vase'].defaults);
    // Hollow vessel: outer + inner wall read 2 loops per slice.
    const report = verifyVesselGeometry(geom, { baseTop: 4, height: 170, expectedLoops: 2 });
    expect(report.triangleCount).toBeGreaterThan(1000);
    expect(report.allPass).toBe(true);
    expect(report.checks.map((c) => c.id)).toEqual([
      'manifold',
      'normals',
      'single-wall',
      'overhang',
    ]);
  });

  it('passes structural checks for every archetype default', () => {
    for (const key of Object.keys(VESSEL_ARCHETYPES)) {
      const preset = VESSEL_ARCHETYPES[key as keyof typeof VESSEL_ARCHETYPES].defaults;
      const geom = createVesselGeometry(preset);
      const report = verifyVesselGeometry(geom, {
        baseTop: preset.wallThickness,
        height: preset.height,
        expectedLoops: 2,
      });
      const byId = Object.fromEntries(report.checks.map((c) => [c.id, c.pass]));
      expect(byId.manifold, `${key} manifold`).toBe(true);
      expect(byId.normals, `${key} normals`).toBe(true);
      expect(byId['single-wall'], `${key} single-wall`).toBe(true);
    }
  });

  it('honestly flags steep shell on flared archetypes (bowls/planters)', () => {
    // Organic bowl flares outward — real down-facing shell the panel must
    // surface, not hide. Fluted vase stays fully self-supporting.
    const bowl = createVesselGeometry(VESSEL_ARCHETYPES['organic-bowl'].defaults);
    const bowlReport = verifyVesselGeometry(bowl, {
      baseTop: 5,
      height: 70,
      expectedLoops: 2,
    });
    expect(bowlReport.steepAreaFraction).toBeGreaterThan(0.02);
    expect(bowlReport.maxOverhangDeg).toBeGreaterThan(45);

    const vase = createVesselGeometry(VESSEL_ARCHETYPES['fluted-vase'].defaults);
    const vaseReport = verifyVesselGeometry(vase, { baseTop: 4, height: 170, expectedLoops: 2 });
    expect(vaseReport.allPass).toBe(true);
  });

  it('fails an open shell with a useful detail string', () => {
    const report = verifyVesselGeometry(new THREE.PlaneGeometry(10, 10), {
      baseTop: 0,
      height: 10,
    });
    expect(report.allPass).toBe(false);
    const manifold = report.checks.find((c) => c.id === 'manifold')!;
    expect(manifold.pass).toBe(false);
    expect(manifold.detail).toMatch(/open edges/);
  });
});

describe('mesh-verify / repair', () => {
  it('welds duplicated vertices and recomputes normals', () => {
    const g = box();
    const pos = g.getAttribute('position').array as Float32Array;
    const doubled = new Float32Array(pos.length * 2);
    doubled.set(pos, 0);
    doubled.set(pos, pos.length);
    const idx = Array.from(g.getIndex()!.array);
    const broken = new THREE.BufferGeometry();
    broken.setAttribute('position', new THREE.BufferAttribute(doubled, 3));
    broken.setIndex([...idx, ...idx.map((i) => i + pos.length / 3)]);
    const { geometry, weldedVertices, notes } = repairMesh(broken);
    expect(weldedVertices).toBeGreaterThan(0);
    expect(notes.length).toBeGreaterThan(0);
    expect(analyzeEdges(geometry).nonManifoldEdges).toBe(0);
  });
});
