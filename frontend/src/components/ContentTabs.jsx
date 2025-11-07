import { FileText, Youtube, LinkIcon, Type } from 'lucide-react';

const ContentTabs = ({ activeTab, setActiveTab }) => {
  const contentTabs = [
    { id: 'file', icon: FileText, label: 'File' },
    { id: 'youtube', icon: Youtube, label: 'YouTube' },
    { id: 'link', icon: LinkIcon, label: 'Link' },
    { id: 'text', icon: Type, label: 'Long Text' }
  ];

  return (
    <div className="bg-gray-900/50 dark:bg-white/80 backdrop-blur-sm rounded-2xl border border-white/10 dark:border-gray-200 p-6 shadow-2xl dark:shadow-lg">
      <h3 className="text-lg font-medium text-white dark:text-gray-900 mb-4">Choose Content Type</h3>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {contentTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-3 p-4 rounded-xl transition-all duration-300 ${
              activeTab === tab.id
                ? 'bg-blue-600/20 dark:bg-blue-50 text-blue-300 dark:text-blue-700 border border-blue-500/30 dark:border-blue-200'
                : 'bg-white/5 dark:bg-gray-50 text-gray-400 dark:text-gray-600 hover:text-white dark:hover:text-gray-900 hover:bg-white/10 dark:hover:bg-gray-100 border border-white/10 dark:border-gray-200'
            }`}
          >
            <tab.icon className="w-5 h-5" />
            <span className="font-medium">{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ContentTabs;
