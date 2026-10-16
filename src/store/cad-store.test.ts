import { beforeEach, describe, expect, it } from 'vitest';
import { useCADStore } from '@/store/cad-store';

function resetStore() {
  useCADStore.setState({
    nodes: [],
    selectedId: null,
    transformMode: 'select',
    hoveredId: null,
    viewport: {
      cameraMode: 'perspective',
      renderStyle: 'shaded',
      gridVisible: true,
      gridSize: 200,
      gridDivisions: 40,
      snapToGrid: true,
      snapStep: 5,
      unit: 'mm',
    },
    cameraPresetTrigger: 0,
    activePreset: 'iso',
    cursorCoords: { x: 0, y: 0, z: 0 },
    measurePoints: null,
    measureActive: false,
    undoStack: [],
    redoStack: [],
  });
}

describe('cad-store / CRUD + history', () => {
  beforeEach(resetStore);

  it('adds one node per primitive type and selects it', () => {
    for (const t of ['box', 'cylinder', 'sphere', 'torus', 'cone', 'extrusion'] as const) {
      const n = useCADStore.getState().addNode(t);
      expect(n.type).toBe(t);
      expect(useCADStore.getState().selectedId).toBe(n.id);
    }
    expect(useCADStore.getState().nodes).toHaveLength(6);
  });

  it('generates unique ids for rapid adds', () => {
    const a = useCADStore.getState().addNode('box');
    const b = useCADStore.getState().addNode('box');
    expect(a.id).not.toBe(b.id);
  });

  it('documents id collision when the clock is frozen in the same ms', async () => {
    const { vi: v } = await import('vitest');
    v.spyOn(Date, 'now').mockReturnValue(123456789);
    const a = useCADStore.getState().addNode('box');
    const b = useCADStore.getState().addNode('box');
    // Known limitation: ids derive from Date.now() only — same-ms adds collide.
    expect(a.id).toBe(b.id);
  });

  it('updates node fields and pushes undo', () => {
    const n = useCADStore.getState().addNode('box');
    useCADStore.getState().updateNode(n.id, { name: 'Renamed', color: '#ff0000' });
    const updated = useCADStore.getState().nodes.find((x) => x.id === n.id)!;
    expect(updated.name).toBe('Renamed');
    expect(useCADStore.getState().undoStack.length).toBeGreaterThan(0);
  });

  it('merges partial transforms without pushing undo', () => {
    const n = useCADStore.getState().addNode('box');
    const depth = useCADStore.getState().undoStack.length;
    useCADStore.getState().updateNodeTransform(n.id, { x: 11 }, { y: 45 }, { x: 2 });
    const updated = useCADStore.getState().nodes.find((x) => x.id === n.id)!;
    expect(updated.position.x).toBe(11);
    expect(updated.position.y).toBe(20); // untouched default
    expect(updated.rotation.y).toBe(45);
    expect(updated.scale.x).toBe(2);
    expect(useCADStore.getState().undoStack.length).toBe(depth);
  });

  it('removes nodes and clears selection', () => {
    const n = useCADStore.getState().addNode('box');
    expect(useCADStore.getState().selectedId).toBe(n.id);
    useCADStore.getState().removeNode(n.id);
    expect(useCADStore.getState().nodes).toHaveLength(0);
    expect(useCADStore.getState().selectedId).toBeNull();
  });

  it('duplicates with +10mm XZ offset and (Copy) suffix', () => {
    const n = useCADStore.getState().addNode('box');
    useCADStore.getState().duplicateNode(n.id);
    const st = useCADStore.getState();
    expect(st.nodes).toHaveLength(2);
    const copy = st.nodes[1];
    expect(copy.name).toContain('(Copy)');
    expect(copy.position.x).toBe(n.position.x + 10);
    expect(copy.position.z).toBe(n.position.z + 10);
    expect(st.selectedId).toBe(copy.id);
  });

  it('undo/redo restores snapshots and is a no-op when empty', () => {
    const st = () => useCADStore.getState();
    expect(st().nodes).toHaveLength(0);
    st().undo(); // no-op
    st().redo(); // no-op
    const n = st().addNode('box');
    expect(st().nodes).toHaveLength(1);
    st().undo();
    expect(st().nodes).toHaveLength(0);
    st().redo();
    expect(st().nodes).toHaveLength(1);
    expect(st().nodes[0].id).toBe(n.id);
  });

  it('caps the undo ring at ~31 entries', () => {
    for (let i = 0; i < 40; i++) useCADStore.getState().addNode('box');
    expect(useCADStore.getState().undoStack.length).toBeLessThanOrEqual(31);
  });

  it('merges viewport updates and bumps camera preset trigger', () => {
    useCADStore.getState().setViewport({ unit: 'in', snapStep: 10 });
    expect(useCADStore.getState().viewport.unit).toBe('in');
    expect(useCADStore.getState().viewport.gridSize).toBe(200); // preserved
    const before = useCADStore.getState().cameraPresetTrigger;
    useCADStore.getState().setCameraPreset('top');
    expect(useCADStore.getState().activePreset).toBe('top');
    expect(useCADStore.getState().cameraPresetTrigger).toBe(before + 1);
  });

  it('loads projects and resets scenes', () => {
    useCADStore.getState().loadProject({
      version: '1.0.0',
      id: 'p1',
      title: 'T',
      created: 1,
      updated: 2,
      viewport: { ...useCADStore.getState().viewport, unit: 'in' },
      nodes: [
        {
          id: 'x',
          name: 'X',
          type: 'sphere',
          position: { x: 0, y: 0, z: 0 },
          rotation: { x: 0, y: 0, z: 0 },
          scale: { x: 1, y: 1, z: 1 },
          dimensions: { radius: 5 },
          color: '#000',
          visible: true,
          wireframe: false,
        },
      ],
    });
    expect(useCADStore.getState().nodes).toHaveLength(1);
    expect(useCADStore.getState().viewport.unit).toBe('in');
    useCADStore.getState().resetScene();
    expect(useCADStore.getState().nodes).toHaveLength(0);
    expect(useCADStore.getState().selectedId).toBeNull();
  });
});
