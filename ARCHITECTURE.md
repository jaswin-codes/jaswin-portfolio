# Architecture: jaswin-portfolio

Recorded on 2026-11-12 from the code and an interview with Jaswin. A new dependency or service needs a row and a decision record here first; agents ask, they do not choose.

## Stack (what is live)
| Area | Choice | Decision |
|---|---|---|
| Language | TypeScript | recorded from code |
| Framework | React 19 + Vite, routing with wouter, state with Zustand | recorded from code |
| 3D | three.js through @react-three/fiber, drei and postprocessing | recorded from code |
| Styling | Tailwind CSS 4, shadcn/ui components (Radix), Framer Motion | recorded from code |
| Database | None in the live site | D1 |
| Auth | None in the live site | D1 |
| Hosting | Vercel, serving `client/` (static build plus `client/api/` functions) | D1 |
| Integrations | Discord webhook for the contact form (`DISCORD_WEBHOOK_URL` in Vercel) | recorded from code |
| Testing | Vitest (`client/api/contact.test.ts`); typecheck with `tsc` | recorded from code |
| CI | GitHub Actions `security.yml` (gitleaks secret scan), Dependabot | recorded from code |

"Recorded from code" means the choice was made before this file existed and its original reasons were not written down.

## Folder layout
```
client/            the live site
  src/pages/       one file per 3D world, plus RecruiterMode.tsx
  src/components/  shared pieces; ui/ is shadcn
  src/data/portfolioData.ts   all site content (both modes read it)
  src/index.css    design tokens (see DESIGN_SYSTEM.md)
  api/contact.js   Vercel function: contact form to Discord
  public/          resume.pdf, poster, images
server/ drizzle/ shared/ references/ patches/   legacy template code, not deployed (D1)
```

## Data flow
1. Content: `portfolioData.ts` is imported by the 3D pages and by Recruiter Mode and rendered in the browser. There is no content API.
2. Contact: the form posts JSON to `/api/contact`; the function validates it, drops honeypot hits, and forwards an embed to the Discord webhook.
3. Mode (3D or recruiter) is kept in Zustand and saved in `localStorage` under `portfolioMode`.

## Decisions

### D1: The live architecture is the Vercel client only; the server is legacy and stays untouched (2026-11-12)
- Chosen: `client/` on Vercel with one serverless function is the architecture. `server/` (Express, tRPC), `drizzle/` (MySQL schema), `shared/`, `references/` and the Manus OAuth code are leftovers from the template the site started from. Agents must not extend them, wire the client to them, or delete them.
- Why: Jaswin's decision; the site runs without them.
- Rejected: removing the legacy code now (not chosen; it stays as it is). Treating the server as live (it is not).
- Revisit if: a feature needs stored data or logins, or the legacy code starts to cost upkeep (Dependabot noise, failing checks).

### D2: 3D scenes are exempt from the design-token rule; flat UI is not (2026-11-12)
- Chosen: see `DESIGN_SYSTEM.md`.
- Why: scene materials and lights are not interface styling; forcing them into CSS variables adds work for no consistency gain.
- Rejected: everything on tokens including 3D (a large refactor); fixing the flat UI's raw values now (recorded as known debt instead).
- Revisit if: a redesign is planned.

## Not decided yet
- `README.md` still lists tRPC, MySQL and Manus OAuth as the stack and says the contact form writes to a `contacts` table. Whether to correct the README to match D1 has not been decided.
- The Vercel project's root directory is assumed to be `client/` (from where `api/` sits); it was not checked in the Vercel dashboard.
