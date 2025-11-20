// src/components/YouTubeDialog.jsx
import React, { useState } from "react";
import axios from "axios";
import { AlertCircle, FileText, Youtube } from "lucide-react";

const YouTubeDialog = ({ showMessage }) => {
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [transcript, setTranscript] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleUrlChange = (e) => setYoutubeUrl(e.target.value);

  const handleSubmit = async () => {
    if (!youtubeUrl.trim()) {
      setError("Please enter a valid YouTube link.");
      return;
    }
    setError("");
    setTranscript("");
    setSummary("");
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      // Fetch transcript
      const transcriptRes = await axios.post(
        "http://localhost:3000/api/youtube-transcript",
        { url: youtubeUrl },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTranscript(transcriptRes.data.transcript);

      // Fetch summary
      const summaryRes = await axios.post(
        "http://localhost:3000/api/summarize",
        { text: transcriptRes.data.transcript },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSummary(summaryRes.data.summary);

      showMessage("✅ Transcript and summary generated!", "success");
    } catch (err) {
      setError(`Failed to process. ${err.response?.data?.error || err.message}`);
      showMessage("❌ Failed to fetch transcript/summary.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white/5 dark:bg-gray-50 rounded-2xl p-6 border border-white/10 dark:border-gray-200 shadow-lg space-y-4 w-full max-w-xl mx-auto">
      <h4 className="text-xl font-semibold flex gap-2 items-center text-red-500 mb-2">
        <Youtube className="w-7 h-7 text-red-400" />
        Upload YouTube Link
      </h4>
      <input
        type="text"
        placeholder="Paste YouTube link here…"
        value={youtubeUrl}
        onChange={handleUrlChange}
        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 mb-3 text-black dark:text-gray-900"
      />
      <button
        onClick={handleSubmit}
        disabled={loading}
        className="bg-gradient-to-r from-red-500 to-blue-600 hover:from-red-600 hover:to-blue-700 text-white py-2 px-6 rounded-lg font-semibold shadow inline-flex items-center gap-2"
      >
        {loading ? "Processing..." : "Get Transcript & Summary"}
      </button>
      {error && (
        <div className="bg-red-500/10 dark:bg-red-50 border border-red-500/30 dark:border-red-200 text-red-300 dark:text-red-700 px-6 py-4 rounded-2xl flex items-center gap-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          {error}
        </div>
      )}
      {transcript && (
        <div className="mt-4">
          <h5 className="text-lg font-medium mb-2 flex gap-2 items-center">
            <FileText className="w-5 h-5 text-blue-400 mr-1" />Transcript
          </h5>
          <div className="bg-black/10 dark:bg-white/10 rounded-lg p-4 mb-4 text-sm max-h-40 overflow-y-auto">
            {transcript}
          </div>
        </div>
      )}
      {summary && (
        <div className="mt-2">
          <h5 className="text-lg font-medium mb-2 flex gap-2 items-center text-purple-600">
            <FileText className="w-5 h-5 text-purple-400 mr-1" />Summary
          </h5>
          <div className="bg-black/10 dark:bg-white/10 rounded-lg p-4 text-sm">{summary}</div>
        </div>
      )}
    </div>
  );
};

export default YouTubeDialog;
