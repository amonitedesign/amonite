# Project Amonite: The 3D Studio for Minimalist Interior Decor

> **MILESTONE v2.0 ACTIVE (2026-10-16): Parametric Decor Studio Pivot**
> 
> Milestone v1.0 established the foundational browser WebGL engine, Three.js viewport, client-side STL/JSON parsers, and local storage.
> 
> Milestone v2.0 executes the decisive pivot from an engineering-heavy CAD tool to a specialized design studio for interior decorators, ceramicists, and Etsy creators (`docs/PRD-v1.0.0-amonite.md`). Traditional CAD mechanics (boxes, spheres, XYZ coordinates, draftsmen projection views) are eliminated and replaced by intuitive, artistic controls, base archetypes, tactile parametric sliders, guaranteed watertight STL generation, vase-mode continuous extrusion, and clay shrinkage calculation.

## Executive Summary
**Amonite** is an intuitive, browser-native 3D design studio engineered exclusively for boutique 3D printing creators, Etsy makers, and interior decor designers. Instead of overwhelming users with traditional mechanical CAD tools (Fusion 360, Rhino), Amonite provides a fast, slider-driven environment to sculpt bespoke, watertight 3D vases, ribbed planters, organic bowls, and lighting shells ready for immediate physical production in clay, resin, and PLA.

## Core Identity & Positioning
- **Official Headline:** "Amonite | The 3D Studio for Minimalist Interior Decor"
- **Primary Audience:** Interior decorators, boutique Etsy shop owners, 3D print farm operators, and ceramic slip-casting makers.
- **Value Proposition:** Generate infinite, beautiful variations for Etsy shops and decor projects in seconds with guaranteed print-ready, watertight STLs, vase-mode continuous extrusion support, and clay shrinkage compensation.
- **Support Contact:** `amoniteadmin@gmail.com`

## Technical Framework & Architecture
- **Language Layer:** 100% Type-Safe TypeScript (`strict: true`).
- **Frontend Stack:** Next.js (App Router) + Tailwind CSS + Lucide Icons + JetBrains Mono / Inter / Outfit fonts.
- **Rendering Layer:** Hardware-accelerated Three.js WebGL canvas featuring studio-grade neutral lighting (ceramic glazes, matte PLA, bisque stoneware), fluid auto-rotation, and quiet, invisible controls.
- **Computation Layer:** Multi-threaded mathematical mesh generation utilizing Web Workers (`src/workers/mesh-worker.ts`) to ensure 60fps slider fluidness even under heavy rib calculations (50+ ribs).
- **Geometry Pipeline:** Parametric waveform generation (trigonometric profiles, twist matrices, wall offset thickness, clay shrinkage ratio scaling) yielding guaranteed manifold, watertight meshes.
- **Privacy & Storage:** 100% client-side computing and local storage (`localStorage` / `IndexedDB`) with zero server overhead and zero telemetry.

## Milestone v2.0 Key Deliverables & Modules

1. **Website Copy & Positioning Overhaul:**
   - Eliminate engineering jargon ("Brep", "50B records", "CAD/CAM Micro-SaaS").
   - Replace with creator-first messaging: "Guaranteed Print-Ready", "Flawless toolpaths for clay, resin, and FDM", "Vase Mode (Spiralize) Compatible".
   - Feature spotlight for the **Clay Shrinkage Tool** (automatic dimensional compensation for ceramic kiln firing).

2. **Illustrating Work Showcase Gallery:**
   - Dedicated visual section showcasing high-end designer works crafted in Amonite (e.g., Fluted Ikebana Vase, Ribbed Nordic Planter, Pleated Ceramic Bowl, Twisted Biophilic Lamp Shell).
   - Real-world fabrication specifications (print time, material weight, clay shrinkage factor, slicer settings).

3. **Sculptor UI Paradigm & Base Archetypes:**
   - Remove mechanical CAD primitives (Cuboid, Sphere, Cylinder, Torus, 2D Extrude).
   - Introduce 4 Base Decor Archetypes: **Fluted Vase**, **Ribbed Planter**, **Organic Bowl**, **Twisted Lamp Shell**.
   - Replace XYZ coordinate axes with clean, tactile parametric sliders:
     - Base Diameter
     - Wall Thickness
     - Rib Count
     - Wave Frequency
     - Rotational Twist
   - Simplified Viewport: Remove engineering views (ISO, TOP, FRONT, SHADED); adopt fluid, auto-rotating 3D display with gallery lighting.

4. **Multi-Threaded Web Worker Mesh Engine:**
   - Dedicated Web Worker offloading parametric vertex/face generation loops, keeping UI at 60fps.
   - Manifold topology guarantee (zero non-manifold edges, continuous outward normals).
   - Instant watertight STL export directly optimized for Bambu Studio, PrusaSlicer, and Cura vase mode.

5. **Open-Source Core vs. Premium Boundary:**
   - **Amonite Core (Open Source):** Local procedural generation, base ribbed archetypes, standard STL export, ceramic/PLA shaders, local storage.
   - **Amonite Premium:** Commercial starter templates (Japandi, Brutalism, Organic Modern), batch generation for Etsy shop variations, advanced slip-cast mold split lines.
