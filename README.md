# Amonite CAD // High-Performance Browser-Based CAD/CAM Micro-SaaS

<p align="center">
  <img src="public/logo-mark.svg" alt="Amonite CAD Logo" width="120" height="120" />
</p>

<p align="center">
  <strong>Zero-Auth, Hardware-Accelerated 3D WebGL Solids Modeling, 2D Vector Drafting, and Manufacturing Interchange</strong>
</p>

<p align="center">
  <a href="#key-features">Key Features</a> •
  <a href="#tech-stack">Tech Stack</a> •
  <a href="#architecture-segregation">Architecture</a> •
  <a href="#quickstart">Quickstart</a> •
  <a href="#shortcuts">Shortcuts</a> •
  <a href="#license">License</a>
</p>

---

## Overview

**Amonite** is an industrial-grade, client-side CAD/CAM Micro-SaaS public application built for mechanical engineers, industrial designers, additive manufacturing technicians, and digital fabricators.

Amonite bypasses all registration barriers, running an instant 3D WebGL solids modeling sandbox right on your browser canvas with client-side mathematical matrix operations, millimeter grid snapping, dynamic parametric inspector, and fast local STL/DXF parsing.

## Key Features

- **Hardware-Accelerated 3D WebGL Viewport:** Powered by Three.js with OrbitControls, TransformControls, and multi-source studio lighting.
- **Dual-Mode Projection:** Seamlessly switch between Perspective 3D rendering and true Orthographic 2D/3D engineering views.
- **Parametric Solid Primitives:** Generate Cuboids, Cylinders, Spheres, Tori, Cones, and extruded 2D Polygons with dynamic dimension inspection.
- **Manufacturing File Interchange:**
  - **STL (Binary & ASCII):** Export direct triangle meshes for 3D printing slicers (Bambu Studio, Cura, PrusaSlicer).
  - **DXF (AutoCAD R12 ASCII):** Read and write vector CAD lines for CNC routing and laser cutting.
  - **SVG:** Export 2D orthographic projection diagrams or import 2D vector paths into 3D extrusions.
  - **Amonite Native JSON:** Lossless full project backup and restoration.
- **High-Frequency Zustand Store:** Coordinates, camera matrices, and transform states isolated from React tree re-renders for 120fps fluid interaction.
- **Local Workspace Persistence:** Automatic background autosave to browser `localStorage` and `IndexedDB` with zero external telemetry.
- **Zero-Auth Playground:** Immediate CAD utility without logins, cookies, or paywalls.

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript 5 (Strict Mode)
- **Styling:** Tailwind CSS 4 + Industrial Dark Theme
- **3D Graphics:** Three.js (WebGL Hardware Acceleration)
- **State Store:** Zustand
- **Icons:** Lucide React
- **Typography:** Outfit & JetBrains Mono

## Architecture Segregation

This repository represents the **Public Core Ecosystem**:
- **Included:** Core WebGL canvas, geometric primitives, transform gizmos, local file parsers, documentation workspace (`/docs`), and waitlist conversion funnel.
- **Excluded (Reserved for Private Enterprise Vault):** Authentication gates, subscription billing, server-side database schemas, multi-tenant cloud sync, and enterprise CAM post-processors.

## Quickstart

### Prerequisites
- Node.js 18+ (tested on Node v20/v24)
- npm 9+

### Setup & Run
```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev
```

Navigate to [http://localhost:3000](http://localhost:3000) for the landing page with live CAD hero, or [http://localhost:3000/sandbox](http://localhost:3000/sandbox) for the fullscreen studio.

### Validation
```bash
# Typecheck
npx tsc --noEmit

# Lint
npm run lint

# Production Build
npm run build
```

## Interactive Hotkeys

| Shortcut | Description |
| :--- | :--- |
| **`V`** | Select Tool (Focus entity) |
| **`G`** | Translate / Move Gizmo |
| **`R`** | Rotate Gizmo (15° snap) |
| **`S`** | Scale Gizmo |
| **`Ctrl + Z`** | Undo geometric modification |
| **`Ctrl + Y`** | Redo geometric modification |
| **`Ctrl + D`** | Duplicate selected entity |
| **`Delete`** | Delete selected entity |

## Contact & Early Access

For feedback, custom CAM integration inquiries, or early access to cloud vaults:
- **Email:** `amoniteadmin@gmail.com`
- **Waitlist:** Available directly within the application shell.

---
© Amonite CAD. Distributed under the MIT Open Source License.
