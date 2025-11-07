import { FolderOpen, Brain } from 'lucide-react';

const PlaceholderSection = ({ activeSection }) => {
  if (activeSection === 'notes') {
    return (
      <div className="bg-gray-900/50 dark:bg-white/80 backdrop-blur-sm rounded-2xl border border-white/10 dark:border-gray-200 p-12 text-center shadow-2xl dark:shadow-lg">
        <FolderOpen className="w-16 h-16 text-blue-400 dark:text-blue-600 mx-auto mb-4" />
        <h3 className="text-2xl font-light text-white dark:text-gray-900 mb-4">My Notes</h3>
        <p className="text-gray-400 dark:text-gray-600 mb-6">All your AI-generated summaries and notes in one place</p>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 shadow-lg">
          Coming Soon
        </button>
      </div>
    );
  }

  if (activeSection === 'flashcards') {
    return (
      <div className="bg-gray-900/50 dark:bg-white/80 backdrop-blur-sm rounded-2xl border border-white/10 dark:border-gray-200 p-12 text-center shadow-2xl dark:shadow-lg">
        <Brain className="w-16 h-16 text-purple-400 dark:text-purple-600 mx-auto mb-4" />
        <h3 className="text-2xl font-light text-white dark:text-gray-900 mb-4">AI Flashcards</h3>
        <p className="text-gray-400 dark:text-gray-600 mb-6">Generate flashcards automatically from your content</p>
        <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 shadow-lg">
          Coming Soon
        </button>
      </div>
    );
  }

  // Add more sections as needed
  return null;
};

export default PlaceholderSection;
