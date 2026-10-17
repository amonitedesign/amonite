# Amonite Requirements & Specification

> **Milestone Status:**
> - Milestone v1.0 (Public Foundational Ecosystem) — COMPLETE (Archived)
> - Milestone v2.0 (Parametric Decor Studio Pivot) — ACTIVE

---

## As-Built Reconciliation (2026-10-17)

Status of each requirement group against the current `src/` implementation:

| Group | Status | Notes |
|---|---|---|
| REQ-COPY-01…04 | ✅ Delivered | Landing metadata, headline, jargon purge, Clay Shrinkage + Vase Mode featured (Phase 6). |
| REQ-GALLERY-01…03 | ✅ Delivered | `src/components/landing/designer-showcase.tsx`, deep links `/sandbox?archetype={id}`. |
| REQ-SCULPT-01…03 | ✅ Delivered (superset) | 10 archetypes (spec asked 4) in `VESSEL_ARCHETYPES`; sliders in `vessel-studio.tsx`. Names drift: Brutalist Planter / Twisted Cylinder. Shrinkage is presets, not a 0–20% slider. |
| REQ-VIEWPORT-01…04 | ✅ Delivered | Drafting views removed from UI; auto-rotate via `studio-settings.tsx`; 4 finishes (`VESSEL_FINISHES`); orbit/inertia via `cad-canvas.tsx`. Finish names differ from spec (Sandstone / Terracotta / Porcelain / Obsidian). |
| REQ-ENGINE-01 | ✅ Delivered (different path) | Math kernel is `src/lib/vessel-geometry.ts` (`createVesselGeometry`), **not** `src/core/math/vaseEngine.ts`. |
| REQ-ENGINE-02 | ❌ GAP | No `src/workers/mesh-worker.ts`, no Web Worker, no transferable buffers — geometry runs synchronously on the main thread. |
| REQ-ENGINE-03 | ⚠️ Moot | No worker, so no fallback needed yet; revisit if the worker is built. |
| REQ-FABRICATION-01 | ✅ Delivered | `src/lib/mesh-verify.ts` (`verifyVesselGeometry`) + merged manifold generator. |
| REQ-FABRICATION-02 | ✅ Delivered | `src/lib/parsers/stl-exporter.ts`. |
| REQ-FABRICATION-03 | ✅ Delivered | Continuous outer contour + solid base by construction (slice-loop checks). |
| REQ-FABRICATION-04 | ✅ Delivered | `shrinkagePercent` scaling + Terracotta/Stoneware/Porcelain presets. |
| REQ-TIERS-01 | ⚠️ Documented only | Boundary described in `docs/tiers-and-limits.md`, not enforced in code. Etsy batch ZIP (`batch-zip.ts`) already ships in Core. |
| REQ-NEGATIVE-01…03 | ✅ Honored | No constraints/CSG/server mesh; legacy primitive code paths remain in engine/parsers but are not exposed in the sandbox UI. |

**Net remaining v2.0 work:** Web Worker pipeline (REQ-ENGINE-02) and Phase 9 docs/E2E/milestone audit. Everything else in Phases 7–8 is delivered under different paths/names.

---

## Milestone v2.0 Requirements: The 3D Studio for Minimalist Interior Decor

### 1. Website Copy & Creator Positioning (REQ-COPY)
- **REQ-COPY-01 (Must):** Update top-level titles, metadata, and hero headlines:
  - Title: `Amonite | The 3D Studio for Minimalist Interior Decor`
  - Headline: `Sculpt bespoke minimal vases & interior decor, right in your browser.`
  - Subtext: Emphasize generating infinite variations for Etsy shops and bespoke interior design projects.
- **REQ-COPY-02 (Must):** Completely eliminate engineering jargon across all pages:
  - Replace "Brep", "50B records", "CAD/CAM Micro-SaaS", "Client Solid Geometry Engine" with creator-oriented terminology.
  - Metrics: "Guaranteed Print-Ready", "Flawless toolpaths for clay, resin, and FDM", "Zero slicer errors".
- **REQ-COPY-03 (Must):** Prominently feature the **Clay Shrinkage Tool**:
  - Explain automatic 8%–15% volumetric shrinkage compensation for ceramic kiln firing.
- **REQ-COPY-04 (Must):** De-emphasize DXF/SVG on the landing page in favor of **Instant Watertight STL** and **Vase Mode (Spiralize)** compatibility.

### 2. Illustrating Designer Work Showcase (REQ-GALLERY)
- **REQ-GALLERY-01 (Must):** Dedicated visual showcase section on the landing page presenting realistic interior decor designs crafted in Amonite:
  - Fluted Ikebana Vase (Ceramic Stoneware, 0.4mm nozzle)
  - Ribbed Nordic Planter (Matte Terracotta PLA, watertight base)
  - Pleated Wave Bowl (Bisque Porcelain, spiralized profile)
  - Twisted Biophilic Lamp Shell (Translucent PETG, continuous vase mode)
- **REQ-GALLERY-02 (Must):** Provide fabrication specifications per showcase item (dimensions in mm, print time estimate, material, nozzle extrusion profile, layer height).
- **REQ-GALLERY-03 (Should):** Include quick-action trigger: "Load Archetype into Studio" allowing creators to jump directly into editing that design in `/sandbox`.

### 3. Sculptor UI & Base Archetypes (REQ-SCULPT)
- **REQ-SCULPT-01 (Must):** Remove mechanical CAD primitives (Cuboid, Cylinder, Sphere, Torus, Cone, 2D Extrude) from the primary studio interface.
- **REQ-SCULPT-02 (Must):** Introduce 4 Base Decor Archetypes:
  - **Fluted Vase** (vertical flute ripples, neck constriction, flared lip)
  - **Ribbed Planter** (horizontal or vertical ribs, drainage hole option, thickened base)
  - **Organic Bowl** (shallow curved profile, undulating lip, stable foot)
  - **Twisted Lamp Shell** (helical twist angle, open top/bottom aperture, thin-wall translucent shell)
- **REQ-SCULPT-03 (Must):** Replace XYZ coordinates, transform gizmos, and raw numeric positioning inputs with clean, tactile parametric sliders:
  - **Base Diameter** (mm)
  - **Wall Thickness** (mm / vase-mode single perimeter)
  - **Rib Count** (3 to 64 ribs)
  - **Wave Frequency** (undulation density)
  - **Rotational Twist** (degrees of helical rotation from base to rim)
  - **Clay Shrinkage Factor** (% compensation slider: 0% to 20%)

### 4. Viewport Simplification & Material Aesthetics (REQ-VIEWPORT)
- **REQ-VIEWPORT-01 (Must):** Remove traditional drafting views (ISO, TOP, FRONT, RIGHT, BOTTOM, BACK, LEFT, SHADED, WIREFRAME) from the studio UI.
- **REQ-VIEWPORT-02 (Must):** Provide a fluid, automatically rotating 3D canvas (WebGL/Three.js) that gracefully showcases the object form.
- **REQ-VIEWPORT-03 (Must):** Implement warm, studio-quality physical materials:
  - Matte Stoneware / Bisque Ceramic (warm chalky `#e4ded4` / `#22201e`)
  - Terracotta Clay (`#c26d4a`)
  - Matte White PLA (`#f4f3f0`)
  - Translucent Smoked Glass / PETG (`#2a2d32` with subtle transmission)
- **REQ-VIEWPORT-04 (Must):** Gentle orbital interaction (one-finger / left-drag rotates, wheel zooms, smooth inertia damping).

### 5. Multi-Threaded Web Worker Mesh Engine (REQ-ENGINE)
- **REQ-ENGINE-01 (Must)** — *[DELIVERED at `src/lib/vessel-geometry.ts`]*: Pure trigonometric parametric mesh generator translating slider parameters into continuous 3D vertices, indices, and normals. (Original target path `src/core/math/vaseEngine.ts` was not used; treat `createVesselGeometry` as the canonical kernel.)
- **REQ-ENGINE-02 (Must)** — *[GAP — not implemented]*: Offload geometry generation loops to a Web Worker (`src/workers/mesh-worker.ts`) using `postMessage` and transferable `ArrayBuffer`s, ensuring UI slider interactions remain smooth at 60fps even with 50+ ribs.
- **REQ-ENGINE-03 (Must)** — *[MOOT until ENGINE-02 exists]*: Fallback graceful synchronous execution if Web Workers are unavailable in headless test environments.

### 6. Print Reliability, Vase Mode & Clay Shrinkage (REQ-FABRICATION)
- **REQ-FABRICATION-01 (Must):** Guaranteed watertight (manifold) mesh generation: zero non-manifold edges, zero self-intersections, continuous outward surface normals.
- **REQ-FABRICATION-02 (Must):** Instant binary and ASCII `.STL` export optimized for Bambu Studio, PrusaSlicer, and Cura.
- **REQ-FABRICATION-03 (Must):** Explicit Vase Mode support (single continuous perimeter with solid base layers).
- **REQ-FABRICATION-04 (Must):** Clay shrinkage compensation calculator adjusting export geometry to account for 8%–15% ceramic drying/firing shrinkage.

### 7. Open-Source vs. Commercial Boundary (REQ-TIERS)
- **REQ-TIERS-01 (Must):** Document and enforce the boundary:
  - **Amonite Core (Free / Open Source):** Standard archetypes, real-time procedural sliders, watertight STL export, local session persistence.
  - **Amonite Premium:** Commercial starter templates (Japandi, Brutalism, Organic Modern), batch generation of Etsy variations (e.g. export 10 size/rib variations in a ZIP), commercial license rights.

### 8. Negative Scope — Strictly Excluded (REQ-NEGATIVE)
- **REQ-NEGATIVE-01 (Must NOT):** No mechanical assembly constraints, fasteners, joints, or multi-body kinematics.
- **REQ-NEGATIVE-02 (Must NOT):** No Boolean CSG operations (union, difference, intersection).
- **REQ-NEGATIVE-03 (Must NOT):** No server-side mesh rendering or cloud storage requirements in Core.
