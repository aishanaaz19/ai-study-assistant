import express from "express";
import axios from "axios";
import { generateAIContent } from "../utils/summarizer.js";
const router = express.Router();

// POST /api/web-summary
router.post("/", async (req, res) => {
  const { url, wordLimit } = req.body;

  if (!url) {
    return res.status(400).json({ error: "Missing 'url' in request body" });
  }

  try {
    // 1. Fetch the page
    const response = await axios.get(url, { timeout: 10000, headers: {
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.82 Safari/537.36"
  } });
    let textContent = response.data;

    // 2. Quick check for valid HTML/text
    if (typeof textContent !== "string" || textContent.length < 200) {
      return res.status(400).json({ error: "Couldn't fetch enough page content." });
    }

    // 3. Strip HTML tags (basic)
    textContent = textContent.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();

    // 4. Check again
    if (!textContent || textContent.length < 200) {
      return res.status(400).json({ error: "Webpage content too short for summary." });
    }

    // 5. Summarize
    const summary = await generateAIContent(textContent, "summary", wordLimit || 200);
    res.json({ summary });
  } catch (err) {
    console.error("❌ Webpage Summarization Error:", err); // <--- LOG FULL ERROR!
    res.status(500).json({ error: "Failed to summarize webpage", details: err.message });
  }
});


export default router;
