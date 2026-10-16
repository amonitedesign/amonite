import { describe, expect, it } from 'vitest';
import { createProjectJSON, parseProjectJSON } from './project-io';
import type { CADNode, ViewportState } from '../cad-types';

const viewport: ViewportState = {
  cameraMode: 'perspective',
  renderStyle: 'shaded',
  gridVisible: true,
  gridSize: 200,
  gridDivisions: 40,
  snapToGrid: true,
  snapStep: 5,
  unit: 'mm',
};

const nodes: CADNode[] = [
  {
    id: 'n1',
    name: 'Box',
    type: 'box',
    position: { x: 0, y: 0, z: 0 },
    rotation: { x: 0, y: 0, z: 0 },
    scale: { x: 1, y: 1, z: 1 },
    dimensions: { width: 10, height: 10, depth: 10 },
    color: '#fff',
    visible: true,
    wireframe: false,
  },
];

describe('project-io / native JSON', () => {
  it('creates a versioned project blob that parses back losslessly', async () => {
    const blob = createProjectJSON(nodes, viewport, 'My Project');
    const parsed = JSON.parse(await blob.text());
    expect(parsed.version).toBe('1.0.0');
    expect(parsed.title).toBe('My Project');
    expect(parsed.nodes).toEqual(nodes);
    expect(parsed.viewport).toEqual(viewport);
  });

  it('parses valid project JSON', () => {
    const raw = JSON.stringify({ version: '1.0.0', nodes, viewport });
    expect(parseProjectJSON(raw).nodes).toEqual(nodes);
  });

  it('throws on missing nodes array', () => {
    expect(() => parseProjectJSON('{"version":"1.0.0"}')).toThrow(
      /missing nodes array/
    );
  });

  it('throws on malformed JSON', () => {
    expect(() => parseProjectJSON('{{{')).toThrow();
  });
});
