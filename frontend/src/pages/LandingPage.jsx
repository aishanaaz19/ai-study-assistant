import React, { useState, useEffect } from 'react';
import { Upload, Brain, MessageSquare, FileText, Volume2, Zap, BookOpen, Target, Clock, CheckCircle, Star, ArrowRight, Menu, X } from 'lucide-react';

const LandingPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const features = [
    {
      icon: <Upload className="w-8 h-8" />,
      title: "Upload Notes",
      description: "Easily upload your study materials in PDF, DOC, or text format. Our AI processes any document instantly.",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: <Brain className="w-8 h-8" />,
      title: "AI Summarization",
      description: "Get intelligent summaries of your content. Save hours of reading with AI-powered key point extraction.",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: <MessageSquare className="w-8 h-8" />,
      title: "Q&A Assistant",
      description: "Ask questions about your notes and get instant answers. Perfect for clarifying complex concepts.",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: <FileText className="w-8 h-8" />,
      title: "Smart Flashcards",
      description: "Generate flashcards and bullet notes automatically. Enhance your memory retention effortlessly.",
      color: "from-orange-500 to-red-500"
    },
    {
      icon: <Volume2 className="w-8 h-8" />,
      title: "Text-to-Speech",
      description: "Listen to your summaries on the go. Perfect for auditory learners and multitasking students.",
      color: "from-indigo-500 to-purple-500"
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Lightning Fast",
      description: "Process documents in seconds, not minutes. Our advanced AI ensures rapid content analysis.",
      color: "from-yellow-500 to-orange-500"
    }
  ];

  const stats = [
    { number: "50k+", label: "Students Helped" },
    { number: "1M+", label: "Documents Processed" },
    { number: "95%", label: "Success Rate" },
    { number: "24/7", label: "AI Availability" }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Medical Student",
      content: "StudyAI transformed my study routine. I can now process textbooks in minutes instead of hours!",
      rating: 5
    },
    {
      name: "Mike Chen",
      role: "Engineering Student",
      content: "The Q&A feature is incredible. It's like having a personal tutor available 24/7.",
      rating: 5
    },
    {
      name: "Emma Davis",
      role: "Law Student",
      content: "Flashcard generation saves me so much time. My retention has improved dramatically.",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-800 via-gray-950 to-gray-600">
      {/* Navigation */}
      <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-gray-900/95 backdrop-blur-md border-b border-gray-800' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="text-2xl animate-pulse">🧠</div>
              <span className="text-2xl font-bold text-white">StudyAI</span>
            </div>
            
            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-300 hover:text-white transition-colors">Features</a>
              <a href="#how-it-works" className="text-gray-300 hover:text-white transition-colors">How it Works</a>
              <a href="#testimonials" className="text-gray-300 hover:text-white transition-colors">Reviews</a>
              <a href="#pricing" className="text-gray-300 hover:text-white transition-colors">Pricing</a>
              <button className="bg-gradient-to-r from-gray-700 to-gray-600 text-white px-6 py-2 rounded-full hover:from-gray-600 hover:to-gray-500 transition-all transform hover:scale-105 shadow-lg">
                Get Started
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden text-white"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-gray-900/95 backdrop-blur-md border-b border-gray-800">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <a href="#features" className="block px-3 py-2 text-gray-300 hover:text-white">Features</a>
              <a href="#how-it-works" className="block px-3 py-2 text-gray-300 hover:text-white">How it Works</a>
              <a href="#testimonials" className="block px-3 py-2 text-gray-300 hover:text-white">Reviews</a>
              <a href="#pricing" className="block px-3 py-2 text-gray-300 hover:text-white">Pricing</a>
              <button className="w-full mt-2 bg-gradient-to-r from-gray-700 to-gray-600 text-white px-4 py-2 rounded-full hover:from-gray-600 hover:to-gray-500">
                Get Started
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="animate-fadeInUp">
            <h1 className="text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-400 mb-6">
              Transform Your Learning
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mt-2 mb-8 max-w-3xl mx-auto">
              Upload your study materials and let AI create summaries, flashcards, and answer your questions instantly. Study smarter, not harder.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <button className="bg-gradient-to-r from-gray-700 to-gray-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:from-gray-600 hover:to-gray-500 transition-all transform hover:scale-105 shadow-2xl">
                Start Learning Free
              </button>
              <button className="bg-gray-800/50 backdrop-blur-md text-gray-300 px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-700/50 transition-all border border-gray-700">
                Watch Demo
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">{stat.number}</div>
                <div className="text-gray-300">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
                      <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Powerful Features for Smart Learning
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Everything you need to accelerate your learning journey with AI-powered tools
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-gray-800/50 backdrop-blur-md rounded-2xl p-8 hover:bg-gray-700/50 transition-all transform hover:scale-105 border border-gray-700">
                <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${feature.color} text-white mb-4`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-800/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              How StudyAI Works
            </h2>
            <p className="text-xl text-gray-400">Simple steps to supercharge your studying</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Upload className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">1. Upload Your Notes</h3>
              <p className="text-gray-400">Drop your PDFs, documents, or text files. Our AI supports all major formats.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">2. AI Processing</h3>
              <p className="text-gray-400">Our advanced AI analyzes your content and extracts key insights instantly.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">3. Study Smarter</h3>
              <p className="text-gray-400">Get summaries, flashcards, and ask questions to master your material.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              What Students Say
            </h2>
            <p className="text-xl text-gray-400">Join thousands of students who've transformed their learning</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-gray-800/50 backdrop-blur-md rounded-2xl p-8 border border-gray-700">
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-400 mb-6 italic">"{testimonial.content}"</p>
                <div>
                  <div className="font-semibold text-white">{testimonial.name}</div>
                  <div className="text-gray-500">{testimonial.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-gray-800/50 to-gray-900/50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Transform Your Learning?
          </h2>
          <p className="text-xl text-gray-400 mb-8">
            Join thousands of students who are already studying smarter with StudyAI
          </p>
          <button className="bg-gradient-to-r from-gray-700 to-gray-600 text-white px-10 py-4 rounded-full text-lg font-semibold hover:from-gray-600 hover:to-gray-500 transition-all transform hover:scale-105 shadow-2xl inline-flex items-center gap-2">
            Get Started Now
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900/80 py-12 px-4 sm:px-6 lg:px-8 border-t border-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="text-2xl">🧠</div>
                <span className="text-2xl font-bold text-white">StudyAI</span>
              </div>
              <p className="text-gray-500">Empowering students with AI-powered learning tools.</p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-500">
                <li><a href="#" className="hover:text-gray-300 transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-gray-300 transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-gray-300 transition-colors">API</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-500">
                <li><a href="#" className="hover:text-gray-300 transition-colors">About</a></li>
                <li><a href="#" className="hover:text-gray-300 transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-gray-300 transition-colors">Careers</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-500">
                <li><a href="#" className="hover:text-gray-300 transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-gray-300 transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-gray-300 transition-colors">Privacy</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-500">
            <p>&copy; 2025 StudyAI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;