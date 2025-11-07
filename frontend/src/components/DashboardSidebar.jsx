import { 
  Plus, FolderOpen, Brain, Youtube, MessageSquare, 
  Monitor, PenTool, BookOpen, HelpCircle, Users, 
  ArrowLeft, User 
} from 'lucide-react';

const DashboardSidebar = ({ 
  activeSection, 
  setActiveSection, 
  sidebarCollapsed, 
  setSidebarCollapsed, 
  user 
}) => {
  
  const sidebarItems = [
    { id: 'create', icon: Plus, label: 'Create', active: true },
    { id: 'notes', icon: FolderOpen, label: 'My Notes' },
    { id: 'flashcards', icon: Brain, label: 'Flashcards' },
    { id: 'youtube', icon: Youtube, label: 'AI YouTube' },
    { id: 'chat', icon: MessageSquare, label: 'AI Chat' },
    { id: 'presentations', icon: Monitor, label: 'AI Presentations' },
    { id: 'homework', icon: PenTool, label: 'AI Homework' },
    { id: 'library', icon: BookOpen, label: 'AI Book Library' },
    { id: 'tutorial', icon: HelpCircle, label: 'Tutorial' },
    { id: 'feedback', icon: MessageSquare, label: 'Feedback' },
    { id: 'community', icon: Users, label: 'Community' }
  ];

  return (
    <div className={`fixed left-0 top-16 h-full bg-gray-900/90 dark:bg-white/95 backdrop-blur-xl border-r border-white/10 dark:border-gray-200 transition-all duration-300 z-40 ${
      sidebarCollapsed ? 'w-16' : 'w-64'
    }`}>
      <div className="flex flex-col h-full">
        
        {/* Collapse Toggle */}
        <div className="p-4 border-b border-white/10 dark:border-gray-200">
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="w-full flex items-center justify-center p-2 rounded-xl hover:bg-white/10 dark:hover:bg-gray-100 transition-colors duration-300"
          >
            <ArrowLeft className={`w-5 h-5 text-gray-400 dark:text-gray-600 transition-transform duration-300 ${
              sidebarCollapsed ? 'rotate-180' : ''
            }`} />
          </button>
        </div>

        {/* Sidebar Menu */}
        <div className="flex-1 overflow-y-auto py-4">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 mx-2 mb-1 rounded-xl transition-all duration-300 group ${
                activeSection === item.id
                  ? 'bg-blue-600/20 dark:bg-blue-50 text-blue-300 dark:text-blue-700 border border-blue-500/30 dark:border-blue-200'
                  : 'text-gray-400 dark:text-gray-600 hover:text-white dark:hover:text-gray-900 hover:bg-white/10 dark:hover:bg-gray-100'
              }`}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {!sidebarCollapsed && (
                <span className="text-sm font-medium">{item.label}</span>
              )}
            </button>
          ))}
        </div>

        {/* User Profile */}
        <div className="p-4 border-t border-white/10 dark:border-gray-200">
          {!sidebarCollapsed && user && (
            <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 dark:bg-gray-50">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <User className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-white dark:text-gray-900 truncate">
                  {user.name || user.email}
                </div>
                <div className="text-xs text-gray-400 dark:text-gray-500">Free Plan</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardSidebar;
