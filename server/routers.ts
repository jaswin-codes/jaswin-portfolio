import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { invokeLLM } from "./_core/llm";
import { saveContact } from "./db";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  chat: publicProcedure
    .input(z.object({
      message: z.string(),
      conversationHistory: z.array(z.object({
        role: z.enum(['user', 'assistant']),
        content: z.string(),
      })),
    }))
    .mutation(async ({ input }) => {
      const systemPrompt = `You are Jarvis, the AI assistant for Jaswin Chinthala's personal portfolio website.

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

      const messages = [
        { role: 'system' as const, content: systemPrompt },
        ...input.conversationHistory.map((msg) => ({
          role: msg.role as 'user' | 'assistant',
          content: msg.content,
        })),
        {
          role: 'user' as const,
          content: input.message,
        },
      ];

      const result = await invokeLLM({
        messages: messages as any,
        model: 'gpt-4o-mini',
      });

      const responseText = typeof result.choices[0]?.message.content === 'string'
        ? result.choices[0].message.content
        : '';

      // Check if the user is a recruiter
      const isRecruiter = 
        input.message.toLowerCase().includes('recruiter') ||
        input.message.toLowerCase().includes('hiring') ||
        input.message.toLowerCase().includes('internship') ||
        input.message.toLowerCase().includes('job') ||
        input.message.toLowerCase().includes('position') ||
        input.message.toLowerCase().includes('company') ||
        responseText.toLowerCase().includes('contact form');

      return {
        response: responseText,
        isRecruiter,
      };
    }),

  contact: publicProcedure
    .input(z.object({
      name: z.string().min(1),
      email: z.string().email(),
      role: z.string().optional(),
      company: z.string().optional(),
      favPart: z.string().optional(),
      message: z.string().min(10),
    }))
    .mutation(async ({ input }) => {
      try {
        // Save to database
        await saveContact({
          name: input.name,
          email: input.email,
          role: input.role,
          company: input.company,
          favoritePart: input.favPart,
          message: input.message,
        });

        return { success: true };
      } catch (error) {
        console.error('Error saving contact:', error);
        throw new Error('Failed to submit contact form');
      }
    }),
});

export type AppRouter = typeof appRouter;
