import express, { Request, Response } from "express";
import { createServer } from "http";
import cors from "cors";

const app = express();
const httpServer = createServer(app);

app.use(cors());
app.use(express.json());

// In-memory puzzle store
const puzzles: Record<string, number[]> = {};

// Health check
app.get("/api/health", (_req: Request, res: Response) => {
  res.json({ status: "ok", timestamp: Date.now() });
});

// GET /api/puzzle → generate random arithmetic sequence
app.get("/api/puzzle", (_req, res) => {
  const length = 5;
  const start = Math.floor(Math.random() * 10) + 1;
  const step = Math.floor(Math.random() * 5) + 1;

  const sequence = Array.from({ length }, (_, i) => start + i * step);
  const id = Date.now().toString();

  // Pick a random index to hide
  const missingIndex = Math.floor(Math.random() * length);
  const correctAnswer = sequence[missingIndex];

  // Replace with null so frontend can render "?"
  const puzzleSequence = sequence.map((n, i) =>
    i === missingIndex ? null : n
  );

  puzzles[id] = sequence; // store full sequence
  res.json({ id, sequence: puzzleSequence, missingIndex });
});


// POST /api/puzzle/check → validate guess
app.post("/api/puzzle/check", (req, res) => {
  const { id, guess } = req.body;
  const sequence = puzzles[id];

  if (!sequence) {
    return res.status(404).json({ message: "Puzzle not found" });
  }

  // Find the missing index by looking for null in the puzzle sent earlier
  // (or store missingIndex alongside the puzzle)
  const step = sequence[1] - sequence[0];
  const missingIndex = sequence.findIndex((n, i, arr) =>
    i > 0 && n - arr[i - 1] !== step
  );

  // Simpler: store missingIndex when generating puzzle
  const correctAnswer = sequence[missingIndex];
  const correct = guess === correctAnswer;

  res.json({
    correct,
    correctAnswer,
    ruleExplanation: `This is an arithmetic sequence with step ${step}`,
  });
});

// Scores (demo in-memory)
let scores: { id: string; name: string; score: number }[] = [
  { id: "1", name: "Alice", score: 42 },
  { id: "2", name: "Bob", score: 37 },
];

app.get("/api/scores", (_req: Request, res: Response) => {
  res.json(scores);
});

app.post("/api/scores", (req: Request, res: Response) => {
  const { name, score } = req.body;
  const newScore = { id: Date.now().toString(), name, score };
  scores.push(newScore);
  res.status(201).json(newScore);
});

// Start server
const port = parseInt(process.env.PORT || "5000", 10);
httpServer.listen(port, "0.0.0.0", () => {
  console.log(`Express server running on port ${port}`);
});

export default app;
