# Architecture: amonite-core Target Layout (PRD v1.0.0 §4)

> Authority: `docs/PRD-v1.0.0-amonite.md` §4–§5. Docs-only phase — no code moved yet.

## 1. Target tree (PRD §4 verbatim intent)

```text
amonite-core
 ├── .github/workflows/ci.yml   # lint, type-check, build verify (exists — keep)
 ├── public/                    # OPEN-2: PRD wants orange snail `icon.svg`; current `logo-mark.svg` stays until ruled
 └── src/
     ├── core/                  # NEW — pure math, no React, no Three.js scene code
     │   ├── math/              # parametric waveforms, Fibonacci spirals, twist matrices
     │   │   └── vaseEngine.ts  # Phase 6 spec: params → vertices (rib count, wave freq, twist, base dia)
     │   └── mesh/              # STL generation, topology maps, manifold checkers
     ├── components/            # textless sliders + minimal canvas window (exists under src/components/)
     └── workers/               # NEW — mesh-worker offloads vertex loops, 60fps sliders
```

## 2. Current actual (v1.0) → target mapping

| Current path | Status | Target |
|---|---|---|
| `src/lib/geometry-engine.ts` (box/cyl/sphere/torus/cone/extrusion) | LEGACY — do not extend | Sandbox-only; extrusion path `:48-72` + torus/cone branches frozen |
| `src/lib/parsers/stl-exporter.ts` | RETAIN + harden | Backs `src/core/mesh/` manifold guarantee (REQ-PRINT-01/02) |
| `src/lib/parsers/dxf-parser.ts`, `svg-parser.ts` | LEGACY | Move off landing → `/docs` only |
| `src/store/cad-store.ts` | RETAIN | Local pipeline; vase params slice added in Phase 6 |
| `src/lib/storage.ts`, `project-io.ts` | RETAIN | `.amonite.json` local persistence, zero cloud |
| `src/components/cad/*`, `src/components/ui/*` | RETAIN | Preview renderer; landing hero strips HUD per Appendix A4 |
| `src/core/math/vaseEngine.ts` | NEW (spec only) | Trig coordinate loops isolated from prototype (PRD §5 step 1) |
| `src/workers/mesh-worker.ts` | NEW (spec only) | Vertex-gen off main thread (PRD §5 step 2) |

## 3. Phase 6 sequencing (after this docs freeze)

- `06-01` Docs freeze (this set) + `PROJECT.md` pivot note — DONE.
- `06-02` `vaseEngine.ts` **interface spec only**: param types, return contracts, manifold-check signatures. No implementation.
- `06-03` Worker contract: message protocol, fallback if Worker unavailable.
- `06-04` Landing rewrite per `docs/design/landing-designer-first.md`.
- PRD's closing questions answered in order: vaseEngine module first, `.gitignore` production hygiene with it — never before the spec.
