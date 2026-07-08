import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
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

  contact: publicProcedure
    .input(
      z.object({
        name: z.string().min(1),
        email: z.string().email(),
        role: z.string().optional(),
        company: z.string().optional(),
        favPart: z.string().optional(),
        message: z.string().min(1),
      })
    )
    .mutation(async ({ input }) => {
      // 1. Save to database
      await saveContact({
        name: input.name,
        email: input.email,
        role: input.role,
        company: input.company,
        favoritePart: input.favPart,
        message: input.message,
      });

      // 2. Dispatch Discord notification if Webhook URL is set
      const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
      if (webhookUrl) {
        try {
          const payload = {
            embeds: [
              {
                title: "📬 New Portfolio Contact Submission",
                color: 0x00ff88, // Mint green
                fields: [
                  { name: "Name", value: input.name || "N/A", inline: true },
                  { name: "Email", value: input.email || "N/A", inline: true },
                  { name: "Role", value: input.role || "N/A", inline: true },
                  {
                    name: "Company",
                    value: input.company || "N/A",
                    inline: true,
                  },
                  {
                    name: "Favorite Part",
                    value: input.favPart || "N/A",
                    inline: true,
                  },
                  { name: "Message", value: input.message || "N/A" },
                ],
                timestamp: new Date().toISOString(),
              },
            ],
          };

          await fetch(webhookUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
        } catch (discordError) {
          console.error("Failed to send Discord webhook:", discordError);
        }
      } else {
        console.log(
          "Discord notification skipped: DISCORD_WEBHOOK_URL is not set"
        );
      }

      return { success: true };
    }),
});

export type AppRouter = typeof appRouter;
