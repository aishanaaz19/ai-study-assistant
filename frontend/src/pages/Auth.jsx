import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, ArrowLeft, Brain, MessageSquare, Zap } from 'lucide-react';
import axios from 'axios';
import { Toaster, toast } from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { useSearchParams } from 'react-router-dom';

const Auth = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isSignup, setIsSignup] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [googleReady, setGoogleReady] = useState(false);

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

  useEffect(() => {
    let mounted = true;

    const loadGoogleScript = () => {
      if (window.google?.accounts?.id) {
        if (mounted) initializeGoogle();
        return;
      }
      const existingScript = document.querySelector('script[src="https://accounts.google.com/gsi/client"]');
      if (existingScript) {
        existingScript.onload = () => { if (mounted) setTimeout(initializeGoogle, 100); };
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = () => { if (mounted) setTimeout(initializeGoogle, 100); };
      script.onerror = () => { if (mounted) setGoogleReady(false); };
      document.head.appendChild(script);
    };

    const initializeGoogle = () => {
      if (window.google?.accounts?.id && mounted) {
        try {
          window.google.accounts.id.initialize({
            client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID || 'YOUR_CLIENT_ID',
            callback: handleGoogleResponse,
            auto_select: false,
            cancel_on_tap_outside: true,
            use_fedcm_for_prompt: true,
            itp_support: true
          });
          setGoogleReady(true);
        } catch {
          setGoogleReady(false);
        }
      }
    };

    loadGoogleScript();
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    if (searchParams.get('mode') === 'login') {
      setIsSignup(false);
    }
  }, []);

  const handleGoogleResponse = async (response) => {
    if (!response.credential) {
      toast.error('Google Sign-In failed: No credential received');
      return;
    }
    try {
      setLoading(true);
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/google`, {
        token: response.credential
      });
      if (res.data.success) {
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        toast.success('Google login successful! Welcome to StudyMate.');
        navigate('/dashboard');
      } else {
        throw new Error(res.data.message || 'Google login failed');
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message || 'Google login failed';
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const toggleAuth = () => {
    setIsSignup(!isSignup);
    setFormData({ fullName: '', email: '', password: '', confirmPassword: '' });
    setErrors({});
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;

    if (isSignup) {
      if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
      else if (formData.fullName.length < 2) newErrors.fullName = 'Name must be at least 2 characters';
    }

    if (!formData.email) newErrors.email = 'Email is required';
    else if (!emailRegex.test(formData.email)) newErrors.email = 'Please enter a valid email';

    if (!formData.password) newErrors.password = 'Password is required';
    else if (!passwordRegex.test(formData.password)) newErrors.password = 'Password must contain at least one letter, one number, and one special character';

    if (isSignup) {
      if (!formData.confirmPassword) newErrors.confirmPassword = 'Please confirm your password';
      else if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);

    try {
      if (isSignup) {
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/register`, {
          name: formData.fullName,
          email: formData.email,
          password: formData.password
        });
        if (response.data.success) {
          toast.success('Registration successful! Please login to continue.');
          setIsSignup(false);
          setFormData({ fullName: '', email: formData.email, password: '', confirmPassword: '' });
        }
      } else {
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
          email: formData.email,
          password: formData.password
        });
        if (response.data.success) {
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('user', JSON.stringify(response.data.user));
          toast.success('Login successful! Welcome to StudyMate', { duration: 2000 });
          setTimeout(() => navigate('/dashboard'), 1500);
        }
      }
    } catch (error) {
      if (error.response?.data?.errors) {
        const backendErrors = {};
        error.response.data.errors.forEach(err => {
          const field = err.path === 'name' ? 'fullName' : err.path;
          backendErrors[field] = err.msg;
        });
        setErrors(backendErrors);
      } else {
        toast.error(error.response?.data?.message || 'Something went wrong');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = () => {
    if (!googleReady) {
      toast.error('Google Sign-In is loading. Please wait and try again.');
      return;
    }
    if (window.google?.accounts?.id) {
      try {
        window.google.accounts.id.prompt();
      } catch {
        toast.error('Failed to open Google Sign-In. Please try again.');
      }
    } else {
      toast.error('Google Sign-In is not available. Please refresh and try again.');
    }
  };

  const GoogleIcon = () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
  );

  const GoogleButton = () => (
    <button
      type="button"
      onClick={handleGoogleAuth}
      disabled={loading || !googleReady}
      className={`w-full py-3 rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-3 transform hover:scale-105 ${
        googleReady ? 'bg-white text-gray-800 hover:bg-gray-100' : 'bg-gray-400 text-gray-600 cursor-not-allowed'
      } ${loading ? 'opacity-50' : ''}`}
    >
      {!googleReady ? (
        <><div className="animate-spin w-5 h-5 border-2 border-gray-600 border-t-transparent rounded-full"></div>Loading Google...</>
      ) : (
        <><GoogleIcon />Continue with Google</>
      )}
    </button>
  );

  const StarBackground = ({ prefix = '' }) => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {stars.map((star) => (
        <div
          key={`${prefix}${star.id}`}
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
  );

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-black">
      <Toaster position="top-center" />

      {/* Back to Home */}
      <button
        onClick={() => navigate('/')}
        className="absolute top-6 left-6 z-50 text-white hover:text-blue-300 transition-colors duration-300 flex items-center gap-2"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to Home
      </button>

      {/* Sliding container */}
      <div
        className={`absolute inset-0 w-[200%] h-full flex transition-transform duration-700 ease-in-out ${
          isSignup ? 'translate-x-0' : '-translate-x-1/2'
        }`}
      >

        {/* ── SIGNUP PANEL ── */}
        <div className="w-1/2 h-full flex">

          {/* Left: Black form — full width on mobile, half on desktop */}
          <div className="w-full md:w-1/2 h-full bg-black text-white relative flex flex-col justify-center items-center p-8 md:p-12 overflow-y-auto">
            <StarBackground prefix="signup-" />
            <div className="relative z-10 w-full max-w-md py-16 md:py-0">
              <div className="text-center mb-8">
                <img src="/logo.png" alt="StudyMate" className="w-16 h-16 mx-auto mb-4 filter brightness-0 invert" />
                <h1 className="text-3xl font-light tracking-tight mb-2">Create Account</h1>
                <p className="text-gray-400">Start your learning journey with StudyMate</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <input type="text" name="fullName" placeholder="Full Name" value={formData.fullName} onChange={handleInputChange}
                    className={`w-full px-4 py-3 bg-white/10 border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:bg-white/20 transition-all duration-300 ${errors.fullName ? 'border-red-500' : 'border-white/20'}`}
                  />
                  {errors.fullName && <span className="text-red-400 text-sm mt-1 block">{errors.fullName}</span>}
                </div>

                <div>
                  <input type="email" name="email" placeholder="Email Address" value={formData.email} onChange={handleInputChange}
                    className={`w-full px-4 py-3 bg-white/10 border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:bg-white/20 transition-all duration-300 ${errors.email ? 'border-red-500' : 'border-white/20'}`}
                  />
                  {errors.email && <span className="text-red-400 text-sm mt-1 block">{errors.email}</span>}
                </div>

                <div className="relative">
                  <input type={showPassword ? 'text' : 'password'} name="password" placeholder="Password" value={formData.password} onChange={handleInputChange}
                    className={`w-full px-4 py-3 bg-white/10 border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:bg-white/20 transition-all duration-300 ${errors.password ? 'border-red-500' : 'border-white/20'}`}
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white">
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                  {errors.password && <span className="text-red-400 text-sm mt-1 block">{errors.password}</span>}
                </div>

                <div className="relative">
                  <input type={showConfirmPassword ? 'text' : 'password'} name="confirmPassword" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleInputChange}
                    className={`w-full px-4 py-3 bg-white/10 border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:bg-white/20 transition-all duration-300 ${errors.confirmPassword ? 'border-red-500' : 'border-white/20'}`}
                  />
                  <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white">
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                  {errors.confirmPassword && <span className="text-red-400 text-sm mt-1 block">{errors.confirmPassword}</span>}
                </div>

                <button type="submit" disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-700 disabled:to-gray-600 text-white py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 disabled:hover:scale-100"
                >
                  {loading ? 'Creating Account...' : 'Create Account'}
                </button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/20"></div></div>
                  <div className="relative flex justify-center text-sm"><span className="px-2 bg-black text-gray-400">or</span></div>
                </div>

                <GoogleButton />

                {/* Mobile only toggle */}
                <div className="text-center">
                  <p className="text-gray-400">
                    Already have an account?{' '}
                    <button type="button" onClick={toggleAuth} disabled={loading} className="text-blue-400 hover:text-blue-300 font-medium">
                      Login here
                    </button>
                  </p>
                </div>
              </form>
            </div>
          </div>

          {/* Right: White branding — desktop only, with Login button */}
          <div className="hidden md:flex w-1/2 h-full bg-white relative flex-col justify-center items-center p-12">
            <div className="rainbow-bg"></div>
            <button
              onClick={toggleAuth}
              className="absolute top-6 left-6 text-sm text-gray-500 hover:text-black font-medium transition-colors duration-300"
            >
              Login →
            </button>
            <div className="relative z-10 text-center">
              <img src="/logo-black.png" alt="StudyMate" className="w-20 h-20 mx-auto mb-6" />
              <h1 className="text-5xl font-light tracking-tight text-black mb-6">StudyMate</h1>
              <p className="text-gray-600 text-lg max-w-md leading-relaxed mb-8">
                Transform your learning experience with AI-powered summaries, flashcards, and intelligent study assistance.
              </p>
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

        {/* ── LOGIN PANEL ── */}
        <div className="w-1/2 h-full flex">

          {/* Left: White branding — desktop only, with Sign up button */}
          <div className="hidden md:flex w-1/2 h-full bg-white relative flex-col justify-center items-center p-12">
            <div className="absolute inset-0 bg-gradient-to-bl from-purple-50 to-blue-50 pointer-events-none"></div>
            <div className="absolute top-16 left-16 w-14 h-14 bg-indigo-100 rounded-full animate-pulse opacity-25 pointer-events-none" style={{ animationDuration: '4s' }}></div>
            <div className="absolute bottom-16 right-16 w-10 h-10 bg-pink-100 rounded-full animate-bounce opacity-30 pointer-events-none" style={{ animationDuration: '2.5s' }}></div>
            <button
              onClick={toggleAuth}
              className="absolute top-6 right-6 text-sm text-gray-500 hover:text-black font-medium transition-colors duration-300"
            >
              ← Sign up
            </button>
            <div className="relative z-10 text-center">
              <img src="/logo-black.png" alt="StudyMate" className="w-20 h-20 mx-auto mb-6" />
              <h1 className="text-5xl font-light tracking-tight text-black mb-6">StudyMate</h1>
              <p className="text-gray-600 text-lg max-w-md leading-relaxed mb-8">
                Welcome back! Continue your learning journey with AI-powered study tools.
              </p>
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

          {/* Right: Black form — full width on mobile, half on desktop */}
          <div className="w-full md:w-1/2 h-full bg-black text-white relative flex flex-col justify-center items-center p-8 md:p-12 overflow-y-auto">
            <StarBackground prefix="login-" />
            <div className="relative z-10 w-full max-w-md py-16 md:py-0">
              <div className="text-center mb-8">
                <img src="/logo.png" alt="StudyMate" className="w-16 h-16 mx-auto mb-4 filter brightness-0 invert" />
                <h1 className="text-3xl font-light tracking-tight mb-2">Welcome Back</h1>
                <p className="text-gray-400">Sign in to continue your learning</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <input type="email" name="email" placeholder="Email Address" value={formData.email} onChange={handleInputChange}
                    className={`w-full px-4 py-3 bg-white/10 border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:bg-white/20 transition-all duration-300 ${errors.email ? 'border-red-500' : 'border-white/20'}`}
                  />
                  {errors.email && <span className="text-red-400 text-sm mt-1 block">{errors.email}</span>}
                </div>

                <div className="relative">
                  <input type={showPassword ? 'text' : 'password'} name="password" placeholder="Password" value={formData.password} onChange={handleInputChange}
                    className={`w-full px-4 py-3 bg-white/10 border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:bg-white/20 transition-all duration-300 ${errors.password ? 'border-red-500' : 'border-white/20'}`}
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white">
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                  {errors.password && <span className="text-red-400 text-sm mt-1 block">{errors.password}</span>}
                  <div className="mt-1 text-right">
                    <Link to="/forgot-password" className="text-blue-400 hover:underline text-sm">Forgot password?</Link>
                  </div>
                </div>

                <button type="submit" disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-700 disabled:to-gray-600 text-white py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 disabled:hover:scale-100"
                >
                  {loading ? 'Signing In...' : 'Sign In'}
                </button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/20"></div></div>
                  <div className="relative flex justify-center text-sm"><span className="px-2 bg-black text-gray-400">or</span></div>
                </div>

                <GoogleButton />

                {/* Mobile only toggle */}
                <div className="text-center">
                  <p className="text-gray-400">
                    Don&apos;t have an account?{' '}
                    <button type="button" onClick={toggleAuth} disabled={loading} className="text-blue-400 hover:text-blue-300 font-medium">
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