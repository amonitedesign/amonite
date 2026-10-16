# Landing Spec: Designer-First (PRD v1.0.0 UI)

> Authority: `docs/PRD-v1.0.0-amonite.md` §2 + `DESIGN.md` Appendix A.
> Scope: `src/app/page.tsx` + `src/components/ui/navbar.tsx` only. `/sandbox` untouched.

## 1. IA (single page, calm order)

1. **Nav (product):** `Amonite | Studio, Objects, Process, Pricing | Open Studio + Join Waitlist`. Drop `File I/O`, `Launch CAD`, `Architecture & Specs`, GitHub-icon-in-logo-row (move to footer).
2. **Hero — outcome, not tool:** eyebrow `Object Atelier for Designers`; H1 direction `Shape vessels with proportion you can feel` (final copy in build); 1-line sub on curve/proportion/material; 2 CTAs (strings unchanged until OPEN-3 ruled). Right: pedestal canvas — no toolbar/view-controls overlay, caption `No. 04 — Fluted Vessel, stoneware`.
3. **Collection strip:** 3–4 object studies with names (live canvas states until renders exist). Trust signal for Etsy/decor buyers.
4. **Process `Sketch → Form → Object`:** numbered typographic rows `01/02/03`, no 3-col cards. Language: silhouette, curve tension, wall, foot, glaze.
5. **Craft detail (one, quiet):** material/light close-up + 2 lines on proportion control. Replaces `OBJECT MORPHOLOGY` code block.
6. **Making (collapsed one row):** `From studio to kiln — one export`, `STL / DXF / SVG` as plain text links → `/docs`. No byte/packer/slicer-model copy.
7. **Designer proof:** 2 short quotes + studio names (currently zero — required before ship).
8. **Final CTA:** single calm band. Remove duplicate pricing upsell from landing; link out to `/pricing`.
9. **Footer:** product footer, GitHub + documentation links low-contrast.

## 2. Copy voice

- USE: silhouette, profile, curve, proportion, foot, rim, wall, collection, glaze, stoneware, cast, fire.
- BAN in hero + first 2 viewports: Brep, manifold, watertight, telemetry, slicer, parametric, 50B, DXF R12, `FABRICATION PIPELINE`, `SLICER READY`, `ATELIER METHODOLOGY`, `PRIVATE ATELIER INVARIANT`, code-block exports.
- Current violations to remove: `src/app/page.tsx:54-71` telemetry grid, `:180-185` code callout, `:164-198` tile headers, `:97-118` canvas header/HUD.

## 3. Visual (per DESIGN.md + Appendix A)

- Base: warm paper `#fbfaf7 / #181715`, NOT cyan-dark IDE. Display Outfit H, quiet body, mono eyebrows only.
- Left-anchored headlines, asymmetric hero (~7/5), `py-24` air, hairlines `border-white/8` or spacing — no boxed bento, no gradients/glows/pills.
- Canvas frame: `rounded-2xl`, no header bar jargon, no floating HUD, fading hint max.

## 4. Test impact (build phase)

- `e2e/smoke.spec.ts:9-10` + `src/app/routes.test.tsx:42-43` assert `Sculpt minimal 3D objects` / `Open Studio Sandbox`. Any H1/CTA rename requires updating both. Default: keep strings, restyle only.
- Verify: `npm run test`, `npx playwright test e2e/smoke.spec.ts`, light/dark check, zero console errors.
