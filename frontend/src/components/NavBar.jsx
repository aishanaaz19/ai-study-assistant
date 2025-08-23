import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, LogOut } from 'lucide-react';

const Navbar = ({ user, onLogout }) => {
  const navigate = useNavigate();

  return (
    <header className="fixed w-full z-50 bg-black/80 backdrop-blur-xl border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left side - Logo */}
          <div 
            className="flex items-center space-x-3 cursor-pointer hover:opacity-80 transition-opacity duration-300" 
            onClick={() => navigate('/')}
          >
            <img 
              src="/logo.png" 
              alt="StudyMate" 
              className="h-10 w-10 filter brightness-0 invert"
            />
            <span className="text-xl font-medium tracking-tight hover:text-blue-300 transition-colors duration-300 text-white">
              StudyMate
            </span>
          </div>
          
          {/* Right side - User info and logout */}
          <div className="flex items-center gap-4">
            {user ? (
              <>
                {/* User welcome message */}
                <div className="flex items-center gap-3">
                  {user.profilePicture ? (
                    <img 
                      src={user.profilePicture} 
                      alt={user.name}
                      className="w-8 h-8 rounded-full border-2 border-blue-400"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                  )}
                  <span className="text-gray-300 font-medium">
                    Welcome, {user.name}
                  </span>
                </div>
                
                {/* Logout button */}
                <button
                  onClick={onLogout}
                  className="flex items-center gap-2 bg-red-600/20 hover:bg-red-600/30 text-red-300 px-4 py-2 rounded-xl transition-all duration-300 hover:scale-105"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </>
            ) : (
              <button
                onClick={() => navigate('/auth')}
                className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors duration-300"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" />
                Login
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
