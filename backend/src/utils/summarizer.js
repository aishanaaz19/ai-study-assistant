import axios from "axios";

export async function summarizeWithHuggingFace(text) {
  try {
    const HF_API_KEY = process.env.HF_API_KEY;

    const response = await axios.post(
      "https://api-inference.huggingface.co/models/facebook/bart-large-cnn",
      {
        inputs: text,
      },
      {
        headers: {
          Authorization: `Bearer ${HF_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (response.data.error) {
      throw new Error(response.data.error);
    }

    return response.data[0].summary_text;
  } catch (error) {
    console.error("❌ Hugging Face API Error:", error.message);
    throw error;
  }
}

