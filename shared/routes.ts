import { z } from 'zod';
import { insertScoreSchema, scores } from './schema';

export const api = {
  puzzle: {
    get: {
      method: 'GET' as const,
      path: '/api/puzzle' as const,
      responses: {
        200: z.object({
          id: z.string(),
          sequence: z.array(z.number().nullable()),
        })
      }
    },
    check: {
      method: 'POST' as const,
      path: '/api/puzzle/check' as const,
      input: z.object({
        id: z.string(),
        guess: z.number()
      }),
      responses: {
        200: z.object({
          correct: z.boolean(),
          correctAnswer: z.number(),
          ruleExplanation: z.string(),
        })
      }
    }
  },
  scores: {
    list: {
      method: 'GET' as const,
      path: '/api/scores' as const,
      responses: {
        200: z.array(z.custom<typeof scores.$inferSelect>())
      }
    },
    create: {
      method: 'POST' as const,
      path: '/api/scores' as const,
      input: insertScoreSchema,
      responses: {
        201: z.custom<typeof scores.$inferSelect>()
      }
    }
  }
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
