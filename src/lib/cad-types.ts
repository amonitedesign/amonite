export type PrimitiveType = 'box' | 'cylinder' | 'sphere' | 'torus' | 'cone' | 'extrusion';

export type TransformMode = 'select' | 'translate' | 'rotate' | 'scale';

export type CameraPreset = 'iso' | 'top' | 'front' | 'right' | 'bottom' | 'back' | 'left';

export type ProjectionMode = 'perspective' | 'orthographic';

export type RenderStyle = 'shaded' | 'wireframe' | 'hidden-line';

export type LengthUnit = 'mm' | 'cm' | 'm' | 'in';

export interface Vector3Data {
  x: number;
  y: number;
  z: number;
}

export interface CADNode {
  id: string;
  name: string;
  type: PrimitiveType;
  position: Vector3Data;
  rotation: Vector3Data; // in degrees
  scale: Vector3Data;
  dimensions: {
    width?: number;
    height?: number;
    depth?: number;
    radius?: number;
    tube?: number;
    radialSegments?: number;
    tubularSegments?: number;
  };
  color: string;
  visible: boolean;
  wireframe: boolean;
  extrusionPoints?: { x: number; y: number }[];
}

export interface ViewportState {
  cameraMode: ProjectionMode;
  renderStyle: RenderStyle;
  gridVisible: boolean;
  gridSize: number; // e.g. 100mm
  gridDivisions: number; // e.g. 20
  snapToGrid: boolean;
  snapStep: number; // e.g. 5mm
  unit: LengthUnit;
}

export interface AmoniteProject {
  version: string;
  id: string;
  title: string;
  created: number;
  updated: number;
  viewport: ViewportState;
  nodes: CADNode[];
}
