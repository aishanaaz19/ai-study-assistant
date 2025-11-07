import express from "express";
import { generateAIContent } from "../utils/summarizer.js";
const router = express.Router();

router.post("/", async (req, res) => {
  const { summary, question, fileName } = req.body;

  // Validate required fields
  if (!summary || !question) {
    return res.status(400).json({ 
      error: "Missing 'summary' or 'question' in request body" 
    });
  }

  try {
    // Create a contextual prompt for answer generation
    const contextualPrompt = `
    Based on the following document summary, answer the student's question in a helpful, educational manner:

    Document Summary:
    ${summary}

    Student's Question:
    ${question}

    Please provide a clear, comprehensive answer that helps the student understand the topic better. Focus on key concepts and practical understanding.
    `;

    // Use your existing generateAIContent function with 'answer' type
    const answer = await generateAIContent(contextualPrompt, 'answer');
    
    res.json({ 
      answer,
      question,
      fileName: fileName || 'Unknown',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error("❌ Answer Generation Error:", error.message);
    res.status(500).json({ 
      error: "Failed to generate answer", 
      details: error.message 
    });
  }
});

export default router;

