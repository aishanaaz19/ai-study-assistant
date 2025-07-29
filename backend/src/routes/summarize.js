import express from "express";
import { generateAIContent } from "../utils/summarizer.js"; // Import the new function
const router = express.Router();

router.post("/", async (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ error: "Missing 'text' in request body" });
  }

  try {
    // Call generateAIContent specifically for summary
    const summary = await generateAIContent(text, 'summary');
    res.json({ summary });
  } catch (err) {
    console.error("❌ Summarization Error:", err.message);
    res.status(500).json({ error: "Failed to summarize text", details: err.message });
  }
});

export default router;