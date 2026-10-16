# Product Direction — Affirmed 2026-10-16

> This is the correct direction. The studio pivot, the workflow, and the
> monetization track below are all progressing correctly — hold this course.
> See `.planning/STATE.md` (Decision 16) and `docs/PRD-v1.0.0-amonite.md`.

## 1. The pivot is right: Parametric Decor Studio, not generic CAD

- Audience: interior decorators, ceramicists, Etsy boutique makers —
  **not** mechanical engineers (see `docs/REQUIREMENTS-vase.md`).
- The `/sandbox` studio in its current state is the reference: vessel
  archetypes + tactile sliders + finishes + kiln/shrinkage tooling +
  print-certification + Etsy batch export. This composition is the product.
- Mechanical primitives/XYZ gizmos stay out of the primary interface
  (STATE.md Decision 12). Phases 7–9 (math kernel, sculptor UI, print
  export + tiers) build on this foundation — do not relitigate the pivot.

## 2. The workflow that works — keep it

1. **Screenshot-verify against the live dev server** (`/sandbox` @1440×900
   minimum). Unit tests were green while the viewport showed no vessel —
   tests alone do not catch rendering divergence.
2. **UI–store divergence protocol** (`docs/architecture/studio-viewport-record.md`):
   clean console + missing mesh ⇒ traverse the live scene first.
3. **Gates stay green**: `typecheck` → `lint` → `test:minute` →
   `test:primary` → `build` → chromium E2E (CI). No commit without them.
4. **Segregation guard is load-bearing**: zero payment/auth/DB code in this
   public repo. Marketing words are fine; SDKs, secrets, and billing
   routes are not. All gateway work lives in the private vault
   (`docs/payments-research.md`).

## 3. Monetization track (unchanged, aligned)

- Free (non-commercial, local-first) → Pro solo → Studio (viewers free) →
  Enterprise later (`docs/tiers-and-limits.md`, `docs/monetization/tiers-mapping.md`).
- `/pricing` page (cascading Free/Pro/Studio tiles) is the conversion
  surface; tile CTAs are waitlist-per-plan until billing opens. Pro and
  Early Access stay separate concepts everywhere (navbar, sandbox header,
  landing).
- Money features live in the studio panel (Etsy ZIP batch, STL export) —
  keep the CTA sticky and above the fold on all viewport heights.

## 4. What "correct direction" means for the next work

- Phase 7–9 as planned; any new viewport work reuses `applyCameraPreset` /
  `vesselFrame` and the teardown discipline from the fix record.
- Every studio change ships with a screenshot check, not just tests.
- Docs first for product decisions (`docs/`), code second; planning state
  (`STATE.md`) updated with each decision.
