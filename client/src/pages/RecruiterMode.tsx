import type { ReactNode } from 'react';
import { useAppStore } from '@/stores/appStore';
import {
  projects,
  experiences,
  research,
  achievements,
  skillClusters,
  leadership,
  features,
  characteristics,
  profile,
  RESUME_URL,
} from '@/data/portfolioData';
import { Github, ExternalLink, FileDown, Mail, Box } from 'lucide-react';
import WldsDemo from '@/components/WldsDemo';

const MONO = { fontFamily: "'JetBrains Mono', monospace" };
const DISPLAY = { fontFamily: "'Space Grotesk', sans-serif" };

// One numbered datasheet section with a ruled heading
function Section({ n, title, children }: { n: number; title: string; children: ReactNode }) {
  return (
    <section className="ds-section py-6 border-t border-green-500/25">
      <h2 className="mb-4 text-sm font-bold tracking-widest text-green-400" style={MONO}>
        {n}. {title.toUpperCase()}
      </h2>
      {children}
    </section>
  );
}

function Tag({ children }: { children: ReactNode }) {
  return <span className="rounded border border-green-500/40 px-1.5 py-0.5 text-[11px] text-green-300" style={MONO}>{children}</span>;
}

export default function RecruiterMode() {
  const setMode = useAppStore((state) => state.setMode);
  const setShowContactForm = useAppStore((state) => state.setShowContactForm);

  // DIP-8 pinout: pins 1–4 down the left, 5–8 up the right, as on a real package
  const pins: { n: number; name: string; desc: string; href?: string; onClick?: () => void }[] = [
    { n: 1, name: 'CV', desc: 'PDF, 1 page', href: RESUME_URL },
    { n: 2, name: 'EMAIL', desc: profile.email, href: `mailto:${profile.email}` },
    { n: 3, name: 'LINKEDIN', desc: 'jaswin-chinthala', href: profile.linkedin },
    { n: 4, name: 'GND', desc: profile.location },
    { n: 5, name: 'GITHUB', desc: 'jaswin-codes', href: profile.github },
    { n: 6, name: 'MSG', desc: 'contact form', onClick: () => setShowContactForm(true) },
    { n: 7, name: '3D', desc: 'interactive board', onClick: () => setMode('3d') },
    { n: 8, name: 'VCC', desc: '3.3 V' },
  ];
  const left = pins.slice(0, 4);
  const right = pins.slice(4).reverse();

  const Pin = ({ pin, side }: { pin: (typeof pins)[number]; side: 'l' | 'r' }) => {
    const body = (
      <>
        <span className="text-white font-bold">{pin.name}</span>
        <span className="block text-[10px] text-gray-400 truncate">{pin.desc}</span>
      </>
    );
    const cls = `group flex items-center gap-2 ${side === 'l' ? 'flex-row' : 'flex-row-reverse text-right'}`;
    const lead = <span className={`h-[3px] w-6 sm:w-10 shrink-0 ${pin.href || pin.onClick ? 'bg-[#c9a227] group-hover:bg-green-400' : 'bg-gray-500'}`} />;
    const num = <span className="w-4 shrink-0 text-center text-[10px] text-gray-500">{pin.n}</span>;
    // flex-row-reverse on the right side keeps the lead next to the chip
    const inner = <><span className="min-w-0 flex-1">{body}</span>{num}{lead}</>;
    if (pin.href) return <a href={pin.href} target={pin.href.startsWith('mailto') ? undefined : '_blank'} rel="noopener noreferrer" className={cls}>{inner}</a>;
    if (pin.onClick) return <button onClick={pin.onClick} className={`${cls} w-full`}>{inner}</button>;
    return <div className={cls}>{inner}</div>;
  };

  return (
    <div className="datasheet min-h-screen bg-[#070b08] text-gray-200">
      {/* Top bar */}
      <header className="no-print sticky top-0 z-40 border-b border-green-500/20 bg-black/85 backdrop-blur">
        <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-between gap-2 px-4 py-3">
          <span className="text-sm font-bold text-green-400" style={MONO}>JC-2026 DATASHEET</span>
          <div className="flex flex-wrap gap-2 text-sm" style={MONO}>
            <button onClick={() => setMode('3d')} className="rounded border border-green-500 px-3 py-1.5 text-green-400 hover:bg-green-500/10">
              <Box size={14} className="inline -mt-0.5 mr-1" />3D
            </button>
            <a href={RESUME_URL} target="_blank" rel="noopener noreferrer" className="rounded border border-green-500 px-3 py-1.5 text-green-400 hover:bg-green-500/10">
              <FileDown size={14} className="inline -mt-0.5 mr-1" />CV
            </a>
            <button onClick={() => window.print()} className="hidden sm:inline-block rounded border border-green-500 px-3 py-1.5 text-green-400 hover:bg-green-500/10">
              Print
            </button>
            <button onClick={() => setShowContactForm(true)} className="rounded bg-green-600 px-3 py-1.5 font-bold text-white hover:bg-green-700">
              Get in touch
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 pb-24">
        {/* Title block, laid out like the first page of a part datasheet */}
        <div className="ds-section grid grid-cols-1 gap-4 py-8 sm:grid-cols-[1fr_auto] sm:items-end">
          <div>
            <p className="text-xs tracking-widest text-green-400" style={MONO}>JC-2026 · REV B · OCT 2026</p>
            <h1 className="mt-1 text-4xl font-bold text-white sm:text-5xl" style={DISPLAY}>{profile.name}</h1>
            <p className="mt-2 text-lg text-green-300">{profile.headline}</p>
            <p className="mt-3 max-w-xl text-gray-300">{profile.tagline}</p>
          </div>
          <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-xs sm:text-right" style={MONO}>
            <dt className="text-gray-500">LOCATION</dt><dd>{profile.location}</dd>
            <dt className="text-gray-500">PACKAGE</dt><dd>BSc Eng (Mechatronics), UCT</dd>
            <dt className="text-gray-500">STATUS</dt><dd className="text-green-400">Open to vacation work</dd>
          </dl>
        </div>

        <Section n={1} title="Features">
          <ul className="grid grid-cols-1 gap-x-8 gap-y-1.5 sm:grid-cols-2">
            {features.map((f) => (
              <li key={f} className="flex gap-2 text-sm"><span className="text-green-400">■</span>{f}</li>
            ))}
          </ul>
        </Section>

        <Section n={2} title="Pin configuration">
          <div className="no-print mx-auto grid max-w-xl grid-cols-[1fr_auto_1fr] items-center gap-2 text-xs sm:gap-4" style={MONO}>
            <div className="flex flex-col gap-4">{left.map((p) => <Pin key={p.n} pin={p} side="l" />)}</div>
            <div className="relative flex h-56 w-20 items-center justify-center rounded-sm border-2 border-gray-500 bg-[#151515] sm:w-28">
              <span className="absolute top-0 left-1/2 h-3 w-6 -translate-x-1/2 rounded-b-full border-2 border-t-0 border-gray-500 bg-[#070b08]" />
              <span className="absolute top-4 left-2 h-2 w-2 rounded-full bg-gray-500" />
              <span className="-rotate-90 whitespace-nowrap text-sm font-bold tracking-widest text-gray-300">JC-2026</span>
            </div>
            <div className="flex flex-col gap-4">{right.map((p) => <Pin key={p.n} pin={p} side="r" />)}</div>
          </div>
          <p className="print-only hidden text-sm" style={MONO}>
            {profile.email} · {profile.linkedin.replace('https://www.', '')} · {profile.github.replace('https://', '')} · jaswin.me
          </p>
        </Section>

        <Section n={3} title="Electrical characteristics">
          {/* Phones get stacked rows; the table needs more width than a phone has */}
          <dl className="space-y-3 sm:hidden">
            {characteristics.map((c) => (
              <div key={c.parameter} className="border-b border-green-500/20 pb-2">
                <dt className="flex items-baseline justify-between gap-3 text-sm">
                  <span>{c.parameter}</span>
                  <span className="font-bold text-green-300 whitespace-nowrap" style={MONO}>{c.value}</span>
                </dt>
                <dd className="mt-0.5 text-xs text-gray-400">{c.conditions}</dd>
              </div>
            ))}
          </dl>
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full min-w-[32rem] border-collapse text-sm">
              <thead>
                <tr className="text-left text-xs text-gray-400" style={MONO}>
                  <th className="border border-green-500/25 px-2 py-1.5">PARAMETER</th>
                  <th className="border border-green-500/25 px-2 py-1.5">VALUE</th>
                  <th className="border border-green-500/25 px-2 py-1.5">CONDITIONS</th>
                </tr>
              </thead>
              <tbody>
                {characteristics.map((c) => (
                  <tr key={c.parameter}>
                    <td className="border border-green-500/25 px-2 py-1.5">{c.parameter}</td>
                    <td className="border border-green-500/25 px-2 py-1.5 font-bold text-green-300 whitespace-nowrap" style={MONO}>{c.value}</td>
                    <td className="border border-green-500/25 px-2 py-1.5 text-gray-400">{c.conditions}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>

        <Section n={4} title="Functional block diagram">
          <div className="mx-auto max-w-2xl text-center text-xs" style={MONO}>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded border-2 border-green-400 p-3">
                <p className="font-bold text-green-300">HARDWARE</p>
                <p className="mt-1 text-gray-400">EV research · analogue and embedded electronics</p>
              </div>
              <div className="rounded border-2 border-pink-500/70 p-3">
                <p className="font-bold text-pink-300">AI SAFETY EVALUATION</p>
                <p className="mt-1 text-gray-400">red-teaming · LLM evals</p>
              </div>
            </div>
            <div className="mx-auto h-5 w-1/2 border-x border-b border-gray-600" />
            <div className="mx-auto h-4 w-px bg-gray-600" />
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {['DATA & ML', 'WEB', 'SECURITY (CTF)', 'LEADERSHIP'].map((b) => (
                <div key={b} className="rounded border border-gray-600 px-2 py-2 text-gray-300">{b}</div>
              ))}
            </div>
            <p className="mt-2 text-[10px] text-gray-500">Supporting skills feed the two main threads.</p>
          </div>
        </Section>

        <Section n={5} title="Experience">
          <div className="space-y-5">
            {experiences.map((exp) => (
              <div key={exp.id} className="ds-section">
                <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                  <h3 className="font-bold text-white">{exp.role} <span className="font-normal text-green-300">· {exp.company}</span></h3>
                  <span className="text-xs text-gray-400" style={MONO}>{exp.duration}</span>
                </div>
                <ul className="mt-1.5 space-y-1">
                  {exp.bulletPoints.map((b) => (
                    <li key={b} className="flex gap-2 text-sm text-gray-300"><span className="text-green-500">▸</span>{b}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Section>

        <Section n={6} title="Projects">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {projects.map((proj) => (
              <article key={proj.id} className={`ds-section rounded border border-green-500/25 p-4 ${proj.id === 'wlds' ? 'md:col-span-2' : ''}`}>
                {proj.images?.[0] && (
                  <img src={proj.images[0].src} alt={proj.images[0].caption} loading="lazy" className="no-print mb-3 h-44 w-full rounded object-cover" />
                )}
                <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                  <h3 className="font-bold text-white">{proj.name}</h3>
                  <span className="text-xs text-gray-400" style={MONO}>{proj.period} · {proj.role}</span>
                </div>
                <p className="mt-1.5 text-sm text-green-300">{proj.shortDescription}</p>
                <div className="mt-2 flex flex-wrap gap-1.5">{proj.techStack.map((t) => <Tag key={t}>{t}</Tag>)}</div>
                {proj.id === 'wlds' && <div className="no-print mt-3"><WldsDemo /></div>}
                <details className="no-print mt-3">
                  <summary className="cursor-pointer text-sm text-gray-400 hover:text-green-300">Read more</summary>
                  <p className="mt-2 whitespace-pre-line text-sm text-gray-300">{proj.details}</p>
                  {proj.images && proj.images.length > 1 && (
                    <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                      {proj.images.slice(1).map((img) => (
                        <a key={img.src} href={img.src} target="_blank" rel="noopener noreferrer">
                          <img src={img.src} alt={img.caption} loading="lazy" className="w-full rounded bg-white" />
                          <span className="text-[11px] text-gray-400">{img.caption}</span>
                        </a>
                      ))}
                    </div>
                  )}
                </details>
                {(proj.githubLink || proj.liveLink) && (
                  <div className="no-print mt-3 flex gap-4 text-sm">
                    {proj.githubLink && <a href={proj.githubLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-green-400 hover:text-green-300"><Github size={14} />GitHub</a>}
                    {proj.liveLink && <a href={proj.liveLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-green-400 hover:text-green-300"><ExternalLink size={14} />Live</a>}
                  </div>
                )}
              </article>
            ))}
          </div>
        </Section>

        <Section n={7} title="Research">
          <div className="space-y-4">
            {research.map((r) => (
              <div key={r.id} className="ds-section">
                <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                  <h3 className="font-bold text-white">{r.title} <span className="font-normal text-green-300">· {r.organization}</span></h3>
                  <span className="text-xs text-gray-400" style={MONO}>{r.date}</span>
                </div>
                <p className="mt-1 text-sm text-gray-300">{r.summary}</p>
                <p className="mt-1 text-sm text-gray-300"><span className="text-green-400">Result: </span>{r.outcome}</p>
                {r.link && <a href={r.link} target="_blank" rel="noopener noreferrer" className="no-print mt-1 inline-flex items-center gap-1 text-sm text-green-400 hover:text-green-300"><Github size={14} />GitHub</a>}
              </div>
            ))}
          </div>
        </Section>

        <Section n={8} title="Education">
          <div className="flex flex-wrap items-baseline justify-between gap-x-4">
            <h3 className="font-bold text-white">BSc Eng Electrical Engineering (Mechatronics) <span className="font-normal text-green-300">· University of Cape Town</span></h3>
            <span className="text-xs text-gray-400" style={MONO}>2026 – 2029 (expected)</span>
          </div>
          <p className="mt-1 text-sm text-gray-300">Semester 1 2026 distinctions: Engineering Calculus, Introduction to Electrical Engineering, Computer Science I (Python).</p>
          <p className="mt-2 text-sm text-gray-400">Blouberg International School, Cambridge A-Levels: Mathematics (A), Physics (B). 2019 – 2025.</p>
        </Section>

        <Section n={9} title="Leadership">
          <div className="space-y-3">
            {leadership.map((l) => (
              <div key={l.role + l.org} className="ds-section border-b border-green-500/15 pb-2">
                <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                  <h3 className="font-bold text-white">{l.role} <span className="font-normal text-green-300">· {l.org}</span></h3>
                  <span className="text-xs text-gray-400" style={MONO}>{l.period}</span>
                </div>
                <p className="mt-0.5 text-sm text-gray-300">{l.detail}</p>
              </div>
            ))}
          </div>
        </Section>

        <Section n={10} title="Skills">
          <div className="grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2">
            {skillClusters.map((c) => (
              <div key={c.name} className="ds-section">
                <p className="mb-1 text-xs font-bold" style={{ ...MONO, color: c.color }}>{c.label.toUpperCase()}</p>
                <p className="text-sm text-gray-300">
                  {c.skills.map((s, i) => (
                    <span key={s.name}>
                      {s.name}
                      {s.proficiency === 'novice' && <span className="text-gray-500"> (learning)</span>}
                      {i < c.skills.length - 1 && ', '}
                    </span>
                  ))}
                </p>
              </div>
            ))}
          </div>
        </Section>

        <Section n={11} title="Awards">
          <ul className="space-y-1.5">
            {achievements.map((a) => (
              <li key={a.id} className="flex flex-wrap justify-between gap-x-4 text-sm">
                <span><span className="font-bold text-white">{a.title}</span> <span className="text-gray-400">· {a.type}</span></span>
                <span className="text-xs text-gray-400" style={MONO}>{a.date}</span>
              </li>
            ))}
          </ul>
        </Section>

        <Section n={12} title="Ordering information">
          <p className="text-sm text-gray-300">
            I'm looking for vacation work and research roles in EV/power systems, embedded hardware or AI evaluation.
          </p>
          <div className="no-print mt-4 flex flex-wrap gap-3 text-sm">
            <button onClick={() => setShowContactForm(true)} className="flex items-center gap-2 rounded bg-green-600 px-4 py-2 font-bold text-white hover:bg-green-700">
              <Mail size={16} />Get in touch
            </button>
            <a href={`mailto:${profile.email}`} className="rounded border border-green-500 px-4 py-2 text-green-400 hover:bg-green-500/10" style={MONO}>{profile.email}</a>
          </div>
        </Section>

        <footer className="border-t border-green-500/25 pt-4 text-xs text-gray-500" style={MONO}>
          JC-2026 datasheet, rev B, Oct 2026. I built this site with React, Three.js and Tailwind CSS. Tip: press ` for a serial console.
        </footer>
      </main>
    </div>
  );
}
