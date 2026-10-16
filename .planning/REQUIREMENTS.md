# Amonite CAD Requirements & Architecture Blueprint

## System Overview
Amonite is an industrial-grade, client-side CAD/CAM Micro-SaaS public application. The public repository provides an instant, zero-authentication browser modeling studio, technical documentation, and early access funnel.

## 1. High-Fidelity Rendering & Viewport (REQ-VIEW)
- **REQ-VIEW-01 (Must):** WebGL hardware-accelerated 3D viewport powered by Three.js with OrbitControls (pan, zoom, orbit).
- **REQ-VIEW-02 (Must):** Dual-mode projection support: Perspective and Orthographic camera modes with instant smooth transition.
- **REQ-VIEW-03 (Must):** Standard CAD view presets: Isometric, Top (+Z), Front (+Y), Right (+X), Bottom, Back, Left.
- **REQ-VIEW-04 (Must):** Dynamic CAD snap grid with millimeter/inch unit switching, major/minor divisions, and origin crosshair.
- **REQ-VIEW-05 (Must):** XYZ orientation coordinate triad (gizmo) rendered in the lower corner of the viewport.
- **REQ-VIEW-06 (Must):** Multiple shading styles: Solid Shaded, Wireframe Overlay, Pure Wireframe, and Technical Hidden-Line Dark Mode.

## 2. Geometric Primitives & Drafting Engine (REQ-GEOM)
- **REQ-GEOM-01 (Must):** Parametric solid generation: Box / Cuboid, Cylinder, Sphere, Torus, Cone, and Extruded 2D Polygon.
- **REQ-GEOM-02 (Must):** Transform gizmo support: Translate (X, Y, Z), Rotate (roll, pitch, yaw), and Uniform/Non-uniform Scale.
- **REQ-GEOM-03 (Must):** Real-time numeric property inspector for instant dimension adjustments (width, height, depth, radius, segments).
- **REQ-GEOM-04 (Must):** Grid snap calculation: client-side snapping to configurable grid steps (e.g., 1mm, 5mm, 10mm, 25mm).
- **REQ-GEOM-05 (Should):** Multiple object selection, duplication (Ctrl+D), grouping, and deletion.

## 3. High-Frequency State Store (REQ-STATE)
- **REQ-STATE-01 (Must):** Decoupled Zustand state store to isolate mouse coordinate streams, hover nodes, and camera matrix from React component tree re-renders.
- **REQ-STATE-02 (Must):** Full Undo / Redo history ring buffer supporting 50+ actions with `Ctrl+Z` / `Ctrl+Y`.
- **REQ-STATE-03 (Must):** Local workspace persistence using browser `localStorage` and `IndexedDB` with automatic debounced autosave.

## 4. Local Importers & Exporters (REQ-IO)
- **REQ-IO-01 (Must):** STL Exporter: Generate standard binary and ASCII `.stl` files client-side for 3D printing and CNC slicers.
- **REQ-IO-02 (Must):** DXF 2D/3D Vector Parser & Exporter: Read/write standard ASCII DXF entity structures (LINES, POLYLINE, 3DFACE).
- **REQ-IO-03 (Must):** SVG Vector Importer: Parse 2D SVG paths and convert them to extruded 3D geometry.
- **REQ-IO-04 (Must):** Amonite Native Project (`.amonite.json`): Lossless JSON export and import preserving scene hierarchy, dimensions, and camera state.

## 5. UI/UX & Brand Aesthetics (REQ-UI)
- **REQ-UI-01 (Must):** Industrial Dark Mode palette (`#08090a`, `#0f1115`, `#181b21`, technical borders `#262b36`, cyan/electric accent `#00e5ff`).
- **REQ-UI-02 (Must):** Full integration of the ammonite shell `logo-mark.svg` across top navigation, splash screen, and viewport watermark.
- **REQ-UI-03 (Must):** Zero-auth CAD playground accessible immediately on the homepage without account registration.
- **REQ-UI-04 (Must):** Technical Documentation route (`/docs`) with shortcuts, mathematical coordinate conventions, and file format specs.
- **REQ-UI-05 (Must):** Early access / waitlist signup form capturing user email and routing to `amoniteadmin@gmail.com`.

## 6. Engineering & CI/CD Standards (REQ-OPS)
- **REQ-OPS-01 (Must):** GitHub Actions workflow (`.github/workflows/ci.yml`) testing TypeScript builds and ESLint.
- **REQ-OPS-02 (Must):** Clean `README.md` and `CONTRIBUTING.md` setting up local open source development standards.
- **REQ-OPS-03 (Must):** Strict security segregation: zero authentication gates, payment routes, or server-side DB dependencies in this public repository.
