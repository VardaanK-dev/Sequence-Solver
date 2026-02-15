import { z } from 'zod';
import { insertScoreSchema, scores } from './schema';

// Keep API_URL detection
let API_URL: string = "";

try {
  // Frontend (Vite)
  API_URL = import.meta.env.VITE_API_URL;
} catch {
  // Backend (Node/Express)
  API_URL = process.env.VITE_API_URL || "";
}

console.log("API_URL in routes.ts:", API_URL);

// ✅ Keep paths relative so backend can register them
export const api = {
  puzzle: {
    get: {
      method: 'GET' as const,
      path: "/api/puzzle",
      responses: {
        200: z.object({
          id: z.string(),
          sequence: z.array(z.number().nullable()),
        })
      }
    },
    check: {
      method: 'POST' as const,
      path: "/api/puzzle/check",
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
      path: "/api/scores",
      responses: {
        200: z.array(z.custom<typeof scores.$inferSelect>())
      }
    },
    create: {
      method: 'POST' as const,
      path: "/api/scores",
      input: insertScoreSchema,
      responses: {
        201: z.custom<typeof scores.$inferSelect>()
      }
    }
  }
};

// ✅ Helper: prepend API_URL only for frontend fetch calls
export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return API_URL ? `${API_URL}${url}` : url;
}
