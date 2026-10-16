# Amonite Tiers & Free-Tier Limits

> Companion to `payments-research.md`. Design rule: **free is structurally
> cheap, not just capped** — modeling, geometry, and all exporters run
> client-side, so free users burn ~$0 compute/bandwidth. Every
> server-touching action sits behind the login popup + a quota.

## 1. Tier × feature matrix

| Feature | Free (non-commercial) | Pro solo (~$12–16/mo) | Studio (~$24/editor/mo) | Enterprise |
|---|---|---|---|---|
| Viewport, primitives, gizmos, calipers | ✅ unlimited local | ✅ | ✅ | ✅ |
| STL / DXF / SVG / JSON export (client-side) | ✅ unlimited | ✅ | ✅ | ✅ |
| Local projects (localStorage / IndexedDB) | ✅ unlimited | ✅ | ✅ | ✅ |
| Cloud projects (login popup) | 3 projects, 25 MB | Unlimited, 50 GB | Unlimited, pooled 250 GB | Custom + residency |
| Version history | 7 days | Unlimited | Unlimited + branching | Audit log |
| Devices | 1 (this browser) | Cloud sync, unlimited | + shared team workspace | SSO/SCIM |
| Client view / share links | Watermarked preview only | 10 active links | Unlimited + commenting, viewers free | Custom-domain links |
| Commercial client work | ❌ license gate | ✅ | ✅ + consolidated billing | Invoice billing |
| Rendering (photoreal) | ❌ | ✅ metered credits | ✅ larger pool | Custom pool |
| CAM toolpaths | ❌ | ✅ basic (3-axis / laser) | ✅ advanced | Custom post-processors |
| AI assist (layouts, materials) | ❌ | ✅ metered credits | ✅ larger pool | Private models |
| Support | Community | Priority email | Dedicated | SLA + CSM |

## 2. Why these caps: burn-guard reasoning

- **Blobs, not JSON, are the budget.** A cloud project is ~10–100 KB of
  JSON; 3 projects ≈ <1 MB of DB. Thumbnails and shared assets are the hog
  — hence 25 MB total on free and no cloud thumbnails on free.
- **Keep exports client-side forever.** One server-side render/export
  endpoint would nuke the Workers free budget (100k req/day); never build
  it for free users.
- **Login popup = abuse gate.** Cloud save, share, and export-packs require
  verified email + Turnstile; bot farms never touch R2/D1.
- **Rate limits:** share-link creation (5/day free), per-key API ceilings.
- **Metered Pro pools** (render/AI credits) make GPU bills scale with
  revenue, never with free usage.

## 3. Infra budget @ ~1k users (Cloudflare-first, free tiers)

| Line | Free-tier fit | Paid click-over |
|---|---|---|
| Hosting (Pages, static) | $0 | $0–20 |
| Workers (auth-gated API only) | $0 within 100k req/day | $5+ if exceeded |
| R2 (25 MB × 1k free + Pro pools) | ~$0–2 over 10 GB free | $0.015/GB-mo, zero egress |
| D1 (metadata, entitlements) | $0 within 5 GB / 5M reads/day | $5+ |
| Email (verify/receipts, free 100/day tier) | $0 early | $20+ at scale |
| **Total early** | **≈ $0–10/mo** | Paywalled features fund it |

Scale-to-zero discipline (Neon-style or Workers-idle): idle users must cost
storage-cents only. Never run always-on compute for free-tier workloads —
an idle-but-awake database costs ~5x a sleeping one.

## 4. Guardrails to implement (private repo, with auth)

1. Per-user storage + project-count caps enforced server-side (never trust client).
2. Upload MIME/size validation (JSON + images only; reject binaries over cap).
3. Share links: signed, expiring, rate-limited creation.
4. Entitlement checks on every cloud write (plan, seats, commercial flag).
5. Credit pools: decrement per render/AI job, hard-stop at zero, top-up via checkout.
6. Abuse: Turnstile on signup, email verification before cloud write, per-IP throttles.
7. Kill-switches: disable new free-cloud signups without touching paid.

## 5. Open tuning question

Free cloud quota: **3 projects / 25 MB** (stingy, safest burn) vs **5–10
projects** (friendlier top-of-funnel, still inside free quotas while blobs
stay small). Decide with early waitlist conversion data.
