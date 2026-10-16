# Amonite Vase-Studio Requirements (PRD v1.0.0 scope)

> Authority: `docs/PRD-v1.0.0-amonite.md` §3–§4. This file scopes v1.1 away from
> generic CAD. Old blueprint `.planning/REQUIREMENTS.md` (REQ-GEOM / REQ-VIEW /
> REQ-IO for mechanical primitives) is retained as v1.0 build history, not direction.

## 1. Vase parametric core (REQ-VASE)

- **REQ-VASE-01 (Must):** Slider-driven rib/profile morphing: Base Diameter,
  Rib Count, Wave Frequency, Rotational Twist. Trig wave → coordinate matrix,
  60fps fluid preview (worker-offloaded per PRD §3).
- **REQ-VASE-02 (Must):** Single-mesh vessel output only. Shell- and rib-based
  decor items: vases, plant pots, centerpiece vessels, lighting shells/lampshades.
- **REQ-VASE-03 (Must):** Vase-mode-friendly profiles: continuous single-wall
  extrusion compatible (`spiralize outer contour` in Cura / PrusaSlicer / Bambu Studio).
- **REQ-VASE-04 (Should):** Commercially tuned preset curves (Premium-gated):
  Japandi, Minimalism, Brutalism starter families.

## 2. Print guarantee (REQ-PRINT)

- **REQ-PRINT-01 (Must):** Guaranteed watertight (manifold) pipeline:
  continuous vertices, closed face connectivity, outward normals. Zero slicer
  errors, zero hollow-space dropouts.
- **REQ-PRINT-02 (Must):** Direct-to-print `.STL` export, uncompressed,
  optimized for Cura / PrusaSlicer / Bambu Studio. Reuses
  `src/lib/parsers/stl-exporter.ts` — no new format work in Core.
- **REQ-PRINT-03 (Must):** 100% client-side generation in open-source layer.
  Zero server compute for Core geometry (PRD §3 out-of-scope cloud rule).

## 3. Negative scope — strictly rejected (REQ-NEG)

- **REQ-NEG-01 (Must NOT):** No multi-part assemblies — no joints, hinges,
  screws, mating logic.
- **REQ-NEG-02 (Must NOT):** No boolean modeling — no cutting, manual solid
  sketching, sculpt toolsets.
- **REQ-NEG-03 (Must NOT):** No cloud engine overhead in Core — no server-side
  geometry, no render/export endpoint for free users.

## 4. Old → new mapping (v1.0 generic → v1.1 vase studio)

| v1.0 (`.planning/REQUIREMENTS.md`) | v1.1 ruling |
|---|---|
| REQ-GEOM-01 box/cylinder/sphere/torus/cone/extrusion | LEGACY — keep in `/sandbox` only, do not extend, do not surface on landing |
| REQ-GEOM-02/03 transform gizmos + numeric inspector | LEGACY chrome for sandbox; vase studio uses slider/profile controls instead |
| REQ-GEOM-04 grid snap 1/5/10/25mm | RETAIN in sandbox; vase studio uses mm wall/foot/rim readouts, not grid copy on landing |
| REQ-VIEW-* orbit/ortho/presets/gizmo/shading | RETAIN as preview renderer only; strip HUD jargon from landing hero |
| REQ-IO-01 STL exporter | RETAIN + harden with manifold guarantee (REQ-PRINT-01/02) |
| REQ-IO-02/03 DXF/SVG | LEGACY — move to `/docs`, remove from landing first viewport |
| REQ-IO-04 `.amonite.json` | RETAIN for local persistence only |
| REQ-UI / REQ-OPS | SUPERSEDED by `DESIGN.md` Appendix A + `docs/design/landing-designer-first.md` for voice; CI guard stays |

## 5. Code touch map (no implementation in this phase)

- NEW `src/core/math/vaseEngine.ts` — param interface + trig coordinate loops (Phase 6 spec).
- NEW `src/workers/mesh-worker.ts` — offload vertex loops, keep sliders at 60fps.
- MARK `src/lib/geometry-engine.ts:48-72` extrusion path + torus/cone branches — legacy-generic, do not extend.
- KEEP `src/lib/parsers/stl-exporter.ts`, `src/store/cad-store.ts`, `src/lib/storage.ts` — Core local pipeline.
