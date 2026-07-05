import "dotenv/config";
import express from "express";
import { createServer } from "http";
import net from "net";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "./oauth";
import { registerStorageProxy } from "./storageProxy";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { serveStatic, setupVite } from "./vite";

function isPortAvailable(port: number): Promise<boolean> {
  return new Promise(resolve => {
    const server = net.createServer();
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
    server.on("error", () => resolve(false));
  });
}

async function findAvailablePort(startPort: number = 3000): Promise<number> {
  for (let port = startPort; port < startPort + 20; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`No available port found starting from ${startPort}`);
}

async function startServer() {
  const app = express();
  const server = createServer(app);
  // Configure body parser with larger size limit for file uploads
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));
  registerStorageProxy(app);
  registerOAuthRoutes(app);
  // Chat API — mirrors Vercel api/chat.ts so it also works in local dev
  app.post("/api/chat", async (req, res) => {
    const { message, conversationHistory } = req.body;

    if (!message || typeof message !== "string") {
      res.status(400).json({ error: "Message is required" });
      return;
    }

    const groqApiKey = process.env.GROQ_API_KEY;
    if (!groqApiKey) {
      res.status(200).json({
        response:
          "Hello! I am in standby — GROQ_API_KEY is not set locally. Add it to your .env file to activate me.",
        isRecruiter: false,
      });
      return;
    }

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

    try {
      const groqRes = await fetch(
        "https://api.groq.com/openai/v1/chat/completions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${groqApiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "llama-3.3-70b-versatile",
            messages: [
              { role: "system", content: SYSTEM_PROMPT },
              ...(conversationHistory || []).map(
                (msg: { role: string; content: string }) => ({
                  role: msg.role,
                  content: msg.content,
                })
              ),
              { role: "user", content: message },
            ],
          }),
        }
      );

      if (!groqRes.ok) {
        const errText = await groqRes.text();
        console.error("[Chat] Groq API error:", groqRes.status, errText);
        res.status(200).json({
          response:
            "I encountered an error with the AI service. Please ensure the Groq API key is valid.",
          isRecruiter: false,
        });
        return;
      }

      const data = await groqRes.json() as { choices: Array<{ message: { content: string } }> };
      const responseText =
        typeof data.choices[0]?.message?.content === "string"
          ? data.choices[0].message.content
          : "";

      const isRecruiter =
        message.toLowerCase().includes("recruiter") ||
        message.toLowerCase().includes("hiring") ||
        message.toLowerCase().includes("internship") ||
        message.toLowerCase().includes("job") ||
        message.toLowerCase().includes("position") ||
        message.toLowerCase().includes("company") ||
        responseText.toLowerCase().includes("contact form");

      res.status(200).json({ response: responseText, isRecruiter });
    } catch (error) {
      console.error("[Chat] Error:", error);
      res.status(200).json({
        response: "Sorry, I encountered an error. Please try again.",
        isRecruiter: false,
      });
    }
  });

  // tRPC API
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );
  // development mode uses Vite, production mode uses static files
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  const preferredPort = parseInt(process.env.PORT || "3000");
  const port = await findAvailablePort(preferredPort);

  if (port !== preferredPort) {
    console.log(`Port ${preferredPort} is busy, using port ${port} instead`);
  }

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
