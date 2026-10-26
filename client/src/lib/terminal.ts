import { profile, projects, experiences, RESUME_URL } from '@/data/portfolioData';

// What the terminal should do besides printing, handled by the UI
export type TerminalAction = 'clear' | 'close' | 'contact' | 'mode-3d' | 'mode-recruiter' | { open: string };

export interface CommandResult {
  lines: string[];
  action?: TerminalAction;
}

const HELP = [
  'available commands:',
  '  whoami      who I am',
  '  projects    things I have built',
  '  experience  where I have worked',
  '  cv          open my CV (PDF)',
  '  contact     send me a message',
  '  github      open my GitHub',
  '  3d          switch to the 3D board',
  '  recruiter   switch to the datasheet view',
  '  clear       clear the screen',
  '  exit        close the terminal',
];

export function runCommand(input: string): CommandResult {
  const cmd = input.trim().toLowerCase();
  switch (cmd) {
    case '':
      return { lines: [] };
    case 'help':
    case '?':
      return { lines: HELP };
    case 'whoami':
      return { lines: [profile.name, profile.headline, profile.tagline, `based in ${profile.location}`] };
    case 'projects':
    case 'ls':
      return { lines: projects.map((p) => `${p.period.padEnd(12)} ${p.name}`) };
    case 'experience':
      return { lines: experiences.map((e) => `${e.duration.padEnd(19)} ${e.role}, ${e.company}`) };
    case 'cv':
    case 'resume':
      return { lines: ['opening CV...'], action: { open: RESUME_URL } };
    case 'github':
      return { lines: ['opening GitHub...'], action: { open: profile.github } };
    case 'contact':
      return { lines: [`email: ${profile.email}`, 'opening the contact form...'], action: 'contact' };
    case '3d':
      return { lines: ['booting the ESP32...'], action: 'mode-3d' };
    case 'recruiter':
      return { lines: ['loading datasheet...'], action: 'mode-recruiter' };
    case 'clear':
      return { lines: [], action: 'clear' };
    case 'exit':
      return { lines: [], action: 'close' };
    case 'sudo':
      return { lines: ['nice try'] };
    default:
      return { lines: [`command not found: ${cmd}. type "help" for a list.`] };
  }
}
