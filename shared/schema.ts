import { pgTable, integer, text } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const scores = pgTable(
  "scores",
  (c) => ({
    id: c.integer("id")
      .primaryKey()
      .default(sql`nextval('app.scores_id_seq'::regclass)`),
    username: c.text("username").notNull(),
    score: c.integer("score").notNull(),
    createdAt: c.timestamp("created_at").defaultNow(),
  }),
  (table) => ({
    schema: "app",
  })
);

export const insertScoreSchema = createInsertSchema(scores).omit({
  id: true,
  createdAt: true,
});

export type Score = typeof scores.$inferSelect;
export type InsertScore = z.infer<typeof insertScoreSchema>;


// === API Types ===

export interface PuzzleResponse {
  id: string;
  sequence: (number | null)[];
}

export interface CheckSolutionRequest {
  id: string;
  guess: number;
}

export interface CheckSolutionResponse {
  correct: boolean;
  correctAnswer: number;
  ruleExplanation: string;
}
