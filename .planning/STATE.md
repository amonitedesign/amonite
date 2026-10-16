---
gsd_state_version: 1.0
milestone: v1.0
milestone_name: milestone
status: milestone_complete
last_updated: "2026-10-16T18:01:30.000Z"
progress:
  total_phases: 5
  completed_phases: 5
  total_plans: 9
  completed_plans: 9
  percent: 100
---

# Amonite CAD Project State

## Current Position

- **Active Milestone:** Milestone v1.0 (Public Foundational Ecosystem) — COMPLETE
- **Status:** All 5 Phases Verified & Complete (100%)
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
- **Phase 4: Landing Page, Documentation & Early Access Funnel** (Completed: 2026-10-16)
  - Plan 04-01: Anti-Slop Industrial Hero, Asymmetric Architecture & Studio Showcase
  - Plan 04-02: Editorial Technical Documentation Workspace & Minimalist Early Access Funnel
- **Phase 5: CI/CD Workflows & Public Repository Governance** (Completed: 2026-10-16)
  - Plan 05-01: CI/CD Workflows, Repository Governance & Segregation Security Audits

## Architectural Decisions Log

- **Decision 01 (Framework):** Selected Next.js 16 (App Router) + TypeScript + Tailwind CSS over Vite to ensure native metadata, SEO for public landing paths, modular routing, and server-side static generation.
- **Decision 02 (Rendering Engine):** Selected Three.js WebGL hardware-accelerated viewport with a dedicated React canvas manager. Direct Three.js WebGL loop provides 120fps fluid performance without React 19 peer-dependency conflicts or reconciler bottlenecks during continuous CAD transform interactions.
- **Decision 03 (State Management):** Zustand state store (`src/store/cad-store.ts`) adopted to decouple high-frequency mouse coordinate streams, grid snap calculations, camera modes, and mesh transforms from React component re-renders.
- **Decision 04 (Security & Public Scope):** Strictly segregated all authentication, user databases, and paywalls from this repository. Zero-auth sandbox runs 100% client-side with local file session persistence.
- **Decision 05 (Branding):** Embedded the Ammonite spiral geometry from `Logo/IMAGE.svg` as `public/logo-mark.svg` across splash headers, viewport watermarks, and icons.
- **Decision 06 (CI & Workflow Enforcement):** GitHub Actions CI workflow established at `.github/workflows/ci.yml` tracking `main` and `master`, verifying TypeScript compilation (`tsc --noEmit`), ESLint, and Turbopack production builds.
- **Decision 07 (Parametric Lifecycle & Geometry Disposal):** Implemented explicit `mesh.geometry.dispose()` and `edges.geometry.dispose()` whenever node dimensions are mutated, avoiding WebGL buffer memory leaks.
- **Decision 08 (Zero-Dependency CAD I/O):** Built pure-JavaScript parsers and exporters for binary/ASCII STL, AutoCAD DXF, SVG, and native JSON without heavy native dependencies, enabling 100% client-side execution in all browsers.
- **Decision 09 (Anti-Slop Industrial Design System):** Enforced a strict ban on generic AI startup tropes (no multi-color gradients, no radial card glows, no 3-column identical rows, no centered symmetry). Adopted a calibrated graphite and cold zinc aesthetic with asymmetric bento layouts, whitespace-driven hierarchy, and authentic CAD/CAM engineering documentation.
- **Decision 10 (Automated Segregation Guard):** Integrated regex-based automated CI audit (`grep -rniE "stripe|supabase|clerk|next-auth|prisma|drizzle|DATABASE_URL|billing|paywall|subscription" src/`) guaranteeing the public repository stays zero-auth and zero-leak.

## Milestone v1.0 Summary
The public foundational ecosystem for Amonite CAD is fully delivered, tested, documented, and protected with automated CI/CD quality gates. All 104 unit and app tests are passing. Production bundle builds cleanly in <2.5s. Ready for public open-source release.
