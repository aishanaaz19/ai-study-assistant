import React, { useState } from 'react';
import { Video, Download, Copy, Brain, ListChecks, FileText, AlertCircle, CheckCircle, Loader } from 'lucide-react';

const YouTubeTranscript = () => {
  const [url, setUrl] = useState('');
  const [transcript, setTranscript] = useState('');
  const [summary, setSummary] = useState('');
  const [keyPoints, setKeyPoints] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState({ text: '', type: '' });

  const showMessage = (text, type) => {
    setMessage({ text, type });
    setTimeout(() => {
      setMessage({ text: '', type: '' });
    }, 3000);
  };

  // Fixed regex for extracting video ID
  const extractVideoId = (url) => {
    const regex = /(?:youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const validateYouTubeUrl = (url) => {
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/;
    return youtubeRegex.test(url);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!url.trim()) {
      setError('Please enter a YouTube URL');
      return;
    }

    if (!validateYouTubeUrl(url)) {
      setError('Please enter a valid YouTube URL');
      return;
    }

    const videoId = extractVideoId(url);
    if (!videoId) {
      setError('Could not extract video ID from the URL. Please check the URL format.');
      return;
    }

    setLoading(true);
    setError('');
    setTranscript('');
    setSummary('');
    setKeyPoints('');

    try {
      const response = await fetch('http://localhost:3000/api/youtube-transcript', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ videoId, url, summarize: true }),
      });

      const responseText = await response.text();
      
      let data;
      try {
        data = JSON.parse(responseText);
      } catch {
        throw new Error(`Server returned non-JSON response: ${responseText.substring(0, 200)}`);
      }

      if (!response.ok) {
        throw new Error(data.error || `Server error: ${response.status}`);
      }

      if (!data.transcript || data.transcript.trim().length === 0) {
        throw new Error('No transcript content found for this video');
      }

      setTranscript(data.transcript);
      setSummary(data.summary || '');
      setKeyPoints(data.keyPoints || '');
      showMessage(`✅ Video processed successfully! (${data.transcriptLength || data.transcript.length} characters)`, 'success');
      
    } catch (fetchError) {
      console.error('Transcript fetch error:', fetchError);
      setError(fetchError.message);
      showMessage('❌ Failed to extract transcript', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!transcript) {
      showMessage('No transcript to copy', 'error');
      return;
    }
    
    try {
      await navigator.clipboard.writeText(transcript);
      showMessage('✅ Transcript copied to clipboard!', 'success');
    } catch (copyError) {
      console.error('Copy error:', copyError);
      showMessage('❌ Failed to copy transcript', 'error');
    }
  };

  const handleDownload = () => {
    if (!transcript) {
      showMessage('No transcript to download', 'error');
      return;
    }

    const blob = new Blob([transcript], { type: 'text/plain;charset=utf-8' });
    const downloadUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = `youtube-transcript-${Date.now()}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(downloadUrl);
    showMessage('✅ Transcript downloaded!', 'success');
  };

  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-8 mb-8">
      {/* Header */}
      <div className="text-center mb-8">
        <Video className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h2 className="text-2xl font-light text-white mb-2">
          YouTube Video Processor
        </h2>
        <p className="text-gray-400">
          Extract transcripts and generate AI summaries from YouTube videos
        </p>
      </div>

      {/* Message Display */}
      {message.text && (
        <div className={`mb-6 flex items-center gap-3 px-6 py-4 rounded-2xl border transition-all duration-300 ${
          message.type === 'success' 
            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' 
            : 'bg-red-500/10 border-red-500/30 text-red-300'
        }`}>
          {message.type === 'success' ? (
            <CheckCircle className="w-5 h-5 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
          )}
          <span className="font-medium">{message.text}</span>
        </div>
      )}

      {/* URL Input Form */}
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="flex gap-4">
          <div className="flex-1">
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Paste YouTube video URL here... (e.g., https://youtube.com/watch?v=...)"
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-red-400 focus:bg-white/20 transition-all duration-300"
              disabled={loading}
            />
          </div>
          <button
            type="submit"
            disabled={loading || !url.trim()}
            className="bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 disabled:hover:scale-100 flex items-center gap-2 min-w-[140px]"
          >
            {loading ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <FileText className="w-5 h-5" />
                Extract & Summarize
              </>
            )}
          </button>
        </div>
      </form>

      {/* Error Display */}
      {error && (
        <div className="mb-6 bg-red-500/10 border border-red-500/30 text-red-300 px-6 py-4 rounded-2xl flex items-center gap-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <div>
            <div className="font-medium">Error:</div>
            <div className="text-sm mt-1">{error}</div>
          </div>
        </div>
      )}

      {/* Summary Display */}
      {summary && (
        <div className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden mb-6">
          <div className="px-6 py-4 border-b border-white/10">
            <h3 className="text-lg font-medium text-white flex items-center gap-2">
              <Brain className="w-5 h-5 text-purple-400" />
              AI Summary
            </h3>
          </div>
          <div className="p-6">
            <div className="max-h-48 overflow-y-auto">
              <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                {summary}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Key Points Display */}
      {keyPoints && (
        <div className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden mb-6">
          <div className="px-6 py-4 border-b border-white/10">
            <h3 className="text-lg font-medium text-white flex items-center gap-2">
              <ListChecks className="w-5 h-5 text-emerald-400" />
              Key Points
            </h3>
          </div>
          <div className="p-6">
            <div className="max-h-48 overflow-y-auto">
              <div className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                {keyPoints}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Transcript Display */}
      {transcript && (
        <div className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden">
          {/* Transcript Header */}
          <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
            <h3 className="text-lg font-medium text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-400" />
              Full Transcript ({transcript.length} characters)
            </h3>
            
            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                className="bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 px-4 py-2 rounded-xl transition-all duration-300 flex items-center gap-2 hover:scale-105"
              >
                <Copy className="w-4 h-4" />
                Copy
              </button>
              
              <button
                onClick={handleDownload}
                className="bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 px-4 py-2 rounded-xl transition-all duration-300 flex items-center gap-2 hover:scale-105"
              >
                <Download className="w-4 h-4" />
                Download
              </button>
            </div>
          </div>
          
          {/* Transcript Content */}
          <div className="p-6">
            <div className="max-h-96 overflow-y-auto custom-scrollbar">
              <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                {transcript}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Custom Scrollbar Styles */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 3px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(239, 68, 68, 0.6);
          border-radius: 3px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(239, 68, 68, 0.8);
        }
      `}</style>
    </div>
  );
};

export default YouTubeTranscript;
