import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import toast from 'react-hot-toast';
import Navbar from '../components/Navbar.jsx';
import StarryBackground from '../components/StarryBackground.jsx';
import DashboardSidebar from '../components/DashboardSidebar.jsx';
import DashboardHeader from '../components/DashboardHeader.jsx';
import MessageDisplay from '../components/MessageDisplay.jsx';
import ContentTabs from '../components/ContentTabs.jsx';
import PDFUploader from '../components/PDFUploader.jsx';
import SummaryDisplay from '../components/SummaryDisplay.jsx';
import InteractiveQA from '../components/InteractiveQA.jsx';
import PlaceholderSection from '../components/PlaceholderSection.jsx';
import FlashcardGenerator from '../components/FlashcardGenerator.jsx';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  
  // Navigation state
  const [activeSection, setActiveSection] = useState('create');
  const [activeTab, setActiveTab] = useState('file');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  // PDF processing state
  const [pdfState, setPdfState] = useState({
    file: null,
    summary: "",
    loading: false,
    error: "",
    summaryWordLimit: 200
  });

  // Q&A state
  const [qaState, setQaState] = useState({
    suggestedQuestions: [],
    chatHistory: [],
    selectedQuestion: null,
    loadingAnswer: false,
    showQASection: false
  });

  // UI state
  const [showDropdown, setShowDropdown] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  // Auth logic
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      const savedUser = localStorage.getItem('user');
      
      if (!token) {
        navigate('/auth');
        return;
      }

      try {
        if (savedUser) {
          setUser(JSON.parse(savedUser));
        }

        const response = await axios.get('http://localhost:3000/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` }
        });

        setUser(response.data.user);
      } catch (error) {
        console.error('Auth check failed:', error);
        handleLogout();
      }
    };

    checkAuth();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    toast.success('✅ Logged out successfully!');
    navigate('/auth');
  };

  const showMessage = (text, type) => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: '', type: '' }), 3000);
  };

  return (
    <div className="min-h-screen bg-gray-950 dark:bg-gray-50 text-white dark:text-gray-900 relative overflow-visible">
      <StarryBackground />
      <Navbar user={user} onLogout={handleLogout} />

      <div className="pt-16 flex h-screen">
        <DashboardSidebar 
          activeSection={activeSection}
          setActiveSection={setActiveSection}
          sidebarCollapsed={sidebarCollapsed}
          setSidebarCollapsed={setSidebarCollapsed}
          user={user}
        />

        <div className={`flex-1 transition-all duration-300 overflow-visible ${
          sidebarCollapsed ? 'ml-16' : 'ml-64'
        }`}>
          <div className="p-6 h-full overflow-y-auto overflow-x-visible custom-scrollbar">
            
            <DashboardHeader />
            
            <MessageDisplay message={message} />

            {activeSection === 'create' && (
              <div className="space-y-6">
                
                <ContentTabs 
                  activeTab={activeTab}
                  setActiveTab={setActiveTab}
                />

                {activeTab === 'file' && (
                  <>
                    <PDFUploader 
                      pdfState={pdfState}
                      setPdfState={setPdfState}
                      setQaState={setQaState}
                      showMessage={showMessage}
                    />

                    <SummaryDisplay 
                      pdfState={pdfState}
                      showDropdown={showDropdown}
                      setShowDropdown={setShowDropdown}
                      showMessage={showMessage}
                    />

                    <InteractiveQA 
                      pdfState={pdfState}
                      qaState={qaState}
                      setQaState={setQaState}
                    />

                    <FlashcardGenerator 
                      pdfState={pdfState}
                      showMessage={showMessage}
                    />
                  </>
                )}
              </div>
            )}

            <PlaceholderSection activeSection={activeSection} />

          </div>
        </div>
      </div>

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
        
        .dark .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.1);
        }
        
        .dark .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(139, 92, 246, 0.4);
        }
        
        .dark .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(139, 92, 246, 0.6);
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
