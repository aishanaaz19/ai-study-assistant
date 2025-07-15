import React from 'react';
import './index.css'; 
import LandingPage from './pages/LandingPage.jsx';
import PdfSummarizer from './components/pdfSummarizer.jsx';

function App() {
  return (
    <div className="App">
      <LandingPage />
      <PdfSummarizer />
    </div>
  );
}

export default App;
