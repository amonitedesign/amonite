---
gsd_state_version: 1.0
milestone: v2.0
milestone_name: "Parametric Decor Studio Pivot"
status: in_progress
last_updated: "2026-10-16T20:00:00.000Z"
progress:
  total_phases: 9
  completed_phases: 6
  total_plans: 17
  completed_plans: 11
  percent: 65
---

# Amonite Project State

## Current Position

- **Active Milestone:** Milestone v2.0 (Parametric Decor Studio Pivot) — ACTIVE
- **Status:** Phase 6 Complete (100%); Phase 7 ready for planning & execution
- **Repository Branch:** `master`
- **Primary Support:** `amoniteadmin@gmail.com`

## Milestone History

### Milestone v1.0: Public Foundational Ecosystem (Complete)
- **Phase 1: Project Setup & Core Viewport Foundation** (Completed: 2026-10-16)
- **Phase 2: Parametric Geometry & Transform Engine** (Completed: 2026-10-16)
- **Phase 3: Client-Side Parsers, Exporters & Session Memory** (Completed: 2026-10-16)
- **Phase 4: Landing Page, Documentation & Early Access Funnel** (Completed: 2026-10-16)
- **Phase 5: CI/CD Workflows & Public Repository Governance** (Completed: 2026-10-16)

---

### Milestone v2.0: Parametric Decor Studio Pivot (In Progress)
- **Phase 6: Website Copy, Positioning & Designer Work Showcase Gallery** (Completed: 2026-10-16)
  - Plan 06-01: Website Copy, Typography & Creator Positioning Overhaul
  - Plan 06-02: Illustrating Designer Work Showcase Section
- **Phase 7: Parametric Math Engine & Multi-Threaded Web Worker** (Partial — 07-01 delivered in v1.0 as `src/lib/vessel-geometry.ts` + `src/lib/mesh-verify.ts`; 07-02 Web Worker is the remaining gap)
  - Plan 07-01: Procedural Waveform & Manifold Geometry Math Kernel — delivered under different path
  - Plan 07-02: Multi-Threaded Web Worker Pipeline — pending
- **Phase 8: Sculptor Studio UI & Base Archetypes** (Delivered — 10 archetypes, sliders, finishes, auto-rotate; see ROADMAP reconciliation)
  - Plan 08-01: Base Archetype Catalog & Tactile Parametric Controls
  - Plan 08-02: Fluid Studio Viewport & Ceramic Material Presets
- **Phase 9: Print Export, Commercial Tiers & Verification** (Partial — STL + Etsy ZIP done; slicer docs, tier enforcement, E2E/audit pending)
  - Plan 09-01: Direct-to-Print Watertight STL & Slicer Profiles
  - Plan 09-02: Documentation, E2E Verification & Milestone Audit

## Architectural Decisions Log (Milestone v2.0 Additions)

- **Decision 11 (Target Audience Pivot):** Pivoted from generic mechanical CAD (Fusion 360 competitor) to specialized design studio for interior decorators, ceramicists, and Etsy boutique makers (`docs/PRD-v1.0.0-amonite.md`).
- **Decision 12 (Elimination of Mechanical CAD Mechanics):** Banished traditional 3D primitives (Box, Cylinder, Sphere, Torus, 2D Extrude) and XYZ coordinate axes from the primary interface; replaced with 4 Base Decor Archetypes (Fluted Vase, Ribbed Planter, Organic Bowl, Twisted Lamp Shell) and intuitive parametric sliders.
- **Decision 13 (Multi-Threaded Web Worker Engine):** Offload all procedural vertex loops, wave transformations, and normal calculations to `src/workers/mesh-worker.ts` with transferable array buffers to prevent UI frame drops when scrubbing sliders at 60fps.
- **Decision 14 (Vase-Mode & Clay Shrinkage First):** Prioritized continuous spiralize outer contour export and automatic ceramic clay shrinkage compensation (8%–15%) over legacy DXF/SVG formats.
- **Decision 15 (Studio Visual Showcase):** Added dedicated illustrating gallery on the landing page presenting real-world decor designs with physical fabrication specifications (print time, weight, shrinkage factor, slicer settings).
- **Decision 16 (Studio Viewport Fix + Affirmed Direction, 2026-10-16):** Diagnosed and fixed the invisible-vessel bug (StrictMode remount orphaned mesh groups in a disposed scene; verified by live scene traversal vs store) plus init camera framing and panel overflow — recorded in `docs/architecture/studio-viewport-record.md`. Affirmed the Parametric Decor Studio pivot, the screenshot-verify workflow, and the monetization track as correct and progressing — recorded in `docs/direction.md`. Hold this course through Phases 7–9.
- **Decision 17 (Planning Reconciliation, 2026-10-17):** Audited ROADMAP/REQUIREMENTS Phases 7–9 against as-built `src/`. Phases 7-01 and 8 are already delivered under different paths/names (math kernel = `src/lib/vessel-geometry.ts`; manifold checker = `src/lib/mesh-verify.ts`; 10 archetypes; 4 finishes). The only true engine gap is the Web Worker (REQ-ENGINE-02); Phase 9 slicer docs, tier enforcement, and E2E/audit remain. Planning docs updated to match code; no code changed by this reconciliation.
