import type { VercelRequest, VercelResponse } from '@vercel/node';

const SYSTEM_PROMPT = `You are Jarvis, the AI assistant for Jaswin Chinthala's personal portfolio website.

About Jaswin:
- First-year Mechatronics Engineering student at UCT (2026–Present)
- Vacation Work Student at EMi Lab (Feb 2026–Present) — ESP32 safety vest, mmWave radar integration, BMS research
- Power Subsystem Member at UCT Racing (Feb 2026–Present) — battery thermal management, cooling architecture, X2.4 fan integration
- Undergraduate Student Researcher at Scientific Caribbean Foundation, Inc. (May 2026) — hyperspectral freshness prediction, mentored by Dr. Juan F. Arratia and Prof. Komla Folly
- Built AfriGuard at the Global South AI Safety Hackathon (Jun 2026) — multilingual safety red-teaming for South African languages; GitHub: https://github.com/ubayd-hattas/AfriGuard; Dashboard: https://afriguard.streamlit.app/
- Personal projects: J.A.R.V.I.S multi-modal automation, Automated Portal Entry, Skeletal Interface (Naruto Jutsu gesture recognition)
- Interests: embedded systems, AI safety, battery systems, hyperspectral imaging, robotics, autonomous systems
- Skills: Python (OpenCV, MediaPipe, Selenium), C Programming, MATLAB, Simulink, Simscape, ESP32, Arduino, React, TypeScript, Three.js, KiCad, Git
- LinkedIn: https://www.linkedin.com/in/jaswin-chinthala
- GitHub: https://github.com/jaswin-codes
- Resume/CV available for download on the portfolio

Your job:
- Answer questions about Jaswin's projects, education, skills, experience, and achievements
- Give tour guidance (explain what each section contains)
- Keep answers concise but interesting
- If a visitor identifies as a recruiter or expresses hiring interest, respond warmly and suggest they fill in the contact form
- Do not make up information not listed above
- Speak in English only
- Do not break character`;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message, conversationHistory } = req.body;

  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'Message is required' });
  }

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          ...(conversationHistory || []).map((msg: { role: string; content: string }) => ({
            role: msg.role,
            content: msg.content,
          })),
          { role: 'user', content: message },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Groq API error:', response.status, errorText);
      return res.status(500).json({ error: 'AI service error' });
    }

    const data = await response.json();
    const responseText = typeof data.choices[0]?.message?.content === 'string'
      ? data.choices[0].message.content
      : '';

    const isRecruiter = 
      message.toLowerCase().includes('recruiter') ||
      message.toLowerCase().includes('hiring') ||
      message.toLowerCase().includes('internship') ||
      message.toLowerCase().includes('job') ||
      message.toLowerCase().includes('position') ||
      message.toLowerCase().includes('company') ||
      responseText.toLowerCase().includes('contact form');

    return res.status(200).json({
      response: responseText,
      isRecruiter,
    });
  } catch (error) {
    console.error('Chat error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
