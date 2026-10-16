/**
 * Adaptive grid subdivision: keep cell count readable by deriving
 * divisions from gridSize / snapStep, clamped to a sane range.
 */
export function gridDivisionsFor(gridSize: number, snapStep: number): number {
  if (snapStep <= 0) return 20;
  const raw = Math.round(gridSize / snapStep);
  return Math.min(100, Math.max(10, raw));
}

/** Snap-step options surfaced in the viewport UI (canonical mm). */
export const SNAP_OPTIONS: number[] = [1, 5, 10, 25];
