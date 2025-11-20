import express from 'express';
import { YoutubeTranscript } from 'youtube-transcript';
import { GoogleGenAI } from '@google/genai';
import { getSubtitles } from 'youtube-captions-scraper';

const router = express.Router();

// Initialize Gemini client
const genAI = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY 
});

router.post('/youtube-transcript', async (req, res) => {
  try {
    const { videoId, summarize = false } = req.body;
    if (!videoId) {
      return res.status(400).json({ error: 'Video ID is required' });
    }

    console.log('Fetching transcript using captions-scraper for:', videoId);

    // Transcript extraction with alternate package
    let transcriptText = '';
    try {
      const subtitles = await getSubtitles({ videoID: videoId, lang: 'en' });
      transcriptText = subtitles.map(item => item.text).join(' ').trim();
      console.log('captions-scraper transcript:', transcriptText.substring(0, 150));
    } catch (captionErr) {
      console.error('captions-scraper error:', captionErr);
      return res.status(404).json({ error: 'No transcript found for this video with alternate method.' });
    }

    if (!transcriptText) {
      return res.status(404).json({ error: 'No transcript found for this video.' });
    }

    let summary = null;
    let keyPoints = null;

    // Gemini summary exactly as before (if requested and transcript found)
    if (summarize && transcriptText.length > 100) {
      try {
        console.log('Generating AI summary with Gemini...');
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `Please analyze this YouTube video transcript and provide:
1. A concise summary (2-3 paragraphs)
2. Key points (bullet format)
3. Main topics covered

Transcript:
${transcriptText.substring(0, 4000)}`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        summary = response.text();

        // Key Points separately
        const keyPointsPrompt = `Extract the 5 most important key points from this YouTube video transcript in bullet format:

${transcriptText.substring(0, 3000)}`;

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
      transcript: transcriptText,
      summary,
      keyPoints,
      transcriptLength: transcriptText.length,
      videoId
    });

  } catch (error) {
    console.error('YouTube transcript error:', error);
    res.status(500).json({ error: 'Failed to fetch transcript (alternate package).' });
  }
});

export default router;
