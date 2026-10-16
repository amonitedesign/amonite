# Deployment Staging — Decision Open, Grounds Prepared

> Status: staging only. **No hosting decision has been made.** Nothing in
> this repo is hardcoded to any provider — no `wrangler.jsonc`, no
> vendor adapter, no Docker commitment, no secrets, no env files.
> The owner picks the host; this document keeps every option open.

## 1. What "staged" means right now

- `output: "standalone"` in `next.config.ts` — `npm run build` emits a
  self-contained `.next/standalone` server runnable with plain Node.
  Portable to VPS, containers, PaaS, or any adapter-based host. It does
  not commit to any of them.
- `GET /api/health` (`src/app/api/health/route.ts`) — provider-neutral
  liveness probe returning `{ status: "ok" }`. Any host, load balancer,
  or uptime monitor can poll it. Covered by `route.test.tsx`.
- Zero env vars, zero secrets, zero vendor SDKs in the dependency tree.
  The app runs fully client-side (localStorage persistence); the build
  has no server-side data dependencies to wire up.

## 2. Host options under evaluation (no pick)

| Host shape | Pros | Cons / watch-outs |
|---|---|---|
| Cloudflare (Pages/Workers via adapter) | ~$0–5/mo, zero egress, R2/D1 colocated later | Needs OpenNext adapter + `nodejs_compat`; `next/image` needs CDN/Images handling |
| Vercel | Zero-config Next.js, previews per PR | Bandwidth billing, seat costs scale fast |
| VPS / Coolify / Dokku | Flat $5–12/mo, full Node, Docker-native | You own patching, backups, TLS |
| Render / Fly / Railway | Middle ground, Docker or Nixpacks | Per-service pricing adds up;db usually separate |

Decision criteria when the time comes: monthly cost at 1k users →
preview-env ergonomics → exit cost (how fast can we leave) → colocated
data story (R2/D1 vs external Postgres).

## 3. Phase A pre-flight checklist (for whoever pushes the button)

1. `npm run build` green locally (standalone output present).
2. `GET /api/health` returns 200 on the deployed URL.
3. `/`, `/sandbox`, `/pricing`, `/docs` render; chromium smoke passes
   against the preview URL (`npm run test:e2e:smoke`).
4. Confirm no build-time secrets required (there are none).
5. Attach the host's deploy hook to `master` (and PR previews if offered).

## 4. Explicitly NOT added yet (do not add without the hosting decision)

- `wrangler.jsonc` / Cloudflare adapter / `nodejs_compat` flags.
- `vercel.json` or any host-specific config.
- `Dockerfile` / `docker-compose.yml` (standalone output keeps this a
  10-line addition later — no need to commit early).
- `.env*` files, secret managers, auth/DB SDKs. When secrets arrive,
  they live in the host dashboard (and later the private vault), never
  in this repo — the segregation guard stays green.

## 5. Constraints that survive any host choice

- Public repo stays zero-auth with no payment/auth/DB code
  (`docs/direction.md`, segregation guard in CI).
- Backend phases (auth, D1/Postgres, R2, entitlements, billing webhooks)
  land in the private vault repo, behind the hosting + auth decisions.
- Free tier must stay structurally cheap on any host: geometry and
  exports remain client-side; only auth-gated API calls ever touch
  servers (`docs/tiers-and-limits.md`).
