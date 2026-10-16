import { describe, expect, it } from 'vitest';
import { exportToSVG, parseSVGPaths } from './svg-parser';
import type { CADNode } from '../cad-types';

function box(id = 'b1', x = 0): CADNode {
  return {
    id,
    name: 'Box',
    type: 'box',
    position: { x, y: 0, z: 0 },
    rotation: { x: 0, y: 0, z: 0 },
    scale: { x: 1, y: 1, z: 1 },
    dimensions: { width: 10, height: 10, depth: 10 },
    color: '#fff',
    visible: true,
    wireframe: false,
  };
}

describe('svg-parser', () => {
  it('exports a valid SVG doc with grid + geometry', async () => {
    const text = await exportToSVG([box()]).text();
    expect(text).toContain('<svg');
    expect(text).toContain('cad-geom');
    expect(text).toContain('<rect');
    expect(text.trimEnd().endsWith('</svg>')).toBe(true);
  });

  it('renders cylinders as circles and skips hidden nodes', async () => {
    const cyl: CADNode = { ...box(), type: 'cylinder', dimensions: { radius: 10 } };
    const hidden: CADNode = { ...box('h'), visible: false };
    const text = await exportToSVG([cyl, hidden]).text();
    expect(text).toContain('<circle');
    expect(text.match(/class="cad-geom"/g)?.length).toBe(1);
  });

  it('parses polyline points attributes with -50 offset', () => {
    const svg = `<svg><polyline points="60,70 80,90 100,110" /></svg>`;
    expect(parseSVGPaths(svg)).toEqual([
      { x: 10, y: 20 },
      { x: 30, y: 40 },
      { x: 50, y: 60 },
    ]);
  });

  it('falls back to a 6-point star when no parseable points', () => {
    const pts = parseSVGPaths('<svg></svg>');
    expect(pts).toHaveLength(6);
  });
});
