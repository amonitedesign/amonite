import { describe, expect, it } from 'vitest';
import { exportToSTL } from './stl-exporter';
import type { CADNode } from '../cad-types';

const box: CADNode = {
  id: 'b1',
  name: 'Box',
  type: 'box',
  position: { x: 0, y: 0, z: 0 },
  rotation: { x: 0, y: 0, z: 0 },
  scale: { x: 1, y: 1, z: 1 },
  dimensions: { width: 10, height: 10, depth: 10 },
  color: '#fff',
  visible: true,
  wireframe: false,
};

const hidden: CADNode = { ...box, id: 'h1', visible: false };

describe('stl-exporter', () => {
  it('exports ASCII STL with solid wrappers and facets', async () => {
    const blob = exportToSTL([box], false);
    const text = await blob.text();
    expect(text.startsWith('solid amonite_cad_model')).toBe(true);
    expect(text.trimEnd().endsWith('endsolid amonite_cad_model')).toBe(true);
    expect(text).toContain('facet normal');
    expect(text).toContain('outer loop');
    // BoxGeometry = 12 triangles
    expect(text.match(/facet normal/g)?.length).toBe(12);
  });

  it('skips hidden nodes', async () => {
    const blob = exportToSTL([hidden], false);
    const text = await blob.text();
    expect(text).not.toContain('facet normal');
  });

  it('exports an empty solid for an empty scene', async () => {
    const text = await exportToSTL([], false).text();
    expect(text).toContain('solid amonite_cad_model');
    expect(text).toContain('endsolid amonite_cad_model');
  });

  it('exports binary STL with 84-byte header + 50 bytes/triangle', async () => {
    const blob = exportToSTL([box], true);
    const buf = await blob.arrayBuffer();
    const view = new DataView(buf);
    const triCount = view.getUint32(80, true);
    expect(triCount).toBe(12);
    expect(buf.byteLength).toBe(84 + 12 * 50);
  });

  it('applies node translation to binary vertices', async () => {
    const moved: CADNode = { ...box, position: { x: 100, y: 0, z: 0 } };
    const buf = await exportToSTL([moved], true).arrayBuffer();
    const view = new DataView(buf);
    const vx = view.getFloat32(84 + 12, true); // first vertex x after normal
    // Box corner at ±5 shifted by +100; first emitted facet uses the +5 corner.
    expect(Math.abs(vx - 100)).toBeCloseTo(5, 1);
  });
});
