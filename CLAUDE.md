# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

"The Artificial Intelligencer" — a full-stack mock newspaper where AI-themed `Persona`s author `Article`s. React 19 + Vite frontend, Express + Prisma + Postgres backend, JWT-protected admin dashboard.

## Commands

```bash
npm run dev          # runs server (tsx watch) + client (vite) concurrently
npm run dev:server   # backend only on :3000
npm run dev:client   # frontend only on :5173 (proxies /api → :3000)

npm run build        # vite build → dist/client, then tsc -p tsconfig.server.json → dist/server
npm start            # prisma db push --accept-data-loss && node dist/server/index.js (production entrypoint)

npm run db:push      # apply schema.prisma to DB without migrations (used in prod via `start`)
npm run db:migrate   # prisma migrate dev (interactive; for local dev only)
npm run db:seed      # tsx prisma/seed.ts — wipes nothing, just inserts 2 personas + 3 articles
```

`postinstall` runs `prisma generate` automatically.

There is **no** test runner, linter, or formatter configured. Don't invent commands for them.

## Architecture

### Two-process dev, single-process prod
- **Dev:** Vite serves the React app on :5173 and proxies `/api/*` to the Express server on :3000 (see `vite.config.ts`). `tsx watch server/index.ts` runs the server directly from TS.
- **Prod:** `vite build` outputs `dist/client/`; `tsc -p tsconfig.server.json` outputs `dist/server/`. The Express server in `dist/server/index.js` resolves `path.join(__dirname, "../client")` to serve the static React bundle and falls back to `index.html` for client-side routes. **The relative `../client` path is load-bearing** — keep both build outputs siblings under `dist/`.

### TypeScript config split
- `tsconfig.json` — `noEmit: true`, includes both `src` and `server`. Used by the IDE / Vite for typechecking only.
- `tsconfig.server.json` — actually compiles `server/` to `dist/server/` for production.
- Frontend TS is bundled by Vite, never by `tsc`.

### ESM + `.js` import extensions in server code
Server is `"type": "module"`. Imports between server files use `.js` extensions even though the source is `.ts` (e.g. `import authRoutes from "./routes/auth.js"`). This is required for Node ESM resolution after compilation. **Always write new server imports with `.js`**.

### Backend layout (`server/`)
- `index.ts` — Express app, mounts `/api/auth`, `/api` (personas), `/api` (articles), then static client + SPA fallback.
- `routes/auth.ts` — `POST /api/auth/login` checks credentials against `ADMIN_EMAIL` / `ADMIN_PASSWORD` env vars and returns a 24h JWT signed with `JWT_SECRET`. There is no users table; the admin is a single env-var-defined identity.
- `routes/personas.ts`, `routes/articles.ts` — public `GET` routes plus admin-only `POST/PUT/DELETE` mounted under `/api/admin/...` and gated by `requireAuth`.
- `middleware/auth.ts` — verifies `Authorization: Bearer <token>` against `JWT_SECRET`.
- Each route module instantiates its own `new PrismaClient()`. If you add more, follow the same pattern (or refactor all of them at once to share a singleton).

### Frontend layout (`src/`)
- `main.tsx` mounts `<BrowserRouter><App/></BrowserRouter>`.
- `App.tsx` defines the header/footer chrome and the five routes: `/`, `/article/:id`, `/persona/:id`, `/admin/login`, `/admin`.
- Pages call the API via plain `fetch("/api/...")` — no API client abstraction.
- The admin token lives in `localStorage.token`; `Dashboard.tsx` redirects to `/admin/login` if missing or if any admin call returns 401.

### Database
- Postgres via Prisma. Schema in `prisma/schema.prisma` defines `Persona` (1) ↔ (n) `Article`. IDs are `cuid()`. Tables map to `personas` / `articles`.
- **No `prisma/migrations/` directory exists.** Schema is managed via `prisma db push`, which is run automatically on `npm start`. When you change `schema.prisma`, prefer `db:push` for parity with production; the `--accept-data-loss` flag on prod `start` means destructive column changes will be applied without prompting.
- Other branches (e.g. `Chaz-fix-database-url`) have added `Admin` / `Settings` models to match a different deployment's DB. Before changing the schema, check whether such a branch is the source of truth for the target environment.

### Styling
- Tailwind with a custom `editorial` color palette and two font families: `headline` (Playfair Display) and `body` (Crimson Pro), loaded from Google Fonts in `index.html`. New UI should use these tokens rather than raw color/font values.

## Environment

`.env` (copy from `.env.example`) needs: `DATABASE_URL`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `JWT_SECRET`, `PORT` (defaults to 3000). The auth middleware and login route fall back to insecure defaults (`"dev-secret"`, `"changeme"`) if these are unset — fine for local dev, never rely on this in deployed environments.

## Deployment notes

The repo is deployed on Railway. `npm start` is the entrypoint and runs `prisma db push --accept-data-loss` before booting the server, so any pushed `schema.prisma` change auto-applies on deploy. Several past commits (visible in git log) exist specifically to reconcile schema mismatches between branches and the Railway DB — be cautious when modifying `schema.prisma` and verify the target env's actual schema first.
