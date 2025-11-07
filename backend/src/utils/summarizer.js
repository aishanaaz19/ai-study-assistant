import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables from .env file

const API_KEY = process.env.GEMINI_API_KEY;
if (!API_KEY) {
  console.error('GEMINI_API_KEY is not set in environment variables!');
}

const genAI = new GoogleGenerativeAI(API_KEY);

/**
 * Generates content (summary, mind map, flashcards, questions) using the Gemini API.
 * @param {string} text The input text to process.
 * @param {string} contentType The type of content to generate ('summary', 'mindmap', 'flashcards', 'questions').
 * @param {number} [wordLimit] Optional: The desired word limit for summaries.
 * @returns {Promise<string|object|Array>} The generated content.
 */
export async function generateAIContent(text, contentType, wordLimit = null) { // Added wordLimit parameter
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    let prompt = '';
    let generationConfig = {};

    switch (contentType) {
      case 'summary':
        // Modified prompt to include word limit
        prompt = `Analyze the following PDF content and provide a structured summary with the following format:

          **OVERVIEW:** (3-4 sentences describing what this document is about)

          **KEY HIGHLIGHTS:**
          • [Most important point 1]
          • [Most important point 2] 
          • [Most important point 3]
          • [Most important point 4]

          **KEY INSIGHTS:**
          • [Critical insight or conclusion 1]
          • [Critical insight or conclusion 2]
          • [Critical insight or conclusion 3]

          **MAIN TAKEAWAYS:**
          • [Actionable takeaway 1]
          • [Actionable takeaway 2]
          • [Actionable takeaway 3]

          Content to analyze: ${text}

          Word limit: approximately ${wordLimit} words total.
          `;
        break;

      case 'mindmap':
        prompt = `Generate a JSON object representing a mind map from the following text. The mind map should capture key concepts, relationships, and important details. The JSON should have a 'nodes' array (each node with 'id', 'label', 'type' e.g., 'main', 'sub', 'detail') and an 'edges' array (each edge with 'from', 'to', 'label'). Ensure the JSON is valid and can be directly parsed.

        Example JSON Structure:
        {
          "nodes": [
            {"id": "main_topic_1", "label": "Main Topic 1", "type": "main"},
            {"id": "sub_topic_1_1", "label": "Sub Topic 1.1", "type": "sub"},
            {"id": "detail_1_1_1", "label": "Detail 1.1.1", "type": "detail"}
          ],
          "edges": [
            {"from": "main_topic_1", "to": "sub_topic_1_1", "label": "relates to"}
          ]
        }

        Text for Mind Map:
        """
        ${text}
        """

        Mind Map JSON:`;
        generationConfig = {
          responseMimeType: "application/json",
          responseSchema: {
            type: "OBJECT",
            properties: {
              nodes: {
                type: "ARRAY",
                items: {
                  type: "OBJECT",
                  properties: {
                    id: { type: "STRING" },
                    label: { type: "STRING" },
                    type: { type: "STRING", enum: ["main", "sub", "detail"] }
                  },
                  required: ["id", "label", "type"]
                }
              },
              edges: {
                type: "ARRAY",
                items: {
                  type: "OBJECT",
                  properties: {
                    from: { type: "STRING" },
                    to: { type: "STRING" },
                    label: { type: "STRING" }
                  },
                  required: ["from", "to"]
                }
              }
            },
            required: ["nodes", "edges"]
          }
        };
        break;

      case 'flashcards':
        prompt = `Generate 10 flashcards from the following text. Each flashcard should be an object with a 'term' (question/concept) and a 'definition' (answer/explanation). Focus on key vocabulary, concepts, and facts. Ensure the JSON is valid and can be directly parsed.

        Example JSON Structure:
        [
          {"term": "Term 1", "definition": "Definition 1"},
          {"term": "Term 2", "definition": "Definition 2"}
        ]

        Text for Flashcards:
        """
        ${text}
        """

        Flashcards JSON:`;
        generationConfig = {
          responseMimeType: "application/json",
          responseSchema: {
            type: "ARRAY",
            items: {
              type: "OBJECT",
              properties: {
                term: { type: "STRING" },
                definition: { type: "STRING" }
              },
              required: ["term", "definition"]
            }
          }
        };
        break;

      case 'questions':
        prompt = `Generate a JSON array of interactive multiple-choice questions from the following text. Each question object should have a 'question' string, an 'options' array of strings (at least 3 options), and an 'answer' string (which must be one of the options). Ensure the JSON is valid and can be directly parsed. Create at least 3 distinct questions.

        Example JSON Structure:
        [
          {
            "question": "What is the capital of France?",
            "options": ["Berlin", "Madrid", "Paris", "Rome"],
            "answer": "Paris"
          },
          {
            "question": "Which planet is known as the Red Planet?",
            "options": ["Earth", "Mars", "Jupiter", "Venus"],
            "answer": "Mars"
          }
        ]

        Text for Questions:
        """
        ${text}
        """

        Questions JSON:`;
        generationConfig = {
          responseMimeType: "application/json",
          responseSchema: {
            type: "ARRAY",
            items: {
              type: "OBJECT",
              properties: {
                question: { type: "STRING" },
                options: { type: "ARRAY", items: { type: "STRING" } },
                answer: { type: "STRING" }
              },
              required: ["question", "options", "answer"]
            }
          }
        };
        break;

      case 'answer':
        prompt = text;
        break;


        default:
        throw new Error(`Unsupported content type: ${contentType}`);
    }

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: Object.keys(generationConfig).length > 0 ? generationConfig : undefined
    });

    const response = await result.response;
    const textResponse = response.text();

    if (contentType === 'mindmap' || contentType === 'flashcards' || contentType === 'questions') {
      try {
        return JSON.parse(textResponse);
      } catch (jsonError) {
        console.error(`❌ JSON parsing error for ${contentType}:`, jsonError.message);
        console.error('Raw AI response (first 500 chars):', textResponse.substring(0, 500));
        throw new Error(`Failed to parse JSON for ${contentType}. Check Gemini's raw response for errors. Details: ${jsonError.message}`);
      }
    }

    return textResponse;
  } catch (error) {
    console.error(`❌ Gemini API Error for ${contentType}:`, error.message);
    throw error;
  }
}
