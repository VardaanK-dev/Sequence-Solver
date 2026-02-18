import type { VercelRequest, VercelResponse } from "@vercel/node";

let scores = [
  { id: "1", name: "Alice", score: 42 },
  { id: "2", name: "Bob", score: 37 },
];

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === "GET") {
    res.status(200).json(scores);
  } else if (req.method === "POST") {
    const { name, score } = req.body;
    const newScore = { id: String(scores.length + 1), name, score };
    scores.push(newScore);
    res.status(201).json(newScore);
  } else {
    res.status(405).end();
  }
}
