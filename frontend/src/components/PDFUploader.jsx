import React from 'react';
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { FileText, Upload, Zap, AlertCircle } from 'lucide-react';


const PDFUploader = ({ pdfState, setPdfState, setQaState, showMessage }) => {
  const navigate = useNavigate();


  const handleFileChange = (e) => {
    const newFile = e.target.files[0];
    setPdfState(prev => ({ ...prev, file: newFile, summary: "", error: "" }));
    setQaState({
      suggestedQuestions: [],
      chatHistory: [],
      selectedQuestion: null,
      loadingAnswer: false,
      showQASection: false
    });
  };


  const handleWordLimitChange = (event) => {
    const value = parseInt(event.target.value, 10);
    let newLimit = value;
    if (!isNaN(value) && value >= 50 && value <= 1000) {
      newLimit = value;
    } else if (value < 50) {
      newLimit = 50;
    } else if (value > 1000) {
      newLimit = 1000;
    }
    
    setPdfState(prev => ({ ...prev, summaryWordLimit: newLimit }));
  };


  const generateSuggestedQuestions = async (summaryText) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.post(
      'http://localhost:3000/api/generate-questions',
      { summary: summaryText },
      {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );


    setQaState(prev => ({ 
      ...prev, 
      suggestedQuestions: response.data.questions || getDefaultQuestions(),
      showQASection: true 
    }));
  } catch (error) {
    console.error('Failed to generate questions:', error);
    setQaState(prev => ({ 
      ...prev, 
      suggestedQuestions: getDefaultQuestions(),
      showQASection: true 
    }));
  }
};


// Helper function to get default questions
const getDefaultQuestions = () => [
  "What are the main key points discussed in this document?",
  "Can you explain the most important concept mentioned?",
  "What are the practical applications of this information?",
  "How does this relate to current industry trends?",
  "What should I focus on for exam preparation?"
];


  const handleSubmit = async () => {
    if (!pdfState.file) {
      setPdfState(prev => ({ ...prev, error: "Please upload a PDF file." }));
      return;
    }


    const token = localStorage.getItem('token');
    
    if (!token) {
      setPdfState(prev => ({ ...prev, error: "Please login to use this feature." }));
      navigate('/auth');
      return;
    }


    const formData = new FormData();
    formData.append("pdfFile", pdfState.file);
    formData.append("wordLimit", pdfState.summaryWordLimit.toString());


    try {
      setPdfState(prev => ({ ...prev, loading: true, summary: "", error: "" }));
      showMessage('', '');
      setQaState({
        suggestedQuestions: [],
        chatHistory: [],
        selectedQuestion: null,
        loadingAnswer: false,
        showQASection: false
      });


      const res = await axios.post("http://localhost:3000/api/pdf-summary", formData, {
        headers: { 
          "Content-Type": "multipart/form-data",
          "Authorization": `Bearer ${token}`
        },
      });


      setPdfState(prev => ({ ...prev, summary: res.data.summary }));
      showMessage("✅ Summary generated successfully!", "success");
      
      setTimeout(() => {
        generateSuggestedQuestions(res.data.summary);
      }, 500);
      
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.message;
      setPdfState(prev => ({ ...prev, error: "❌ Failed to summarize. " + errorMessage }));
      showMessage("❌ Failed to summarize.", "error");
    } finally {
      setPdfState(prev => ({ ...prev, loading: false }));
    }
  };


  const removeFile = () => {
    setPdfState(prev => ({ ...prev, file: null, summary: "", error: "" }));
    setQaState({
      suggestedQuestions: [],
      chatHistory: [],
      selectedQuestion: null,
      loadingAnswer: false,
      showQASection: false
    });
  };


  return (
    <div className="space-y-6">
      {!pdfState.file ? (
        <div className="border-2 border-dashed border-white/20 dark:border-gray-300 rounded-2xl p-12 text-center hover:border-blue-400/50 dark:hover:border-blue-400 transition-all duration-300 group">
          <div className="w-16 h-16 bg-blue-600/20 dark:bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-600/30 dark:group-hover:bg-blue-200 transition-colors duration-300">
            <FileText className="w-8 h-8 text-blue-400 dark:text-blue-600" />
          </div>
          <h4 className="text-xl text-white dark:text-gray-900 mb-2">Upload your PDF document</h4>
          <p className="text-gray-400 dark:text-gray-600 mb-6">Drag and drop or click to browse files</p>
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            className="hidden"
            id="file-upload"
          />
          <label
            htmlFor="file-upload"
            className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white px-8 py-3 rounded-xl cursor-pointer transition-all duration-300 inline-flex items-center gap-2 hover:scale-105 shadow-lg"
          >
            <Upload className="w-5 h-5" />
            Choose File
          </label>
        </div>
      ) : (
        <div className="bg-white/5 dark:bg-gray-50 rounded-2xl p-6 border border-white/10 dark:border-gray-200 shadow-lg">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-blue-600/20 dark:bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <FileText className="w-6 h-6 text-blue-400 dark:text-blue-600" />
            </div>
            <div className="flex-1">
              <h4 className="text-white dark:text-gray-900 font-medium mb-1">{pdfState.file.name}</h4>
              <p className="text-gray-400 dark:text-gray-600 text-sm mb-4">
                {(pdfState.file.size / (1024 * 1024)).toFixed(2)} MB • PDF Document
              </p>
              
              {/* Summary Settings */}
              <div className="bg-black/30 dark:bg-white rounded-xl p-4 mb-4 border dark:border-gray-200">
                <h5 className="text-white dark:text-gray-900 font-medium mb-3">Summary Settings</h5>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm text-gray-300 dark:text-gray-700 mb-2">
                      Length: {pdfState.summaryWordLimit} words
                    </label>
                    <input
                      type="range"
                      min="50"
                      max="1000"
                      step="10"
                      value={pdfState.summaryWordLimit}
                      onChange={handleWordLimitChange}
                      className="w-full h-2 bg-gray-700 dark:bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                    />
                  </div>
                </div>
              </div>


              <div className="flex gap-3">
                <button
                  onClick={handleSubmit}
                  disabled={pdfState.loading}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-700 disabled:to-gray-600 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 hover:scale-105 disabled:hover:scale-100 shadow-lg"
                >
                  {pdfState.loading ? (
                    <>
                      <div className="animate-spin w-4 h-4 border-2 border-white/30 border-t-white rounded-full"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4" />
                      Summarize Now
                    </>
                  )}
                </button>
                
                <button
                  onClick={removeFile}
                  className="text-gray-400 dark:text-gray-600 hover:text-red-400 dark:hover:text-red-600 px-4 py-3 transition-colors duration-300"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        </div>
      )}


      {/* Error Display */}
      {pdfState.error && (
        <div className="bg-red-500/10 dark:bg-red-50 border border-red-500/30 dark:border-red-200 text-red-300 dark:text-red-700 px-6 py-4 rounded-2xl flex items-center gap-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          {pdfState.error}
        </div>
      )}
    </div>
  );
};


export default PDFUploader;