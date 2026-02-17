import express from "express";
import cors from "cors";

const app = express();

app.use(cors({
  origin: ["https://sequence-solver-frontend.vercel.app"],
  methods: ["GET", "POST"],
}));

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: Date.now() });
});

// Export the app instead of calling listen()
export default app;
