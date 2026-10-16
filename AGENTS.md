<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Amonite CAD — agent notes

Next.js 16 App Router + React 19 + TS strict (`@/*` → `src/*`). Tailwind 4 via `@tailwindcss/turbopack` (see `next.config.ts`: `cacheComponents`, `partialPrefetching`). Node 20 / npm 9+ (`npm ci` in CI).

## Commands (PowerShell)

- `npm install` then `npm run dev` → `/` landing, `/sandbox` studio. E2E dev server is `-p 3100`, not 3000.
- Validate in this order: `npx tsc --noEmit; if ($?) { npm run lint }; if ($?) { npm run build }` (`typecheck` = `tsc --noEmit`, `lint` = `eslint` with `eslint-config-next` core-web-vitals + typescript).
- Tests are split — run the narrowest tier that covers your change:
  - `npm run test:minute` — Tier 1 unit, node env: `src/lib/**/*.test.ts`, `src/store/**/*.test.ts`
  - `npm run test:primary` — Tier 2 app, jsdom: `src/components/**/*.test.tsx`, `src/app/**/*.test.tsx` (3D canvas is mocked — see `src/app/routes.test.tsx:5-6`)
  - `npm run test` = both tiers; `npm run test:coverage` enforces gates (stmts 85 / branches 70 / funcs 80 / lines 85)
  - `npm run test:e2e:smoke -- --project=chromium` (PR gate) vs `npm run test:e2e:full` (chromium + firefox + mobile, main only)
- `tsconfig.json` excludes `**/*.test.*`, `tests/`, vitest/playwright configs — `typecheck` does not cover tests.

## CI split

- `ci.yml` (PRs): typecheck + lint, minute, primary, E2E `@smoke` on chromium. Keep it <5 min.
- `ci-main.yml` (main only): coverage gates, `build` + bundle report, full E2E matrix, `npm audit --omit=dev --audit-level=high`, segregation guard.

## Hard constraint: public-repo segregation

This repo must stay zero-auth with no payment/DB code. `ci-main.yml` fails if `src/` matches `stripe|paddle|lemonsqueezy|dodo.?payments|next-auth|clerk|supabase|prisma|drizzle|DATABASE_URL|STRIPE_.*KEY|api/(billing|checkout|webhooks?)`. Marketing copy (e.g. "billing" on `/pricing`) is fine — code signals only. Never add auth/billing/DB deps or routes here.

## Architecture

- `src/app/`: `/` landing, `/sandbox` single-vessel atelier, `/docs`, `/pricing`. Sandbox scope guard: orbit/pan/zoom + Reset view only — no scene tree, primitive toolbar, inspector, camera-preset bar, grid, or calipers.
- `src/store/cad-store.ts` (Zustand): single source of truth — nodes, viewport, undo/redo (capped at 30), singular `vessel-1` node. High-frequency viewport/cursor state is isolated from re-renders; vessel slider drags use `beginVesselDrag`/`setVesselParams`/`commitVesselHistory` to coalesce history.
- `src/lib/`: `cad-types.ts` (all shared types), `vessel-geometry.ts` (`VESSEL_ARCHETYPES` + defaults), `geometry-engine.ts`, `parsers/` (STL/DXF/SVG/project-io, all client-side), `storage.ts` (`localStorage` key `amonite_cad_workspace_autosave`), `batch-zip.ts`.
- `src/components/`: `cad/` (canvas, vessel studio), `io/`, `landing/`, `pricing/`, `ui/` (shadcn `base-nova`, `rsc:true`, neutral, `iconLibrary: remixicon`; aliases in `components.json`).
- Autosave is debounced `localStorage` with `Ctrl+Z` / `Ctrl+Y` undo/redo.

## Design + copy freeze (`DESIGN.md` is authoritative)

- No gradients/glow shadows, no 3-equal-column feature rows, no centered hero stacks, hairlines (`white/[0.06–0.08]`) not boxed cards; `rounded-lg` only (sandbox pills excepted). Landing: paper `#fbfaf7`/dark `#121110`, terracotta `#c28456`; sandbox: stage `#161310`, panels `#1e1a15`/`#1c1712`, terracotta `#c96f4b`, clay finishes Sandstone/Terracotta/Porcelain/Obsidian. Outfit display + JetBrains Mono labels/HUD.
- Vessel micro-copy only (Fluted Vase, Brutalist Planter, Organic Bowl, Twisted Cylinder; Base radius, Wall thickness, Rib count, Wave, Twist; finishes; Kiln Shrinkage +9.5/+11.8/+14.2%). Landing copy targets designers, not engineers (no Brep/manifold/watertight/slicer/DXF-R12 in first two viewports).
- Byte-identical strings asserted by `src/app/routes.test.tsx` and `e2e/*.spec.ts` (e.g. "Sculpt bespoke minimal vases & interior decor, right in your browser.", "Open Studio Sandbox", "AMONITE", "Base forms", "Shape the clay", "Reset view"). Do not reword when restyling.
