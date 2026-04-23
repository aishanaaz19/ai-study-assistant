import { GoogleGenAI } from "@google/genai";
import Groq from "groq-sdk";
import dotenv from "dotenv";
import ReactMarkdown from "react-markdown";

dotenv.config();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function generateAIContent(text, contentType, wordLimit = null) {
  let prompt = "";

  switch (contentType) {
case "summary":
  prompt = `
Analyze the following PDF content and provide a structured summary.

Use EXACTLY this format with these EXACT headings:

**Overview**
Write 3-4 sentences here.

**Key Highlights**
- Point 1
- Point 2
- Point 3
- Point 4

**Key Insights**
- Insight 1
- Insight 2
- Insight 3

**Main Takeaways**
- Takeaway 1
- Takeaway 2
- Takeaway 3

Content:
${text}

Word limit: approximately ${wordLimit || 300} words.
Do not add any extra headings or text outside this structure.
`;
      break;

    case "mindmap":
      prompt = `
Generate a valid JSON object mind map from this text.

Return ONLY valid JSON:

{
  "nodes": [
    {"id": "1", "label": "Main Topic", "type": "main"},
    {"id": "2", "label": "Sub Topic", "type": "sub"}
  ],
  "edges": [
    {"from": "1", "to": "2", "label": "relates to"}
  ]
}

Text:
${text}
`;
      break;

    case "flashcards":
      prompt = `
Generate 10 flashcards.

Return ONLY valid JSON array:
[
  {"term": "Term", "definition": "Definition"}
]

Text:
${text}
`;
      break;

    case "questions":
      prompt = `
Generate at least 3 MCQs.

Return ONLY valid JSON array:
[
  {
    "question": "Question?",
    "options": ["A", "B", "C"],
    "answer": "Correct Option"
  }
]

Text:
${text}
`;
      break;

    case "answer":
      prompt = text;
      break;

    default:
      throw new Error(`Unsupported content type: ${contentType}`);
  }

  try {
    // 🔥 Primary: Gemini
    const result = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
    });

    const textResponse = result.text;

    if (
      contentType === "mindmap" ||
      contentType === "flashcards" ||
      contentType === "questions"
    ) {
      return JSON.parse(textResponse);
    }

    return textResponse;

  } catch (error) {

    try {
      const completion = await groq.chat.completions.create({
        model: "llama-3.1-8b-instant",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
      });

      const fallbackText =
        completion.choices[0]?.message?.content || "";

      if (
        contentType === "mindmap" ||
        contentType === "flashcards" ||
        contentType === "questions"
      ) {
        // Extract JSON block safely
const jsonMatch = fallbackText.match(/\{[\s\S]*\}|\[[\s\S]*\]/);

if (!jsonMatch) {
  throw new Error("No valid JSON found in fallback response.");
}

return JSON.parse(jsonMatch[0]);
      }

      return fallbackText;

    } catch (fallbackError) {
      console.error("❌ Groq also failed:", fallbackError.message);
      throw new Error("Both Gemini and fallback model failed.");
    }
  }
}