import * as THREE from 'three';
import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

export interface MeshCheck {
  id: 'manifold' | 'normals' | 'single-wall' | 'overhang';
  label: string;
  pass: boolean;
  detail: string;
}

export interface MeshReport {
  triangleCount: number;
  boundaryEdges: number;
  nonManifoldEdges: number;
  degenerateFaces: number;
  signedVolume: number;
  /** Closed-loop count per sampled slice height (above the base). */
  sliceLoops: number[];
  /** Largest downward overhang angle from vertical, degrees. */
  maxOverhangDeg: number;
  /** Fraction of shell area steeper than 45° from vertical. */
  steepAreaFraction: number;
  checks: MeshCheck[];
  allPass: boolean;
}

interface TriSoup {
  positions: Float32Array | number[];
  index: ArrayLike<number> | null;
  triCount: number;
}

function soupOf(geom: THREE.BufferGeometry): TriSoup {
  const pos = geom.getAttribute('position');
  if (!pos) return { positions: [], index: null, triCount: 0 };
  return {
    positions: pos.array as Float32Array,
    index: geom.getIndex()?.array ?? null,
    triCount: Math.floor((geom.getIndex()?.count ?? pos.count) / 3),
  };
}

function vert(soup: TriSoup, vi: number): [number, number, number] {
  const p = soup.positions;
  return [p[vi * 3], p[vi * 3 + 1], p[vi * 3 + 2]];
}

function faceVerts(soup: TriSoup, f: number): [number, number, number] {
  if (soup.index) return [soup.index[f * 3], soup.index[f * 3 + 1], soup.index[f * 3 + 2]];
  return [f * 3, f * 3 + 1, f * 3 + 2];
}

export interface EdgeStats {
  boundaryEdges: number;
  nonManifoldEdges: number;
  degenerateFaces: number;
}

/**
 * Canonical vertex ids by quantized position. Indexed meshes (Box, Lathe,
 * merged parts) split shared corners into distinct indices — without this
 * weld step every hard edge reads as a boundary.
 */
function weldIds(soup: TriSoup, tol = 1e-6): number[] {
  const pos = soup.positions;
  const count = pos.length / 3;
  const ids = new Array<number>(count);
  const map = new Map<string, number>();
  for (let i = 0; i < count; i++) {
    const k = `${Math.round(pos[i * 3] / tol)}_${Math.round(pos[i * 3 + 1] / tol)}_${Math.round(pos[i * 3 + 2] / tol)}`;
    let id = map.get(k);
    if (id === undefined) {
      id = map.size;
      map.set(k, id);
    }
    ids[i] = id;
  }
  return ids;
}

/** Hash every edge; boundary = used once, non-manifold = used 3+. */
export function analyzeEdges(geom: THREE.BufferGeometry): EdgeStats {
  const soup = soupOf(geom);
  const canon = weldIds(soup);
  const counts = new Map<string, number>();
  let degenerateFaces = 0;
  const key = (a: number, b: number): string => {
    const ca = canon[a];
    const cb = canon[b];
    return ca < cb ? `${ca}_${cb}` : `${cb}_${ca}`;
  };

  for (let f = 0; f < soup.triCount; f++) {
    const [a, b, c] = faceVerts(soup, f);
    const pa = vert(soup, a);
    const pb = vert(soup, b);
    const pc = vert(soup, c);
    // Degenerate: any two vertices coincident (within float noise).
    const dab = Math.hypot(pa[0] - pb[0], pa[1] - pb[1], pa[2] - pb[2]);
    const dbc = Math.hypot(pb[0] - pc[0], pb[1] - pc[1], pb[2] - pc[2]);
    const dca = Math.hypot(pc[0] - pa[0], pc[1] - pa[1], pc[2] - pa[2]);
    if (dab < 1e-9 || dbc < 1e-9 || dca < 1e-9) {
      degenerateFaces++;
      continue;
    }
    // NaN guard: treat as degenerate so the check fails loudly, not silently.
    if (![pa, pb, pc].every((p) => p.every(Number.isFinite))) {
      degenerateFaces++;
      continue;
    }
    for (const [u, v] of [[a, b], [b, c], [c, a]] as const) {
      const k = key(u, v);
      counts.set(k, (counts.get(k) ?? 0) + 1);
    }
  }

  let boundaryEdges = 0;
  let nonManifoldEdges = 0;
  for (const n of counts.values()) {
    if (n === 1) boundaryEdges++;
    else if (n > 2) nonManifoldEdges++;
  }
  return { boundaryEdges, nonManifoldEdges, degenerateFaces };
}

/** Signed volume via divergence theorem; negative ⇒ globally inverted winding. */
export function signedVolume(geom: THREE.BufferGeometry): number {
  const soup = soupOf(geom);
  let vol = 0;
  for (let f = 0; f < soup.triCount; f++) {
    const [ia, ib, ic] = faceVerts(soup, f);
    const [ax, ay, az] = vert(soup, ia);
    const [bx, by, bz] = vert(soup, ib);
    const [cx, cy, cz] = vert(soup, ic);
    vol +=
      ax * (by * cz - bz * cy) -
      ay * (bx * cz - bz * cx) +
      az * (bx * cy - by * cx);
  }
  return vol / 6;
}

interface Seg {
  ax: number;
  ay: number;
  bx: number;
  by: number;
}

/** Intersect triangle ring (x, z at plane y) → segment list in the XZ plane. */
function sliceSegments(soup: TriSoup, y: number): Seg[] {
  const segs: Seg[] = [];
  const EPS = 1e-7;
  for (let f = 0; f < soup.triCount; f++) {
    const [ia, ib, ic] = faceVerts(soup, f);
    const pa = vert(soup, ia);
    const pb = vert(soup, ib);
    const pc = vert(soup, ic);
    const da = pa[1] - y;
    const db = pb[1] - y;
    const dc = pc[1] - y;
    // Skip triangles fully coplanar with the slice.
    if (Math.abs(da) < EPS && Math.abs(db) < EPS && Math.abs(dc) < EPS) continue;
    const pts: Array<[number, number]> = [];
    const edges: Array<[[number, number, number], [number, number, number]]> = [
      [pa, pb],
      [pb, pc],
      [pc, pa],
    ];
    for (const [[x1, y1, z1], [x2, y2, z2]] of edges) {
      const d1 = y1 - y;
      const d2 = y2 - y;
      if ((d1 > EPS && d2 < -EPS) || (d1 < -EPS && d2 > EPS)) {
        const t = d1 / (d1 - d2);
        pts.push([x1 + (x2 - x1) * t, z1 + (z2 - z1) * t]);
      } else if (Math.abs(d1) < EPS && Math.abs(d2) >= EPS) {
        pts.push([x1, z1]);
      }
    }
    if (pts.length === 2) {
      segs.push({ ax: pts[0][0], ay: pts[0][1], bx: pts[1][0], by: pts[1][1] });
    } else if (pts.length > 2) {
      // Vertex exactly on the plane is visited twice (first and last
      // entry coincide) — collapse back to the single segment.
      const uniq = pts.filter(
        (p, i) => pts.findIndex((q) => Math.hypot(q[0] - p[0], q[1] - p[1]) < 1e-9) === i
      );
      if (uniq.length === 2) {
        segs.push({ ax: uniq[0][0], ay: uniq[0][1], bx: uniq[1][0], by: uniq[1][1] });
      }
    }
  }
  return segs;
}

/** Count closed loops among segments via union-find on quantized endpoints. */
export function countClosedLoops(segs: Seg[]): number {
  if (segs.length === 0) return 0;
  const Q = 1e-3;
  const id = new Map<string, number>();
  const key = (x: number, y: number): string => `${Math.round(x / Q)}_${Math.round(y / Q)}`;
  const parent: number[] = [];
  const degree: number[] = [];
  const find = (x: number): number => {
    while (parent[x] !== x) {
      parent[x] = parent[parent[x]];
      x = parent[x];
    }
    return x;
  };
  const node = (x: number, y: number): number => {
    const k = key(x, y);
    let n = id.get(k);
    if (n === undefined) {
      n = parent.length;
      id.set(k, n);
      parent.push(n);
      degree.push(0);
    }
    return n;
  };
  const union = (a: number, b: number): void => {
    const ra = find(a);
    const rb = find(b);
    if (ra !== rb) parent[ra] = rb;
  };
  for (const s of segs) {
    const a = node(s.ax, s.ay);
    const b = node(s.bx, s.by);
    degree[a]++;
    degree[b]++;
    union(a, b);
  }
  // A closed loop = component where every endpoint has degree 2.
  const compDegOk = new Map<number, boolean>();
  const compSeen = new Map<number, boolean>();
  for (let i = 0; i < parent.length; i++) {
    const r = find(i);
    compSeen.set(r, true);
    if (degree[i] !== 2) compDegOk.set(r, false);
    else if (!compDegOk.has(r)) compDegOk.set(r, true);
  }
  let loops = 0;
  for (const [r, seen] of compSeen) {
    if (seen && compDegOk.get(r)) loops++;
  }
  return loops;
}

/**
 * Sample slice heights between yLo and yHi; returns closed-loop counts.
 * A vase-mode body must read exactly [1] at every sampled height.
 */
export function sliceLoopCounts(
  geom: THREE.BufferGeometry,
  yLo: number,
  yHi: number,
  samples = 12
): number[] {
  const soup = soupOf(geom);
  const out: number[] = [];
  for (let i = 0; i < samples; i++) {
    const y = yLo + ((i + 0.5) / samples) * (yHi - yLo);
    out.push(countClosedLoops(sliceSegments(soup, y)));
  }
  return out;
}

export interface OverhangStats {
  maxOverhangDeg: number;
  steepAreaFraction: number;
}

/** Downward-facing shell steeper than 45° from vertical needs support.
 *  Faces entirely below yLo (the printed base) are skipped. */
export function analyzeOverhang(geom: THREE.BufferGeometry, yLo = 0): OverhangStats {
  const soup = soupOf(geom);
  const COS45 = Math.SQRT1_2;
  let maxDeg = 0;
  let steepArea = 0;
  let totalArea = 0;
  for (let f = 0; f < soup.triCount; f++) {
    const [ia, ib, ic] = faceVerts(soup, f);
    const [ax, ay, az] = vert(soup, ia);
    const [bx, by, bz] = vert(soup, ib);
    const [cx, cy, cz] = vert(soup, ic);
    if (ay < yLo && by < yLo && cy < yLo) continue;
    const ux = bx - ax;
    const uy = by - ay;
    const uz = bz - az;
    const vx = cx - ax;
    const vy = cy - ay;
    const vz = cz - az;
    // Face normal + area (0.5 * |u × v|).
    const nx = uy * vz - uz * vy;
    const ny = uz * vx - ux * vz;
    const nz = ux * vy - uy * vx;
    const len = Math.hypot(nx, ny, nz);
    if (len < 1e-12) continue;
    const area = len / 2;
    totalArea += area;
    const nyN = ny / len;
    if (nyN < -COS45) {
      steepArea += area;
      // Overhang angle from vertical: acos(ny) − 90° (down face = 90°).
      const deg = (Math.acos(Math.max(-1, Math.min(1, nyN))) * 180) / Math.PI - 90;
      if (deg > maxDeg) maxDeg = deg;
    }
  }
  return {
    maxOverhangDeg: Math.round(maxDeg * 10) / 10,
    steepAreaFraction: totalArea > 0 ? steepArea / totalArea : 0,
  };
}

export interface VerifyOptions {
  /** Base occupies y ∈ [0, baseTop]; slices start above it. */
  baseTop?: number;
  /** Total height; slices end just below the rim. */
  height?: number;
  /** Closed loops expected per slice: 1 for solid bodies, 2 for hollow
   *  vessels (outer + inner wall — slicers spiralize the outer contour). */
  expectedLoops?: number;
}

/** Full vase-mode printability report for one merged solid. */
export function verifyVesselGeometry(
  geom: THREE.BufferGeometry,
  opts: VerifyOptions = {}
): MeshReport {
  const soup = soupOf(geom);
  const { boundaryEdges, nonManifoldEdges, degenerateFaces } = analyzeEdges(geom);
  const vol = signedVolume(geom);
  const baseTop = opts.baseTop ?? 4;
  const height = opts.height ?? 170;
  const sliceLoops =
    soup.triCount > 0 ? sliceLoopCounts(geom, baseTop + 1, Math.max(baseTop + 2, height - 1)) : [];
  const { maxOverhangDeg, steepAreaFraction } = analyzeOverhang(geom, baseTop);

  const manifoldPass = boundaryEdges === 0 && nonManifoldEdges === 0 && degenerateFaces === 0;
  const normalsPass = vol > 0;
  const expected = opts.expectedLoops ?? 1;
  const singleWallPass = sliceLoops.length > 0 && sliceLoops.every((n) => n === expected);
  const overhangPass = steepAreaFraction < 0.02;

  const checks: MeshCheck[] = [
    {
      id: 'manifold',
      label: 'Watertight manifold',
      pass: manifoldPass,
      detail:
        manifoldPass
          ? 'Closed solid · no boundary edges'
          : `${boundaryEdges} open edges · ${nonManifoldEdges} non-manifold · ${degenerateFaces} degenerate`,
    },
    {
      id: 'normals',
      label: 'Outward normals',
      pass: normalsPass,
      detail: normalsPass ? 'Positive signed volume' : 'Inverted winding — run Repair',
    },
    {
      id: 'single-wall',
      label: 'Single contour / slice',
      pass: singleWallPass,
      detail:
        sliceLoops.length === 0
          ? 'No slices sampled'
          : singleWallPass
            ? `${sliceLoops.length}/${sliceLoops.length} slices · ${expected} loop${expected > 1 ? 's' : ''}`
            : `Slices read [${sliceLoops.join(', ')}] — want all ${expected}s`,
    },
    {
      id: 'overhang',
      label: 'Overhang ≤ 45°',
      pass: overhangPass,
      detail:
        overhangPass
          ? `Max ${maxOverhangDeg}° · self-supporting`
          : `Max ${maxOverhangDeg}° · ${(steepAreaFraction * 100).toFixed(1)}% steep shell`,
    },
  ];

  return {
    triangleCount: soup.triCount,
    boundaryEdges,
    nonManifoldEdges,
    degenerateFaces,
    signedVolume: vol,
    sliceLoops,
    maxOverhangDeg,
    steepAreaFraction,
    checks,
    allPass: checks.every((c) => c.pass),
  };
}

export interface RepairResult {
  geometry: THREE.BufferGeometry;
  weldedVertices: number;
  notes: string[];
}

/**
 * Best-effort repair: weld near-duplicate vertices, drop degenerates
 * implicitly via merge, recompute normals. Our generator is correct by
 * construction, so this is the safety path for imported/edge-case shells.
 */
export function repairMesh(geom: THREE.BufferGeometry, tolerance = 1e-4): RepairResult {
  const before = geom.getAttribute('position')?.count ?? 0;
  const beforeTris = (geom.getIndex()?.count ?? before) / 3;
  const welded = mergeVertices(geom.clone(), tolerance);
  // Drop exactly-duplicated faces (coincident shells from bad merges):
  // hash sorted welded-index triples, keep the first of each.
  const idx = welded.getIndex();
  let droppedFaces = 0;
  if (idx) {
    const seen = new Set<string>();
    const keep: number[] = [];
    const arr = idx.array;
    for (let f = 0; f < arr.length; f += 3) {
      const tri = [arr[f], arr[f + 1], arr[f + 2]].sort((a, b) => a - b).join('_');
      if (seen.has(tri)) {
        droppedFaces++;
        continue;
      }
      seen.add(tri);
      keep.push(arr[f], arr[f + 1], arr[f + 2]);
    }
    welded.setIndex(keep);
  }
  welded.computeVertexNormals();
  const after = welded.getAttribute('position')?.count ?? 0;
  const notes: string[] = [];
  if (before - after > 0) notes.push(`Welded ${before - after} duplicate vertices`);
  if (droppedFaces > 0) notes.push(`Removed ${droppedFaces} duplicated faces`);
  if (notes.length === 0) notes.push('No duplicate vertices found');
  notes.push('Recomputed normals');
  void beforeTris;
  return { geometry: welded, weldedVertices: Math.max(0, before - after), notes };
}
