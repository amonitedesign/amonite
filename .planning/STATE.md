# Amonite CAD Project State

## Current Position
- **Active Phase:** Phase 1 (Project Setup & Core Viewport Foundation)
- **Status:** Initializing project structure, WebGL viewport, Zustand state store, and public landing layout.
- **Repository Branch:** `master`
- **Primary Support:** `amoniteadmin@gmail.com`

## Architectural Decisions Log
- **Decision 01 (Framework):** Selected Next.js 16 (App Router) + TypeScript + Tailwind CSS over Vite to ensure native metadata, SEO for public landing paths, modular routing, and server-side static generation.
- **Decision 02 (Rendering Engine):** Selected Three.js WebGL hardware-accelerated viewport with a dedicated React canvas manager. Direct Three.js WebGL loop provides 120fps fluid performance without React 19 peer-dependency conflicts or reconciler bottlenecks during continuous CAD transform interactions.
- **Decision 03 (State Management):** Zustand state store (`src/store/cad-store.ts`) adopted to decouple high-frequency mouse coordinate streams, grid snap calculations, camera modes, and mesh transforms from React component re-renders.
- **Decision 04 (Security & Public Scope):** Strictly segregated all authentication, user databases, and paywalls from this repository. Zero-auth sandbox runs 100% client-side with local file session persistence.
- **Decision 05 (Branding):** Embedded the Ammonite spiral geometry from `Logo/IMAGE.svg` as `public/logo-mark.svg` across splash headers, viewport watermarks, and icons.

## Next Steps
1. Implement the complete Zustand store (`src/store/cad-store.ts`).
2. Build the hardware-accelerated WebGL Viewport (`src/components/cad/viewport.tsx`) with OrbitControls, TransformControls, CAD grid, camera presets, and lighting.
3. Build the CAD Toolbar, Properties Inspector, and Layer Tree components.
4. Implement client-side geometry generators and STL/DXF/SVG/JSON parsers.
5. Create the technical documentation page (`src/app/docs/page.tsx`).
6. Build the hero landing page with live interactive CAD playground and waitlist form.
7. Setup GitHub Actions (`.github/workflows/ci.yml`), `README.md`, and `CONTRIBUTING.md`.
