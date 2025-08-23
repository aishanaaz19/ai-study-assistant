import express from 'express';
import { YoutubeTranscript } from 'youtube-transcript';
import { GoogleGenAI } from '@google/genai';

const router = express.Router();

// Initialize Gemini client
const genAI = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY // Add this to your .env file
});

router.post('/youtube-transcript', async (req, res) => {
  try {
    const { videoId, summarize = false } = req.body;
    
    if (!videoId) {
      return res.status(400).json({ error: 'Video ID is required' });
    }

    console.log('Fetching transcript for:', videoId);

    // Fetch transcript
    const transcriptArray = await YoutubeTranscript.fetchTranscript(videoId);
    const transcript = transcriptArray
      .map(item => item.text)
      .join(' ')
      .replace(/\s+/g, ' ')
      .trim();

    if (!transcript) {
      return res.status(404).json({ 
        error: 'No transcript content found for this video.' 
      });
    }

    let summary = null;
    let keyPoints = null;
    
    // Generate summary if requested
    if (summarize && transcript.length > 100) {
      try {
        console.log('Generating AI summary with Gemini...');
        
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        
        const prompt = `Please analyze this YouTube video transcript and provide:
1. A concise summary (2-3 paragraphs)
2. Key points (bullet format)
3. Main topics covered

Transcript:
${transcript.substring(0, 4000)}`; // Limit to avoid token limits

        const result = await model.generateContent(prompt);
        const response = await result.response;
        summary = response.text();

        // Generate key points separately
        const keyPointsPrompt = `Extract the 5 most important key points from this YouTube video transcript in bullet format:

${transcript.substring(0, 3000)}`;

        const keyPointsResult = await model.generateContent(keyPointsPrompt);
        const keyPointsResponse = await keyPointsResult.response;
        keyPoints = keyPointsResponse.text();
        
      } catch (summaryError) {
        console.error('Summary generation failed:', summaryError);
        // Continue without summary rather than failing completely
      }
    }

    res.json({
      success: true,
      transcript,
      summary,
      keyPoints,
      transcriptLength: transcript.length,
      videoId
    });

  } catch (error) {
    console.error('YouTube transcript error:', error);
    
    if (error.message?.includes('Could not retrieve a transcript')) {
      return res.status(404).json({ 
        error: 'No transcript available for this video. The video may not have captions enabled.' 
      });
    }
    
    res.status(500).json({ 
      error: 'Failed to fetch transcript. Please try again later.' 
    });
  }
});

export default router;
