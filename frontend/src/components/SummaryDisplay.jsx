import { jsPDF } from "jspdf";
import { Document, Packer, Paragraph, TextRun } from "docx";
import { 
  Brain, Copy, Share2, Download, ChevronDown, ChevronUp,
  FileText, Zap, Target, Lightbulb
} from 'lucide-react';

// Structured Summary Component
const StructuredSummary = ({ content }) => {
  const parseStructuredSummary = (text) => {
    const sections = {
      overview: '',
      highlights: [],
      insights: [],
      takeaways: []
    };

    // Split content by sections
    const overviewMatch = text.match(/\*\*OVERVIEW:\*\*(.*?)(?=\*\*|$)/s);
    const highlightsMatch = text.match(/\*\*KEY HIGHLIGHTS:\*\*(.*?)(?=\*\*|$)/s);
    const insightsMatch = text.match(/\*\*KEY INSIGHTS:\*\*(.*?)(?=\*\*|$)/s);
    const takeawaysMatch = text.match(/\*\*MAIN TAKEAWAYS:\*\*(.*?)(?=\*\*|$)/s);

    if (overviewMatch) {
      sections.overview = overviewMatch[1].trim();
    }

    if (highlightsMatch) {
      sections.highlights = highlightsMatch[1]
        .split('•')
        .filter(item => item.trim())
        .map(item => item.trim());
    }

    if (insightsMatch) {
      sections.insights = insightsMatch[1]
        .split('•')
        .filter(item => item.trim())
        .map(item => item.trim());
    }

    if (takeawaysMatch) {
      sections.takeaways = takeawaysMatch[1]
        .split('•')
        .filter(item => item.trim())
        .map(item => item.trim());
    }

    return sections;
  };

  const sections = parseStructuredSummary(content);

  return (
    <div className="space-y-6">
      {/* Overview Section */}
      {sections.overview && (
        <div className="bg-blue-500/10 dark:bg-blue-50 border border-blue-500/20 dark:border-blue-200 rounded-xl p-4 hover:bg-blue-500/15 dark:hover:bg-blue-100 transition-all duration-300">
          <h4 className="text-blue-300 dark:text-blue-700 font-medium mb-2 flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Overview
          </h4>
          <p className="text-gray-300 dark:text-gray-700 leading-relaxed text-sm">
            {sections.overview}
          </p>
        </div>
      )}

      {/* Key Highlights */}
      {sections.highlights.length > 0 && (
        <div className="bg-yellow-500/10 dark:bg-yellow-50 border border-yellow-500/20 dark:border-yellow-200 rounded-xl p-4 hover:bg-yellow-500/15 dark:hover:bg-yellow-100 transition-all duration-300">
          <h4 className="text-yellow-300 dark:text-yellow-700 font-medium mb-3 flex items-center gap-2">
            <Zap className="w-4 h-4" />
            Key Highlights
            <span className="text-xs bg-yellow-500/20 dark:bg-yellow-200 px-2 py-1 rounded-full dark:text-yellow-800">
              {sections.highlights.length}
            </span>
          </h4>
          <ul className="space-y-2">
            {sections.highlights.map((highlight, index) => (
              <li key={index} className="flex items-start gap-3 text-gray-300 dark:text-gray-700 text-sm hover:text-white dark:hover:text-gray-900 transition-colors duration-200">
                <div className="w-1.5 h-1.5 bg-yellow-400 dark:bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
                <span className="leading-relaxed">{highlight}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Key Insights */}
      {sections.insights.length > 0 && (
        <div className="bg-purple-500/10 dark:bg-purple-50 border border-purple-500/20 dark:border-purple-200 rounded-xl p-4 hover:bg-purple-500/15 dark:hover:bg-purple-100 transition-all duration-300">
          <h4 className="text-purple-300 dark:text-purple-700 font-medium mb-3 flex items-center gap-2">
            <Lightbulb className="w-4 h-4" />
            Key Insights
            <span className="text-xs bg-purple-500/20 dark:bg-purple-200 px-2 py-1 rounded-full dark:text-purple-800">
              {sections.insights.length}
            </span>
          </h4>
          <ul className="space-y-2">
            {sections.insights.map((insight, index) => (
              <li key={index} className="flex items-start gap-3 text-gray-300 dark:text-gray-700 text-sm hover:text-white dark:hover:text-gray-900 transition-colors duration-200">
                <div className="w-1.5 h-1.5 bg-purple-400 dark:bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                <span className="leading-relaxed">{insight}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Main Takeaways */}
      {sections.takeaways.length > 0 && (
        <div className="bg-emerald-500/10 dark:bg-emerald-50 border border-emerald-500/20 dark:border-emerald-200 rounded-xl p-4 hover:bg-emerald-500/15 dark:hover:bg-emerald-100 transition-all duration-300">
          <h4 className="text-emerald-300 dark:text-emerald-700 font-medium mb-3 flex items-center gap-2">
            <Target className="w-4 h-4" />
            Main Takeaways
            <span className="text-xs bg-emerald-500/20 dark:bg-emerald-200 px-2 py-1 rounded-full dark:text-emerald-800">
              {sections.takeaways.length}
            </span>
          </h4>
          <ul className="space-y-2">
            {sections.takeaways.map((takeaway, index) => (
              <li key={index} className="flex items-start gap-3 text-gray-300 dark:text-gray-700 text-sm hover:text-white dark:hover:text-gray-900 transition-colors duration-200">
                <div className="w-1.5 h-1.5 bg-emerald-400 dark:bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                <span className="leading-relaxed">{takeaway}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Fallback for unstructured content */}
      {!sections.overview && sections.highlights.length === 0 && sections.insights.length === 0 && sections.takeaways.length === 0 && (
        <div className="bg-white/5 dark:bg-gray-50 rounded-xl p-4 border border-white/10 dark:border-gray-200">
          <div className="flex items-center gap-2 mb-3">
            <FileText className="w-4 h-4 text-gray-400 dark:text-gray-600" />
            <h4 className="text-gray-400 dark:text-gray-600 font-medium">Summary</h4>
          </div>
          <p className="text-gray-300 dark:text-gray-700 leading-relaxed whitespace-pre-wrap text-sm">
            {content}
          </p>
        </div>
      )}
    </div>
  );
};

const SummaryDisplay = ({ pdfState, showDropdown, setShowDropdown, showMessage }) => {
  if (!pdfState.summary) return null;

  const handleDownloadPDF = () => {
    if (!pdfState.summary) {
      showMessage("No summary to download.", "error");
      return;
    }
    const doc = new jsPDF();
    const lines = doc.splitTextToSize(pdfState.summary, 180);
    doc.text(lines, 10, 10);
    doc.save("summary.pdf");
    showMessage("✅ Summary downloaded as PDF!", "success");
  };

  const handleDownloadTXT = () => {
    if (!pdfState.summary) {
      showMessage("No summary to download.", "error");
      return;
    }
    const blob = new Blob([pdfState.summary], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "summary.txt";
    link.click();
    showMessage("✅ Summary downloaded as Text!", "success");
  };

  const handleDownloadDOCX = async () => {
    if (!pdfState.summary) {
      showMessage("No summary to download.", "error");
      return;
    }
    try {
      const doc = new Document({
        sections: [
          {
            properties: {},
            children: [new Paragraph({ children: [new TextRun(pdfState.summary)] })],
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
    if (!pdfState.summary) {
      showMessage("No summary to copy.", "error");
      return;
    }
    try {
      await navigator.clipboard.writeText(pdfState.summary);
      showMessage("✅ Summary copied to clipboard!", "success");
    } catch (error) {
      showMessage("❌ Failed to copy summary.", "error");
      console.error("Copy error:", error);
    }
  };

  const shareOnWhatsApp = () => {
    if (!pdfState.summary) {
      showMessage("No summary to share.", "error");
      return;
    }
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(pdfState.summary)}`;
    window.open(whatsappUrl, '_blank');
    showMessage("✅ Opened WhatsApp for sharing!", "success");
  };

  return (
    <div className="bg-gray-900/50 dark:bg-white/80 backdrop-blur-sm rounded-2xl border border-white/10 dark:border-gray-200 overflow-hidden shadow-2xl dark:shadow-lg">
      <div className="px-6 py-4 border-b border-white/10 dark:border-gray-200 flex items-center justify-between">
        <h3 className="text-lg font-medium text-white dark:text-gray-900 flex items-center gap-2">
          <Brain className="w-5 h-5 text-emerald-400 dark:text-emerald-600" />
          AI Summary Result
        </h3>
        
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="bg-blue-600/20 dark:bg-blue-100 hover:bg-blue-600/30 dark:hover:bg-blue-200 text-blue-300 dark:text-blue-700 px-4 py-2 rounded-xl transition-all duration-300 flex items-center gap-2 hover:scale-105"
          >
            <Copy className="w-4 h-4" />
            Copy
          </button>

          <button
            onClick={shareOnWhatsApp}
            className="bg-green-600/20 dark:bg-green-100 hover:bg-green-600/30 dark:hover:bg-green-200 text-green-300 dark:text-green-700 px-4 py-2 rounded-xl transition-all duration-300 flex items-center gap-2 hover:scale-105"
          >
            <Share2 className="w-4 h-4" />
            Share
          </button>
          
          {/* Export dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="bg-emerald-600/20 dark:bg-emerald-100 hover:bg-emerald-600/30 dark:hover:bg-emerald-200 text-emerald-300 dark:text-emerald-700 px-4 py-2 rounded-xl transition-all duration-300 flex items-center gap-2 hover:scale-105"
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
              <div className="absolute right-0 top-full mt-2 bg-black/90 dark:bg-white backdrop-blur-xl border border-white/20 dark:border-gray-200 rounded-xl shadow-2xl z-20 min-w-[150px]">
                <button
                  onClick={() => {
                    setShowDropdown(false);
                    handleDownloadPDF();
                  }}
                  className="w-full px-4 py-3 text-left text-gray-300 dark:text-gray-700 hover:text-white dark:hover:text-gray-900 hover:bg-white/10 dark:hover:bg-gray-50 transition-colors duration-300 flex items-center gap-2"
                >
                  📄 PDF
                </button>
                <button
                  onClick={() => {
                    setShowDropdown(false);
                    handleDownloadTXT();
                  }}
                  className="w-full px-4 py-3 text-left text-gray-300 dark:text-gray-700 hover:text-white dark:hover:text-gray-900 hover:bg-white/10 dark:hover:bg-gray-50 transition-colors duration-300 flex items-center gap-2"
                >
                  📃 Text
                </button>
                <button
                  onClick={() => {
                    setShowDropdown(false);
                    handleDownloadDOCX();
                  }}
                  className="w-full px-4 py-3 text-left text-gray-300 dark:text-gray-700 hover:text-white dark:hover:text-gray-900 hover:bg-white/10 dark:hover:bg-gray-50 transition-colors duration-300 flex items-center gap-2 rounded-b-xl"
                >
                  📝 DOCX
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="p-6">
        <div className="max-h-96 overflow-y-auto custom-scrollbar">
          <StructuredSummary content={pdfState.summary} />
        </div>
      </div>
    </div>
  );
};

export default SummaryDisplay;
