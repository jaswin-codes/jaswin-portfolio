# jaswin-portfolio

Jaswin Chinthala's portfolio, live at jaswin.me: a 3D ESP32 hub with six section worlds, plus a flat Recruiter Mode showing the same content.

## Commands (PowerShell; all run on 2026-11-12)
- Install the site: `cd client; pnpm install --frozen-lockfile`
- Run the site: `cd client; pnpm dev` (Vite prints the port). Root `npm run dev` starts the legacy server and uses POSIX syntax; do not use it.
- Build: `cd client; pnpm build`
- Install root tools (typecheck, tests): `npm ci`. The root `.npmrc` sets `legacy-peer-deps` because `@builder.io/vite-plugin-jsx-loc` only declares vite 4 and 5 as peers.
- Typecheck: `npm run check`
- Test: `npm test`

## Layout
- `client/src/data/portfolioData.ts`: all site content. Both modes read it.
- `client/src/pages/`: one file per 3D world, plus `RecruiterMode.tsx`.
- `client/src/components/`: shared pieces; `ui/` is shadcn.
- `client/src/index.css`: design tokens.
- `client/api/contact.js`: Vercel function, contact form to Discord.
- `client/public/`: `resume.pdf`, poster, images.
- `server/`, `drizzle/`, `shared/`, `references/`, `patches/`: legacy, not deployed.

## Read before working
- `PRD.md`: goals and non-goals. The current goal is keeping content current, not redesign or new features.
- `ARCHITECTURE.md`: stack decisions. Do not add or swap a library or service that is not in it; ask first.
- `DESIGN_SYSTEM.md`: read before any UI change. New flat-UI code uses tokens; 3D scenes are exempt.

## Conventions
- Content changes go in `portfolioData.ts` (and `client/public/resume.pdf` when the CV changes), never as text in a page.
- Conventional Commits; one focused commit per working change.

## Done means
- Both modes show the same content for what changed.
- `resume.pdf` opens from both modes and agrees with the site; changed links resolve.
- Typecheck, tests and the client build pass.
- The changed section was opened in the browser in both modes at desktop and phone widths, with a screenshot. Recruiter Mode: set `localStorage.portfolioMode` to `recruiter` and reload.

## Never
- Extend, wire up or delete the legacy folders listed above.
- Commit secrets, `.env` files or build output; `DISCORD_WEBHOOK_URL` lives only in Vercel.
- Push; commits stay local until Jaswin asks.
