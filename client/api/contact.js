// Vercel serverless function: forwards contact-form messages to Discord.
// Needs DISCORD_WEBHOOK_URL set in the Vercel project's environment variables.

const LIMITS = { name: 100, email: 200, role: 100, company: 100, favPart: 50, message: 2000 };
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Returns cleaned fields, or an error string for invalid input
export function validate(body) {
  if (!body || typeof body !== 'object') return 'Invalid request';
  const out = {};
  for (const [key, max] of Object.entries(LIMITS)) {
    const v = body[key] ?? '';
    if (typeof v !== 'string') return `Invalid ${key}`;
    const t = v.trim();
    if (t.length > max) return `${key} is too long`;
    out[key] = t;
  }
  if (!out.name || !out.message) return 'Name and message are required';
  if (!EMAIL_RE.test(out.email)) return 'Please enter a valid email';
  return out;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  // Honeypot: real users never see or fill the "website" field
  if (req.body?.website) return res.status(200).json({ ok: true });

  const fields = validate(req.body);
  if (typeof fields === 'string') return res.status(400).json({ error: fields });

  const webhook = process.env.DISCORD_WEBHOOK_URL;
  if (!webhook) return res.status(503).json({ error: 'Contact form is not configured' });

  const field = (name, value, inline = true) => ({ name, value: value || 'N/A', inline });
  const discord = await fetch(webhook, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      allowed_mentions: { parse: [] }, // stop @everyone or role pings coming from the form
      embeds: [{
        title: 'New message from jaswin.me',
        color: 0x00ff88,
        fields: [
          field('Name', fields.name),
          field('Email', fields.email),
          field('Role', fields.role),
          field('Company', fields.company),
          field('Favourite part', fields.favPart),
          field('Message', fields.message, false),
        ],
        timestamp: new Date().toISOString(),
      }],
    }),
  }).catch(() => null);

  if (!discord || !discord.ok) return res.status(502).json({ error: 'Could not deliver the message' });
  return res.status(200).json({ ok: true });
}
