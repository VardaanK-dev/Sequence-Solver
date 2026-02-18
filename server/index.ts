import express from "express";

const app = express();
app.use(express.json());

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: Date.now() });
});

// GET /api/puzzle
app.get("/api/puzzle", (req, res) => {
  res.json({
    id: "1",
    sequence: [2, 4, 6, 8], // Example puzzle
  });
});

// POST /api/puzzle/check
app.post("/api/puzzle/check", (req, res) => {
  const { id, guess } = req.body;
  // Example check logic: expecting 10 as the next number
  const correct = guess === 10;
  res.json({ correct });
});

// GET /api/scores
app.get("/api/scores", (req, res) => {
  res.json([
    { id: "1", name: "Alice", score: 42 },
    { id: "2", name: "Bob", score: 37 },
  ]);
});

// POST /api/scores
app.post("/api/scores", (req, res) => {
  const { name, score } = req.body;
  const newScore = { id: Date.now().toString(), name, score };
  res.status(201).json(newScore);
});

// Export for Vercel
export default app;
