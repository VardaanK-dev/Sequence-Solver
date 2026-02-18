import type { VercelRequest, VercelResponse } from "@vercel/node";

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === "POST") {
    const { id, guess } = req.body;

    // Example check logic: expecting 10 as the next number
    const correct = guess === 10;

    res.status(200).json({ correct });
  } else {
    res.status(405).end();
  }
}
