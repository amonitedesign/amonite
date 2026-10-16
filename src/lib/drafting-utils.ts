import { snapValue } from "./measurement";

export interface DraftPoint {
  x: number;
  y: number;
}

/** Snap a 2D drafting point (canonical mm) to the active grid step. */
export function snapDraftPoint(
  p: DraftPoint,
  snapStep: number,
  enabled: boolean
): DraftPoint {
  return {
    x: snapValue(p.x, snapStep, enabled),
    y: snapValue(p.y, snapStep, enabled),
  };
}

/** True when first/last points are within tolerance (closed loop). */
export function isClosedLoop(pts: DraftPoint[], tol = 2): boolean {
  if (pts.length < 3) return false;
  const a = pts[0];
  const b = pts[pts.length - 1];
  return Math.hypot(b.x - a.x, b.y - a.y) <= tol;
}

/** Signed polygon area (shoelace); absolute value used for validation. */
export function polygonArea(pts: DraftPoint[]): number {
  if (pts.length < 3) return 0;
  let sum = 0;
  for (let i = 0; i < pts.length; i++) {
    const a = pts[i];
    const b = pts[(i + 1) % pts.length];
    sum += a.x * b.y - b.x * a.y;
  }
  return Math.abs(sum / 2);
}

/** Remove consecutive duplicates within tolerance. */
export function dedupePoints(pts: DraftPoint[], tol = 1e-6): DraftPoint[] {
  const out: DraftPoint[] = [];
  for (const p of pts) {
    const prev = out[out.length - 1];
    if (!prev || Math.hypot(p.x - prev.x, p.y - prev.y) > tol) out.push(p);
  }
  return out;
}

/** Validate a draft polygon before extrusion commit. */
export function validatePolygon(pts: DraftPoint[]): { ok: boolean; reason?: string } {
  const clean = dedupePoints(pts);
  if (clean.length < 3) return { ok: false, reason: "Add at least 3 points" };
  if (polygonArea(clean) <= 1e-6) return { ok: false, reason: "Polygon has zero area" };
  return { ok: true };
}
