# Jaswin Chinthala — Interactive Portfolio Website

A highly interactive personal portfolio that doubles as an immersive 3D experience, built with React 19, Three.js, Framer Motion, tRPC, and Tailwind CSS 4. The site showcases Jaswin's work as an embedded systems and ML engineer, with a recruiter-friendly flat-layout fallback mode.

---

## Live Features

### Landing — 3D ESP32 Scene
The homepage renders a procedural ESP32 microcontroller model in Three.js. On load, an intro animation plays: LED blinks twice (400 ms per toggle) then explodes with a 700 ms flash, followed by the name fading in and sliding up above the board in ~1 second. After the intro, users can rotate the board freely with mouse drag, hover over individual components to see glowing tooltips, and click any component to navigate to its corresponding section world. An idle hint ("click a component to explore →") appears after 7 seconds of inactivity.

| Component | Section |
|---|---|
| ESP-WROOM-32 | Projects |
| USB Port | About Me |
| Voltage Regulator | Experience |
| CP2102 | Research |
| GPIO Pins | Skills & Tools |
| Crystal Oscillator | Achievements |

### Recruiter Mode
A persistent toggle (top-right in 3D mode, top-left in recruiter mode) switches between the immersive 3D worlds and a clean, scrollable flat layout. The selected mode is saved to `localStorage` and restored on next visit.

The Recruiter Mode flat layout includes: Hero, About Me, Experience, Projects, Research, Skills & Tools, Achievements, **Leadership & Involvement**, and Contact.

### Section Worlds (3D Mode)

**Projects — Robot POV Lab**
A 3D room with three project screens mounted on the walls. Hover to highlight, click to open a detail modal with description, tech stack, GitHub link, and live demo link where available. The Hyperspectral Freshness modal renders **Coming Soon** in bold green to distinguish the hardware project from the research paper.

| Project | Status | Links |
|---|---|---|
| AfriGuard | Complete | [GitHub](https://github.com/ubayd-hattas/AfriGuard) · [Dashboard](https://afriguard.streamlit.app/) |
| Hyperspectral Freshness | **Coming Soon** — hardware sensor product | — |
| Vibecoded | Complete | — |

**About Me — Business Card Stack**
Eight business cards cycle with a smooth horizontal slide-left/right transition animation. Navigation is via Previous/Next arrow buttons or dot indicators. The first card shows only the name (no title label). Card order: Name → Education → Interests → Research Focus → LinkedIn → GitHub → Location → Let's Connect. All card content is centred.

**Experience — Elevator UI**
An elevator panel with three floor buttons. Clicking a floor animates the elevator and slides in a detail panel.

| Floor | Role |
|---|---|
| EMi Lab | Vacation Work Student — BMS & swappable battery research |
| UCT Racing | Power Subsystem Member — cooling architecture, drivetrain & telemetry systems |
| Scientific Caribbean Foundation | Undergraduate Student Researcher — hyperspectral imaging |

**Research — Electron Journey PCB**
A top-down PCB scene with colour-coded research chips. Press **E** near a chip to open its detail panel.

| Chip | Status |
|---|---|
| Hyperspectral Imaging | Complete — poster & methodology available |
| Swappable Battery | Coming Soon (EMi Lab) |

Note: AfriGuard chip removed from the PCB scene (it is a project, not a research paper).

**Skills — Magnetic Field Simulator**
Six draggable role-magnet clusters (Machine Learning, AI Safety, Embedded Systems, Power/Energy, Web Dev, Tools) with skill bubbles that respond to drag position. Each skill displays a Novice / Intermediate / Advanced badge. Git, GitHub, and VS Code are rated **Intermediate**.

**Achievements — Oscilloscope Viewer**
A CRT-style phosphor screen with waveforms for each achievement. Move the probe cursor over a waveform to reveal the achievement detail card.

| Achievement | Date |
|---|---|
| Student of the Year | Grade 11 |
| President's Award — Bronze | Grade 12 |
| National Chess Champion | — |

### Leadership & Involvement (Recruiter Mode)

| Role | Organisation |
|---|---|
| Treasurer | Interact Club (Rotary International) |
| Student Wellness and Leadership | Student Representative Council (SRC) |
| Class Representative | EEE1008 — Electrical Engineering (UCT) |

Interact Club: Managed budgets and financial records over R5000+ for community fundraising. 1 of 4 Board Members organizing events and service activities.

SRC: Represented the student body as 1 of 9 in school governance. Organized mental health and wellness events; mentored cohort of class representatives.

### Jarvis AI Chatbot
A floating chatbot (bottom-right) powered by the built-in LLM API. The system prompt is specific to Jaswin's background, projects, and experience. The chatbot detects recruiter intent and surfaces the contact form when appropriate. Text-to-speech is available via the speaker icon toggle.

### Contact Form
Disabled by default. Surfaced via recruiter detection in the chatbot or the "Get in Touch" button in Recruiter Mode. Submissions are saved to the `contacts` database table and trigger an owner notification.

### Loading Screen
A circuit-themed loading screen with a progress bar, rotating icon, and dynamic status messages displays while 3D assets initialise. It dismisses automatically when the page is ready.

### Resume Button
A persistent "Resume" button (bottom-left in 3D mode) opens the CV PDF in a new browser tab.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, TypeScript, Tailwind CSS 4, Framer Motion |
| 3D | Three.js, @react-three/fiber, @react-three/drei, @react-three/postprocessing |
| State | Zustand |
| API | tRPC 11, Express 4 |
| Database | MySQL / TiDB via Drizzle ORM |
| Auth | Manus OAuth |
| LLM | Built-in Forge API (via `server/_core/llm.ts`) |
| Notifications | Built-in notification API (via `server/_core/notification.ts`) |
| Fonts | Space Grotesk (headings), JetBrains Mono (code/labels) |

---

## Project Structure

```
client/src/
  pages/
    Landing.tsx          ← ESP32 3D landing scene
    Projects.tsx         ← Robot POV Lab (3 project screens)
    About.tsx            ← Business Card Stack
    Experience.tsx       ← Elevator UI
    Research.tsx         ← Electron Journey PCB
    Skills.tsx           ← Magnetic Field Simulator
    Achievements.tsx     ← Oscilloscope Viewer
    RecruiterMode.tsx    ← Flat recruiter layout
  components/
    ESP32Model.tsx       ← Procedural ESP32 3D model
    JarvisChat.tsx       ← AI chatbot UI
    ContactForm.tsx      ← Contact form modal
    LoadingScreen.tsx    ← Circuit-themed loading screen
    SectionTransition.tsx← ESP32 flash transition between worlds
  data/
    portfolioData.ts     ← All content (projects, experience, research, etc.)
  stores/
    appStore.ts          ← Zustand global state
server/
  routers.ts             ← tRPC procedures (chat, contact)
  db.ts                  ← Database helpers
drizzle/
  schema.ts              ← users + contacts tables
```

---

## Static Assets

| Asset | Path |
|---|---|
| CV / Resume PDF | `/manus-storage/Jaswin_Research_CV_d1a4d9f5.pdf` |
| Research Poster PNG | `/manus-storage/research_poster_358fb6ff.png` |

Assets are hosted via Manus static storage and referenced by URL in `portfolioData.ts`.

---

## Database Schema

**users** — Manus OAuth user records (auto-managed by auth flow).

**contacts** — Contact form submissions.

| Column | Type | Notes |
|---|---|---|
| id | int PK | Auto-increment |
| name | varchar(255) | Submitter name |
| email | varchar(320) | Submitter email |
| role | varchar(255) | Role / company |
| favourite_part | text | Favourite part of portfolio |
| message | text | Free-form message |
| createdAt | timestamp | Auto-set on insert |

---

## Environment Variables

All secrets are injected automatically by the Manus platform. Do not commit `.env` files.

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | MySQL connection string |
| `JWT_SECRET` | Session cookie signing |
| `BUILT_IN_FORGE_API_KEY` | LLM + notification API key (server) |
| `BUILT_IN_FORGE_API_URL` | LLM + notification API base URL |
| `VITE_FRONTEND_FORGE_API_KEY` | LLM API key (client) |
| `VITE_FRONTEND_FORGE_API_URL` | LLM API base URL (client) |

---

## Development

```bash
pnpm install
pnpm dev          # Start dev server on :3000
pnpm check        # TypeScript type check
pnpm test         # Run Vitest tests
pnpm db:push      # Generate + apply Drizzle migrations
```

---

## Changelog

| Version | Changes |
|---|---|
| v1.0 | Initial build — ESP32 landing, 6 section worlds, Recruiter Mode, Jarvis chatbot |
| v1.1 | Bug fixes: name positioning, About cards, Skills dragging, Projects screens, Achievements probe, ESP32 rotation |
| v1.2 | Custom loading screen with circuit-themed progress animation |
| v1.3 | Content updates from CV: AfriGuard links, research poster, correct experience details |
| v1.4 | Changes_3: faster name animation, resume PDF fix, Research rename + Swappable Battery chip, 4 project screens (Hackathon + Vibecoded), EMi Lab BMS focus, UCT Racing drivetrain bullet, flashcard reorder, achievements date fixes, Leadership block in Recruiter Mode |
