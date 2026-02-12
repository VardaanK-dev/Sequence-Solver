import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { randomUUID } from "crypto";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  // === Puzzle Logic ===
  
  function generatePuzzle() {
    const rules = [
      { name: "Linear (+n)", fn: (x: number, n: number) => x + n },
      { name: "Linear (-n)", fn: (x: number, n: number) => x - n },
      { name: "Geometric (*n)", fn: (x: number, n: number) => x * n },
      { name: "Squares", fn: (x: number, n: number) => (x + 1) ** 2 },
      { name: "Fibonacci-style", fn: (x: number, n: number, prev?: number) => (prev ?? 0) + x },
    ];

    const type = Math.floor(Math.random() * rules.length);
    const start = Math.floor(Math.random() * 10) + 1;
    const length = 5;
    const sequence: number[] = [start];
    
    let ruleDescription = "";
    
    if (type === 0) {
      const step = Math.floor(Math.random() * 9) + 1;
      ruleDescription = `Add ${step} to previous number`;
      for (let i = 1; i < length; i++) sequence.push(sequence[i-1] + step);
    } else if (type === 1) {
      const step = Math.floor(Math.random() * 5) + 1;
      ruleDescription = `Subtract ${step} from previous number`;
      for (let i = 1; i < length; i++) sequence.push(sequence[i-1] - step);
    } else if (type === 2) {
      const factor = Math.floor(Math.random() * 2) + 2; // *2 or *3
      ruleDescription = `Multiply previous number by ${factor}`;
      for (let i = 1; i < length; i++) sequence.push(sequence[i-1] * factor);
    } else if (type === 3) {
      ruleDescription = `Perfect squares (n^2)`;
      // Override sequence for squares
      const base = Math.floor(Math.random() * 5) + 1;
      for (let i = 0; i < length; i++) sequence[i] = (base + i) ** 2;
    } else if (type === 4) {
      ruleDescription = `Add the two previous numbers`;
      sequence[1] = Math.floor(Math.random() * 5) + 1;
      for (let i = 2; i < length; i++) sequence.push(sequence[i-1] + sequence[i-2]);
    }

    const missingIndex = Math.floor(Math.random() * (length - 1)) + 1; // Don't hide the first one usually
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
        ruleExplanation: puzzle.rule
      });
    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid input" });
      }
      throw err;
    }
  });

  // === Scores ===

  app.get(api.scores.list.path, async (req, res) => {
    const scores = await storage.getScores();
    res.json(scores);
  });

  app.post(api.scores.create.path, async (req, res) => {
    try {
      const input = api.scores.create.input.parse(req.body);
      const score = await storage.createScore(input);
      res.status(201).json(score);
    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid input" });
      }
      throw err;
    }
  });

  return httpServer;
}
