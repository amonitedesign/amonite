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

> **Reconciled 2026-10-17 against as-built code.** Phases 7–9 were largely delivered
> during Milestone v1.0 under different paths/names than originally planned. Status
> stamps: `[x]` delivered · `[~]` partial · `[ ]` true gap. Paths in the original
> plan (`src/core/math/vaseEngine.ts`, `src/workers/mesh-worker.ts`) were never
> created — the real code lives in `src/lib/{vessel-geometry,geometry-engine,mesh-verify}.ts`.

### Phase 7: Parametric Math Engine & Multi-Threaded Web Worker — `[~]` Partial
- [x] Plan 07-01: Procedural Waveform & Manifold Geometry Math Kernel
  - **Delivered (v1.0)** as `src/lib/vessel-geometry.ts` (`createVesselGeometry`): synchronous trigonometric profile mapping base radius, height, rib count, wave, twist, wall thickness → lathe outer/inner walls + rim + capped floors, displaced consistently and merged into one solid. Consumed via `src/lib/geometry-engine.ts`.
  - Manifold/normal checker delivered as `src/lib/mesh-verify.ts` (`verifyVesselGeometry`, `analyzeEdges`, `signedVolume`, slice-loop + overhang checks) — covers REQ-FABRICATION-01.
  - Shrinkage compensation delivered inline via `VesselParams.shrinkagePercent` scaling plus `SHRINKAGE_PRESETS` (0 / +9.5 / +11.8 / +14.2%) in `vessel-studio.tsx`.
  - **Deviation:** no `src/core/math/vaseEngine.ts` and no standalone 0–20% shrinkage calculator module; shrinkage is preset-driven, not a continuous slider.
- [ ] Plan 07-02: Multi-Threaded Web Worker Pipeline — **REAL GAP**
  - `src/workers/mesh-worker.ts` does not exist. No `postMessage`/transferable `ArrayBuffer`s; geometry builds synchronously on the main thread.
  - No worker manager, no non-Worker fallback, no worker roundtrip tests.
  - Decision needed: is the worker still required, or does the synchronous engine hold 60fps acceptably in practice?

### Phase 8: Sculptor Studio UI & Base Archetypes — `[x]` Delivered
- [x] Plan 08-01: Base Archetype Catalog & Tactile Parametric Controls
  - Delivered as a **superset**: 10 archetypes in `VESSEL_ARCHETYPES` (`fluted-vase`, `brutalist-planter`, `organic-bowl`, `twisted-cylinder`, `globe-bud`, `bobbin-teardrop`, `hourglass-cinch`, `scallop-channel`, `nordic-floor`, `onion-bud`), catalog in `vessel-archetypes.tsx`, sliders in `vessel-studio.tsx`.
  - As-built sliders: Base radius · Height · Wall thickness · Rib count · Wave · Twist. Clay shrinkage is a 4-preset tool, not a continuous slider.
  - **Naming drift vs. spec:** "Brutalist Planter" (spec: Ribbed Planter), "Twisted Cylinder" (spec: Twisted Lamp Shell).
  - Legacy primitive paths (`box/cylinder/sphere/torus/cone/extrusion`) still exist in `cad-types.ts`, `geometry-engine.ts`, `cad-store.ts`, and parsers but are **not surfaced in the sandbox UI** (only `extrusion` via `file-dialog.tsx` import).
- [x] Plan 08-02: Fluid Studio Viewport & Ceramic Material Presets
  - Auto-rotate + speed, pedestal, shadows via `studio-settings.tsx`; drafting views removed from UI; bottom bar is Reset view only (internally `setCameraPreset('iso')`).
  - 4 finishes in `VESSEL_FINISHES`: Sandstone, Terracotta, Porcelain, Obsidian (**spec named** Matte Stoneware / Terracotta Clay / Bisque Porcelain / Translucent PETG).
  - Legacy `CameraPreset` type + store trigger remain but no ISO/TOP/FRONT/SHADED UI.

### Phase 9: Print Export, Commercial Tiers & Verification — `[~]` Partial
- [~] Plan 09-01: Direct-to-Print Watertight STL & Slicer Profiles
  - [x] STL export: `src/lib/parsers/stl-exporter.ts` + `downloadSTL` in `vessel-studio.tsx`.
  - [x] Etsy batch ZIP: `src/lib/batch-zip.ts` (`generateEtsyBatchDrop`) — beyond the original Premium scope.
  - [ ] Explicit slicer-profile instructions (Bambu Studio / PrusaSlicer / Cura) — confirm presence in `/docs`, else author.
  - [ ] Core vs. Premium enforcement — documented in `docs/tiers-and-limits.md` / `docs/monetization/tiers-mapping.md`, not enforced in code.
- [ ] Plan 09-02: Documentation, E2E Verification & Milestone Audit
  - [ ] Update `/docs` with pottery shrinkage tables, vase-mode guides, and Etsy maker workflows.
  - [ ] Re-verify full suites (Vitest unit/app, Playwright e2e smoke & studio) against the reconciled scope.
  - [ ] Finalize Milestone v2.0 audit and commit.
