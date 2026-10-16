# Phase 1: UI Design Contract (UI-SPEC)

**Phase:** 01-project-setup-core-viewport-foundation  
**Date:** 2026-10-16  
**Status:** Approved  

## 1. Visual Design Philosophy & Aesthetics
Amonite employs an industrial dark-mode design system tailored for engineering professionals, CAD technicians, and additive manufacturers. It avoids standard stock colors and leverages a high-contrast slate-and-cyan palette reminiscent of precision aerospace and machining consoles.

---

## 2. Color Palette & Design Tokens

| Token | Hex Value | Usage |
| :--- | :--- | :--- |
| `color-bg-base` | `#08090b` | Main window background |
| `color-bg-canvas` | `#0c0e12` | 3D WebGL viewport canvas background |
| `color-bg-panel` | `#101216` | Floating HUD toolbars, inspectors, and trees (90-95% opacity backdrop blur) |
| `color-border-subtle` | `#1f2430` | Structural dividers and panel borders |
| `color-border-active` | `#272d3b` | Interactive button borders and hover states |
| `color-accent-primary` | `#00e5ff` | Primary technical cyan accent (active states, wireframe highlights, glow) |
| `color-accent-blue` | `#38bdf8` | Secondary engineering accent (camera modes, coordinate gizmo) |
| `color-text-primary` | `#f1f5f9` | High-contrast titles and numerical dimensions |
| `color-text-secondary`| `#94a3b8` | Parameter labels, descriptions, and axis markers |
| `color-text-muted` | `#64748b` | Disabled buttons, metadata, and shortcuts |

---

## 3. Typography Hierarchy
- **Display & Headings:** `Outfit` (sans-serif, geometric, high-precision).
- **Code, Telemetry & Coordinates:** `JetBrains Mono` (monospace, tabular numbers).

---

## 4. Shell Component Contracts

### 4.1 Top Application Bar
- **Height:** 48px (`h-12`).
- **Brand:** Embedded `logo-mark.svg` (24x24px) with cyan border and subtle glow.
- **Controls:** Import/Export modal trigger, Local Autosave indicator badge, Early Access CTA.

### 4.2 Floating CAD Toolbar
- **Position:** Top center (`top-4 left-1/2 -translate-x-1/2`), floating with `z-index: 20`.
- **Background:** `#101216` with `backdrop-blur-md` and `#232733` border.
- **Tools:** Modes (`V`, `G`, `R`, `S`), Primitives (`Box`, `Cylinder`, `Sphere`, `Torus`, `Extrude`), History (`Undo`, `Redo`), Selection ops (`Duplicate`, `Delete`).

### 4.3 Viewport HUD & Orientation Triad
- **Position:** Bottom left (`bottom-4 left-4`).
- **Components:** View Presets (`ISO`, `TOP`, `FRONT`, `RIGHT`), Projection toggle (`PERSP` / `ORTHO`), Shading mode (`SHADED` / `WIREFRAME`), Grid snap toggle, Cursor coordinate telemetry (`X`, `Y`, `Z`).
