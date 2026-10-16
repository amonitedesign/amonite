# Phase 1: Project Setup & Core Viewport Foundation - Technical Research

**Phase:** 01-project-setup-core-viewport-foundation  
**Date:** 2026-10-16  
**Status:** Complete  

## Executive Technical Summary
Phase 1 establishes the foundational infrastructure for **Amonite**, an industrial-grade browser CAD/CAM micro-SaaS. The public repository requires a responsive client-side WebGL canvas capable of hardware-accelerated 3D solids manipulation, isometric/orthographic camera projection, technical grid snapping, and high-frequency decoupled state management.

---

## 1. Core Framework & Rendering Engine Selection

### Next.js 16 (App Router) + React 19
- **Turbopack & App Router:** Native support for static route generation (`/`, `/sandbox`, `/docs`), instant HMR, and zero-auth local execution.
- **Client Boundary (`'use client'`):** The CAD canvas and WebGL renderer must run strictly on the client (`window`, `HTMLCanvasElement`, WebGL context). Client boundaries isolate browser DOM/GPU interactions from Next.js server components.

### Three.js Direct Canvas Manager vs. React Three Fiber (R3F)
- **Investigation:** Direct Three.js WebGL canvas manager with React refs was chosen over R3F for this phase:
  1. **React 19 Compatibility:** Direct Three.js avoids peer-dependency conflicts with React 19.
  2. **Render Loop Control:** Continuous 60/120fps animation loop (`requestAnimationFrame`) with direct matrix mutation eliminates React reconciler overhead during high-frequency mouse drags and gizmo transforms.
  3. **Controls Integration:** Clean event listener binding for `OrbitControls` and `TransformControls` with mutual exclusion (`dragging-changed` disables orbit during transform manipulation).

---

## 2. Camera System & Projection Architecture

### Perspective vs. Orthographic Duality
- **Perspective Camera:** Field of View = 45°, near = 0.1, far = 2000. Provides natural human visual depth cues for model inspection.
- **Orthographic Camera:** Frustum size = 250 with aspect ratio scaling (`frustumSize * aspect / 2`). Eliminates perspective foreshortening, crucial for engineering drafting, dimensions, and manufacturing alignment.
- **Synchronized Camera Switching:**
  - When switching between Perspective and Orthographic modes, position, quaternion orientation, and orbit target (`target.copy(target)`) are preserved so the model stays centered.

### Standard CAD Orientation Presets
Calculated camera positions relative to orbit target `(0, 15, 0)` with distance `R = 180mm`:
- **Isometric (ISO):** `(R * 0.7, R * 0.6, R * 0.7)` — standard trimetric engineering angle.
- **Top (+Y):** `(0, R, 0.001)` — looking straight down onto X-Z ground plane.
- **Front (+Z):** `(0, 15, R)` — looking at the front elevation.
- **Right (+X):** `(R, 15, 0)` — looking at the side profile.
- **Bottom / Back / Left:** Inverted axial offsets.

---

## 3. High-Frequency State Store (Zustand)

### Decoupled State vs. React Render Loops
- Standard React state causes full sub-tree re-renders on every mouse move.
- **Zustand Solution:** Viewport cursor telemetry (`cursorCoords: { x, y, z }`) and active node transforms are dispatched through atomic setters.
- **Undo / Redo Buffer:** Maintains immutable snapshots of `CADNode[]` with 30-step history. Key bindings (`Ctrl+Z`, `Ctrl+Y`) restore previous geometry states instantaneously.

---

## 4. Grid System, Snapping & Coordinate Frames

### Right-Handed Cartesian Frame
- **X (Red):** Lateral width
- **Y (Green):** Elevation height
- **Z (Blue):** Longitudinal depth

### Technical Grid & Snapping
- **Grid Helper:** 240mm width with 48 subdivisions (5mm grid cell resolution).
- **Transform Snapping:** When `snapToGrid` is active, `TransformControls` applies:
  - `translationSnap`: 5mm step (configurable: 1mm, 5mm, 10mm, 25mm).
  - `rotationSnap`: 15° step (`Math.PI / 12`).
  - `scaleSnap`: 0.1 increments.

---

## 5. Memory Management & WebGL Context Lifecycle

To prevent WebGL context loss or memory leaks during navigation:
- `renderer.dispose()` called on unmount.
- Window resize listeners removed on cleanup.
- Raycaster event listeners detached from container.
- Geometries and materials disposed upon node deletion.

---

## Validation Architecture

1. **Static Typecheck:** Run `npx tsc --noEmit` across all types, stores, and components.
2. **ESLint Verification:** Run `npm run lint` for Next.js App Router rules.
3. **Production Build Validation:** Run `npm run build` to guarantee client boundaries, Turbopack packaging, and zero SSR hydration mismatches.
4. **Interactive Sandbox Verification:** Verify WebGL context initialization, OrbitControls rotation, camera preset toggling, and coordinate telemetry.
