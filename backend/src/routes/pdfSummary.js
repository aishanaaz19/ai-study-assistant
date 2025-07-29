import express from "express";
import { generateAIContent } from "../utils/summarizer.js";
import pdfParse from "pdf-parse-debugging-disabled";
import multer from "multer";
import path from "path";
import fs from "fs";

const router = express.Router();

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

function chunkText(text, maxLength = 200000) {
  const chunks = [];
  let currentPos = 0;
  while (currentPos < text.length) {
    let endPos = Math.min(currentPos + maxLength, text.length);
    if (endPos < text.length) {
      let lastSpace = text.lastIndexOf(' ', endPos);
      let lastNewline = text.lastIndexOf('\n', endPos);
      let breakPoint = Math.max(lastSpace, lastNewline);

      if (breakPoint > currentPos && breakPoint < endPos) {
        endPos = breakPoint;
      }
    }
    chunks.push(text.slice(currentPos, endPos));
    currentPos = endPos;
    while (currentPos < text.length && /\s/.test(text[currentPos])) {
      currentPos++;
    }
  }
  return chunks;
}

router.post("/", upload.single("pdfFile"), async (req, res) => { // Changed 'pdf' to 'pdfFile' to match frontend formData.append
  let filePath = '';
  try {
    if (!req.file || !req.file.path) {
      return res.status(400).json({ error: "No PDF file uploaded." });
    }

    // NEW: Extract wordLimit from the request body
    const wordLimit = parseInt(req.body.wordLimit, 10);
    if (isNaN(wordLimit) || wordLimit <= 0) {
      // Set a default or return an error if wordLimit is invalid
      console.warn("Invalid wordLimit received, defaulting to 200.");
      // You could also return an error: return res.status(400).json({ error: "Invalid word limit provided." });
    }

    filePath = req.file.path;
    const dataBuffer = fs.readFileSync(filePath);
    const { text } = await pdfParse(dataBuffer);

    if (!text || text.length < 100) {
      return res.status(400).json({ error: "PDF content too short for comprehensive AI processing." });
    }

    const chunks = chunkText(text);
    let finalSummary = '';

    const chunkSummaries = [];
    for (const [index, chunk] of chunks.entries()) {
      console.log(`📄 Summarizing chunk ${index + 1} of ${chunks.length}...`);
      try {
        // Pass the wordLimit to generateAIContent
        const partSummary = await generateAIContent(chunk, 'summary', wordLimit);
        chunkSummaries.push(partSummary);
        console.log(`✅ Chunk ${index + 1} summarized.`);
      } catch (err) {
        console.warn(`⚠️ Failed to summarize chunk ${index + 1}:`, err.message);
      }
    }

    finalSummary = chunkSummaries.filter(Boolean).join("\n\n");

    if (!finalSummary.trim()) {
      return res.status(500).json({ error: "Failed to generate a comprehensive summary from the PDF." });
    }

    res.json({
      summary: finalSummary,
    });

  } catch (err) {
    console.error("❌ PDF Summarization Error:", err.message);
    res.status(500).json({ error: "Failed to summarize PDF", details: err.message });
  } finally {
    if (filePath && fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
        console.log("🗑️ Temporary file cleaned up:", filePath);
      } catch (cleanupErr) {
        console.warn("⚠️ Failed to cleanup temporary file:", cleanupErr.message);
      }
    }
  }
});

export default router;