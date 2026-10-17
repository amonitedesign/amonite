# Deployment — Cloudflare Workers via OpenNext

> Status: **host decision made — Cloudflare Workers.** The repo is wired with
> the `@opennextjs/cloudflare` adapter (`wrangler.jsonc`, `open-next.config.ts`,
> `.dev.vars`, `public/_headers`). Wrangler is pinned as a devDependency.
> The public repo stays zero-auth / zero-payment / zero-DB; all gateway work
> lives in the private vault.

## 1. Why OpenNext (and not `npm run build`)

Cloudflare cannot run a Next.js server directly. `next build` produces a Node
server, **not** a Worker, so a plain `npm run build` + `wrangler deploy` fails
("no `.open-next/worker.js`"). The adapter runs `next build` for you, then
transforms the output into a Worker:

```
npx opennextjs-cloudflare build   # runs `npm run build`, then bundles .open-next/worker.js
npx wrangler deploy               # uploads the Worker + assets
```

Verified locally: `Total Upload: 6.5 MiB / gzip: 1.39 MiB` (under the 3 MiB
gzipped free-tier Worker limit).

## 2. Cloudflare Workers Builds settings

| Setting | Value |
|---|---|
| Root directory | `/` (repo root — `package.json` lives here) |
| Build command | `npx opennextjs-cloudflare build` |
| Deploy command | `npx wrangler deploy` |
| Build variables | `NEXT_PUBLIC_*` values (see §4) |
| Node version | 20 or 22 |

`compatibility_date` is `2026-06-01`; `nodejs_compat` +
`global_fetch_strictly_public` flags are set in `wrangler.jsonc`. Worker name
is `amonite` (change `name` + the `WORKER_SELF_REFERENCE.service` together if
renamed).

## 3. Optional R2 cache

`open-next.config.ts` currently uses the default (no incremental cache). The app
is fully client-side, so this is fine. Add an R2 binding named
`NEXT_INC_CACHE_R2_BUCKET` + `r2IncrementalCache` only when ISR/data caching is
wanted.

## 4. Build-time environment variables

`NEXT_PUBLIC_*` values are inlined into the client bundle **at build time**, so
they must be present as Cloudflare *Build variables* (not just runtime vars):

- `NEXT_PUBLIC_WAITLIST_SHEET_URL` — Google Apps Script web app URL (waitlist
  → spreadsheet).
- `NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY` — waitlist → email notification.

Locally these live in `.env.local` (gitignored). `.env.example` documents them.

## 5. Local commands

- `npm run dev` — normal Next dev server.
- `npm run preview` — build + serve in the real Workers runtime (workerd).
- `npm run deploy` — build + deploy from the CLI.
- `npm run cf-typegen` — regenerate `cloudflare-env.d.ts`.

Windows caveat: OpenNext works but is not officially fully supported on Windows;
the Cloudflare build itself runs Linux, so CI is unaffected.

## 6. Constraints that survive any host choice

- Public repo stays zero-auth with no payment/auth/DB code (`docs/direction.md`,
  segregation guard in CI).
- Backend phases (auth, D1/Postgres, R2, entitlements, billing webhooks) land in
  the private vault repo, behind the hosting + auth decisions.
- Free tier must stay structurally cheap: geometry and exports remain
  client-side; only auth-gated API calls ever touch servers
  (`docs/tiers-and-limits.md`).
