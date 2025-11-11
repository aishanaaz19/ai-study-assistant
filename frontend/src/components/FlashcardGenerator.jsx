// components/FlashcardGenerator.jsx
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, RotateCcw, BookOpen, Zap, Download, FileText, Image, Presentation } from 'lucide-react';
import axios from 'axios';

const FlashcardGenerator = ({ pdfState, showMessage }) => {
  const [flashcards, setFlashcards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [error, setError] = useState('');
  const [showExportMenu, setShowExportMenu] = useState(false);

  const generateFlashcards = async () => {
    if (!pdfState.file) {
      showMessage('❌ Please upload a PDF file first.', 'error');
      return;
    }

    setLoading(true);
    setError('');
    setFlashcards([]);
    setCurrentIndex(0);
    setIsFlipped(false);

    const formData = new FormData();
    formData.append('pdfFile', pdfState.file);

    try {
      const response = await axios.post('http://localhost:3000/api/generate-flashcards', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.data.flashcards && response.data.flashcards.length > 0) {
        setFlashcards(response.data.flashcards);
        showMessage(`✅ Generated ${response.data.totalCards} flashcards successfully!`, 'success');
      } else {
        setError('No flashcards could be generated from this document.');
        showMessage('❌ No flashcards generated.', 'error');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.message;
      setError('Failed to generate flashcards: ' + errorMessage);
      showMessage('❌ Failed to generate flashcards.', 'error');
      console.error('Flashcard generation error:', error);
    } finally {
      setLoading(false);
    }
  };

  const nextCard = () => {
    if (currentIndex < flashcards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
    }
  };

  const prevCard = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsFlipped(false);
    }
  };

  const flipCard = () => {
    setIsFlipped(!isFlipped);
  };

  const resetProgress = () => {
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  // Update your exportFlashcards function
    const exportFlashcards = async (format) => {
  if (!flashcards.length) return;
  
  const formatNames = {
    pdf: 'PDF',
    images: 'Images ZIP',
    ppt: 'PowerPoint'
  };
  
  showMessage(`📥 Generating ${formatNames[format]}...`, 'info');
  
  try {
    // Make sure to get auth token if needed
    const token = localStorage.getItem('token');
    
    const response = await axios({
      method: 'POST',
      url: `http://localhost:3000/api/export-flashcards/${format}`,
      data: {
        flashcards,
        fileName: pdfState.file?.name?.replace('.pdf', '') || 'StudyMate'
      },
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
      },
      responseType: 'blob', // This is crucial!
      timeout: 60000 // 60 second timeout
    });
    
    // Check if response is actually a blob and not an error
    if (response.data.type && response.data.type.includes('text/html')) {
      throw new Error('Server returned HTML instead of file - check server logs');
    }
    
    // Create blob with correct MIME type
    let mimeType;
    let fileExtension;
    let downloadName;
    
    if (format === 'ppt') {
      mimeType = 'application/vnd.openxmlformats-officedocument.presentationml.presentation';
      fileExtension = 'pptx';
    } else if (format === 'images') {
      mimeType = 'application/zip';
      fileExtension = 'zip';
    } else {
      mimeType = 'application/pdf';
      fileExtension = 'pdf';
    }
    
    const blob = new Blob([response.data], { type: mimeType });
    downloadName = `${pdfState.file?.name?.replace('.pdf', '') || 'StudyMate'}_flashcards${format === 'images' ? '_images' : ''}.${fileExtension}`;
    
    // Create download link
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = downloadName;
    
    // Trigger download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Clean up
    window.URL.revokeObjectURL(url);
    
    showMessage(`✅ ${formatNames[format]} downloaded successfully!`, 'success');
    
  } catch (error) {
    console.error('Export error:', error);
    
    if (error.response?.status === 404) {
      showMessage('❌ Export feature not available - check server setup', 'error');
    } else if (error.response?.status === 500) {
      showMessage('❌ Server error during export - check server logs', 'error');
    } else {
      showMessage(`❌ Failed to export ${formatNames[format]}`, 'error');
    }
  }
};



  return (
    <div className="bg-gray-900/50 dark:bg-white/80 backdrop-blur-sm rounded-2xl border border-white/10 dark:border-gray-200 overflow- shadow-2xl dark:shadow-lg">
      {/* Header */}
      <div className="px-6 py-4 border-b border-white/10 dark:border-gray-200">
        <h3 className="text-lg font-medium text-white dark:text-gray-900 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-purple-400 dark:text-purple-600" />
          Flashcard Generator
        </h3>
        <p className="text-gray-400 dark:text-gray-600 text-sm mt-1">
          Generate interactive flashcards from your document for focused studying
        </p>
      </div>

      <div className="p-6 bg-gray-950 dark:bg-white">
        {/* Generate Button Section */}
        {flashcards.length === 0 && (
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-purple-500/20 dark:bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-8 h-8 text-purple-400 dark:text-purple-600" />
            </div>
            
            {pdfState.file ? (
              <div className="space-y-4">
                <p className="text-gray-400 dark:text-gray-600 text-sm mb-4">
                  Ready to generate flashcards from: <span className="text-white dark:text-gray-900 font-medium">{pdfState.file.name}</span>
                </p>
                <button
                  onClick={generateFlashcards}
                  disabled={loading}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-700 text-white px-8 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105 disabled:hover:scale-100 shadow-lg flex items-center gap-2 mx-auto"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Generating Flashcards...</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4" />
                      <span>Generate 10 Flashcards</span>
                    </>
                  )}
                </button>
              </div>
            ) : (
              <p className="text-gray-400 dark:text-gray-600">
                Upload a PDF file to generate flashcards
              </p>
            )}
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="bg-red-500/10 dark:bg-red-50 border border-red-500/20 dark:border-red-300 text-red-200 dark:text-red-800 px-4 py-3 rounded-xl mb-6">
            {error}
          </div>
        )}

        {/* Flashcard Display */}
        {flashcards.length > 0 && (
        <div className="grid lg:grid-cols-3 gap-6">
            
            {/* LEFT SIDE - Flashcard (Takes 2 columns) */}
            <div className="lg:col-span-2 space-y-4">
            
            {/* Progress Bar */}
            <div className="bg-black/20 dark:bg-gray-100 rounded-xl p-4 border border-white/10 dark:border-gray-200">
                <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-white dark:text-gray-900">Study Progress</span>
                <span className="text-sm text-gray-400 dark:text-gray-600">
                    {currentIndex + 1} / {flashcards.length}
                </span>
                </div>
                <div className="w-full bg-white/10 dark:bg-gray-300 rounded-full h-2">
                <div
                    className="bg-gradient-to-r from-purple-600 to-blue-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${((currentIndex + 1) / flashcards.length) * 100}%` }}
                />
                </div>
            </div>

            {/* Flashcard */}
            <div className="flex justify-center">
                <div className="w-full max-w-lg">
                <div
                    className={`relative h-80 cursor-pointer transition-all duration-700 preserve-3d ${
                    isFlipped ? 'rotate-y-180' : ''
                    }`}
                    onClick={flipCard}
                >
                    {/* Front of card */}
                    <div className="absolute inset-0 w-full h-full backface-hidden">
                    <div className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl p-8 h-full flex flex-col justify-center items-center text-center shadow-2xl border border-white/20">
                        <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mb-4">
                        <BookOpen className="w-6 h-6 text-white" />
                        </div>
                        <div className="text-xs text-white/70 uppercase tracking-wider font-medium mb-3">
                        TERM
                        </div>
                        <div className="text-xl font-semibold text-white leading-relaxed text-center">
                        {flashcards[currentIndex]?.term}
                        </div>
                        <div className="text-xs text-white/60 mt-6">
                        Click to reveal definition
                        </div>
                    </div>
                    </div>

                    {/* Back of card */}
                    <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180">
                    <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl p-8 h-full flex flex-col justify-center items-center text-center shadow-2xl border border-white/20">
                        <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mb-4">
                        <Zap className="w-6 h-6 text-white" />
                        </div>
                        <div className="text-xs text-white/70 uppercase tracking-wider font-medium mb-3">
                        DEFINITION
                        </div>
                        <div className="text-base text-white leading-relaxed text-center max-h-48 overflow-y-auto">
                        {flashcards[currentIndex]?.definition}
                        </div>
                        <div className="text-xs text-white/60 mt-6">
                        Click to flip back
                        </div>
                    </div>
                    </div>
                </div>
                </div>
            </div>

            {/* Navigation */}
            <div className="bg-black/20 dark:bg-gray-100 rounded-xl p-4 border border-white/10 dark:border-gray-200">
                <div className="flex justify-between items-center mb-4">
                <button
                    onClick={prevCard}
                    disabled={currentIndex === 0}
                    className="flex items-center space-x-2 bg-white/10 dark:bg-gray-200 hover:bg-white/20 dark:hover:bg-gray-300 disabled:bg-white/5 disabled:text-gray-500 text-white dark:text-gray-900 px-4 py-2 rounded-xl transition-all duration-300"
                >
                    <ChevronLeft className="w-4 h-4" />
                    <span className="text-sm font-medium">Previous</span>
                </button>

                <button
                    onClick={nextCard}
                    disabled={currentIndex === flashcards.length - 1}
                    className="flex items-center space-x-2 bg-white/10 dark:bg-gray-200 hover:bg-white/20 dark:hover:bg-gray-300 disabled:bg-white/5 disabled:text-gray-500 text-white dark:text-gray-900 px-4 py-2 rounded-xl transition-all duration-300"
                >
                    <span className="text-sm font-medium">Next</span>
                    <ChevronRight className="w-4 h-4" />
                </button>
                </div>

                {/* Dot Navigation */}
                <div className="flex justify-center space-x-2">
                {flashcards.map((_, index) => (
                    <button
                    key={index}
                    onClick={() => {
                        setCurrentIndex(index);
                        setIsFlipped(false);
                    }}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                        index === currentIndex 
                        ? 'bg-purple-500 scale-125' 
                        : 'bg-white/30 hover:bg-white/50 dark:bg-gray-400'
                    }`}
                    />
                ))}
                </div>
            </div>
            </div>

            {/* RIGHT SIDE - Controls (Takes 1 column) */}
        <div className="space-y-4">
        
        {/* Stats with Reset Button */}
        <div className="bg-black/20 dark:bg-gray-100 rounded-xl p-4 border border-white/10 dark:border-gray-200">
            <div className="flex items-center justify-between mb-4">
            <h4 className="text-white dark:text-gray-900 font-medium">Study Stats</h4>
            <button
                onClick={resetProgress}
                className="text-purple-400 dark:text-purple-600 hover:text-purple-300 dark:hover:text-purple-700 transition-colors"
                title="Reset to first card"
            >
                <RotateCcw className="w-4 h-4" />
            </button>
            </div>
            
            <div className="space-y-3">
            <div className="flex justify-between">
                <span className="text-gray-400 dark:text-gray-600 text-sm">Total Cards</span>
                <span className="text-white dark:text-gray-900 font-medium">{flashcards.length}</span>
            </div>
            <div className="flex justify-between">
                <span className="text-gray-400 dark:text-gray-600 text-sm">Current</span>
                <span className="text-white dark:text-gray-900 font-medium">{currentIndex + 1}</span>
            </div>
            <div className="flex justify-between">
                <span className="text-gray-400 dark:text-gray-600 text-sm">Progress</span>
                <span className="text-white dark:text-gray-900 font-medium">
                {Math.round(((currentIndex + 1) / flashcards.length) * 100)}%
                </span>
            </div>
            </div>
        </div>

        {/* Actions */}
        <div className="bg-black/20 dark:bg-gray-100 rounded-xl p-4 border border-white/10 dark:border-gray-200">
            <h4 className="text-white dark:text-gray-900 font-medium mb-4">Actions</h4>
            <div className="space-y-3">
            
            {/* Generate New Set */}
            <button
                onClick={generateFlashcards}
                disabled={loading}
                className="w-full bg-white/10 dark:bg-gray-200 hover:bg-white/20 dark:hover:bg-gray-300 text-white dark:text-gray-900 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 flex items-center justify-center gap-2"
            >
                <RotateCcw className="w-4 h-4" />
                Generate New Set
            </button>

            {/* Export Options with Dropdown */}
            <div className="relative">
                <button
                onClick={() => setShowExportMenu(!showExportMenu)}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 flex items-center justify-center gap-2"
                >
                <Download className="w-4 h-4" />
                Export Flashcards
                </button>
                
                {showExportMenu && (
                <>
                    {/* Backdrop to close dropdown */}
                    <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setShowExportMenu(false)}
                    />
                    
                    {/* Dropdown Menu */}
                    <div className="absolute top-full left-0 right-0 mt-2 bg-gray-800 dark:bg-white rounded-xl shadow-2xl border border-white/10 dark:border-gray-200 overflow-hidden z-50">
                    <div className="py-2">
                        <button
                        onClick={() => {
                            exportFlashcards('pdf');
                            setShowExportMenu(false);
                        }}
                        className="w-full px-4 py-3 text-left hover:bg-white/5 dark:hover:bg-gray-100 text-white dark:text-gray-900 text-sm flex items-center gap-3 transition-colors"
                        >
                        <FileText className="w-4 h-4 text-red-400 dark:text-red-600" />
                        <div>
                            <div className="font-medium">Export as PDF</div>
                            <div className="text-xs text-gray-400 dark:text-gray-600">Perfect for printing</div>
                        </div>
                        </button>
                        
                        <button
                        onClick={() => {
                            exportFlashcards('images');
                            setShowExportMenu(false);
                        }}
                        className="w-full px-4 py-3 text-left hover:bg-white/5 dark:hover:bg-gray-100 text-white dark:text-gray-900 text-sm flex items-center gap-3 transition-colors"
                        >
                        <Image className="w-4 h-4 text-blue-400 dark:text-blue-600" />
                        <div>
                            <div className="font-medium">Export as Images</div>
                            <div className="text-xs text-gray-400 dark:text-gray-600">ZIP file with card images</div>
                        </div>
                        </button>
                        
                        <button
                        onClick={() => {
                            exportFlashcards('ppt');
                            setShowExportMenu(false);
                        }}
                        className="w-full px-4 py-3 text-left hover:bg-white/5 dark:hover:bg-gray-100 text-white dark:text-gray-900 text-sm flex items-center gap-3 transition-colors"
                        >
                        <Presentation className="w-4 h-4 text-orange-400 dark:text-orange-600" />
                        <div>
                            <div className="font-medium">Export as PowerPoint</div>
                            <div className="text-xs text-gray-400 dark:text-gray-600">10 slides presentation</div>
                        </div>
                        </button>
                    </div>
                    </div>
                </>
                )}
            </div>
            
            </div>
        </div>
        </div>

        </div>
        )}

      </div>

      {/* Custom CSS for 3D flip effect */}
      <style jsx>{`
        .preserve-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
        
        .scrollbar-thin {
          scrollbar-width: thin;
        }
        
        .scrollbar-thin::-webkit-scrollbar {
          width: 4px;
        }
        
        .scrollbar-track-transparent::-webkit-scrollbar-track {
          background: transparent;
        }
        
        .scrollbar-thumb-white/20::-webkit-scrollbar-thumb {
          background-color: rgba(255, 255, 255, 0.2);
          border-radius: 2px;
        }
      `}</style>
    </div>
  );
};

export default FlashcardGenerator;
