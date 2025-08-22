import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, ArrowLeft, Brain, MessageSquare, Zap } from 'lucide-react';


const Auth = () => {
  const navigate = useNavigate();
  const [isSignup, setIsSignup] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  // Generate stars for background
  const generateStars = () => {
    const stars = [];
    for (let i = 0; i < 150; i++) {
      stars.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 2 + 1,
        opacity: Math.random() * 0.8 + 0.2,
        animationDelay: Math.random() * 3
      });
    }
    return stars;
  };

  const [stars] = useState(generateStars());

  const toggleAuth = () => {
    setIsSignup(!isSignup);
    setFormData({ fullName: '', email: '', password: '', confirmPassword: '' });
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    navigate('/dashboard');
  };

  const handleGoogleAuth = () => {
    console.log('Google auth clicked');
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-black">
      
      {/* Back to Home Button */}
      <button
        onClick={() => navigate('/')}
        className="absolute top-6 left-6 z-50 text-white hover:text-blue-300 transition-colors duration-300 flex items-center gap-2"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to Home
      </button>

      {/* Sliding Container */}
      <div 
        className={`absolute inset-0 w-[200%] h-full flex transition-transform duration-700 ease-in-out ${
          isSignup ? 'translate-x-0' : '-translate-x-1/2'
        }`}
      >
        
        {/* Signup Panel */}
        <div className="w-1/2 h-full flex">
          {/* Form Side (Left) - Black with Stars */}
          <div className="w-full bg-black text-white relative flex flex-col justify-center items-center p-12">
            
            {/* Animated Starry Background */}
            <div className="absolute inset-0 overflow-hidden">
              {stars.map((star) => (
                <div
                  key={star.id}
                  className="absolute rounded-full bg-white animate-pulse"
                  style={{
                    left: `${star.x}%`,
                    top: `${star.y}%`,
                    width: `${star.size}px`,
                    height: `${star.size}px`,
                    opacity: star.opacity,
                    animationDelay: `${star.animationDelay}s`,
                    animationDuration: `${2 + Math.random() * 2}s`
                  }}
                />
              ))}
            </div>

            {/* Signup Form Content */}
            <div className="relative z-10 w-full max-w-md">
              <div className="text-center mb-8">
                <img 
                  src="/logo.png" 
                  alt="StudyMate" 
                  className="w-16 h-16 mx-auto mb-4 filter brightness-0 invert"
                />
                <h1 className="text-3xl font-light tracking-tight mb-2">
                  Create Account
                </h1>
                <p className="text-gray-400">
                  Start your learning journey with StudyMate
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <input
                    type="text"
                    name="fullName"
                    placeholder="Full Name"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:bg-white/20 transition-all duration-300"
                  />
                </div>

                <div>
                  <input
                    type="email"
                    name="email"
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:bg-white/20 transition-all duration-300"
                  />
                </div>

                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:bg-white/20 transition-all duration-300"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-300"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>

                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:bg-white/20 transition-all duration-300"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-300"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105"
                >
                  Create Account
                </button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/20"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-black text-gray-400">or</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleGoogleAuth}
                  className="w-full bg-white/10 border border-white/20 text-white py-3 rounded-xl font-medium transition-all duration-300 hover:bg-white/20 flex items-center justify-center gap-3"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Continue with Google
                </button>

                <div className="text-center">
                  <p className="text-gray-400">
                    Already have an account?{' '}
                    <button
                      type="button"
                      onClick={toggleAuth}
                      className="text-blue-400 hover:text-blue-300 font-medium transition-colors duration-300"
                    >
                      Login here
                    </button>
                  </p>
                </div>
              </form>
            </div>
          </div>

          {/* Branding Side (Right) - White */}
<div className="w-full bg-white relative flex flex-col justify-center items-center p-12">
  
  {/* Rainbow Background Animation */}
  <div className="rainbow-bg"></div>
  
  <div className="relative z-10 text-center">
    {/* BLACK logo for white background */}
    <img 
      src="/logo-black.png" 
      alt="StudyMate" 
      className="w-20 h-20 mx-auto mb-6"
    />
    <h1 className="text-5xl font-light tracking-tight text-black mb-6">
      StudyMate
    </h1>
    <p className="text-gray-600 text-lg max-w-md leading-relaxed mb-8">
      Transform your learning experience with AI-powered summaries, flashcards, and intelligent study assistance.
    </p>
    
    {/* Feature icons */}
    <div className="flex justify-center space-x-12 mt-6">
      <div className="flex flex-col items-center">
        <Brain size={16} className="text-gray-600 mb-1" />
        <span className="text-gray-600 text-xs font-medium">AI Summarization</span>
      </div>
      <div className="flex flex-col items-center">
        <MessageSquare size={16} className="text-gray-600 mb-1" />
        <span className="text-gray-600 text-xs font-medium">Q&A Assistant</span>
      </div>
      <div className="flex flex-col items-center">
        <Zap size={16} className="text-gray-600 mb-1" />
        <span className="text-gray-600 text-xs font-medium">Lightning Fast</span>
      </div>
    </div>
  </div>
</div>





        </div>

        {/* Login Panel */}
        <div className="w-1/2 h-full flex">
          {/* Branding Side (Left) - White */}
<div className="w-full bg-white relative flex flex-col justify-center items-center p-12">
  
  {/* Subtle Background Animations */}
  <div className="absolute inset-0 bg-gradient-to-bl from-purple-50 to-blue-50 animate-pulse pointer-events-none"></div>
  <div className="absolute top-16 left-16 w-14 h-14 bg-indigo-100 rounded-full animate-pulse opacity-25 pointer-events-none" style={{animationDuration: '4s'}}></div>
  <div className="absolute bottom-16 right-16 w-10 h-10 bg-pink-100 rounded-full animate-bounce opacity-30 pointer-events-none" style={{animationDuration: '2.5s'}}></div>
  
  <div className="relative z-10 text-center">
    {/* BLACK logo for white background */}
    <img 
      src="/logo-black.png" 
      alt="StudyMate" 
      className="w-20 h-20 mx-auto mb-6"
    />
    <h1 className="text-5xl font-light tracking-tight text-black mb-6">
      StudyMate
    </h1>
    <p className="text-gray-600 text-lg max-w-md leading-relaxed mb-8">
      Welcome back! Continue your learning journey with AI-powered study tools.
    </p>
    
    {/* Feature icons */}
    <div className="flex justify-center space-x-12 mt-6">
      <div className="flex flex-col items-center">
        <Brain size={16} className="text-gray-600 mb-1" />
        <span className="text-gray-600 text-xs font-medium">AI Summarization</span>
      </div>
      <div className="flex flex-col items-center">
        <MessageSquare size={16} className="text-gray-600 mb-1" />
        <span className="text-gray-600 text-xs font-medium">Q&A Assistant</span>
      </div>
      <div className="flex flex-col items-center">
        <Zap size={16} className="text-gray-600 mb-1" />
        <span className="text-gray-600 text-xs font-medium">Lightning Fast</span>
      </div>
    </div>
  </div>
</div>



          {/* Form Side (Right) - Black with Stars */}
          <div className="w-full bg-black text-white relative flex flex-col justify-center items-center p-12">
            
            {/* Animated Starry Background */}
            <div className="absolute inset-0 overflow-hidden">
              {stars.map((star) => (
                <div
                  key={`login-${star.id}`}
                  className="absolute rounded-full bg-white animate-pulse"
                  style={{
                    left: `${star.x}%`,
                    top: `${star.y}%`,
                    width: `${star.size}px`,
                    height: `${star.size}px`,
                    opacity: star.opacity,
                    animationDelay: `${star.animationDelay}s`,
                    animationDuration: `${2 + Math.random() * 2}s`
                  }}
                />
              ))}
            </div>

            {/* Login Form Content */}
            <div className="relative z-10 w-full max-w-md">
              <div className="text-center mb-8">
                <img 
                  src="/logo.png" 
                  alt="StudyMate" 
                  className="w-16 h-16 mx-auto mb-4 filter brightness-0 invert"
                />
                <h1 className="text-3xl font-light tracking-tight mb-2">
                  Welcome Back
                </h1>
                <p className="text-gray-400">
                  Sign in to continue your learning
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <input
                    type="email"
                    name="email"
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:bg-white/20 transition-all duration-300"
                  />
                </div>

                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:bg-white/20 transition-all duration-300"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-300"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105"
                >
                  Sign In
                </button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/20"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-black text-gray-400">or</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleGoogleAuth}
                  className="w-full bg-white/10 border border-white/20 text-white py-3 rounded-xl font-medium transition-all duration-300 hover:bg-white/20 flex items-center justify-center gap-3"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Continue with Google
                </button>

                <div className="text-center">
                  <p className="text-gray-400">
                    Don&apos;t have an account?{' '}
                    <button
                      type="button"
                      onClick={toggleAuth}
                      className="text-blue-400 hover:text-blue-300 font-medium transition-colors duration-300"
                    >
                      Sign up here
                    </button>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
