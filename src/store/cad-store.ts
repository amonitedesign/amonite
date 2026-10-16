import { create } from 'zustand';
import { CADNode, TransformMode, ViewportState, AmoniteProject, PrimitiveType } from '@/lib/cad-types';

interface CADStoreState {
  // Scene objects
  nodes: CADNode[];
  selectedId: string | null;
  transformMode: TransformMode;
  hoveredId: string | null;

  // Viewport & environment
  viewport: ViewportState;
  cameraPresetTrigger: number;
  activePreset: string;

  // Measurement / interaction
  cursorCoords: { x: number; y: number; z: number };
  measurePoints: { a: { x: number; y: number; z: number }; b: { x: number; y: number; z: number } } | null;
  measureActive: boolean;

  // Undo / Redo history
  undoStack: CADNode[][];
  redoStack: CADNode[][];

  // Actions
  addNode: (type: PrimitiveType) => CADNode;
  updateNode: (id: string, updates: Partial<CADNode>) => void;
  updateNodeTransform: (
    id: string,
    position?: Partial<{ x: number; y: number; z: number }>,
    rotation?: Partial<{ x: number; y: number; z: number }>,
    scale?: Partial<{ x: number; y: number; z: number }>
  ) => void;
  removeNode: (id: string) => void;
  duplicateNode: (id: string) => void;
  setSelectedId: (id: string | null) => void;
  setHoveredId: (id: string | null) => void;
  setTransformMode: (mode: TransformMode) => void;
  setViewport: (updates: Partial<ViewportState>) => void;
  setCameraPreset: (preset: string) => void;
  setCursorCoords: (coords: { x: number; y: number; z: number }) => void;
  setMeasurePoints: (pts: { a: { x: number; y: number; z: number }; b: { x: number; y: number; z: number } } | null) => void;
  setMeasureActive: (active: boolean) => void;
  undo: () => void;
  redo: () => void;
  loadProject: (project: AmoniteProject) => void;
  resetScene: () => void;
}

const DEFAULT_VIEWPORT: ViewportState = {
  cameraMode: 'perspective',
  renderStyle: 'shaded',
  gridVisible: true,
  gridSize: 200,
  gridDivisions: 40,
  snapToGrid: true,
  snapStep: 5,
  unit: 'mm',
};

const INITIAL_NODES: CADNode[] = [
  {
    id: 'node-box-1',
    name: 'Base Plate',
    type: 'box',
    position: { x: 0, y: 5, z: 0 },
    rotation: { x: 0, y: 0, z: 0 },
    scale: { x: 1, y: 1, z: 1 },
    dimensions: { width: 60, height: 10, depth: 60 },
    color: '#38bdf8',
    visible: true,
    wireframe: false,
  },
  {
    id: 'node-cyl-2',
    name: 'Mounting Boss',
    type: 'cylinder',
    position: { x: 0, y: 25, z: 0 },
    rotation: { x: 0, y: 0, z: 0 },
    scale: { x: 1, y: 1, z: 1 },
    dimensions: { radius: 15, height: 30, radialSegments: 32 },
    color: '#06b6d4',
    visible: true,
    wireframe: false,
  },
];

export const useCADStore = create<CADStoreState>((set, get) => ({
  nodes: INITIAL_NODES,
  selectedId: 'node-box-1',
  transformMode: 'select',
  hoveredId: null,
  viewport: DEFAULT_VIEWPORT,
  cameraPresetTrigger: 0,
  activePreset: 'iso',
  cursorCoords: { x: 0, y: 0, z: 0 },
  measurePoints: null,
  measureActive: false,
  undoStack: [],
  redoStack: [],

  addNode: (type: PrimitiveType) => {
    const id = `node-${type}-${Date.now()}`;
    const snap = get().viewport.snapStep;
    const count = get().nodes.length;
    const offset = (count % 5) * snap * 2;

    const baseDimensions: CADNode['dimensions'] = {
      box: { width: 40, height: 40, depth: 40 },
      cylinder: { radius: 20, height: 40, radialSegments: 32 },
      sphere: { radius: 25, radialSegments: 32 },
      torus: { radius: 25, tube: 8, radialSegments: 24, tubularSegments: 48 },
      cone: { radius: 20, height: 40, radialSegments: 32 },
      extrusion: { height: 20 },
    }[type];

    const newNode: CADNode = {
      id,
      name: `${type.charAt(0).toUpperCase() + type.slice(1)} ${count + 1}`,
      type,
      position: { x: offset, y: 20, z: offset },
      rotation: { x: 0, y: 0, z: 0 },
      scale: { x: 1, y: 1, z: 1 },
      dimensions: baseDimensions,
      color: '#38bdf8',
      visible: true,
      wireframe: false,
    };

    set((state) => ({
      undoStack: [...state.undoStack.slice(-30), state.nodes],
      redoStack: [],
      nodes: [...state.nodes, newNode],
      selectedId: id,
    }));

    return newNode;
  },

  updateNode: (id, updates) => {
    set((state) => ({
      undoStack: [...state.undoStack.slice(-30), state.nodes],
      redoStack: [],
      nodes: state.nodes.map((n) => (n.id === id ? { ...n, ...updates } : n)),
    }));
  },

  updateNodeTransform: (id, position, rotation, scale) => {
    set((state) => ({
      nodes: state.nodes.map((node) => {
        if (node.id !== id) return node;
        return {
          ...node,
          position: position ? { ...node.position, ...position } : node.position,
          rotation: rotation ? { ...node.rotation, ...rotation } : node.rotation,
          scale: scale ? { ...node.scale, ...scale } : node.scale,
        };
      }),
    }));
  },

  removeNode: (id) => {
    set((state) => ({
      undoStack: [...state.undoStack.slice(-30), state.nodes],
      redoStack: [],
      nodes: state.nodes.filter((n) => n.id !== id),
      selectedId: state.selectedId === id ? null : state.selectedId,
    }));
  },

  duplicateNode: (id) => {
    const target = get().nodes.find((n) => n.id === id);
    if (!target) return;

    const newId = `node-${target.type}-${Date.now()}`;
    const duplicated: CADNode = {
      ...target,
      id: newId,
      name: `${target.name} (Copy)`,
      position: {
        x: target.position.x + 10,
        y: target.position.y,
        z: target.position.z + 10,
      },
    };

    set((state) => ({
      undoStack: [...state.undoStack.slice(-30), state.nodes],
      redoStack: [],
      nodes: [...state.nodes, duplicated],
      selectedId: newId,
    }));
  },

  setSelectedId: (id) => set({ selectedId: id }),
  setHoveredId: (id) => set({ hoveredId: id }),
  setTransformMode: (mode) => set({ transformMode: mode }),
  setViewport: (updates) =>
    set((state) => ({ viewport: { ...state.viewport, ...updates } })),

  setCameraPreset: (preset) =>
    set((state) => ({
      activePreset: preset,
      cameraPresetTrigger: state.cameraPresetTrigger + 1,
    })),

  setCursorCoords: (coords) => set({ cursorCoords: coords }),
  setMeasurePoints: (pts) => set({ measurePoints: pts }),
  setMeasureActive: (active) => set({ measureActive: active }),

  undo: () => {
    const { undoStack, nodes } = get();
    if (undoStack.length === 0) return;
    const previous = undoStack[undoStack.length - 1];
    set((state) => ({
      nodes: previous,
      undoStack: state.undoStack.slice(0, -1),
      redoStack: [nodes, ...state.redoStack],
      selectedId: null,
    }));
  },

  redo: () => {
    const { redoStack, nodes } = get();
    if (redoStack.length === 0) return;
    const next = redoStack[0];
    set((state) => ({
      nodes: next,
      redoStack: state.redoStack.slice(1),
      undoStack: [...state.undoStack, nodes],
      selectedId: null,
    }));
  },

  loadProject: (project) => {
    set((state) => ({
      undoStack: [...state.undoStack.slice(-30), state.nodes],
      redoStack: [],
      nodes: project.nodes,
      viewport: project.viewport || state.viewport,
      selectedId: project.nodes[0]?.id || null,
    }));
  },

  resetScene: () => {
    set((state) => ({
      undoStack: [...state.undoStack.slice(-30), state.nodes],
      redoStack: [],
      nodes: [],
      selectedId: null,
    }));
  },
}));
