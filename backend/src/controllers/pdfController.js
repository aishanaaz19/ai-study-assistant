import fs from 'fs';
import pdfParse from 'pdf-parse-debugging-disabled';
import path from 'path';

export const extractTextFromPDF = async (req, res) => {
  try {
    // Enhanced validation
    if (!req.file) {
      console.log("❌ No file object found in request");
      return res.status(400).json({ error: 'No file uploaded.' });
    }

    console.log("📂 File object:", req.file);
    
    // Check multiple possible file path properties
    const filePath = req.file.path || req.file.filename || req.file.originalname;
    
    if (!filePath) {
      console.log("❌ No file path found in file object");
      return res.status(400).json({ error: 'File path not available.' });
    }

    console.log("📂 File path to read:", filePath);

    // Check if file exists before attempting to read
    if (!fs.existsSync(filePath)) {
      console.log("❌ File does not exist at path:", filePath);
      
      // Try alternative paths if using multer
      const alternativePaths = [
        path.join('uploads', req.file.filename),
        path.join('uploads', req.file.originalname),
        path.join(process.cwd(), 'uploads', req.file.filename),
        req.file.buffer ? null : path.join(process.cwd(), filePath)
      ].filter(Boolean);

      let validPath = null;
      for (const altPath of alternativePaths) {
        if (fs.existsSync(altPath)) {
          validPath = altPath;
          console.log("✅ Found file at alternative path:", altPath);
          break;
        }
      }

      if (!validPath) {
        return res.status(400).json({ 
          error: 'File not found at expected location.',
          attempted_paths: [filePath, ...alternativePaths]
        });
      }
      
      filePath = validPath;
    }

    // Read file - handle both buffer and file path scenarios
    let dataBuffer;
    if (req.file.buffer) {
      // If multer is configured with memoryStorage
      console.log("📦 Using buffer from memory storage");
      dataBuffer = req.file.buffer;
    } else {
      // If multer is configured with diskStorage
      console.log("📁 Reading file from disk:", filePath);
      dataBuffer = fs.readFileSync(filePath);
    }

    // Parse PDF
    console.log("🔍 Parsing PDF...");
    const data = await pdfParse(dataBuffer);
    
    console.log("✅ PDF parsed successfully, text length:", data.text.length);
    
    // Send response
    res.json({ 
      text: data.text,
      info: {
        pages: data.numpages,
        info: data.info
      }
    });

    // Optional cleanup for disk storage
    if (!req.file.buffer && fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
        console.log("🗑️ Temporary file cleaned up");
      } catch (cleanupErr) {
        console.warn("⚠️ Failed to cleanup temporary file:", cleanupErr.message);
      }
    }

  } catch (err) {
    console.error("❌ PDF parsing error:", err.message);
    console.error("📋 Error details:", err);
    res.status(500).json({ 
      error: 'Failed to parse PDF',
      details: err.message 
    });
  }
};