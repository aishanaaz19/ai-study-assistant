import { CheckCircle, AlertCircle } from 'lucide-react';

const MessageDisplay = ({ message }) => {
  if (!message || !message.text) return null;

  return (
    <div className={`mb-6 flex items-center gap-3 px-6 py-4 rounded-2xl border transition-all duration-300 ${
      message.type === 'success' 
        ? 'bg-emerald-500/10 dark:bg-emerald-50 border-emerald-500/30 dark:border-emerald-200 text-emerald-300 dark:text-emerald-700' 
        : 'bg-red-500/10 dark:bg-red-50 border-red-500/30 dark:border-red-200 text-red-300 dark:text-red-700'
    }`}>
      {message.type === 'success' ? (
        <CheckCircle className="w-5 h-5 flex-shrink-0" />
      ) : (
        <AlertCircle className="w-5 h-5 flex-shrink-0" />
      )}
      <span className="font-medium">{message.text}</span>
    </div>
  );
};

export default MessageDisplay;
