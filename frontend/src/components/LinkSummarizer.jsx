import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Link2, Zap, Loader2, AlertCircle } from "lucide-react";

const LinkSummarizer = () => {
  const [url, setUrl] = useState("");
  const [summary, setSummary] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSummarize = async () => {
    setError("");
    setSummary("");
    if (!url.trim()) {
      setError("Please paste a valid webpage URL!");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:3000/api/web-summary", {
        url,
        wordLimit: 200,
      });
      setSummary(res.data.summary || "No summary generated. Try another link!");
      toast.success("✅ Summary generated!");
    } catch (err) {
      const errMsg = err.response?.data?.error || err.message;
      setError("❌ Failed to summarize link. " + errMsg);
    }
    setLoading(false);
  };

  const handleClear = () => {
    setUrl("");
    setSummary("");
    setError("");
  };

  return (
    <div className="space-y-6">
      {/* Input Drop Area */}
      {!summary ? (
        <div className="border-2 border-dashed border-white/20 dark:border-gray-300 rounded-2xl p-12 text-center hover:border-blue-400/50 dark:hover:border-blue-400 transition-all duration-300 group">
          <div className="w-16 h-16 bg-blue-600/20 dark:bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-600/30 dark:group-hover:bg-blue-200 transition-colors duration-300">
            <Link2 className="w-8 h-8 text-blue-400 dark:text-blue-600" />
          </div>
          <h4 className="text-xl text-white dark:text-gray-900 mb-2">Paste a link to any webpage</h4>
          <p className="text-gray-400 dark:text-gray-600 mb-6">Paste a blog, Wikipedia, or article link to get a summary</p>
          <input
            type="text"
            value={url}
            onChange={e => setUrl(e.target.value)}
            placeholder="Paste your link here (https://...)"
            className="w-full p-3 mb-8 rounded-lg border-2 border-blue-100 focus:border-blue-400 bg-transparent text-blue-100 dark:text-blue-700 text-sm outline-none transition-all duration-300"
            disabled={loading}
          />
          <button
            onClick={handleSummarize}
            disabled={loading || !url.trim()}
            className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white px-8 py-3 rounded-xl cursor-pointer transition-all duration-300 inline-flex items-center gap-2 hover:scale-105 shadow-lg font-semibold"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Summarizing...
              </>
            ) : (
              <>
                <Zap className="w-4 h-4" />
                Summarize Link
              </>
            )}
          </button>
        </div>
      ) : (
        <div className="bg-white/5 dark:bg-gray-50 rounded-2xl p-6 border border-white/10 dark:border-gray-200 shadow-lg relative">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-blue-600/20 dark:bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <Link2 className="w-6 h-6 text-blue-400 dark:text-blue-600" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-white dark:text-gray-900 font-medium mb-1 break-all">{url}</h4>
              <p className="text-gray-400 dark:text-gray-600 text-sm mb-4">Webpage Summary</p>
              <div className="bg-black/30 dark:bg-white rounded-xl p-4 mb-4 border dark:border-gray-200 whitespace-pre-line text-sm text-blue-100 dark:text-blue-900 max-h-60 overflow-auto custom-scrollbar">
                {summary}
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleClear}
                  className="text-gray-400 dark:text-gray-600 hover:text-red-400 dark:hover:text-red-600 px-4 py-3 transition-colors duration-300"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Error Message */}
      {error && (
        <div className="bg-red-500/10 dark:bg-red-50 border border-red-500/30 dark:border-red-200 text-red-300 dark:text-red-700 px-6 py-4 rounded-2xl flex items-center gap-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          {error}
        </div>
      )}
    </div>
  );
};

export default LinkSummarizer;
