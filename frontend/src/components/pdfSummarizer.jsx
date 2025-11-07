import { useState } from "react";
import axios from "axios";
import { jsPDF } from "jspdf";
import { Document, Packer, Paragraph, TextRun } from "docx";
import { ChevronRightIcon } from '@heroicons/react/24/outline';

export default function PdfSummarizer() {
  const [file, setFile] = useState(null);
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [summaryWordLimit, setSummaryWordLimit] = useState(200);
  const [message, setMessage] = useState({ text: '', type: '' });
  
  // New states for Q&A functionality
  const [suggestedQuestions, setSuggestedQuestions] = useState([]);
  const [chatHistory, setChatHistory] = useState([]);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [loadingAnswer, setLoadingAnswer] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setSummary("");
    setError("");
    // Clear Q&A when new file is selected
    setSuggestedQuestions([]);
    setChatHistory([]);
    setSelectedQuestion(null);
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

  // Generate suggested questions based on summary
  const generateSuggestedQuestions = async (summary) => {
  try {
    // First try to get AI-generated questions from backend
    const response = await axios.post('http://localhost:3000/api/generate-questions', {
      summary,
      count: 5 // Number of questions to generate
    });

    if (response.data.questions) {
      setSuggestedQuestions(response.data.questions);
    } else {
      // Fallback to default questions if API fails
      const defaultQuestions = [
        "What are the main key points discussed in this document?",
        "Can you explain the most important concepts mentioned?",
        "What are the practical applications of this information?",
        "How does this relate to current industry trends?",
        "What are the key takeaways for exam preparation?"
      ];
      setSuggestedQuestions(defaultQuestions);
    }
  } catch (error) {
    console.error('Failed to generate questions:', error);
    // Fallback questions in case of API failure
    const fallbackQuestions = [
      "What are the main key points discussed in this document?",
      "Can you explain the most important concepts mentioned?",
      "What are the practical applications of this information?",
      "How does this relate to current industry trends?",
      "What are the key takeaways for exam preparation?"
    ];
    setSuggestedQuestions(fallbackQuestions);
  }
};

  // Handle question click and generate answer
  const handleQuestionClick = async (question, index) => {
    setSelectedQuestion(index);
    setLoadingAnswer(true);
    
    // Add user question to chat
    const userMessage = {
      type: 'user',
      content: question,
      timestamp: new Date().toLocaleTimeString()
    };
    
    setChatHistory(prev => [...prev, userMessage]);
    
    try {
      // Call your backend API to generate answer based on PDF content and question
      const response = await axios.post("http://localhost:3000/api/generate-answer", {
        summary: summary,
        question: question,
        fileName: file?.name
      });
      
      const aiResponse = {
        type: 'ai',
        content: response.data.answer,
        timestamp: new Date().toLocaleTimeString()
      };
      
      setChatHistory(prev => [...prev, aiResponse]);
    } catch (error) {
      // Fallback to a generic answer if API fails
      const fallbackAnswer = {
        type: 'ai',
        content: `Based on the document summary, regarding "${question}": 

${summary.length > 200 ? summary.substring(0, 200) + '...' : summary}

I'd be happy to elaborate further if you have more specific questions! Please note that this is a basic response - for more detailed answers, make sure your backend API is properly configured.`,
        timestamp: new Date().toLocaleTimeString()
      };
      
      setChatHistory(prev => [...prev, fallbackAnswer]);
      console.error("Error generating answer:", error);
    } finally {
      setLoadingAnswer(false);
    }
  };

  const handleSubmit = async () => {
    if (!file) {
      setError("Please upload a PDF file.");
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
      // Clear previous Q&A
      setSuggestedQuestions([]);
      setChatHistory([]);

      const res = await axios.post("http://localhost:3000/api/pdf-summary", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setSummary(res.data.summary);
      showMessage("✅ Summary generated successfully!", "success");
      
      // Generate suggested questions after successful summarization
      generateSuggestedQuestions(res.data.summary);
      
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.message;
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
    } catch (error) {
      showMessage("❌ Failed to download DOCX.", "error");
      console.error("DOCX download error:", error);
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
    } catch (error) {
      showMessage("❌ Failed to copy summary.", "error");
      console.error("Copy error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white px-4 py-10 flex flex-col items-center">
      <div className="w-full max-w-6xl p-6 rounded-2xl bg-gray-800 shadow-lg">
        <h1 className="text-3xl font-bold mb-6 text-center">📚 AI Study Assistant</h1>

        {/* Custom Message Box */}
        {message.text && (
          <div className={`mb-4 px-4 py-2 rounded text-center
            ${message.type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>
            {message.text}
          </div>
        )}

        <div className="flex flex-col md:flex-row md:items-start md:space-x-4 mb-6">
          {/* PDF Upload and Summarize Button (Left/Top) */}
          <div className="flex-1 flex flex-col space-y-4 mb-4 md:mb-0">
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              className="bg-gray-700 border border-gray-600 p-2 rounded w-full text-sm file:bg-indigo-600 file:text-white file:rounded file:px-4 file:py-1"
            />
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded font-medium transition"
            >
              {loading ? "⏳ Summarizing..." : "Summarize PDF"}
            </button>
            {file && (
              <p className="text-gray-400 text-sm mt-2">Selected: {file.name}</p>
            )}
          </div>

          {/* Summary Word Limit Controls (Right/Bottom) */}
          <div className="md:w-1/3 p-3 bg-gray-700 rounded-lg shadow-inner flex flex-col items-center justify-center">
            <label htmlFor="wordLimit" className="block text-sm font-medium text-white mb-2 text-center">
              Limit: <span className="font-bold">{summaryWordLimit} words</span>
            </label>
            <input
              type="range"
              id="wordLimit"
              min="50"
              max="1000"
              step="10"
              value={summaryWordLimit}
              onChange={handleWordLimitChange}
              className="w-full h-2 bg-indigo-500 rounded-lg appearance-none cursor-pointer
                         [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-indigo-600 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md
                         [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-indigo-600 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:shadow-md"
            />
            <input
              type="number"
              min="50"
              max="1000"
              step="10"
              value={summaryWordLimit}
              onChange={handleWordLimitChange}
              className="w-20 p-1 mt-2 border border-gray-600 rounded-lg text-center bg-gray-900 text-white text-sm
                         focus:ring-1 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
        </div>

        {error && (
          <div className="mt-4 bg-red-700 text-white px-4 py-2 rounded">{error}</div>
        )}

        {summary && (
          <>
            <div className="mt-6 p-4 bg-gray-700 rounded-lg max-h-[60vh] overflow-y-auto">
              <h2 className="text-xl font-semibold mb-2">🧠 Summary</h2>
              <p className="text-sm whitespace-pre-wrap">{summary}</p>
            </div>

            <div className="flex justify-end gap-4 mt-4">
              {/* 📋 Copy Button */}
              <button
                onClick={handleCopy}
                className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white text-sm"
              >
                📋 Copy
              </button>

              {/* 📥 Download Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-white text-sm">
                  📥 Download
                </button>
                {showDropdown && (
                  <div className="absolute right-0 flex flex-col bg-gray-800 text-white rounded shadow-lg mt-2 z-10">
                    <button onClick={() => { setShowDropdown(false); handleDownloadPDF(); }} className="px-4 py-2 hover:bg-gray-700">📄 PDF</button>
                    <button onClick={() => { setShowDropdown(false); handleDownloadTXT(); }} className="px-4 py-2 hover:bg-gray-700">📃 Text</button>
                    <button onClick={() => { setShowDropdown(false); handleDownloadDOCX(); }} className="px-4 py-2 hover:bg-gray-700">📝 DOCX</button>
                  </div>
                )}
              </div>
            </div>

            {/* Interactive Q&A Section */}
            {suggestedQuestions.length > 0 && (
              <div className="mt-8 grid lg:grid-cols-2 gap-6">
                {/* Suggested Questions Panel */}
                <div className="bg-gray-700 rounded-lg p-6">
                  <h3 className="text-xl font-bold mb-4 flex items-center">
                    🤔 Ask Questions About Your Document
                  </h3>
                  
                  <div className="space-y-3">
                    {suggestedQuestions.map((question, index) => (
                      <button
                        key={index}
                        onClick={() => handleQuestionClick(question, index)}
                        className={`w-full text-left p-3 rounded-lg border-2 transition-all duration-300 hover:shadow-md ${
                          selectedQuestion === index
                            ? 'border-indigo-500 bg-indigo-900/30'
                            : 'border-gray-600 hover:border-indigo-400 bg-gray-800'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-white">{question}</span>
                          <ChevronRightIcon className="h-4 w-4 text-gray-400" />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Chat Interface Panel */}
                <div className="bg-gray-700 rounded-lg overflow-hidden">
                  <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4">
                    <h4 className="font-semibold">💬 AI Study Chat</h4>
                    <p className="text-sm opacity-90">Click any question to start learning!</p>
                  </div>
                  
                  <div className="h-80 overflow-y-auto p-4 space-y-4 bg-gray-800">
                    {chatHistory.length === 0 ? (
                      <div className="text-center text-gray-400 mt-16">
                        <div className="text-4xl mb-4">🤖</div>
                        <p>Click on any suggested question to start the conversation!</p>
                      </div>
                    ) : (
                      <>
                        {chatHistory.map((message, index) => (
                          <div
                            key={index}
                            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                          >
                            <div
                              className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
                                message.type === 'user'
                                  ? 'bg-indigo-600 text-white rounded-br-none'
                                  : 'bg-gray-600 text-white rounded-bl-none'
                              }`}
                            >
                              <div className="flex items-start space-x-2">
                                <div>
                                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                                  <p className={`text-xs mt-1 ${
                                    message.type === 'user' ? 'text-indigo-100' : 'text-gray-300'
                                  }`}>
                                    {message.timestamp}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                        
                        {loadingAnswer && (
                          <div className="flex justify-start">
                            <div className="bg-gray-600 text-white rounded-lg rounded-bl-none px-4 py-3 max-w-xs">
                              <div className="flex items-center space-x-2">
                                <div className="flex space-x-1">
                                  <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
                                  <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                                  <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                                </div>
                                <span className="text-xs">AI is thinking...</span>
                              </div>
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
