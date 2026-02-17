import { z } from "zod";
import { insertScoreSchema, scores } from "./schema.js";

export const api = {
  puzzle: {
    get: {
      path: "/api/puzzle",
      method: "GET" as const,
    },
    check: {
      path: "/api/puzzle/check",
      method: "POST" as const,
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
      path: "/api/scores",
      method: "GET" as const,
      responses: {
        200: z.array(z.custom<typeof scores.$inferSelect>()),
      },
    },
    create: {
      path: "/api/scores",
      method: "POST" as const,
      input: insertScoreSchema,
      responses: {
        201: z.custom<typeof scores.$inferSelect>(),
      },
    },
  },
};
