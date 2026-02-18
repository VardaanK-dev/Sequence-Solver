import type { VercelRequest, VercelResponse } from "@vercel/node";

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === "GET") {
    // Example puzzle
    res.status(200).json({
      id: "1",
      sequence: [2, 4, 6, 8],
    });
  } else {
    res.status(405).end();
  }
}
