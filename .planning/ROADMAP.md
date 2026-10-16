# Amonite Development Roadmap

## Milestone v1.0: Public Foundational Ecosystem (Complete)
- [x] Phase 1: Project Setup & Core Viewport Foundation
- [x] Phase 2: Parametric Geometry & Transform Engine
- [x] Phase 3: Client-Side Parsers, Exporters & Session Memory
- [x] Phase 4: Landing Page, Documentation & Early Access Funnel
- [x] Phase 5: CI/CD Workflows & Public Repository Governance

---

## Milestone v2.0: Parametric Decor Studio Pivot (Active)

### Phase 6: Website Copy, Positioning & Designer Work Showcase Gallery (Complete)
- [x] Plan 06-01: Website Copy, Typography & Creator Positioning Overhaul
- [x] Plan 06-02: Illustrating Designer Work Showcase Section

### Phase 7: Parametric Math Engine & Multi-Threaded Web Worker
- [ ] Plan 07-01: Procedural Waveform & Manifold Geometry Math Kernel
  - Build `src/core/math/vaseEngine.ts` mapping parametric slider inputs (diameter, rib count, wave frequency, twist, wall thickness, shrinkage factor) to 3D coordinate matrices.
  - Implement mathematical manifold checker guaranteeing 100% watertight vertices and outward surface normals.
  - Implement clay shrinkage dimensional scaling calculator (8%–15% firing compensation).
- [ ] Plan 07-02: Multi-Threaded Web Worker Pipeline
  - Implement `src/workers/mesh-worker.ts` offloading geometry loops to a background thread with transferable `ArrayBuffer`s for 60fps slider smoothness.
  - Build worker manager with graceful fallback for environments lacking Web Worker support.
  - Write unit tests verifying geometry continuity, normal vectors, and worker roundtrips.

### Phase 8: Sculptor Studio UI & Base Archetypes
- [ ] Plan 08-01: Base Archetype Catalog & Tactile Parametric Controls
  - Replace traditional primitives (Cuboid, Cylinder, Sphere, Torus, 2D Extrude) with 4 Base Decor Archetypes: Fluted Vase, Ribbed Planter, Organic Bowl, Twisted Lamp Shell.
  - Replace XYZ coordinates and transform gizmos with clean, tactile parametric sliders: Base Diameter, Wall Thickness, Rib Count, Wave Frequency, Rotational Twist, Clay Shrinkage %.
- [ ] Plan 08-02: Fluid Studio Viewport & Ceramic Material Presets
  - Remove engineering views (ISO, TOP, FRONT, SHADED) from the studio interface.
  - Implement fluid, gentle auto-rotating 3D canvas with studio lighting.
  - Provide physical material presets: Matte Stoneware, Terracotta Clay, Bisque Porcelain, and Translucent PETG.

### Phase 9: Print Export, Commercial Tiers & Verification
- [ ] Plan 09-01: Direct-to-Print Watertight STL & Slicer Profiles
  - Wire direct STL export from parametric engine with single-perimeter vase-mode optimization.
  - Integrate slicer-ready profile instructions for Bambu Studio, PrusaSlicer, and Cura.
  - Clearly delineate Amonite Core (free / open-source) vs. Amonite Premium (commercial presets, batch variations for Etsy).
- [ ] Plan 09-02: Documentation, E2E Verification & Milestone Audit
  - Update `/docs` with pottery shrinkage tables, vase-mode guides, and Etsy maker workflows.
  - Update and verify full test suites (Vitest unit/app tests, Playwright e2e smoke & studio tests).
  - Finalize Milestone v2.0 audit and commit to repository.
