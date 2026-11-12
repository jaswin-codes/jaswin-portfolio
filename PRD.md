# PRD: jaswin-portfolio (jaswin.me)

Decisions below come from the interview with Jaswin on 2026-11-12. What each page does is described in `README.md`; this file does not repeat it.

## Problem
People who want to judge Jaswin's work need one place that shows it quickly and stays true to his CV.

## Users
No single primary audience was chosen; all four count:
- Recruiters and hiring engineers screening for internships, vacation work or graduate roles (short on time; want CV, projects, contact).
- Academics and research contacts looking at the research and poster.
- Clients or collaborators.
- Other engineers and friends, for whom the 3D experience itself is the point.

## Goals
- Keep the content current: projects, CV, research, experience and achievements match what is true today.
- Keep dependencies and the security checks healthy.

## Non-goals
- A visual redesign, new sections, or speed and mobile work. None of these is planned; ask before starting any.
- Extending the legacy server (see `ARCHITECTURE.md`).

## Features by priority
| Priority | Feature | Why it matters |
|---|---|---|
| Must | 3D ESP32 hub and its six section worlds | The identity of the site |
| Must | Recruiter Mode: the same content as a flat, printable page | Readers with one minute |
| Must | CV download (`/resume.pdf`) from both modes | The thing recruiters take away |
| Should | Contact form | A way to reach Jaswin without email |

## Success criteria
After any content update, all of these hold:
- Both modes show the same content, because both read `client/src/data/portfolioData.ts`; no content text is hard-coded in a page.
- `resume.pdf` opens from both modes and agrees with the site; every project and profile link resolves.
- Typecheck, tests and the client build pass.
- The changed section was opened in the browser in both modes at desktop and phone widths, with a screenshot.

## Constraints
- Runs as a static Vite build plus one serverless function on Vercel.
- The contact form depends on `DISCORD_WEBHOOK_URL` in the Vercel project's environment; it is never committed.

## User stories

### Update content
As Jaswin I want to change one data file so that both modes update together.

Acceptance criteria:
- [ ] A change to an entry in `portfolioData.ts` appears in its 3D world and in Recruiter Mode without editing either page.

### Recruiter Mode
As a recruiter I want a flat page with everything on it so that I can scan or print it in a minute.

Acceptance criteria:
- [ ] Reachable from the landing page; the choice is remembered (`localStorage` key `portfolioMode`).
- [ ] The CV link opens `/resume.pdf` in a new tab.

### Contact form
As a visitor I want to send Jaswin a message so that I can reach him without an email client.

Acceptance criteria:
- [ ] A valid message arrives in Jaswin's Discord channel and the form confirms it.
- [ ] Invalid input shows the error next to the form and keeps what was typed.

Endpoint: `POST /api/contact` (`client/api/contact.js`)
- Inputs (JSON strings): `name` (required, max 100), `message` (required, max 2000), `email` (required, valid, max 200), `role` (max 100), `company` (max 100), `favPart` (max 50), `website` (honeypot; must be empty).
- Outputs: `200 {"ok": true}`.
- Errors: `400 {"error": "<reason>"}` invalid input; `405` not POST; `503` webhook not configured; `502` Discord did not accept the message.

## Open questions
- None.
