# Product Requirement & Strategic Report: Project Amonite

> **Document header (added by repo, not part of frozen PRD text)**
>
> - Version: 1.0.0
> - Status: `AUTHORITATIVE` — top-level design authority for all DESIGN and UI work.
> - Date frozen: 2026-10-16
> - Supersedes: `.planning/PROJECT.md` identity paragraph (generic CAD for mechanical engineers). That file is retained as build history; this PRD defines direction from v1.1 onward.
> - Related docs:
>   - `docs/REQUIREMENTS-vase.md` (scoped REQ-VASE / REQ-PRINT / REQ-NEG)
>   - `DESIGN.md` Appendix A (designer voice + gallery rules)
>   - `docs/design/landing-designer-first.md` (landing IA + copy spec)
>   - `docs/architecture/amonite-core-layout.md` (target tree + migration)
>   - `docs/monetization/tiers-mapping.md` (Core vs Premium bridge)
> - **OPEN DECISIONS (not resolved in v1.0.0, flagged for ruling):**
>   - OPEN-1 License: PRD §4 proposes Core AGPL-3.0; `README.md` + `LICENSE` currently state MIT. No change made in this freeze.
>   - OPEN-2 Brand: PRD §5 proposes orange snail `icon.svg`; repo currently ships `public/logo-mark.svg` (graphite + cyan). No asset change made in this freeze.
>   - OPEN-3 Naming/scope: PRD implies `Amonite — Object Studio` (vase/decor only); repo currently names `Amonite CAD` (generic primitives). `/sandbox` generic primitives retained as legacy until ruled.

---

## Frozen PRD text (verbatim, v1.0.0)

### Target Architecture

Micro-SaaS / Browser-Native

### Target Audience

Boutique 3D Printing Creators, Etsy Makers, & Interior Decor Designers

### 1. Executive Summary & Product Vision

Amonite is a highly specialized, browser-native parametric design utility engineered exclusively for 3D-printable interior decor and vase structures. Moving away from the overwhelming, open-ended complexity of general-purpose CAD software (like Fusion 360 or Rhino), Amonite operates strictly within a refined micro-SaaS blueprint.
The tool bridges the gap between complex computational geometry and the booming commercial creator economy. It provides independent designers, Etsy boutique sellers, and interior decor makers with an instant, slider-driven environment to forge mathematically perfect, watertight (manifold) 3D meshes ready for immediate production printing. By constraining the software's scope to shell- and rib-based decor items, Amonite eliminates the steep learning curves of traditional CAD while delivering hyper-targeted value.

### 2. The Target Audience: The Design-to-Manufacture Creator

Traditional CAD tools are designed for mechanical engineers and industrial manufacturers; they prioritize structural load calculations, assembly constraints, and complex boolean operations. Amonite purposefully ignores these fields to serve a distinct, high-intent user base:

- Boutique Etsy Sellers & Digital Creators: Makers who run local 3D printing farms or sell digital STL files online. They need to generate endless product variations (e.g., changing a vase's rib count, ripple frequency, or twisting angle) within seconds to keep up with consumer decor trends.
- Interior Decor Designers & Stagers: Professionals seeking to customize unique, high-end accents — such as custom-textured plant pots, avant-garde centerpiece vases, and organic lighting shells/lampshades — tailored to specific interior architectural styles (e.g., Japandi, Minimalism, Brutalism).
- 3D Printing Enthusiasts ("Vase-Mode" Specialists): Creators who leverage single-wall, continuous extrusion profiles ("spiralize outer contour" settings in modern slicers) to create semi-translucent, lightweight products rapidly.

### 3. Product Scope: Core Features vs. Excluded Engineering Slop

To preserve the absolute agility of a high-converting micro-SaaS product, Amonite maintains an ironclad boundary around its feature set.

#### In-Scope Features (What We Are Building)

- Procedural Rib & Profile Morphing: High-speed slider inputs that map trigonometric wave adjustments directly onto 3D coordinate matrices. Users modify parameters like Base Diameter, Rib Count, Wave Frequency, and Rotational Twist.
- Guaranteed Watertight (Manifold) Geometry Engine: A client-side generation pipeline that algorithmically ensures all vertex calculations, face connectivity lists, and outward-pointing surface normals are 100% mathematically continuous. Result: zero slicer errors, zero hollow-space dropouts, and zero print failures.
- Instant Browser Previews: A lightweight, hardware-accelerated preview panel built entirely using modern client-side architectures (WebGL/Three.js) that offloads computing loops to isolated thread contexts, keeping the interface fluid at a constant 60 frames per second.
- Direct-to-Print Exports: Clean, uncompressed .STL vector mesh downloads optimized for standard slicing suites (Cura, PrusaSlicer, Bambu Studio).

#### Out-of-Scope Features (What We Are Strictly Rejecting)

- No Multi-Part Assemblies: No mechanical joints, hinges, screws, or component mating logic.
- No Boolean Modeling: No open-ended cutting, manual solid sketching, or traditional digital sculpting toolsets.
- No Cloud Engine Overheads: The core generation prototype runs completely in the user's browser canvas, keeping server compute overhead at absolute zero for the open-source layer.

### 4. Architectural & Development Blueprint

Amonite is built with clean separation of concerns, decoupling its pure mathematical shape-finding algorithms from the user interface and presentation frameworks.

```text
[ amonite-core ] (Public Repository Layout)
 ├── .github/workflows/ci.yml   # Automatic lint, type-check, and compilation verify
 ├── public/                    # Raw vector snail shell icon asset (`icon.svg`)
 └── src/
     ├── core/                  # Core mathematical calculation boundaries
     │   ├── math/              # Parametric waveforms, Fibonacci spirals, twist matrices
     │   └── mesh/              # STL generation, topology maps, manifold checkers
     ├── components/            # Clean, textless slider inputs and minimal canvas window
     └── workers/               # Low-overhead Web Workers for off-loaded mesh processing
```

#### The Strategic Monetization Anchor

By launching the core application frontend as an open-source project (amonite-core), you capture maximum organic developer adoption, developer credibility, and distribution on GitHub trending pipelines.
To safeguard the commercial value of your product without fighting a losing battle against browser code inspection tools, monetization is handled at the premium module/infrastructure boundary:

| Tier | Distribution | Included Value |
|---|---|---|
| Amonite Core | Public (AGPL-3.0 Copyleft) | Local single-mesh rendering, basic trigonometric wave profiles, standard low-res STL mesh exports, and local canvas styling controls. |
| Amonite Premium | Private / Gated Module | Commercially tuned preset curves, high-fidelity production geometry modes, multi-file batch automation, and premium cloud asset library syncing. |

### 5. Implementation Roadmap for the Prototype

1. Extract & Refactor: Extract the single prototype file from Gemini Canvas. Isolate the mathematical coordinate loops into a modular file (`/src/core/math/vaseEngine.ts`).
2. Establish Thread Separation: Wrap the vertex-generating functions inside a standalone Web Worker context to prevent complex geometric loop calculations from locking up the interactive sliders.
3. Embed Vector Brand Identity: Deploy the pure minimalist orange snail shell icon asset into the application configuration, setting up a sharp, professional developer-grade theme across the repository footprint.

---

## PRD-to-repo traceability (added by repo)

- §2 Audience → `DESIGN.md` Appendix A + `docs/design/landing-designer-first.md` → `src/app/page.tsx`, `src/components/ui/navbar.tsx`.
- §3 In-scope → `docs/REQUIREMENTS-vase.md` (REQ-VASE / REQ-PRINT) → NEW `src/core/math/vaseEngine.ts`, NEW `src/workers/mesh-worker.ts`, RETAIN `src/lib/parsers/stl-exporter.ts`.
- §3 Out-of-scope → `docs/REQUIREMENTS-vase.md` (REQ-NEG) → `src/lib/geometry-engine.ts` extrusion/boolean paths marked legacy, do not extend.
- §4 Layout + monetization → `docs/architecture/amonite-core-layout.md` + `docs/monetization/tiers-mapping.md` → `.github/workflows/ci.yml` keeps public-core guard.
- §5 Steps 1–3 → deferred to Phase 6 (interface spec first, implementation after docs freeze).
