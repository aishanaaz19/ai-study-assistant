import { useState } from "react";
import axios from "axios";

export default function PdfSummarizer() {
  const [file, setFile] = useState(null);
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setSummary("");
    setError("");
  };

  const handleSubmit = async () => {
    if (!file) {
      setError("Please upload a PDF file.");
      return;
    }

    const formData = new FormData();
    formData.append("pdf", file);

    try {
      setLoading(true);
      setSummary("");
      setError("");

      const res = await axios.post("http://localhost:5000/api/pdf-summary", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setSummary(res.data.summary);
    } catch (err) {
      setError("❌ Failed to summarize. " + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white px-4 py-10 flex flex-col items-center">
      <div className="w-full max-w-3xl p-6 rounded-2xl bg-gray-800 shadow-lg">
        <h1 className="text-3xl font-bold mb-6 text-center">📚 AI Study Assistant</h1>

        <input
          type="file"
          accept=".pdf"
          onChange={handleFileChange}
          className="mb-4 bg-gray-700 border border-gray-600 p-2 rounded w-full text-sm file:bg-indigo-600 file:text-white file:rounded file:px-4 file:py-1"
        />

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded font-medium transition"
        >
          {loading ? "⏳ Summarizing..." : "Summarize PDF"}
        </button>

        {error && (
          <div className="mt-4 bg-red-700 text-white px-4 py-2 rounded">
            {error}
          </div>
        )}

        {summary && (
          <div className="mt-6 p-4 bg-gray-700 rounded-lg max-h-[60vh] overflow-y-auto">
            <h2 className="text-xl font-semibold mb-2">🧠 Summary</h2>
            <p className="text-sm whitespace-pre-wrap">{summary}</p>
          </div>
        )}
      </div>
    </div>
  );
}
