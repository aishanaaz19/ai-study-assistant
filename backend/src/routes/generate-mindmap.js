import express from "express";
import multer from "multer";
import pdf from "pdf-parse-debugging-disabled";
import { generateAIContent } from "../utils/summarizer.js"; // Your Gemini wrapper

const router = express.Router();
const upload = multer();

router.post("/", upload.single('pdfFile'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No PDF file uploaded' });
    }

    const pdfBuffer = req.file.buffer;
    const data = await pdf(pdfBuffer);
    const text = data.text;

    if (!text || text.trim().length === 0) {
      return res.status(400).json({ error: 'No text found in PDF' });
    }

    const ignoreSections = [
      "About the Tutorial", "Audience", "Prerequisites", "Disclaimer", "Table of Contents"
    ];
    const filteredText = text
      .split('\n')
      .filter(line => !ignoreSections.some(section => line.trim().startsWith(section)))
      .join('\n');

    // Core prompt for a "hub-and-spoke" mind map
    const prompt = `
    Generate a mind map for this document in JSON format:
    - One "center" node with the main topic/title.
    - 8–12 "main" topic nodes connected directly to the center.
    - Each main topic node with 2–4 "sub" topic nodes, connected directly to their parent main topic.
    - Absolutely no deeper hierarchy.
    - No chaining, each subtopic must be spaced individually, all visible in a radial layout.
    - Example format:
      {
        "nodes": [
          { "id": "center", "label": "Main Title", "type": "center" },
          { "id": "main1", "label": "Main Topic 1", "type": "main" },
          { "id": "sub1a", "label": "Subtopic A", "type": "sub" },
          // ...
        ],
        "edges": [
          { "from": "center", "to": "main1" },
          { "from": "main1", "to": "sub1a" },
          // ...
        ]
      }
    - All nodes must be unique and connected as described above.
    - Do NOT include 'meta', 'Table of Contents', or filler topics.
    - Focus on key concepts, terms, and ideas from the text.

Document text:
${filteredText}
    `;

    const mindmap = await generateAIContent(prompt, 'mindmap');

    if (!mindmap || !mindmap.nodes || !mindmap.edges || mindmap.nodes.length === 0) {
      return res.status(400).json({
        error: 'No mind map could be generated from this document'
      });
    }

    res.json({
      nodes: mindmap.nodes,
      edges: mindmap.edges
    });

  } catch (error) {
    res.status(500).json({
      error: "Failed to generate mind map",
      details: error.message
    });
  }
});

export default router;
