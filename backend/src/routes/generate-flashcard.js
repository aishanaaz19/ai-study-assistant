// routes/generate-flashcards.js
import express from "express";
import multer from "multer";
import pdf from "pdf-parse-debugging-disabled";
import { generateAIContent } from "../utils/summarizer.js";

const router = express.Router();
const upload = multer();

router.post("/", upload.single('pdfFile'), async (req, res) => {
  try {
    // Validate file upload
    if (!req.file) {
      return res.status(400).json({ error: 'No PDF file uploaded' });
    }

    // Extract text from PDF
    const pdfBuffer = req.file.buffer;
    const data = await pdf(pdfBuffer);
    const text = data.text;

    if (!text || text.trim().length === 0) {
      return res.status(400).json({ error: 'No text found in PDF' });
    }

    console.log("📄 Processing PDF for flashcards:", req.file.originalname);
    console.log("📝 Extracted text length:", text.length, "characters");

    // Generate flashcards using your existing generateAIContent function
    const flashcards = await generateAIContent(text, 'flashcards');
    
    // Validate the response
    if (!flashcards || !Array.isArray(flashcards) || flashcards.length === 0) {
      return res.status(400).json({ 
        error: 'No flashcards could be generated from this document' 
      });
    }

    console.log("✅ Generated", flashcards.length, "flashcards successfully");

    res.json({ 
      flashcards,
      fileName: req.file.originalname,
      totalCards: flashcards.length,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error("❌ Flashcard Generation Error:", error.message);
    res.status(500).json({ 
      error: "Failed to generate flashcards", 
      details: error.message 
    });
  }
});

export default router;
