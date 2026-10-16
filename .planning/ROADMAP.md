# Amonite CAD Development Roadmap

## Phase 1: Project Setup & Core Viewport Foundation (Complete)
- [x] Next.js App Router, TypeScript, Tailwind CSS configuration
- [x] Official `logo-mark.svg` asset integration from `Logo/IMAGE.svg`
- [x] Core Zustand high-frequency state store for viewport and CAD models
- [x] WebGL Three.js hardware-accelerated viewport with OrbitControls
- [x] Dual-mode camera projection (Perspective / Orthographic) & view orientation presets (Top, Front, Right, Isometric)
- [x] Adaptive technical grid system with millimeter snap coordinates

## Phase 2: Parametric Geometry & Transform Engine (Complete)
- [x] Parametric 3D solid primitives (Cuboid, Cylinder, Sphere, Torus, Extruded Polygon)
- [x] Direct manipulation transform gizmos (Translate, Rotate, Scale)
- [x] Dynamic technical inspection panel with real-time numeric inputs and dimensions
- [x] Real-time wireframe, shaded, and technical hidden-line rendering styles
- [x] Undo / Redo history engine with shortcut bindings (`Ctrl+Z`, `Ctrl+Y`)

## Phase 3: Client-Side Parsers, Exporters & Session Memory (Complete)
- [x] Binary and ASCII `.stl` exporter for 3D printing
- [x] DXF 2D/3D parser and vector path exporter
- [x] SVG path parser and 3D extrusion generator
- [x] Lossless `.amonite.json` project file import/export
- [x] Persistent client-side session store using browser `localStorage` and `IndexedDB`

## Phase 4: Landing Page, Documentation & Early Access Funnel (Complete)
- [x] High-impact industrial hero section with live 3D ammonite model & interactive CAD sandbox
- [x] Technical documentation workspace (`/docs`) with coordinate definitions, shortcuts, and format specs
- [x] Early access & waitlist submission modal with validation and routing to `amoniteadmin@gmail.com`
- [x] Responsive UI for mobile/tablet inspection and full desktop modeling studio

## Phase 5: CI/CD Workflows & Public Repository Governance (Current)
- [ ] GitHub Actions workflow (`.github/workflows/ci.yml`) with automated type-checking and linting
- [ ] Open-source contribution guidelines (`CONTRIBUTING.md`) and comprehensive `README.md`
- [ ] Public repository safety verification ensuring zero authentication or payment leaks
