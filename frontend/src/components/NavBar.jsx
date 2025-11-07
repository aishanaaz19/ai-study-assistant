// components/NavBar.jsx - Enhanced Version
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, LogOut, Menu, X } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

const Navbar = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed w-full z-50 bg-gray-900 dark:bg-white/95 backdrop-blur-md transition-all duration-300 shadow-xl dark:shadow-lg relative">
      {/* Gradient accent line at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-blue-500 via-purple-500 to-emerald-500 dark:from-blue-400 dark:via-purple-400 dark:to-emerald-400"></div>
      
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div 
            className="flex items-center space-x-3 cursor-pointer hover:opacity-80 transition-all duration-300 group" 
            onClick={() => navigate('/')}
          >
            <img 
              src="/logo-black.png" 
              alt="StudyMate" 
              className="h-10 w-10 filter invert dark:invert-0 transition-all duration-300 group-hover:scale-105"
            />
            <span className="text-xl font-semibold tracking-tight text-white dark:text-gray-900 hover:text-blue-400 dark:hover:text-blue-600 transition-colors duration-300">
              StudyMate
            </span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4">
            <ThemeToggle />
            
            {user ? (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-3 bg-gray-800/70 dark:bg-gray-100/70 backdrop-blur-sm px-4 py-2 rounded-xl border border-gray-600/50 dark:border-gray-300/50 shadow-lg">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-md">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white dark:text-gray-900">
                      {user.name || user.email}
                    </div>
                    <div className="text-xs text-gray-400 dark:text-gray-500">Free Plan</div>
                  </div>
                </div>
                <button
                  onClick={onLogout}
                  className="flex items-center gap-2 text-gray-300 dark:text-gray-700 hover:text-red-400 dark:hover:text-red-600 bg-gray-800/70 dark:bg-gray-100/70 backdrop-blur-sm px-4 py-2 rounded-xl border border-gray-600/50 dark:border-gray-300/50 hover:border-red-500/50 dark:hover:border-red-400/50 transition-all duration-300 shadow-lg hover:shadow-red-500/20"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="text-sm font-medium">Logout</span>
                </button>
              </div>
            ) : (
              <button 
                onClick={() => navigate('/auth')}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-2 rounded-xl text-sm font-semibold transition-all duration-300 shadow-lg hover:shadow-blue-500/25 hover:scale-105"
              >
                Sign In
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-3">
            <ThemeToggle />
            <button 
              className="text-gray-400 dark:text-gray-600 hover:text-white dark:hover:text-gray-900 transition-colors duration-300 p-2 rounded-lg hover:bg-gray-800/70 dark:hover:bg-gray-200/70 backdrop-blur-sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-gray-900/95 dark:bg-white/95 backdrop-blur-md border-b border-gray-700/50 dark:border-gray-200/50 shadow-lg">
          <div className="px-4 py-4 space-y-4">
            {user ? (
              <>
                <div className="flex items-center space-x-3 pb-4 border-b border-gray-700/50 dark:border-gray-200/50 bg-gray-800/70 dark:bg-gray-100/70 backdrop-blur-sm rounded-lg p-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-md">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white dark:text-gray-900">
                      {user.name || user.email}
                    </div>
                    <div className="text-xs text-gray-400 dark:text-gray-500">Free Plan</div>
                  </div>
                </div>
                <button
                  onClick={onLogout}
                  className="w-full flex items-center gap-2 text-gray-300 dark:text-gray-700 hover:text-red-400 dark:hover:text-red-600 bg-gray-800/70 dark:bg-gray-100/70 backdrop-blur-sm px-4 py-3 rounded-lg border border-gray-600/50 dark:border-gray-300/50 hover:border-red-500/50 dark:hover:border-red-400/50 transition-all duration-300 shadow-lg"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="text-sm font-medium">Logout</span>
                </button>
              </>
            ) : (
              <button 
                onClick={() => navigate('/auth')}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-lg text-sm font-semibold transition-all duration-300 shadow-lg"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
