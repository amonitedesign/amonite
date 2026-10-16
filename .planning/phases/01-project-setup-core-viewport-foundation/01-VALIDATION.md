# Phase 1: Validation Strategy - WebGL Core Viewport Foundation

**Phase:** 01-project-setup-core-viewport-foundation  
**Date:** 2026-10-16  
**Status:** Approved  

## Validation Strategy Overview
This validation strategy defines the test gates, criteria, and operational checks required to verify the successful implementation and stability of Phase 1.

---

## Automated Verification Gates

| Test ID | Gate | Command / Target | Success Criteria |
| :--- | :--- | :--- | :--- |
| **VAL-01** | Static Type Checking | `npx tsc --noEmit` | Clean exit code 0; zero TypeScript compiler errors. |
| **VAL-02** | ESLint Code Quality | `npm run lint` | Clean exit code 0; compliant with Next.js rules. |
| **VAL-03** | Next.js Build | `npm run build` | All routes (`/`, `/sandbox`, `/docs`) build statically without SSR errors. |
| **VAL-04** | WebGL Context Init | `CADCanvas` render | WebGL canvas context creates without fallback warning. |
| **VAL-05** | Asset Integrity | `public/logo-mark.svg` | SVG loads properly in header and watermark. |

---

## Interactive UAT Validation Steps

1. **OrbitControls Functionality:**
   - Left-click drag rotates scene smoothly.
   - Right-click drag pans the camera.
   - Scroll wheel zooms smoothly with damping.
2. **Camera Preset Switching:**
   - Clicking `ISO`, `TOP`, `FRONT`, `RIGHT` moves camera to expected coordinate angles.
   - Toggling `PERSP / ORTHO` preserves camera orientation and target.
3. **Grid & Telemetry HUD:**
   - Moving cursor over canvas updates X, Y, Z coordinate readouts.
   - Snapping moves transform gizmos in exact increments.
4. **History Stack:**
   - Adding or modifying entities enables `Ctrl+Z` undo and `Ctrl+Y` redo.
