import { z } from "zod";
import { insertScoreSchema, scores } from "./schema.js";

export const api = {
  puzzle: {
    get: {
      method: "GET" as const,
      path: "/puzzle" as const, // ✅ removed /api prefix
      responses: {
        200: z.object({
          id: z.string(),
          sequence: z.array(z.number().nullable()),
        }),
      },
    },
    check: {
      method: "POST" as const,
      path: "/puzzle/check" as const, // ✅ removed /api prefix
      input: z.object({
        id: z.string(),
        guess: z.number(),
      }),
      responses: {
        200: z.object({
          correct: z.boolean(),
          correctAnswer: z.number(),
          ruleExplanation: z.string(),
        }),
      },
    },
  },
  scores: {
    list: {
      method: "GET" as const,
      path: "/scores" as const, // ✅ removed /api prefix
      responses: {
        200: z.array(z.custom<typeof scores.$inferSelect>()),
      },
    },
    create: {
      method: "POST" as const,
      path: "/scores" as const, // ✅ removed /api prefix
      input: insertScoreSchema,
      responses: {
        201: z.custom<typeof scores.$inferSelect>(),
      },
    },
  },
};

export function buildUrl(
  path: string,
  params?: Record<string, string | number>
): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }

  // ✅ prepend VITE_API_URL if available
  const baseUrl = import.meta.env.VITE_API_URL || "";
  return `${baseUrl}${url}`;
}
