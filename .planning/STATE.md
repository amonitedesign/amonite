---
gsd_state_version: 1.0
milestone: v1.0
milestone_name: milestone
status: ready_to_plan
last_updated: "2026-10-16T17:20:00.000Z"
progress:
  total_phases: 5
  completed_phases: 3
  total_plans: 6
  completed_plans: 6
  percent: 60
---

# Amonite CAD Project State

## Current Position

- **Active Phase:** Phase 4 (Landing Page, Documentation & Early Access Funnel)
- **Status:** Phase 3 Verified & Complete; Ready for Phase 4
- **Repository Branch:** `master`
- **Primary Support:** `amoniteadmin@gmail.com`

## Completed Phases
- **Phase 1: Project Setup & Core Viewport Foundation** (Completed: 2026-10-16)
  - Plan 01-01: Core WebGL Viewport, Camera Duality & Zustand Store
  - Plan 01-02: Viewport HUD, Snapping Engine, History Stack & Zero-Auth Shell
- **Phase 2: Parametric Geometry & Transform Engine** (Completed: 2026-10-16)
  - Plan 02-01: Parametric Solid Primitives Generation & Memory Lifecycle
  - Plan 02-02: Transform Gizmos, Numeric Inspector HUD & Scene Tree
- **Phase 3: Client-Side Parsers, Exporters & Session Memory** (Completed: 2026-10-16)
  - Plan 03-01: Client-Side Mesh Exporters & 2D Vector Parsers (STL, DXF, SVG)
  - Plan 03-02: Native Lossless Project I/O, Session Storage & File Dialog UI

## Architectural Decisions Log

- **Decision 01 (Framework):** Selected Next.js 16 (App Router) + TypeScript + Tailwind CSS over Vite to ensure native metadata, SEO for public landing paths, modular routing, and server-side static generation.
- **Decision 02 (Rendering Engine):** Selected Three.js WebGL hardware-accelerated viewport with a dedicated React canvas manager. Direct Three.js WebGL loop provides 120fps fluid performance without React 19 peer-dependency conflicts or reconciler bottlenecks during continuous CAD transform interactions.
- **Decision 03 (State Management):** Zustand state store (`src/store/cad-store.ts`) adopted to decouple high-frequency mouse coordinate streams, grid snap calculations, camera modes, and mesh transforms from React component re-renders.
- **Decision 04 (Security & Public Scope):** Strictly segregated all authentication, user databases, and paywalls from this repository. Zero-auth sandbox runs 100% client-side with local file session persistence.
- **Decision 05 (Branding):** Embedded the Ammonite spiral geometry from `Logo/IMAGE.svg` as `public/logo-mark.svg` across splash headers, viewport watermarks, and icons.
- **Decision 06 (CI & Workflow Enforcement):** GitHub Actions CI workflow established at `.github/workflows/ci.yml` tracking `main` and `master`, verifying TypeScript compilation (`tsc --noEmit`), ESLint, and Turbopack production builds.
- **Decision 07 (Parametric Lifecycle & Geometry Disposal):** Implemented explicit `mesh.geometry.dispose()` and `edges.geometry.dispose()` whenever node dimensions are mutated, avoiding WebGL buffer memory leaks.
- **Decision 08 (Zero-Dependency CAD I/O):** Built pure-JavaScript parsers and exporters for binary/ASCII STL, AutoCAD DXF, SVG, and native JSON without heavy native dependencies, enabling 100% client-side execution in all browsers.

## Next Steps

1. Run `/gsd-plan-phase 4` to create execution plans for Phase 4: Landing Page, Documentation & Early Access Funnel.
2. Polish live interactive ammonite hero visualization, documentation workspace (`/docs`), and early-access waitlist modal.
3. Validate responsive behavior on desktop and mobile.
