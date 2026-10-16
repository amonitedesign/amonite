import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import type { VesselArchetype, VesselFinish, VesselParams } from './cad-types';

export const VESSEL_FINISHES: Record<
  VesselFinish,
  { label: string; color: string; roughness: number; blurb: string }
> = {
  sandstone: {
    label: 'Sandstone',
    color: '#d9c7a8',
    roughness: 0.85,
    blurb: 'Matte, warm, forgiving on layer lines',
  },
  terracotta: {
    label: 'Terracotta',
    color: '#b96a4b',
    roughness: 0.7,
    blurb: 'Fired-clay warmth, the signature look',
  },
  porcelain: {
    label: 'Porcelain',
    color: '#efe9dd',
    roughness: 0.35,
    blurb: 'Smooth glaze-like sheen',
  },
  obsidian: {
    label: 'Obsidian',
    color: '#222226',
    roughness: 0.28,
    blurb: 'Sleek smoked ceramic with subtle specular sheen',
  },
};

export interface VesselArchetypeSpec {
  label: string;
  blurb: string;
  defaults: VesselParams;
}

export const VESSEL_ARCHETYPES: Record<VesselArchetype, VesselArchetypeSpec> = {
  'fluted-vase': {
    label: 'Fluted Vase',
    blurb: 'Tall ribbed vase for dried stems',
    defaults: {
      archetype: 'fluted-vase',
      baseRadius: 45,
      height: 170,
      wallThickness: 4,
      ribCount: 24,
      waveAmplitude: 2,
      twistAngle: 0,
      finish: 'sandstone',
      shrinkagePercent: 0,
    },
  },
  'brutalist-planter': {
    label: 'Brutalist Planter',
    blurb: 'Architectural stepped silhouette with raw presence',
    defaults: {
      archetype: 'brutalist-planter',
      baseRadius: 55,
      height: 130,
      wallThickness: 4.5,
      ribCount: 16,
      waveAmplitude: 0,
      twistAngle: 0,
      finish: 'terracotta',
      shrinkagePercent: 0,
    },
  },
  'organic-bowl': {
    label: 'Organic Bowl',
    blurb: 'Low open bowl for catch-alls',
    defaults: {
      archetype: 'organic-bowl',
      baseRadius: 70,
      height: 70,
      wallThickness: 5,
      ribCount: 0,
      waveAmplitude: 5,
      twistAngle: 0,
      finish: 'porcelain',
      shrinkagePercent: 0,
    },
  },
  'twisted-cylinder': {
    label: 'Twisted Cylinder',
    blurb: 'Spiralling vessel, dramatic in print',
    defaults: {
      archetype: 'twisted-cylinder',
      baseRadius: 50,
      height: 180,
      wallThickness: 4,
      ribCount: 12,
      waveAmplitude: 1.5,
      twistAngle: 120,
      finish: 'obsidian',
      shrinkagePercent: 0,
    },
  },
};

/** Silhouette control points [v, radiusMultiplier] per archetype. */
const PROFILES: Record<VesselArchetype, Array<[number, number]>> = {
  'fluted-vase': [
    [0, 0.55],
    [0.12, 0.72],
    [0.35, 0.95],
    [0.55, 1.0],
    [0.72, 0.78],
    [0.88, 0.58],
    [1, 0.7],
  ],
  'brutalist-planter': [
    [0, 0.75],
    [0.18, 0.75],
    [0.2, 0.95],
    [0.55, 0.95],
    [0.58, 1.1],
    [0.92, 1.1],
    [1, 1.05],
  ],
  'organic-bowl': [
    [0, 0.4],
    [0.25, 0.68],
    [0.55, 0.9],
    [0.8, 1.0],
    [1, 1.02],
  ],
  'twisted-cylinder': [
    [0, 0.92],
    [0.3, 1.0],
    [0.6, 0.96],
    [1, 0.9],
  ],
};

function smoothstep(a: number, b: number, x: number): number {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
}

/** Unitless silhouette multiplier at height fraction v ∈ [0, 1]. Exported for SVG archetype glyphs. */
export function vesselProfileRadius(archetype: VesselArchetype, v: number): number {
  const pts = PROFILES[archetype];
  if (v <= pts[0][0]) return pts[0][1];
  for (let i = 1; i < pts.length; i++) {
    if (v <= pts[i][0]) {
      const [v0, r0] = pts[i - 1];
      const [v1, r1] = pts[i];
      const t = smoothstep(v0, v1, v);
      return r0 + (r1 - r0) * t;
    }
  }
  return pts[pts.length - 1][1];
}

const RIB_DEPTH = 0.055;

/**
 * Builds a hollow, 3D-printable vessel: outer lathe wall, inner lathe wall
 * offset by wall thickness, a rim annulus, and capped floors — merged into a
 * single solid. Ribs, wave, and twist displace every part consistently.
 */
export function createVesselGeometry(p: VesselParams): THREE.BufferGeometry {
  const H = Math.max(10, p.height);
  const t = Math.min(Math.max(1, p.wallThickness), 12);
  const base = Math.max(10, p.baseRadius);
  const ribs = Math.max(0, Math.round(p.ribCount));
  const wave = Math.max(0, p.waveAmplitude);
  const twist = ((p.twistAngle * Math.PI) / 180);

  const radial = Math.max(96, ribs * 4);
  const hseg = 48;
  const R = (v: number) => vesselProfileRadius(p.archetype, v) * base;

  // Displace every vertex consistently: ribs twist up the body, wave ripples it.
  const displace = (geom: THREE.BufferGeometry): void => {
    const pos = geom.getAttribute('position') as THREE.BufferAttribute;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      const z = pos.getZ(i);
      const r0 = Math.hypot(x, z);
      if (r0 < 1e-6) continue;
      const theta = Math.atan2(z, x);
      const v = Math.min(1, Math.max(0, y / H));
      const pattern = ribs > 0 ? Math.cos(ribs * (theta - twist * v)) : 0;
      const rn = (r0 + wave * Math.sin(v * Math.PI * 3)) * (1 + RIB_DEPTH * pattern);
      const s = rn / r0;
      pos.setX(i, x * s);
      pos.setZ(i, z * s);
    }
    pos.needsUpdate = true;
  };

  // Outer wall, base → rim (outward normals).
  const outerPts: THREE.Vector2[] = [];
  for (let i = 0; i <= hseg; i++) {
    const v = i / hseg;
    outerPts.push(new THREE.Vector2(Math.max(R(v), 0.5), v * H));
  }
  const outer = new THREE.LatheGeometry(outerPts, radial);

  // Inner wall, rim → floor (top-to-bottom order flips normals inward).
  const innerPts: THREE.Vector2[] = [];
  for (let i = hseg; i >= 0; i--) {
    const v = i / hseg;
    innerPts.push(
      new THREE.Vector2(Math.max(R(v) - t, 0.4), t + v * (H - t))
    );
  }
  const inner = new THREE.LatheGeometry(innerPts, radial);

  // Rim annulus joining outer and inner top rings.
  const rim = new THREE.RingGeometry(Math.max(R(1) - t, 0.4), R(1), radial);
  rim.rotateX(-Math.PI / 2);
  rim.translate(0, H, 0);

  // Capped floors.
  const floorOuter = new THREE.CircleGeometry(Math.max(R(0), 0.5), radial);
  floorOuter.rotateX(Math.PI / 2);
  const floorInner = new THREE.CircleGeometry(Math.max(R(0) - t, 0.4), radial);
  floorInner.rotateX(-Math.PI / 2);
  floorInner.translate(0, t, 0);

  for (const g of [outer, inner, rim, floorOuter, floorInner]) displace(g);

  const merged = mergeGeometries([outer, inner, rim, floorOuter, floorInner]);
  merged.computeVertexNormals();

  // Kiln shrinkage compensation: scales geometry pre-fire so post-fire dimensions match target.
  const shrinkage = p.shrinkagePercent ?? 0;
  if (shrinkage > 0) {
    const scaleFactor = 1 + shrinkage / 100;
    merged.scale(scaleFactor, scaleFactor, scaleFactor);
  }

  merged.computeBoundingBox();
  return merged;
}
