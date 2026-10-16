# Phase 2: UI Design Contract (UI-SPEC) - Geometry & Transform Controls

**Phase:** 02-parametric-geometry-transform-engine  
**Date:** 2026-10-16  
**Status:** Approved  

## 1. Interaction & Inspection Panel Contracts

### 1.1 CAD Toolbar Additions
- **Primitives Group:**
  - Icons: Box, Cylinder, CircleDot (Sphere), Donut (Torus), Layers (Extrusion).
  - Hover effect: `hover:bg-slate-800 text-slate-400 hover:text-cyan-300`.
  - Click feedback: Spawns entity at origin with grid offset, sets selection.
- **Transform Modes:**
  - Active indicator: Cyan glow `border-cyan-500/40 text-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.25)]`.
  - Tooltips with hotkeys: `Select (V)`, `Move (G)`, `Rotate (R)`, `Scale (S)`.

### 1.2 Numeric Property Inspector Contracts
- **Position & Rotation Rows:**
  - Distinct colored axis badges: X (Red `#f87171`), Y (Green `#4ade80`), Z (Blue `#60a5fa`).
  - Right-aligned tabular numeric input boxes with `#161a22` background and `#272d3b` border.
- **Parametric Dimension Controls:**
  - Contextual parameter fields displayed dynamically based on `node.type`:
    - `box`: Width, Height, Depth (step = 5mm).
    - `cylinder` & `cone`: Radius, Height (step = 5mm).
    - `sphere`: Radius (step = 5mm).
    - `torus`: Main Radius, Tube Radius (step = 2mm).
    - `extrusion`: Extrusion Depth.
- **Material Color Picker:**
  - Color swatch square with hex value readout.

### 1.3 Scene Hierarchy Tree Contracts
- **Item Rows:**
  - Left icon indicating primitive type.
  - Editable node label.
  - Visibility eye toggle (`Eye` / `EyeOff`).
  - Delete trash icon (`Trash2`).
  - Active selection highlighting with cyan border and subtle glow.
