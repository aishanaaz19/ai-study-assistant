// Dashboard.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { jsPDF } from "jspdf";
import { useEffect } from 'react';
import Navbar from '../components/NavBar.jsx';

import { Document, Packer, Paragraph, TextRun } from "docx";
import { 
  Upload, 
  FileText, 
  Download, 
  Brain, 
  Copy, 
  Settings, 
  ChevronDown,
  ChevronUp,
  Share2,
  Home,
  ArrowLeft,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import YouTubeTranscript from './../components/YoutubeTranscript';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  
  // Your original state variables
  const [file, setFile] = useState(null);
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [summaryWordLimit, setSummaryWordLimit] = useState(200);
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      const savedUser = localStorage.getItem('user');
      
      if (!token) {
        navigate('/auth');
        return;
      }

      try {
        // Try to get user from localStorage first
        if (savedUser) {
          setUser(JSON.parse(savedUser));
        }

        // Verify token with backend
        const response = await axios.get('http://localhost:3000/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` }
        });

        setUser(response.data.user);
      } catch (error) {
        console.error('Auth check failed:', error);
        handleLogout();
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [navigate]);

  const handleLogout = () => {
    // Clear all user data
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    
    alert('✅ Logged out successfully!');
    navigate('/auth');
  };

  // Your original functions
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setSummary("");
    setError("");
  };

  const handleWordLimitChange = (event) => {
    const value = parseInt(event.target.value, 10);
    if (!isNaN(value) && value >= 50 && value <= 1000) {
      setSummaryWordLimit(value);
    } else if (value < 50) {
      setSummaryWordLimit(50);
    } else if (value > 1000) {
      setSummaryWordLimit(1000);
    }
  };

  const showMessage = (text, type) => {
    setMessage({ text, type });
    setTimeout(() => {
      setMessage({ text: '', type: '' });
    }, 3000);
  };

  const handleSubmit = async () => {
  if (!file) {
    setError("Please upload a PDF file.");
    return;
  }

  // Get the JWT token from localStorage
  const token = localStorage.getItem('token');
  
  if (!token) {
    setError("Please login to use this feature.");
    navigate('/auth');
    return;
  }

  const formData = new FormData();
  formData.append("pdfFile", file);
  formData.append("wordLimit", summaryWordLimit.toString());

  try {
    setLoading(true);
    setSummary("");
    setError("");
    showMessage('', '');

    const res = await axios.post("http://localhost:3000/api/pdf-summary", formData, {
      headers: { 
        "Content-Type": "multipart/form-data",
        "Authorization": `Bearer ${token}` // ✅ Add this line
      },
    });

    setSummary(res.data.summary);
    showMessage("✅ Summary generated successfully!", "success");
  } catch (err) {
    const errorMessage = err.response?.data?.error || err.message;
    setError("❌ Failed to summarize. " + errorMessage);
    showMessage("❌ Failed to summarize.", "error");
  } finally {
    setLoading(false);
  }
};

  const handleDownloadPDF = () => {
    if (!summary) {
      showMessage("No summary to download.", "error");
      return;
    }
    const doc = new jsPDF();
    const lines = doc.splitTextToSize(summary, 180);
    doc.text(lines, 10, 10);
    doc.save("summary.pdf");
    showMessage("✅ Summary downloaded as PDF!", "success");
  };

  const handleDownloadTXT = () => {
    if (!summary) {
      showMessage("No summary to download.", "error");
      return;
    }
    const blob = new Blob([summary], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "summary.txt";
    link.click();
    showMessage("✅ Summary downloaded as Text!", "success");
  };

  const handleDownloadDOCX = async () => {
    if (!summary) {
      showMessage("No summary to download.", "error");
      return;
    }
    try {
      const doc = new Document({
        sections: [
          {
            properties: {},
            children: [new Paragraph({ children: [new TextRun(summary)] })],
          },
        ],
      });

      const blob = await Packer.toBlob(doc);
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "summary.docx";
      link.click();
      showMessage("✅ Summary downloaded as DOCX!", "success");
    } catch (err) {
      showMessage("❌ Failed to download DOCX.", "error");
      console.error("DOCX download error:", err);
    }
  };

  const handleCopy = async () => {
    if (!summary) {
      showMessage("No summary to copy.", "error");
      return;
    }
    try {
      await navigator.clipboard.writeText(summary);
      showMessage("✅ Summary copied to clipboard!", "success");
    } catch (err) {
      showMessage("❌ Failed to copy summary.", "error");
      console.error("Copy error:", err);
    }
  };

  const shareOnWhatsApp = () => {
  if (!summary) {
    showMessage("No summary to share.", "error");
    return;
  }
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(summary)}`;
  window.open(whatsappUrl, '_blank');
  showMessage("✅ Opened WhatsApp for sharing!", "success");
};


  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Background elements similar to landing page */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 100 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 2 + 1}px`,
              height: `${Math.random() * 2 + 1}px`,
              opacity: Math.random() * 0.6 + 0.2,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      {/* Navigation Header */}
      {/* <header className="fixed w-full z-50 bg-black/80 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div 
                className="flex items-center space-x-3 cursor-pointer hover:opacity-80 transition-opacity duration-300" 
                onClick={() => navigate('/')}
              >
                <img src="/logo.png" alt="StudyMate" className="h-10 w-10 filter brightness-0 invert"
 />
                <span className="text-xl font-medium tracking-tight hover:text-blue-300 transition-colors duration-300">
                  StudyMate
                </span>
              </div>
            
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors duration-300 group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" />
              Back to Home
            </button>
          </div>
        </div>
      </header> */}

      {/* Navigation Header with User Info */}
      <Navbar user={user} onLogout={handleLogout} />

      {/* Main Content */}
      <main className="pt-24 pb-12 px-6 lg:px-8 relative z-10">
        <div className="max-w-5xl mx-auto">
          
          {/* Page Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-light tracking-tight mb-4">
              AI Document Summarizer
            </h1>
            <p className="text-xl text-gray-400 font-light">
              Transform your PDFs into concise, intelligent summaries
            </p>
          </div>

          {/* Message Display */}
          {message.text && (
            <div className={`mb-8 mx-auto max-w-2xl`}>
              <div className={`flex items-center gap-3 px-6 py-4 rounded-2xl border transition-all duration-300 ${
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
            </div>
          )}

          {/* Main Dashboard Card */}
          <div className="bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10 p-8 md:p-12 group hover:bg-white/[0.07] transition-all duration-500">
            
            {/* Upload Section */}
            <div className="grid md:grid-cols-3 gap-8 mb-8">
              
              {/* File Upload */}
              <div className="md:col-span-2">
                <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
                  <Upload className="w-5 h-5 text-blue-400" />
                  Upload Document
                </h3>
                
                {!file ? (
                  <div className="border-2 border-dashed border-white/20 rounded-2xl p-8 text-center hover:border-blue-400/50 transition-all duration-300 group/upload">
                    <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4 group-hover/upload:text-blue-400 transition-colors duration-300" />
                    <h4 className="text-lg text-white mb-2">Drop your PDF here</h4>
                    <p className="text-gray-400 mb-6">or click to browse files</p>
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={handleFileChange}
                      className="hidden"
                      id="file-upload"
                    />
                    <label
                      htmlFor="file-upload"
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl cursor-pointer transition-all duration-300 inline-flex items-center gap-2 hover:scale-105"
                    >
                      <Upload className="w-4 h-4" />
                      Choose File
                    </label>
                  </div>
                ) : (
                  <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 bg-blue-600/20 rounded-xl flex items-center justify-center">
                        <FileText className="w-6 h-6 text-blue-400" />
                      </div>
                      <div>
                        <h4 className="text-white font-medium">{file.name}</h4>
                        <p className="text-gray-400 text-sm">
                          {(file.size / (1024 * 1024)).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setFile(null);
                        setSummary("");
                        setError("");
                      }}
                      className="text-gray-400 hover:text-red-400 text-sm transition-colors duration-300"
                    >
                      Remove file
                    </button>
                  </div>
                )}
              </div>

              {/* Word Limit Controls */}
              <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
                  <Settings className="w-5 h-5 text-purple-400" />
                  Settings
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Summary Length
                    </label>
                    <div className="text-center mb-3">
                      <span className="text-2xl font-bold text-white">{summaryWordLimit}</span>
                      <span className="text-gray-400 ml-1">words</span>
                    </div>
                    
                    <input
                      type="range"
                      min="50"
                      max="1000"
                      step="10"
                      value={summaryWordLimit}
                      onChange={handleWordLimitChange}
                      className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                    />
                    
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>50</span>
                      <span>1000</span>
                    </div>
                  </div>
                  
                  <input
                    type="number"
                    min="50"
                    max="1000"
                    step="10"
                    value={summaryWordLimit}
                    onChange={handleWordLimitChange}
                    className="w-full px-3 py-2 bg-black/50 border border-white/20 rounded-xl text-white text-center focus:border-purple-400/50 focus:outline-none transition-colors duration-300"
                  />
                </div>
              </div>
            </div>

            {/* Generate Summary Button */}
            <div className="mb-8">
              <button
                onClick={handleSubmit}
                disabled={loading || !file}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-700 disabled:to-gray-600 text-white py-4 px-6 rounded-2xl font-medium transition-all duration-300 flex items-center justify-center gap-3 group hover:scale-[1.02] disabled:hover:scale-100"
              >
                {loading ? (
                  <>
                    <div className="animate-spin w-5 h-5 border-2 border-white/30 border-t-white rounded-full"></div>
                    Generating Summary...
                  </>
                ) : (
                  <>
                    <Brain className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                    Generate AI Summary
                  </>
                )}
              </button>
            </div>

            {/* Error Display */}
            {error && (
              <div className="mb-8 bg-red-500/10 border border-red-500/30 text-red-300 px-6 py-4 rounded-2xl flex items-center gap-3">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                {error}
              </div>
            )}

            {/* Summary Display */}
            {summary && (
              <div className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden">
                {/* Summary Header */}
                <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
                  <h3 className="text-lg font-medium text-white flex items-center gap-2">
                    <Brain className="w-5 h-5 text-emerald-400" />
                    AI Summary
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

                    {/* WhatsApp Share Button */}
                    <button
                      onClick={shareOnWhatsApp}
                      className="bg-green-600/20 hover:bg-green-600/30 text-green-300 px-4 py-2 rounded-xl transition-all duration-300 flex items-center gap-2 hover:scale-105"
                    >
                      <Share2 className="w-4 h-4" />
                      Share
                    </button>
                    
                    {/* Download Dropdown */}
                    <div className="relative">
                      <button
                        onClick={() => setShowDropdown(!showDropdown)}
                        className="bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 px-4 py-2 rounded-xl transition-all duration-300 flex items-center gap-2 hover:scale-105"
                      >
                        <Download className="w-4 h-4" />
                        Export
                        {showDropdown ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </button>
                      
                      {showDropdown && (
                        <div className="absolute right-0 top-full mt-2 bg-black/90 backdrop-blur-xl border border-white/20 rounded-xl shadow-2xl z-20 min-w-[150px]">
                          <button
                            onClick={() => {
                              setShowDropdown(false);
                              handleDownloadPDF();
                            }}
                            className="w-full px-4 py-3 text-left text-gray-300 hover:text-white hover:bg-white/10 transition-colors duration-300 flex items-center gap-2"
                          >
                            📄 PDF
                          </button>
                          <button
                            onClick={() => {
                              setShowDropdown(false);
                              handleDownloadTXT();
                            }}
                            className="w-full px-4 py-3 text-left text-gray-300 hover:text-white hover:bg-white/10 transition-colors duration-300 flex items-center gap-2"
                          >
                            📃 Text
                          </button>
                          <button
                            onClick={() => {
                              setShowDropdown(false);
                              handleDownloadDOCX();
                            }}
                            className="w-full px-4 py-3 text-left text-gray-300 hover:text-white hover:bg-white/10 transition-colors duration-300 flex items-center gap-2 rounded-b-xl"
                          >
                            📝 DOCX
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Summary Content */}
                <div className="p-6">
                  <div className="max-h-96 overflow-y-auto custom-scrollbar">
                    <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                      {summary}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Custom Styles */}
      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: linear-gradient(45deg, #8b5cf6, #3b82f6);
          cursor: pointer;
          box-shadow: 0 4px 8px rgba(139, 92, 246, 0.3);
        }
        
        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: linear-gradient(45deg, #8b5cf6, #3b82f6);
          cursor: pointer;
          border: none;
          box-shadow: 0 4px 8px rgba(139, 92, 246, 0.3);
        }
        
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 3px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(139, 92, 246, 0.6);
          border-radius: 3px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(139, 92, 246, 0.8);
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
