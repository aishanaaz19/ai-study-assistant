// src/components/InteractiveQA.jsx
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { ChevronRight, MessageSquare, HelpCircle, Send } from 'lucide-react';

const InteractiveQA = ({ pdfState, qaState, setQaState }) => {
  const { 
    suggestedQuestions, 
    chatHistory, 
    selectedQuestion, 
    loadingAnswer, 
    showQASection 
  } = qaState;

  // New state for custom user input
  const [customInput, setCustomInput] = useState('');

  const chatContainerRef = useRef(null);
  useEffect(() => {
    if (chatContainerRef.current) {
      setTimeout(() => {
        chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
      }, 100);
    }
  }, [qaState.chatHistory]);

  if (!showQASection || suggestedQuestions.length === 0) {
    return null;
  }

  const handleQuestionSubmit = async (question, index = null) => {
    if (loadingAnswer) return;

    setQaState(prev => ({
      ...prev,
      selectedQuestion: index,
      loadingAnswer: true
    }));
    
    const userMessage = {
      type: 'user',
      content: question,
      timestamp: new Date().toLocaleTimeString()
    };
    
    setQaState(prev => ({
      ...prev,
      chatHistory: [...prev.chatHistory, userMessage]
    }));
    
    try {
      const token = localStorage.getItem('token');
      
      const response = await axios.post("http://localhost:3000/api/generate-answer", {
        summary: pdfState.summary,
        question: question,
        fileName: pdfState.file?.name
      }, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      
      const aiResponse = {
        type: 'ai',
        content: response.data.answer,
        timestamp: new Date().toLocaleTimeString()
      };
      
      setQaState(prev => ({
        ...prev,
        chatHistory: [...prev.chatHistory, aiResponse],
        loadingAnswer: false
      }));
      
    } catch (error) {
      const fallbackAnswer = {
        type: 'ai',
        content: `Based on the document summary: "${question}"\n\n${pdfState.summary.substring(0, 300)}...\n\nThis is a basic response. For more detailed answers, please ensure your backend API is configured.`,
        timestamp: new Date().toLocaleTimeString()
      };
      
      setQaState(prev => ({
        ...prev,
        chatHistory: [...prev.chatHistory, fallbackAnswer],
        loadingAnswer: false
      }));
      
      console.error("Error generating answer:", error);
    }
  };

  const handleSuggestedQuestionClick = (question, index) => {
    handleQuestionSubmit(question, index);
  };

  const handleCustomInputSubmit = () => {
    if (customInput.trim()) {
      handleQuestionSubmit(customInput.trim());
      setCustomInput(''); // Clear input after sending
    }
  };
  
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleCustomInputSubmit();
    }
  };

  return (
    <div className="bg-gray-900/50 dark:bg-white/80 backdrop-blur-sm rounded-2xl border border-white/10 dark:border-gray-200 overflow-hidden shadow-2xl dark:shadow-lg">
      <div className="px-6 py-4 border-b border-white/10 dark:border-gray-200">
        <h3 className="text-lg font-medium text-white dark:text-gray-900 flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-purple-400 dark:text-purple-600" />
          Interactive Q&A
        </h3>
        <p className="text-gray-400 dark:text-gray-600 text-sm mt-1">
          Ask questions about your document and get AI-powered answers
        </p>
      </div>
      
      <div className="p-6">
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Suggested Questions Panel */}
          <div className="space-y-4">
            <h4 className="text-white dark:text-gray-900 font-medium mb-4 flex items-center gap-2">
              <HelpCircle className="w-4 h-4" />
              Suggested Questions
            </h4>
            
            <div className="space-y-3">
              {suggestedQuestions.map((question, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestedQuestionClick(question, index)}
                  disabled={loadingAnswer}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed ${
                    selectedQuestion === index
                      ? 'border-purple-500/50 dark:border-purple-300 bg-purple-500/10 dark:bg-purple-50'
                      : 'border-white/10 dark:border-gray-200 bg-white/5 dark:bg-gray-50 hover:border-purple-500/30 dark:hover:border-purple-300 hover:bg-purple-500/5 dark:hover:bg-purple-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-white dark:text-gray-900 font-medium leading-relaxed">
                      {question}
                    </span>
                    <ChevronRight className="w-4 h-4 text-gray-400 dark:text-gray-600 flex-shrink-0 ml-2" />
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Chat Interface Panel */}
          <div className="bg-black/20 dark:bg-gray-100 rounded-xl overflow-hidden border border-white/10 dark:border-gray-200 flex flex-col">
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4">
              <h4 className="font-semibold flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                StudyMate
              </h4>
              <p className="text-sm opacity-90">Ask anything about your document!</p>
            </div>
            
            {/* Chat Messages Area */}
            <div className="h-80 max-h-80 overflow-y-auto p-4 space-y-4 flex-1 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-purple-500 hover:scrollbar-thumb-purple-600">
              {chatHistory.length === 0 ? (
                <div className="text-center text-gray-400 dark:text-gray-600 mt-12">
                  <div className="w-16 h-16 bg-purple-500/20 dark:bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MessageSquare className="w-8 h-8 text-purple-400 dark:text-purple-600" />
                  </div>
                  <p>Click a question or type your own below!</p>
                </div>
              ) : (
                <>
                  {chatHistory.map((message, index) => (
                    <div
                      key={index}
                      className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-3 rounded-xl ${
                          message.type === 'user'
                            ? 'bg-purple-600 text-white rounded-br-none'
                            : 'bg-white/10 dark:bg-gray-200 text-white dark:text-gray-900 rounded-bl-none'
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap leading-relaxed">
                          {message.content}
                        </p>
                        <p className={`text-xs mt-2 ${
                          message.type === 'user' 
                            ? 'text-purple-100' 
                            : 'text-gray-400 dark:text-gray-600'
                        }`}>
                          {message.timestamp}
                        </p>
                      </div>
                    </div>
                  ))}
                  
                  {loadingAnswer && (
                    <div className="flex justify-start">
                      <div className="bg-white/10 dark:bg-gray-200 text-white dark:text-gray-900 rounded-xl rounded-bl-none px-4 py-3 max-w-xs">
                        <div className="flex items-center space-x-2">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-purple-400 dark:bg-purple-600 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-purple-400 dark:bg-purple-600 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                            <div className="w-2 h-2 bg-purple-400 dark:bg-purple-600 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                          </div>
                          <span className="text-xs">AI is thinking...</span>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* NEW: Custom Input Area */}
            <div className="border-t border-white/10 dark:border-gray-200 p-4">
              <div className="flex items-end gap-3">
                <div className="flex-1">
                  <textarea
                    value={customInput}
                    onChange={(e) => setCustomInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your question here..."
                    disabled={loadingAnswer}
                    rows={1}
                    className="w-full resize-none rounded-xl border border-white/20 dark:border-gray-300 bg-white/5 dark:bg-white text-white dark:text-gray-900 placeholder-gray-400 dark:placeholder-gray-600 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 disabled:opacity-50"
                    style={{ 
                      minHeight: '44px',
                      maxHeight: '120px' 
                    }}
                    onInput={(e) => {
                      e.target.style.height = 'auto';
                      e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
                    }}
                  />
                </div>
                <button
                  onClick={handleCustomInputSubmit}
                  disabled={loadingAnswer || !customInput.trim()}
                  className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:opacity-50 text-white p-3 rounded-xl transition-all duration-300 flex items-center justify-center hover:scale-105 disabled:hover:scale-100 shadow-lg"
                  title="Send message (Enter)"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
              <p className="text-xs text-gray-400 dark:text-gray-600 mt-2 text-center">
                Press Enter to send or Shift+Enter for new line
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InteractiveQA;
