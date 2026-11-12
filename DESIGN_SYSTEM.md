# Design system: jaswin-portfolio

Recorded on 2026-11-12 from the code as it is; the look is settled (Jaswin's decision) and this file documents it. Only the dark theme ships (`defaultTheme="dark"`).

Token source: `client/src/index.css` (the `.dark` block and `@theme inline`).

## Direction
A circuit board seen up close: deep navy-black, traces and highlights in green, small monospace labels like a datasheet. Recruiter Mode is that datasheet. It must not look like a generic SaaS landing page.

## Scope rule
- Flat interface code (Recruiter Mode, contact form, headers, modals, loading and error screens) uses tokens only.
- 3D scene code is exempt: three.js materials, lights, canvas and shader colours, and the glow/CRT gradients inside a world (`Projects`, `Research`, `Skills`, `Achievements`, `ESP32Model`, `SectionTransition`).

## Colour (by role)
| Role | Token (Tailwind class) | Value |
|---|---|---|
| Page background | `--background` (`bg-background`) | `#0a0e27` |
| Surface: cards | `--card` (`bg-card`) | `#111827` |
| Surface: popovers, inputs | `--popover`, `--input` | `#1f2937` |
| Text | `--foreground` (`text-foreground`) | `#e0e7ff` |
| Text, muted | `--muted-foreground` (`text-muted-foreground`) | `#9ca3af` |
| Accent: actions, highlights, focus ring | `--primary`, `--accent`, `--ring` | `#10b981` |
| Border (circuit trace) | `--border` (`border-border`) | accent at 20% |
| Error | `--destructive` | `#ef4444` |

## Type
- Body and labels: JetBrains Mono. Headings (`h1` to `h6`): Space Grotesk, weight 700. Both load from Google Fonts in `client/index.html`.
- Sizes: Tailwind's scale (`text-xs` to `text-4xl`).

## Spacing, radius, shadow, motion
- Spacing: Tailwind's 4 px scale; no arbitrary values in flat UI.
- Radius: `--radius` is 0.65rem with `sm`, `md`, `lg`, `xl` steps derived from it.
- Shadow: the green glow utilities `.glow-green` and `.glow-green-lg`; text glow `.phosphor-text`; CRT overlay `.scanlines`.
- Motion: Framer Motion for transitions between worlds; `prefers-reduced-motion` is handled in `index.css`.

## Components
- shadcn/ui components in `client/src/components/ui/`; add new primitives with shadcn, not by hand.
- Shared: `WorldHeader` (title bar of each world), `ContactForm` (modal), `LoadingScreen`, `SectionTransition`.
- Content never lives in a component; it comes from `client/src/data/portfolioData.ts`.

## Accessibility minimums
- Contrast 4.5:1 for body text; visible keyboard focus; 44 px touch targets; layout works from 360 px wide.
- Recruiter Mode is the accessible path: everything in the 3D worlds must also be reachable there.

## Known debt (measured 2026-11-12; not fixed, by decision)
The flat UI does not use the tokens above yet. It styles with Tailwind palette classes and a few hex values:
- `RecruiterMode.tsx`: 96 palette classes (`border-green-500`, `text-gray-300`, `text-gray-400`, `text-green-300/400`), hex `#070b08`, `#151515`, `#c9a227`, and arbitrary sizes `text-[10px]`, `text-[11px]`.
- `ContactForm.tsx`: 36 palette classes. `Experience.tsx` 23, `Achievements.tsx` 24, `About.tsx` 16 (plus inline `rgba()` gradients).
- Recruiter Mode's background `#070b08` and gold pin colour `#c9a227` have no token.

Found in the browser check of Recruiter Mode and About (local dev build, 1280 px and an emulated 375 px; not checked on a real phone or on jaswin.me):
- About at 375 px: the business card renders from x=325 to x=650, so most of it is off screen.
- About: 10 buttons (previous, next, the eight dots) have no accessible name; the dots are 8 x 8 px.
- About: a focused carousel button showed no outline or ring.
- Touch targets under 44 px: header buttons are 38 to 40 px high in both pages.
- Recruiter Mode at 375 px: no horizontal overflow; the floating terminal button covers the end of a text line.

Rule until this is paid off: new or changed flat-UI code uses the tokens; when a file is edited for another reason, do not mass-convert it in the same change.
