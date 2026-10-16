import { describe, expect, it } from 'vitest';
import { exportToDXF, parseDXF } from './dxf-parser';
import type { CADNode } from '../cad-types';

function box(id = 'b1'): CADNode {
  return {
    id,
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
}

describe('dxf-parser', () => {
  it('exports R12 header with mm units and layer table', async () => {
    const text = await exportToDXF([box()]).text();
    expect(text).toContain('AC1009');
    expect(text).toContain('$INSUNITS');
    expect(text).toContain('AMONITE_GEOMETRY');
    expect(text.trimEnd().endsWith('EOF')).toBe(true);
  });

  it('exports 12 LINE edges for a cuboid', async () => {
    const text = await exportToDXF([box()]).text();
    expect(text.match(/^LINE$/gm)?.length).toBe(12);
  });

  it('exports rings + struts for a cylinder', async () => {
    const cyl: CADNode = {
      ...box(),
      type: 'cylinder',
      dimensions: { radius: 10, height: 20 },
    };
    const text = await exportToDXF([cyl]).text();
    // 16 segs * 2 rings + 4 struts = 36 lines
    expect(text.match(/^LINE$/gm)?.length).toBe(36);
  });

  it('exports a POINT marker for unsupported types and skips hidden', async () => {
    const sphere: CADNode = { ...box(), type: 'sphere' };
    const hidden: CADNode = { ...box(), id: 'h', visible: false };
    const text = await exportToDXF([sphere, hidden]).text();
    expect(text).toContain('POINT');
    expect(text.match(/^LINE$/gm)).toBeNull();
  });

  it('parses LINE start points back to 2D coords', () => {
    const dxf = [
      '0', 'SECTION', '2', 'ENTITIES',
      '0', 'LINE', '8', 'AMONITE_GEOMETRY',
      '10', '1.0', '20', '2.0', '30', '0.0',
      '11', '3.0', '21', '4.0', '31', '0.0',
      '0', 'LINE', '8', 'AMONITE_GEOMETRY',
      '10', '5.0', '20', '6.0', '30', '0.0',
      '11', '7.0', '21', '8.0', '31', '0.0',
      '0', 'LINE', '8', 'AMONITE_GEOMETRY',
      '10', '9.0', '20', '10.0', '30', '0.0',
      '11', '11.0', '21', '12.0', '31', '0.0',
      '0', 'ENDSEC', '0', 'EOF',
    ].join('\n');
    expect(parseDXF(dxf)).toEqual([
      { x: 1, y: 2 },
      { x: 5, y: 6 },
      { x: 9, y: 10 },
    ]);
  });

  it('falls back to a default square when fewer than 3 points', () => {
    expect(parseDXF('0\nEOF\n')).toHaveLength(4);
  });
});
