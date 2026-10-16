# Monetization Bridge: PRD Tiers ↔ Repo Tiers (PRD v1.0.0 §4)

> Authority: `docs/PRD-v1.0.0-amonite.md` §4 Tier table. Companion docs
> `docs/tiers-and-limits.md` + `docs/payments-research.md` stay untouched.

## 1. PRD tiers (frozen)

| Tier | Distribution | Included Value |
|---|---|---|
| Amonite Core | Public (AGPL-3.0 Copyleft — PROPOSED, see OPEN-1) | Local single-mesh rendering, basic trig wave profiles, standard low-res STL exports, local canvas styling |
| Amonite Premium | Private / Gated Module | Tuned preset curves, high-fidelity production geometry, multi-file batch automation, cloud asset library sync |

Rule: Core compute stays at $0 (client-side only, no server geometry endpoint). Premium monetizes at the module/infrastructure boundary, not by gating Core math.

## 2. Mapping to current repo tiers

| PRD tier | Repo equivalent | Note |
|---|---|---|
| Core (public) | Free (non-commercial) in `tiers-and-limits.md:10-14` | Aligns: unlimited local viewport/exports/projects, client-side = ~$0 burn. AGPL proposal unapplied — repo still MIT (`README.md:119`). |
| Premium (gated) | Pro solo + Studio in `tiers-and-limits.md:10-24` | Aligns: tuned curves → Pro presets; hi-fi/batch/cloud-sync → metered credits + cloud projects + share links. Auth-gated, server-enforced (guardrails `:54-68`). |
| — | Enterprise | Repo-only extension, no PRD conflict. |

## 3. OPEN-1 license conflict (flagged, not resolved)

- PRD §4: Core AGPL-3.0 Copyleft.
- Current: MIT (`README.md:119`, `LICENSE`).
- This freeze changes NEITHER. Ruling required before any `LICENSE` edit or `package.json` license field change. CI segregation guard (`.github/workflows/ci.yml` + `STATE.md` Decision 10) stays: zero auth/billing/paywall in public repo regardless.
