# Studio Viewport Fix Record — 2026-10-16

> The `/sandbox` studio is in its correct, best state as of this record.
> This document marks what was wrong, what proved it, and what fixed it —
> so the same class of bug is caught by workflow, not luck.

## Symptom

The studio viewport showed a giant dark mound (the pedestal disc, ~60% of
frame width) with **no vessel at all**, and the right panel's
"Generate Etsy Collection" CTA was clipped below the viewport edge.
No console errors. Sliders responded (panel values changed). Unit tests green.

## Diagnosis (evidence, in order)

1. **Screenshot** (`/sandbox` @1440×900): mound centered, empty space above,
   CTA cut off at bottom edge.
2. **Geometry scale verified correct**: `createVesselGeometry` builds
   y 0–170 mm, radius ≤ base — corroborated by passing
   `vessel-geometry.test.ts` and the SVG archetype glyphs rendering
   correctly in the left panel.
3. **Camera math checked**: initial camera (dist ≈ 263, fov 34°) overfilled,
   but the framing helper `vesselFrame()` (dist ≈ 297–340) should have
   composed correctly — yet the vessel was absent at *any* distance.
4. **Runtime errors: none.** No `pageerror`, no console errors — ruling out
   exceptions in the mesh-sync path.
5. **Live scene traversal (decisive)**: only 2 meshes existed —
   pedestal (`bb ±84`) and ground plane. Zero vessel group, while the store
   held a visible `vessel-1` node. The mesh was never in the scene;
   the UI and the store had silently diverged.

## Root cause

**React StrictMode double-mount orphaned the vessel group.**
`CADCanvas` init effect creates scene A; mesh-sync registers the vessel
group into `meshesMapRef` parented to A. StrictMode unmounts; cleanup only
disposed the renderer. The re-run created scene B, but the registry still
held A-parented groups, and the sync effect's update branch never
re-added them to B. Pedestal/ground (recreated in init) rendered; the
vessel lived on in the disposed scene. Slider edits mutated the orphan —
which is why the panel "worked" while the canvas stayed empty.

Contributors: init camera never used `vesselFrame()` (only preset changes
did), and the right panel's `max-h` ignored its own 128 px top offset.

## Fix (`src/components/cad/cad-canvas.tsx`, `vessel-studio.tsx`, `vessel-archetypes.tsx`)

- Init-effect teardown now disposes all geometries/materials, removes
  groups from the scene, and clears the mesh registry.
- Re-parent guard in the sync loop: `if (group.parent !== scene) scene.add(group)`.
- Camera framing extracted to `applyCameraPreset()`, shared by init and
  preset changes; init frames via `vesselFrame` with headroom
  (`max(260, h*2.0)`, target `h*0.46`).
- Right panel: `max-h-[calc(100vh-148px)]` (exact fit) + sticky Etsy CTA
  footer so the money button never scrolls away. Same overflow guard on
  the left archetype panel.

## Verification

- Screenshot: full fluted sandstone vase composed on pedestal, rim visible,
  CTA + STL download in view without scrolling.
- `typecheck` + `lint` clean; minute 55/55; primary 34/34.
- E2E runs in CI (`ci-main.yml`); not runnable locally while a dev server
  holds the directory lock.

## Standing rule

Any future "mesh missing, no errors" report starts at step 5: traverse the
live scene and compare against the store. UI–store divergence with a clean
console means an orphaned scene graph, not a geometry bug.
