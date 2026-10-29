import { describe, expect, it } from 'vitest';
// @ts-expect-error plain JS serverless function without type declarations
import { validate } from './contact.js';

describe('contact form validation', () => {
  const good = { name: 'Ada', email: 'ada@example.com', message: 'Hi' };

  it('accepts a normal message and trims it', () => {
    expect(validate({ ...good, name: '  Ada  ' })).toMatchObject({ name: 'Ada', role: '' });
  });

  it('rejects missing fields, bad emails and oversized input', () => {
    expect(validate({ ...good, name: '' })).toBe('Name and message are required');
    expect(validate({ ...good, email: 'nope' })).toBe('Please enter a valid email');
    expect(validate({ ...good, message: 'x'.repeat(2001) })).toBe('message is too long');
    expect(validate({ ...good, name: 42 })).toBe('Invalid name');
    expect(validate(null)).toBe('Invalid request');
  });
});
