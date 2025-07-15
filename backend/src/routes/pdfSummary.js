// ... earlier code like multer setup, fs, etc.
import express from "express";
import { summarizeWithHuggingFace } from "../utils/summarizer.js";
import pdfParse from "pdf-parse-debugging-disabled";
import multer from "multer";
import path from "path";
import fs from "fs";

const router = express.Router();

// Multer setup (same as yours)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join("src", "uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    cb(null, `${timestamp}-${file.originalname}`);
  },
});
const upload = multer({ storage });

function chunkText(text, maxLength = 3500) {
  const chunks = [];
  for (let i = 0; i < text.length; i += maxLength) {
    chunks.push(text.slice(i, i + maxLength));
  }
  return chunks;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

router.post("/", upload.single("pdf"), async (req, res) => {
  try {
    if (!req.file || !req.file.path) {
      return res.status(400).json({ error: "No PDF file uploaded." });
    }

    const filePath = req.file.path;
    const dataBuffer = fs.readFileSync(filePath);
    const { text } = await pdfParse(dataBuffer);

    if (!text || text.length < 50) {
      return res.status(400).json({ error: "PDF content too short to summarize." });
    }

    const chunks = chunkText(text, 3500);
    const summaries = [];

    for (const [index, chunk] of chunks.entries()) {
      try {
        console.log(`✅ Chunk ${index + 1} summarized successfully.`);
        const partSummary = await summarizeWithHuggingFace(chunk);
        summaries.push(`🧩 Summary:\n${partSummary}`);

        if (index < chunks.length - 1) {
          await sleep(3000); // wait 3 seconds
        }
      } catch (err) {
        console.error(`❌ Chunk ${index + 1} failed:`, err.message);
        summaries.push(`❌ Failed to summarize chunk ${index + 1}`);
      }
    }

    fs.unlinkSync(filePath); // optional: cleanup uploaded file

    const finalSummary = summaries.join("\n\n");

    res.json({
      summary: finalSummary,
    });

  } catch (err) {
    console.error("❌ PDF Summarization Error:", err.message);
    res.status(500).json({ error: "Failed to summarize PDF", details: err.message });
  }
});

export default router;
