import express from "express";
import { generateAIContent } from "../utils/summarizer.js";
import pdfParse from "pdf-parse-debugging-disabled";
import multer from "multer";
import path from "path";
import fs from "fs";
import { protect } from "../middleware/auth.js";
import User from "../models/User.js";

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

const upload = multer({ 
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'), false);
    }
  }
});

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

// Apply authentication middleware to protect the route
router.post("/", protect, upload.single("pdfFile"), async (req, res) => {
  let filePath = '';
  try {
    // Check if user is authenticated
    if (!req.user) {
      return res.status(401).json({ 
        success: false,
        error: "Authentication required to use this service." 
      });
    }

    if (!req.file || !req.file.path) {
      return res.status(400).json({ 
        success: false,
        error: "No PDF file uploaded." 
      });
    }

    // Extract wordLimit from the request body
    const wordLimit = parseInt(req.body.wordLimit, 10) || 200;
    if (isNaN(wordLimit) || wordLimit <= 0 || wordLimit > 1000) {
      return res.status(400).json({ 
        success: false,
        error: "Invalid word limit provided. Must be between 1 and 1000." 
      });
    }

    filePath = req.file.path;
    console.log(`📁 Processing PDF for user: ${req.user.email}`);

    const dataBuffer = fs.readFileSync(filePath);
    const { text } = await pdfParse(dataBuffer);

    if (!text || text.length < 100) {
      return res.status(400).json({ 
        success: false,
        error: "PDF content too short for comprehensive AI processing." 
      });
    }

    const chunks = chunkText(text);
    console.log(`📄 Processing ${chunks.length} chunks for PDF summary...`);

    const chunkSummaries = [];
    for (const [index, chunk] of chunks.entries()) {
      console.log(`📄 Summarizing chunk ${index + 1} of ${chunks.length}...`);
      try {
        const partSummary = await generateAIContent(chunk, 'summary', wordLimit);
        chunkSummaries.push(partSummary);
        console.log(`✅ Chunk ${index + 1} summarized.`);
      } catch (err) {
        console.warn(`⚠️ Failed to summarize chunk ${index + 1}:`, err.message);
      }
    }

    const finalSummary = chunkSummaries.filter(Boolean).join("\n\n");

    if (!finalSummary.trim()) {
      return res.status(500).json({ 
        success: false,
        error: "Failed to generate a comprehensive summary from the PDF." 
      });
    }

    // Save summary to user's history
    try {
      const user = await User.findById(req.user.id);
      if (user) {
        await user.addSummary({
          content: finalSummary,
          title: req.file.originalname.replace('.pdf', '') + ' Summary',
          wordCount: finalSummary.split(' ').length
        });
        console.log(`💾 Summary saved to user history for: ${req.user.email}`);
      }
    } catch (saveError) {
      console.warn('⚠️ Failed to save summary to user history:', saveError.message);
      // Don't fail the request if saving fails
    }

    res.json({
      success: true,
      summary: finalSummary,
      message: 'PDF summarized successfully and saved to your history!',
      metadata: {
        filename: req.file.originalname,
        wordLimit: wordLimit,
        summaryLength: finalSummary.length,
        chunksProcessed: chunks.length,
        userId: req.user.id
      }
    });

  } catch (err) {
    console.error("❌ PDF Summarization Error:", err.message);
    
    // Handle specific errors
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ 
        success: false,
        error: "File too large. Please upload a PDF under 10MB." 
      });
    }
    
    if (err.message === 'Only PDF files are allowed') {
      return res.status(400).json({ 
        success: false,
        error: "Only PDF files are allowed. Please upload a valid PDF file." 
      });
    }

    res.status(500).json({ 
      success: false,
      error: "Failed to summarize PDF", 
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  } finally {
    // Clean up uploaded file
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

// Get user's summary history
router.get("/history", protect, async (req, res) => {
  try {
    const { limit = 10, page = 1 } = req.query;
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found"
      });
    }

    // Get paginated summaries
    const summaries = user.summaries
      .sort((a, b) => b.createdAt - a.createdAt) // Most recent first
      .slice((page - 1) * limit, page * limit);

    res.json({
      success: true,
      summaries: summaries.map(summary => ({
        id: summary._id,
        title: summary.title,
        content: summary.content.substring(0, 200) + '...', // Preview
        wordCount: summary.wordCount,
        createdAt: summary.createdAt
      })),
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: user.summaries.length,
        pages: Math.ceil(user.summaries.length / limit)
      }
    });

  } catch (error) {
    console.error('Get summary history error:', error);
    res.status(500).json({
      success: false,
      error: "Failed to retrieve summary history"
    });
  }
});

// Get specific summary by ID
router.get("/history/:summaryId", protect, async (req, res) => {
  try {
    const { summaryId } = req.params;
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found"
      });
    }

    const summary = user.summaries.id(summaryId);
    
    if (!summary) {
      return res.status(404).json({
        success: false,
        error: "Summary not found"
      });
    }

    res.json({
      success: true,
      summary: {
        id: summary._id,
        title: summary.title,
        content: summary.content,
        wordCount: summary.wordCount,
        createdAt: summary.createdAt
      }
    });

  } catch (error) {
    console.error('Get specific summary error:', error);
    res.status(500).json({
      success: false,
      error: "Failed to retrieve summary"
    });
  }
});

// Delete specific summary
router.delete("/history/:summaryId", protect, async (req, res) => {
  try {
    const { summaryId } = req.params;
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found"
      });
    }

    const summary = user.summaries.id(summaryId);
    
    if (!summary) {
      return res.status(404).json({
        success: false,
        error: "Summary not found"
      });
    }

    user.summaries.pull(summaryId);
    await user.save();

    res.json({
      success: true,
      message: "Summary deleted successfully"
    });

  } catch (error) {
    console.error('Delete summary error:', error);
    res.status(500).json({
      success: false,
      error: "Failed to delete summary"
    });
  }
});

export default router;
