import { describe, expect, it } from 'vitest';
import * as THREE from 'three';
import { createAmmoniteSpiralGeometry, createGeometryForNode } from './geometry-engine';
import type { CADNode } from './cad-types';

function node(overrides: Partial<CADNode> = {}): CADNode {
  return {
    id: 'test-1',
    name: 'Test',
    type: 'box',
    position: { x: 0, y: 0, z: 0 },
    rotation: { x: 0, y: 0, z: 0 },
    scale: { x: 1, y: 1, z: 1 },
    dimensions: {},
    color: '#ffffff',
    visible: true,
    wireframe: false,
    ...overrides,
  };
}

describe('geometry-engine', () => {
  it('builds a box with explicit dims', () => {
    const g = createGeometryForNode(
      node({ type: 'box', dimensions: { width: 10, height: 20, depth: 30 } })
    );
    g.computeBoundingBox();
    const size = new THREE.Vector3();
    g.boundingBox!.getSize(size);
    expect(size.x).toBeCloseTo(10, 5);
    expect(size.y).toBeCloseTo(20, 5);
    expect(size.z).toBeCloseTo(30, 5);
  });

  it('builds cylinder / sphere / cone / torus without throwing', () => {
    for (const n of [
      node({ type: 'cylinder', dimensions: { radius: 10, height: 20, radialSegments: 16 } }),
      node({ type: 'sphere', dimensions: { radius: 10, radialSegments: 16 } }),
      node({ type: 'cone', dimensions: { radius: 10, height: 20, radialSegments: 16 } }),
      node({
        type: 'torus',
        dimensions: { radius: 20, tube: 5, radialSegments: 12, tubularSegments: 24 },
      }),
    ]) {
      const g = createGeometryForNode(n);
      expect(g.getAttribute('position').count).toBeGreaterThan(0);
    }
  });

  it('builds extrusions from custom points with depth', () => {
    const g = createGeometryForNode(
      node({
        type: 'extrusion',
        dimensions: { height: 10 },
        extrusionPoints: [
          { x: 0, y: 0 },
          { x: 10, y: 0 },
          { x: 10, y: 10 },
          { x: 0, y: 10 },
        ],
      })
    );
    expect(g.getAttribute('position').count).toBeGreaterThan(0);
  });

  it('falls back to a 20mm box for unknown types', () => {
    const g = createGeometryForNode(node({ type: 'nope' as never }));
    g.computeBoundingBox();
    const size = new THREE.Vector3();
    g.boundingBox!.getSize(size);
    expect(size.x).toBeCloseTo(20, 5);
  });

  it('generates a finite ammonite spiral spline', () => {
    const g = createAmmoniteSpiralGeometry();
    const pos = g.getAttribute('position');
    expect(pos.count).toBe(301);
    for (let i = 0; i < pos.count; i++) {
      expect(Number.isFinite(pos.getX(i))).toBe(true);
      expect(Number.isFinite(pos.getY(i))).toBe(true);
      expect(Number.isFinite(pos.getZ(i))).toBe(true);
    }
  });
});
