# Phase 2: Parametric Geometry & Transform Engine - Technical Research

**Phase:** 02-parametric-geometry-transform-engine  
**Date:** 2026-10-16  
**Status:** Complete  

## Executive Technical Summary
Phase 2 builds the core geometric engine of Amonite CAD. It provides engineers with parametric solid primitive generation (Cuboid, Cylinder, Sphere, Torus, Cone, and 2D Polygon Extrusion), direct manipulation transform gizmos (Translate, Rotate, Scale) with grid snap calculations, real-time numeric property inspection, and multi-object scene tree hierarchy.

---

## 1. Parametric Geometry Lifecycle & Memory Safety

### BufferGeometry Regeneration
When a user adjusts dimensions in the inspector (e.g., changing cylinder radius from 20mm to 35mm, or box depth from 40mm to 80mm):
1. **Disposal:** The previous `mesh.geometry` and associated `edges.geometry` must be disposed (`geometry.dispose()`) to prevent GPU memory leaks.
2. **Re-creation:** New `BufferGeometry` is created via `createGeometryForNode(node)`.
3. **Re-binding:** The mesh's geometry is replaced, bounding spheres/boxes recomputed (`computeBoundingBox()`, `computeBoundingSphere()`), and `EdgesGeometry` re-generated for sharp technical edge lines.
4. **Clamping & Validation:** All dimensions must enforce non-zero positive constraints (`width >= 1mm`, `radius >= 0.5mm`, `segments >= 3`).

### 2D Extrusion Solid Generation
- Uses Three.js `Shape` and `ExtrudeGeometry`.
- Supports arbitrary 2D vector coordinate arrays (`{ x: number, y: number }[]`).
- Parametric extrusion depth, bevel size, and bevel segments for realistic chamfered edges.

---

## 2. Direct Manipulation Transform Gizmos (TransformControls)

### Modes & Coordinates
- **Translate (`'translate'` / Hotkey `G`):**
  - Axis arrows for X (Red), Y (Green), Z (Blue) plus planar handles (XY, XZ, YZ).
  - Snap integration: `transform.setTranslationSnap(viewport.snapStep)` (1mm, 5mm, 10mm, 25mm).
- **Rotate (`'rotate'` / Hotkey `R`):**
  - Rotation rings for pitch (X), yaw (Y), roll (Z).
  - Snap integration: `transform.setRotationSnap(THREE.MathUtils.degToRad(15))` (15° engineering step).
- **Scale (`'scale'` / Hotkey `S`):**
  - Axial cubes for non-uniform dimension stretch, center cube for uniform scaling.
  - Snap integration: `transform.setScaleSnap(0.1)`.

### Bidirectional Synchronization
- When user drags the 3D gizmo, `objectChange` events dispatch updated coordinates to the Zustand store, immediately reflecting in the Numeric Inspector HUD.
- Conversely, when user types a value into the Inspector (e.g. `X = 50.0mm`), the Zustand setter updates `node.position.x`, which moves the Three.js mesh and snaps the gizmo to the new position.

---

## 3. Entity Duplication & Scene Graph Management

### Duplication Protocol (Hotkey `Ctrl+D`)
- Clones all properties of `selectedNode`.
- Generates unique ID `node-${type}-${Date.now()}`.
- Increments label: `${original.name} (Copy)`.
- Applies spatial offset `position.x + snapStep`, `position.z + snapStep` to avoid z-fighting and clarify selection.
- Sets duplicated node as the active selection.

### Deletion Protocol (Hotkey `Delete` / `Backspace`)
- Removes node from `nodes[]` array in Zustand.
- Disposes Three.js mesh, edges, and materials.
- Clears `selectedId` if deleted node was active.
- Pushes prior state to `undoStack` (supporting instant `Ctrl+Z` recovery).

---

## 4. Shading Modes & Visual Styling

- **Solid Shaded:** `MeshStandardMaterial` with roughness = 0.35, metalness = 0.25, rendered with directional studio key light and cyan fill light.
- **Wireframe Overlay:** Solid shaded body with cyan `LineSegments` edge outlines for CAD clarity.
- **Pure Wireframe:** `material.wireframe = true` displaying underlying triangular tessellation.

---

## Validation Architecture

1. **Automated Compiler & Linter Gate:**
   - `npx tsc --noEmit` exits 0.
   - `npm run lint` exits 0.
2. **Build Gate:**
   - `npm run build` compiles without SSR or hydration errors.
3. **Parametric Verification:**
   - Test dimension adjustments on all 6 primitive types.
   - Verify transform gizmo operates in Translate, Rotate, Scale modes.
   - Verify grid snapping snaps coordinates to active step.
   - Verify duplication and deletion.
