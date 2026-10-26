import { describe, expect, it } from 'vitest';
import { runCommand } from './terminal';
import { projects, RESUME_URL } from '@/data/portfolioData';

describe('serial terminal commands', () => {
  it('lists every project from the data file', () => {
    const { lines } = runCommand('projects');
    expect(lines).toHaveLength(projects.length);
    projects.forEach((p, i) => expect(lines[i]).toContain(p.name));
  });

  it('is case and whitespace tolerant', () => {
    expect(runCommand('  HELP ').lines[0]).toBe('available commands:');
  });

  it('returns actions for commands that do something', () => {
    expect(runCommand('cv').action).toEqual({ open: RESUME_URL });
    expect(runCommand('3d').action).toBe('mode-3d');
    expect(runCommand('clear').action).toBe('clear');
  });

  it('explains unknown commands', () => {
    expect(runCommand('rm -rf /').lines[0]).toContain('command not found');
  });
});
