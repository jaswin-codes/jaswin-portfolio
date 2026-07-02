# Jaswin Portfolio Website — TODO

## Phase 1: Foundation & Setup
- [x] Install Three.js, @react-three/fiber, @react-three/drei, @react-three/postprocessing
- [x] Install Framer Motion for UI animations
- [x] Install Zustand for global state management
- [x] Set up TypeScript types for app state and sections
- [x] Configure Tailwind CSS with custom brand tokens (dark theme, circuit aesthetic)
- [ ] Add Google Fonts: Space Grotesk (bold), JetBrains Mono
- [x] Create Zustand store for app state (mode, currentSection, isIntroComplete, jarvisOpen, etc.)

## Phase 2: Landing Page & ESP32 Scene
- [x] Build procedural ESP32 3D model using Three.js (board, components, pins)
- [x] Implement intro animation sequence: LED explosion → name reveal → board settle
- [x] Add "Skip Intro" button with prefers-reduced-motion support
- [x] Implement mouse rotation on ESP32 (full 3D rotation, all axes)
- [x] Add component hover glow and edge highlighting
- [x] Create animated flags above each component (mint green, pulsing)
- [x] Add idle hint text ("click a component to explore →") after 7 seconds
- [x] Create component tooltips (section name + component name)
- [x] Implement component click → camera zoom + transition to section world
- [x] Set up React Router for deep-linkable section routes

## Phase 3: Section Worlds — Part 1
- [x] **Projects (Robot POV Lab):** Build Three.js room with WASD controls
- [x] Implement first-person camera and robot movement
- [x] Create project screens mounted on walls (AfriGuard, Hyperspectral, UCT Racing, EMi Lab)
- [x] Implement project detail modal (name, description, tech tags, links)
- [ ] Add mobile D-pad fallback for WASD controls
- [x] **About Me (Business Card Stack):** Build 3D card flip animation with Framer Motion
- [x] Create 8 business cards with personal info (name, education, LinkedIn, GitHub, location, interests, etc.)
- [x] Implement card cycling on click (lift → flip → display → slide to bottom)
- [ ] Add placeholder photo to name card
- [x] **Experience (Elevator):** Build elevator UI with floor buttons
- [x] Create 3 floors (EMi Lab, UCT Racing, Scientific Caribbean Foundation)
- [x] Implement floor button click → elevator animation → info panel slide-in
- [x] Add floor counter and directory sign

## Phase 4: Section Worlds — Part 2
- [x] **Research (Electron Journey PCB):** Build top-down PCB scene with WASD electron movement
- [x] Implement glowing electron with trailing glow effect
- [x] Create research component chips on PCB
- [x] Implement E-key interaction to open research detail panels
- [ ] Add mobile D-pad fallback
- [x] **Skills (Magnetic Field Simulator):** Build physics-based skill particle system
- [x] Implement skill bubbles with color-coded clusters
- [x] Create draggable job role magnets
- [x] Implement magnetic attraction/repulsion physics (d3-force or similar)
- [x] **Achievements (Oscilloscope Viewer):** Build CRT phosphor screen with waveforms
- [x] Implement waveform visualizations for each achievement
- [x] Add probe cursor interaction to zoom and display detail cards
- [x] Add scanline overlay and barrel distortion effects

## Phase 5: Recruiter Mode
- [x] Create persistent toggle in top-right corner (saved to localStorage)
- [x] Build flat layout scaffold with all sections as scrollable cards
- [x] Implement fade-out 3D scene → slide-in flat layout transition
- [x] Create flat versions of all sections:
  - [x] Hero (name + title + one-liner)
  - [x] About Me (summary card)
  - [x] Experience (timeline view)
  - [x] Projects (grid cards with thumbnails)
  - [x] Research (list cards with abstracts)
  - [x] Skills (tag clusters + proficiency bars)
  - [x] Achievements (list with dates)
  - [x] Contact (form + links)
- [ ] Ensure all content is scannable and keyboard-navigable
- [ ] Test with screen readers for accessibility

## Phase 6: Jarvis AI Chatbot
- [x] Create floating chatbot UI in bottom-right corner
- [x] Implement chat panel with message history
- [x] Integrate Claude API via backend endpoint
- [x] Create system prompt specific to Jaswin
- [x] Implement recruiter detection logic
- [x] Add Web Speech API for text-to-speech (speaker icon toggle)
- [x] Create contact form modal (triggered by recruiter detection)
- [x] Implement contact form submission → database save + owner notification

## Phase 7: Database & Backend
- [x] Create database schema for contacts table
- [ ] Create database schema for chat_logs table (optional, for analytics)
- [x] Implement `/api/chat` endpoint (Claude API integration)
- [x] Implement `/api/contact` endpoint (form submission + notification)
- [ ] Implement `/api/projects` endpoint (static or DB-backed)
- [x] Set up owner notification system for contact form submissions
- [x] Test all API endpoints

## Phase 8: Styling & Polish
- [ ] Apply dark theme with circuit/PCB aesthetic
- [ ] Add glowing effects and bloom post-processing
- [ ] Implement smooth transitions between sections
- [ ] Add loading states and spinners
- [ ] Test responsive design (mobile, tablet, desktop)
- [ ] Implement mobile fallbacks for 3D interactions
- [ ] Ensure WCAG AA color contrast
- [ ] Test keyboard navigation and screen reader support
- [ ] Optimize 3D model performance (lazy-load sections)
- [ ] Compress and optimize all assets

## Phase 9: Content & Testing
- [ ] Add project logos and thumbnails
- [ ] Add company logos (EMi Lab, UCT Racing, Scientific Caribbean Foundation)
- [ ] Add research poster and certificate assets
- [ ] Replace placeholder photo with professional headshot (when available)
- [ ] Verify all social links (LinkedIn, GitHub)
- [ ] Test full recruiter flow end-to-end
- [ ] Test chatbot with various recruiter queries
- [ ] Test contact form submission and notification
- [ ] Verify all links and CTAs work correctly
- [ ] Performance audit (< 3s on 4G, 60fps on mid-tier laptop)

## Phase 10: Launch Prep
- [ ] Final content review — replace all "COMING SOON" placeholders
- [ ] Accessibility audit (keyboard, screen reader, reduced motion)
- [ ] Cross-browser testing (Chrome, Firefox, Safari, Edge)
- [ ] Mobile device testing (iOS, Android)
- [ ] Create checkpoint before deployment
- [ ] Deploy to Manus hosting
- [ ] Verify deployed site works end-to-end
- [ ] Set up custom domain (if applicable)

## Post-Launch (Future)
- [ ] Enable contact form for engaged visitors only
- [ ] Collect recruiter feedback and iterate
- [ ] Add "Antenna" section (creative side projects)
- [ ] Add "Boot + Reset Button" section (blog/journal)
- [ ] Update AfriGuard project status if award received
- [ ] Add remaining project links (GitHub, live demos)
