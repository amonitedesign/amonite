# Amonite Pro — Payment Gateway Research

> Status: research doc, no implementation. All billing code belongs in the
> **private vault repo** — this public repo stays zero-auth per `PROJECT.md`
> and the `ci-main.yml` segregation guard. Last reviewed: 2026-10-16.

## 1. Audience

- **Solo interior designers / fabricators:** 1 seat, monthly or annual sub.
  Price-sensitive, buy with a card, want to show work to clients.
- **Studios (2–20 seats):** per-editor seats + free client viewers, shared
  workspace, consolidated billing.
- Non-audience for v1: enterprise (custom invoicing, SSO) — tracked, not built.

## 2. The real decision: Merchant of Record vs payment processor

| | Stripe (PSP) | Paddle (MoR) | Lemon Squeezy (MoR) |
|---|---|---|---|
| Headline fee | 2.9% + 30¢ | 5% + 50¢ | 5% + 50¢ |
| Seller of record | **You** | Paddle | Lemon Squeezy |
| Global VAT / sales tax | You file (or pay for Stripe Tax) | Included, 200+ jurisdictions | Included |
| Chargeback / fraud burden | Mostly yours | Handled in MoR layer | Handled in MoR layer |
| Usage-based / metered billing | Excellent | Good | Limited |
| Checkout flexibility | Full API control | Less flexible, rigorous approval | Beautiful hosted, simplest setup |
| Independence risk | Independent | Independent | **Owned by Stripe since 2024**; MoR folded into Stripe Managed Payments (2026) |
| Best for | Max control, usage billing | B2B SaaS, enterprise procurement | Solo founders who value speed |

**Effective-cost math (worked examples for planning):**

- $10K MRR, 100 customers × $100: MoR ≈ $550/mo all-in (5.5%).
  Stripe ≈ $3,050/yr-equivalent $305/mo + your tax-compliance labor.
- At $100K MRR / 500 customers: Stripe ≈ $3,050/mo vs MoR ≈ $5,500/mo —
  the gap (~$2.4K/mo) is the price of outsourcing your tax department.
- Cross-border flips the headline: Stripe +1.5% intl cards +1% FX pushes
  effective rates to ~4.4–4.7%, narrowing the gap for non-US customers.

**Recommendation stance: undecided — compare in build phase.** Default lean:
start with a **Merchant of Record** (no finance team, global designers from
day one), revisit Stripe direct when MRR justifies the compliance overhead
or when metered AI/render billing needs Stripe-level flexibility.

## 3. Pricing anchors (design-tool market, 2026)

| Product | Free | Entry paid | Top tier |
|---|---|---|---|
| SketchUp | Web modeler, 10 GB, non-commercial | Go $129/yr | Studio ~$859/yr |
| Figma | Starter (caps) | Professional $16/editor/mo | Org $55, Enterprise $90 |
| Onshape | Full CAD, **public docs, non-commercial** | Standard $1,500/yr | Professional $2,500/yr |
| Sketch | None (30-day trial) | Standard $12/editor/mo | $24–44, viewers free |

Category median ≈ $14–15/seat/mo. The pattern to copy: **designers pay,
their clients view free** (Figma viewers, Sketch viewers, Onshape viewers).

## 4. Recommended model: freemium + Pro + Studio

- **Free forever:** zero-auth local sandbox (today's product) + 3 cloud
  projects / 25 MB after login popup. Non-commercial license. Exports free
  (client-side = $0 marginal cost). See `tiers-and-limits.md` for the full
  matrix and quota math.
- **Pro solo (~$12–16/mo annual):** unlimited private cloud projects,
  50 GB, full history, cloud sync, commercial license, metered render/AI
  credit pool, priority support.
- **Studio (~$24/editor/mo, viewers free):** team workspace, client
  share-links with commenting, roles/admin, consolidated billing.
- **Enterprise (later):** SSO/SCIM, SLA, invoice, residency.

## 5. Funnel: waitlist → paid

1. Anonymous use of `/sandbox` (zero friction, today's flow).
2. Login popup on first "special" action (cloud save, share, export-pack).
3. Trial of Pro (e.g., 14 days, no card) → checkout (hosted page from
   provider) → webhook → entitlements row → feature flags unlock.
4. Dunning: provider-hosted retries + in-app banner on past-due; grace
   period keeps read access, blocks new cloud writes.

## 6. Private-repo architecture (build later, not here)

```
checkout (provider-hosted) → webhook handler → subscriptions table
→ entitlements (user_id, plan, seats, credit pools, renews_at)
→ client reads flags via /api/me (Pro-gated routes only)
```

- Never trust client plan claims; verify via webhook signatures + server lookup.
- Seat changes prorate through the provider; don't hand-roll proration.
- Metered credits (render/AI): decrement server-side per job, hard-stop at zero.

## 7. Compliance checklist

- [ ] VAT/GST collection + remittance (automatic under MoR)
- [ ] SCA / 3D Secure for EU cards (provider-hosted checkout covers it)
- [ ] Invoices + receipts per jurisdiction
- [ ] Refund / chargeback policy published before first charge
- [ ] Failed-payment dunning + grace rules
- [ ] Trial-to-paid consent (no dark patterns; cardless trial preferred)
- [ ] Privacy: billing PII lives with provider/vault only, never in CAD blobs

## 8. Open decisions

1. MoR vs Stripe direct at launch (lean: MoR).
2. Free cloud quota final: 3 projects / 25 MB vs friendlier 5–10.
3. Trial shape: 14-day cardless Pro vs freemium-only funnel.
4. Render/AI credit pricing per unit (needs GPU cost inputs).
