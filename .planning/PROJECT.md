# Project Amonite: High-Performance Browser-Based CAD/CAM Micro-SaaS

## Executive Summary
**Amonite** is a modern, ultra-responsive browser-based CAD/CAM workspace engineered for mechanical designers, industrial engineers, makers, and digital fabricators. Amonite delivers zero-friction CAD utility directly in the browser with no mandatory login barrier, instant hardware-accelerated 3D viewport rendering, interactive 2D drafting overlays, precision grid snapping, client-side vector math, and local persistence.

## Core Identity & Architecture
- **Agent Identity:** `amonite-core-architect`
- **Primary Support Handle:** `amoniteadmin@gmail.com`
- **Target App Execution Mode:** Local worktree / client-side execution
- **Public vs. Private Repository Segregation:**
  - **Public Repo Scope:** Core browser engine, zero-auth CAD sandbox viewport, client-side geometry kernel & math utilities, DXF/SVG/STL/JSON importers & exporters, local session memory (IndexedDB/localStorage), landing page with interactive hero, technical documentation (`/docs`), early access waitlist form, CI/CD linting & validation workflows.
  - **Out of Scope (Reserved for Premium Repo):** Authentication gateways, subscription paywalls, server-side database schemas, billing routes, multi-tenant cloud sync.

## Technical Framework Constraints
- **Language Layer:** 100% Type-Safe TypeScript (`strict: true`).
- **Frontend Stack:** Next.js (App Router) + Tailwind CSS + Lucide Icons + Google Fonts (Inter / Outfit).
- **Rendering Layer:** Hardware-accelerated WebGL Viewport powered by Three.js & React Three Fiber (R3F) for 3D orbital mesh manipulation, paired with precision 2D engineering grid/coordinate planes and camera projection modes (Orthographic & Perspective).
- **State Architecture:** High-frequency, decoupled Zustand stores isolating viewport render loops, transform gizmos, vector node coordinates, snapping thresholds, and unit systems from standard React re-render cycles.
- **Design System:** Bespoke industrial dark-mode UI (`#0a0b0d`, `#121417`, `#1a1d24`, with slate/cyan technical accents), incorporating the official `logo-mark.svg` ammonite shell iconography.
- **Performance & Privacy:** 100% client-side geometric modifications, matrix coordinate vectors, and grid snap behaviors; privacy-preserving local persistence with zero telemetry.

## Key Deliverables & Modules
1. **Interactive Hero & CAD Sandbox:**
   - 3D WebGL viewport with real-time orbital controls, isometric/ortho presets, wireframe and shaded modes, dynamic CAD lighting, and XYZ axis gizmo.
   - Interactive geometry creation: Cuboid, Cylinder, Sphere, Extruded Polygon, Torus, and custom parametric curves.
   - Transform controls: Translate, Rotate, Scale with numeric HUD and millimeter/inch precision.
2. **Precision Vector & Coordinate Tools:**
   - Dynamic snap grid with adaptive subdivision based on zoom level.
   - Real-time coordinate HUD (X, Y, Z, delta, angles).
   - Dimension / measurement calipers.
3. **Client-Side Parsing & Export Utilities:**
   - DXF ASCII vector parser & exporter.
   - SVG vector paths to 3D extrusion geometry.
   - STL binary/ASCII 3D mesh exporter for 3D printing.
   - Amonite Native JSON schema for lossless project file import/export.
4. **Local Workspace Session Memory:**
   - Automatic background autosave to browser `localStorage` and `IndexedDB`.
   - Project history (Undo / Redo stack) with keyboard shortcuts (Ctrl+Z / Ctrl+Y).
5. **Technical Documentation Workspace (`/docs`):**
   - Architectural specifications, keyboard shortcut reference, math and coordinate systems, parser specs, and contribution guidelines.
6. **Waitlist & Early Access Conversion:**
   - Frictionless waitlist submission capturing intent and routing to `amoniteadmin@gmail.com`.
7. **CI/CD & Open Source Tooling:**
   - GitHub Actions workflow (`.github/workflows/ci.yml`) for TypeScript verification, ESLint, and build tests.
   - Comprehensive `README.md` and `CONTRIBUTING.md`.
