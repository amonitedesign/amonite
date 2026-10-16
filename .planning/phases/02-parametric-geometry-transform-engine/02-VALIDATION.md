# Phase 2: Validation Strategy - Parametric Geometry & Transform Engine

**Phase:** 02-parametric-geometry-transform-engine  
**Date:** 2026-10-16  
**Status:** Approved  

## Validation Strategy Overview
Defines automated checks, test criteria, and interactive UAT procedures to verify parametric solids generation, transform gizmo manipulation, numeric inspection, and undo/redo history.

---

## Automated Verification Gates

| Test ID | Gate | Target / Command | Success Criteria |
| :--- | :--- | :--- | :--- |
| **VAL-P2-01** | Static Typecheck | `npx tsc --noEmit` | Clean exit 0; all primitive dimensions and node transforms strictly typed. |
| **VAL-P2-02** | ESLint Code Quality | `npm run lint` | Clean exit 0. |
| **VAL-P2-03** | Production Build | `npm run build` | Turbopack compilation succeeds with all routes intact. |
| **VAL-P2-04** | Primitive Generators | `createGeometryForNode` | Returns valid `BufferGeometry` for box, cylinder, sphere, torus, cone, extrusion. |

---

## Interactive UAT Validation Steps

1. **Solid Primitives Creation:**
   - Click each primitive in toolbar (Box, Cylinder, Sphere, Torus, Extrude).
   - Ensure mesh appears in WebGL viewport and new entry appears in Scene Hierarchy.
2. **Parametric Dimension Inputs:**
   - Select Box, change width from 40mm to 100mm -> mesh widens immediately.
   - Select Cylinder, change radius and height -> mesh regenerates with sharp edges.
3. **Transform Gizmo Operations:**
   - Press `G` (Translate) -> drag axes -> coordinates update in Inspector.
   - Press `R` (Rotate) -> rotate ring -> rotation degrees update in Inspector with 15° snap.
   - Press `S` (Scale) -> drag scale handles -> mesh dimensions scale.
4. **Duplication & Deletion:**
   - Press `Ctrl+D` -> creates offset duplicate with `(Copy)` suffix.
   - Press `Delete` -> removes selected entity from canvas and tree.
   - Press `Ctrl+Z` -> restores deleted entity.
