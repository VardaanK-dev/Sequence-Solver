import { db } from "./db.js";
import { scores, type InsertScore, type Score } from "../shared/schema.js";
import { desc } from "drizzle-orm";

export interface Puzzle {
  id: string;
  sequence: (number | null)[];
  missingIndex: number;
  solution: number;
  rule: string;
}

export interface IStorage {
  // Scoreboard
  getScores(): Promise<Score[]>;
  createScore(score: InsertScore): Promise<Score>;
  
  // Ephemeral Puzzle Storage
  createPuzzle(puzzle: Puzzle): Promise<void>;
  getPuzzle(id: string): Promise<Puzzle | undefined>;
}

export class DatabaseStorage implements IStorage {
  // In-memory cache for active puzzles (no need to persist these)
  private activePuzzles: Map<string, Puzzle> = new Map();

  async getScores(): Promise<Score[]> {
    return await db.select().from(scores).orderBy(desc(scores.score)).limit(10);
  }

async createScore(insertScore: { username: string; score: number }): Promise<Score> {
  const [score] = await db
    .insert(scores)
    .values({
      username: insertScore.username,
      score: insertScore.score,
    })
    .returning();

  return score;
}


  async createPuzzle(puzzle: Puzzle): Promise<void> {
    this.activePuzzles.set(puzzle.id, puzzle);
    
    // Cleanup old puzzles periodically or limit size if needed
    if (this.activePuzzles.size > 1000) {
      const firstKey = this.activePuzzles.keys().next().value;
      if (firstKey) this.activePuzzles.delete(firstKey);
    }
  }

  async getPuzzle(id: string): Promise<Puzzle | undefined> {
    return this.activePuzzles.get(id);
  }
}

export const storage = new DatabaseStorage();
