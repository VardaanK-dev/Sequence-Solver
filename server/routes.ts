import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage.js";
import { api } from "../shared/api.js";
import { z } from "zod";
import { randomUUID } from "crypto";
import { insertScoreSchema } from "../shared/schema.js";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  // === Puzzle Logic ===
  
  function generatePuzzle() {
    // Generate a puzzle in the format an + b
    const a = Math.floor(Math.random() * 9) + 2; // coefficient (2 to 10)
    const b = Math.floor(Math.random() * 20) + 1; // constant (1 to 20)
    const length = 5;
    const sequence: number[] = [];

    for (let n = 1; n <= length; n++) {
      sequence.push(a * n + b);
    }

    const ruleDescription = `The rule is ${a}n + ${b}`;
    const missingIndex = Math.floor(Math.random() * (length - 1)) + 1;
    const solution = sequence[missingIndex];
    
    return { sequence, missingIndex, solution, rule: ruleDescription };
  }

  app.get(api.puzzle.get.path, async (req, res) => {
    const { sequence, missingIndex, solution, rule } = generatePuzzle();
    const id = randomUUID();
    
    const puzzleSequence = [...sequence];
    // @ts-ignore - explicitly setting null for API transport
    puzzleSequence[missingIndex] = null;

    await storage.createPuzzle({
      id,
      sequence: puzzleSequence,
      missingIndex,
      solution,
      rule
    });

    res.json({ id, sequence: puzzleSequence });
  });

// === Scores ===

app.get(api.scores.list.path, async (req, res) => {
  const scores = await storage.getScores();
  res.json(scores);
});

app.post(api.scores.create.path, async (req, res) => {
  try {
    const input = insertScoreSchema.parse(req.body);
    const score = await storage.createScore(input);
    res.status(201).json(score);
  } catch (err) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ message: "Invalid input" });
    } else {
      throw err;
    }
  }
});

// === Puzzle Check ===

app.post(api.puzzle.check.path, async (req, res) => {
  try {
    const { id, guess } = api.puzzle.check.input.parse(req.body);
    const puzzle = await storage.getPuzzle(id);

    if (!puzzle) {
      return res.status(404).json({ message: "Puzzle expired or not found" });
    }

    const correct = puzzle.solution === guess;

    res.json({
      correct,
      correctAnswer: puzzle.solution,
      ruleExplanation: puzzle.rule,
    });
  } catch (err) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ message: "Invalid input" });
    } else {
      throw err;
    }
  }
});

return httpServer;
}