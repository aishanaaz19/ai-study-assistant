import express from "express";
import { summarizeWithHuggingFace } from "../utils/summarizer.js";
const router = express.Router();

router.post("/", async (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ error: "Missing 'text' in request body" });
  }

  try {
    const summary = await summarizeWithHuggingFace(text);
    res.json({ summary });
  } catch (err) {
    res.status(500).json({ error: "Failed to summarize", details: err.message });
  }
});

export default router;
