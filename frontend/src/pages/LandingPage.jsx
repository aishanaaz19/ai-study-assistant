import React, { useState, useEffect } from 'react';
import ScrollToTop from '../components/ScrollToTop.jsx';
import { useNavigate } from 'react-router-dom';
import { Upload, Brain, MessageSquare, FileText, Volume2, Zap, HelpCircle, Target, User, ChevronDown, ChevronUp, ArrowRight, Menu, X } from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [openFAQ, setOpenFAQ] = useState(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    
    const handleMouseMove = (e) => {
      setMousePosition({ 
        x: (e.clientX / window.innerWidth) * 100, 
        y: (e.clientY / window.innerHeight) * 100 
      });
    };
    
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const features = [
    {
      icon: <Upload className="w-6 h-6" />,
      title: "Upload Notes",
      description: "Easily upload your study materials in PDF, DOC, or text format. Our AI processes any document instantly.",
      gradient: "from-blue-500/10 via-cyan-500/5 to-transparent",
      iconGrad: "from-blue-400 to-cyan-400",
      hoverBorder: "hover:border-blue-400/50",
      glowColor: "group-hover:shadow-blue-500/20"
    },
    {
      icon: <Brain className="w-6 h-6" />,
      title: "AI Summarization", 
      description: "Get intelligent summaries of your content. Save hours of reading with AI-powered key point extraction.",
      gradient: "from-purple-500/10 via-violet-500/5 to-transparent",
      iconGrad: "from-purple-400 to-violet-400",
      hoverBorder: "hover:border-purple-400/50",
      glowColor: "group-hover:shadow-purple-500/20"
    },
    {
      icon: <MessageSquare className="w-6 h-6" />,
      title: "Q&A Assistant",
      description: "Ask questions about your notes and get instant answers. Perfect for clarifying complex concepts.",
      gradient: "from-emerald-500/10 via-teal-500/5 to-transparent",
      iconGrad: "from-emerald-400 to-teal-400",
      hoverBorder: "hover:border-emerald-400/50",
      glowColor: "group-hover:shadow-emerald-500/20"
    },
    {
      icon: <FileText className="w-6 h-6" />,
      title: "Smart Flashcards",
      description: "Generate flashcards and bullet notes automatically. Enhance your memory retention effortlessly.",
      gradient: "from-orange-500/10 via-amber-500/5 to-transparent",
      iconGrad: "from-orange-400 to-amber-400",
      hoverBorder: "hover:border-orange-400/50",
      glowColor: "group-hover:shadow-orange-500/20"
    },
    {
      icon: <Volume2 className="w-6 h-6" />,
      title: "Text-to-Speech",
      description: "Listen to your summaries on the go. Perfect for auditory learners and multitasking students.",
      gradient: "from-cyan-500/10 via-sky-500/5 to-transparent",
      iconGrad: "from-cyan-400 to-sky-400",
      hoverBorder: "hover:border-cyan-400/50",
      glowColor: "group-hover:shadow-cyan-500/20"
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Lightning Fast",
      description: "Process documents in seconds, not minutes. Our advanced AI ensures rapid content analysis.",
      gradient: "from-yellow-500/10 via-orange-500/5 to-transparent",
      iconGrad: "from-yellow-400 to-orange-400",
      hoverBorder: "hover:border-yellow-400/50",
      glowColor: "group-hover:shadow-yellow-500/20"
    },
    {
      icon: <HelpCircle className="w-6 h-6" />,
      title: "Generate MCQs",
      description: "Create multiple choice questions automatically from your study materials for effective practice and assessment.",
      gradient: "from-pink-500/10 via-rose-500/5 to-transparent",
      iconGrad: "from-pink-400 to-rose-400",
      hoverBorder: "hover:border-pink-400/50",
      glowColor: "group-hover:shadow-pink-500/20"
    },
    {
      icon: <Target className="w-6 h-6" />,
      title: "Create Mindmap",
      description: "Visualize complex topics with AI-generated mind maps that help you understand connections and concepts.",
      gradient: "from-indigo-500/10 via-blue-500/5 to-transparent",
      iconGrad: "from-indigo-400 to-blue-400",
      hoverBorder: "hover:border-indigo-400/50",
      glowColor: "group-hover:shadow-indigo-500/20"
    },
    {
      icon: <User className="w-6 h-6" />,
      title: "Interactive User Experience",
      description: "Enjoy a seamless, intuitive interface designed to make your learning journey smooth and engaging.",
      gradient: "from-violet-500/10 via-purple-500/5 to-transparent",
      iconGrad: "from-violet-400 to-purple-400",
      hoverBorder: "hover:border-violet-400/50",
      glowColor: "group-hover:shadow-violet-500/20"
    }
  ];

  const faqs = [
    {
      question: "How can I generate summary?",
      answer: "Simply upload your document in PDF, DOC, or text format using our drag-and-drop interface. Our advanced AI will automatically analyze the content and generate a comprehensive summary highlighting the key points, main concepts, and important details within 10-30 seconds. You can also customize the summary length based on your needs."
    },
    {
      question: "Is this app free to use?",
      answer: "Yes! StudyMate offers a generous free tier that includes document upload (up to 10 files per month), AI summarization, basic Q&A assistance, and flashcard generation. For unlimited access and premium features like advanced mind mapping, MCQ generation, and priority processing, you can upgrade to our Pro plan starting at $9.99/month."
    },
    {
      question: "What file formats are supported?",
      answer: "StudyMate supports a comprehensive range of file formats including PDF, DOC, DOCX, TXT, RTF, and even scanned documents with OCR technology. We can process text-based content from academic papers, textbooks, lecture notes, research documents, and more. Maximum file size is 50MB for free users and 200MB for Pro users."
    },
    {
      question: "How accurate are the AI-generated summaries?",
      answer: "Our AI achieves 95%+ accuracy in content summarization and is continuously improving. It's specifically trained on academic materials, research papers, and educational content to understand context, identify key concepts, and maintain factual accuracy. The AI can distinguish between main ideas and supporting details, ensuring your summaries capture the most important information."
    },
    {
      question: "Can I ask questions about my uploaded documents?",
      answer: "Absolutely! Our intelligent Q&A assistant allows you to ask specific questions about any uploaded document. The AI understands context and can answer questions about definitions, explanations, comparisons, examples, and complex concepts from your materials. You can ask follow-up questions and get detailed explanations tailored to your learning level."
    },
    {
      question: "How long does it take to process documents?",
      answer: "Processing time depends on document size and complexity. Most documents under 20 pages are processed within 10-30 seconds. Larger documents (50+ pages) may take 1-2 minutes. Pro users get priority processing for faster results. Once processed, you can instantly access summaries, ask questions, and generate study materials."
    },
    {
      question: "Can I export my summaries and flashcards?",
      answer: "Yes! You can export your generated summaries as PDF or Word documents, and flashcards can be exported to popular formats like Anki, Quizlet, or as simple text files. Pro users can also export mind maps as images or interactive HTML files for easy sharing and offline study."
    },
    {
      question: "Is my data secure and private?",
      answer: "Absolutely. We take data security seriously. All uploaded documents are encrypted in transit and at rest. We don't store your documents permanently - they're automatically deleted after processing unless you choose to save them in your account. We never share your content with third parties and comply with GDPR and other privacy regulations."
    }
  ];

  const toggleFAQ = (index) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  // Generate random stars for background
  const generateStars = () => {
  const stars = [];
  for (let i = 0; i < 400; i++) {  // INCREASED FROM 200 TO 400
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

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Animated Starry Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
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

      {/* Comet-style background gradient */}
      <div 
        className="fixed inset-0 opacity-40 transition-opacity duration-700"
        style={{
          background: `radial-gradient(800px circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(29, 78, 216, 0.1), transparent 50%)`
        }}
      />
      
      {/* Navigation */}
      <nav className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-black/80 backdrop-blur-xl border-b border-white/10' 
          : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div 
                className="flex items-center space-x-3 cursor-pointer hover:opacity-80 transition-opacity duration-300" 
                onClick={() => navigate('/')}
              >
                <img src="/logo.png" alt="StudyMate" className="h-10 w-10 filter brightness-0 invert"
 />
                <span className="text-xl font-medium tracking-tight hover:text-blue-300 transition-colors duration-300">
                  StudyMate
                </span>
              </div>


            
            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-sm text-gray-400 hover:text-blue-300 transition-colors duration-300 relative group">
                Features
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-blue-400 group-hover:w-full transition-all duration-300"></span>
              </a>
              <a href="#how-it-works" className="text-sm text-gray-400 hover:text-purple-300 transition-colors duration-300 relative group">
                How it works
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-purple-400 group-hover:w-full transition-all duration-300"></span>
              </a>
              <a href="#testimonials" className="text-sm text-gray-400 hover:text-emerald-300 transition-colors duration-300 relative group">
                Reviews
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-emerald-400 group-hover:w-full transition-all duration-300"></span>
              </a>
              <a href="#faqs" className="text-sm text-gray-400 hover:text-red-300 transition-colors duration-300 relative group">
                FAQs
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-red-300 group-hover:w-full transition-all duration-300"></span>
              </a>
              <button 
                onClick={() => navigate('/auth')}
                className="bg-white text-black px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-50 hover:shadow-lg hover:shadow-blue-500/20 hover:rounded-xl transition-all duration-300 group"
              >
                <span className="group-hover:text-blue-700 transition-colors duration-300">Get started</span>
              </button>

            </div>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden text-white hover:text-blue-300 transition-colors duration-300 p-2 hover:bg-white/5 hover:rounded-lg transition-all duration-300"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-black/90 backdrop-blur-xl border-b border-white/10">
            <div className="px-6 py-4 space-y-4">
              <a href="#features" className="block text-sm text-gray-400 hover:text-blue-300 transition-colors duration-300">Features</a>
              <a href="#how-it-works" className="block text-sm text-gray-400 hover:text-purple-300 transition-colors duration-300">How it works</a>
              <a href="#testimonials" className="block text-sm text-gray-400 hover:text-emerald-300 transition-colors duration-300">Reviews</a>
              <a href="#faqs" className="block text-sm text-gray-400 hover:text-red-400 transition-colors duration-300">FAQs</a>
              <button 
                onClick={() => navigate('/auth')}
                className="w-full bg-white text-black px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-50 hover:rounded-xl transition-all duration-300"
              >
                Get started
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-8xl font-light tracking-tight mb-6 leading-[1.1]">
            <em>Transform your</em>
            <br />
            <span className="relative group cursor-default">
              learning
              <div className="absolute -inset-1 bg-blue-500/20 blur-xl rounded-full group-hover:bg-blue-500/30 transition-all duration-500"></div>
            </span>
          </h1>
          
          <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto font-light leading-relaxed">
            Upload your study materials and let AI create summaries, flashcards, and answer your questions instantly.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => navigate('/auth')}
              className="group bg-white text-black px-8 py-3 rounded-xl font-medium hover:bg-blue-50 hover:shadow-lg hover:shadow-blue-500/20 hover:rounded-2xl transition-all duration-300 flex items-center justify-center gap-2"
            >
              <span className="group-hover:text-blue-700 transition-colors duration-300">Start learning free</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:text-blue-600 transition-all duration-300" />
            </button>
            <button onClick={() => navigate('/dashboard')}
             className="border border-white/20 text-white px-8 py-3 rounded-xl font-medium hover:border-purple-500/40 hover:bg-purple-500/5 hover:text-purple-200 hover:rounded-2xl transition-all duration-300">
              Watch demo
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-24">
            {[
              { number: "50k+", label: "Students helped", color: "hover:text-blue-300" },
              { number: "1M+", label: "Documents processed", color: "hover:text-purple-300" },
              { number: "95%", label: "Success rate", color: "hover:text-emerald-300" },
              { number: "24/7", label: "AI availability", color: "hover:text-orange-300" }
            ].map((stat, index) => (
              <div key={index} className="text-center group cursor-default">
                <div className={`text-3xl font-light text-white mb-1 ${stat.color} transition-colors duration-300`}>
                  {stat.number}
                </div>
                <div className="text-sm text-gray-500 group-hover:text-gray-400 transition-colors duration-300">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
<section id="features" className="py-24 px-6 lg:px-8 relative z-10">
  <div className="max-w-7xl mx-auto">
    <div className="text-center mb-16">
      <h2 className="text-6xl font-light tracking-tight mb-4 hover:text-blue-100 transition-colors duration-300 cursor-default">
        <em>Everything</em> you need
      </h2>
      <p className="text-gray-400 text-lg font-light hover:text-gray-300 transition-colors duration-300 cursor-default">
        Powerful AI tools designed for modern learning
      </p>
    </div>

    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {features.map((feature, index) => (
        <div 
          key={index}
          className={`
            group relative overflow-hidden border border-white/10
            bg-black/80 backdrop-blur-sm p-8
            rounded-2xl transition-all duration-500
            shadow-sm hover:shadow-lg
            ${feature.hoverBorder} ${feature.glowColor}
            hover:scale-[1.02]
            hover:rounded-3xl
          `}
          style={{
            borderRadius: "1rem", // base
            transition: "all 0.4s cubic-bezier(.22,.68,.44,1.15)",
            boxShadow: "0 2px 24px 0 rgba(32,56,180,0.07)"
          }}
        >
          {/* Animated gradient background on hover */}
          <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-all duration-500 rounded-[inherit] blur-sm z-0`} />
          <div className="relative z-10">
            <div className="relative mb-6">
              <div className={`absolute inset-0 bg-gradient-to-r ${feature.iconGrad} opacity-10 rounded-xl blur group-hover:opacity-20 transition-opacity duration-500`} />
              <div className={`relative w-12 h-12 bg-gradient-to-r ${feature.iconGrad} rounded-xl group-hover:rounded-2xl flex items-center justify-center text-white group-hover:scale-110 transition-all duration-300`}>
                {feature.icon}
              </div>
            </div>
            
            <h3 className="font-medium text-white mb-4 group-hover:text-white transition-colors duration-300 text-lg">
              {feature.title}
            </h3>
            <p className="text-gray-400 text-sm font-light leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
              {feature.description}
            </p>
            <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-30 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
              <ArrowRight className="w-4 h-4 text-white" />
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
</section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 px-6 lg:px-8 bg-white/[0.02] relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-6xl font-light tracking-tight mb-4 hover:text-purple-100 transition-colors duration-300 cursor-default">
              <em>How</em> it works
            </h2>
            <p className="text-gray-400 text-lg font-light hover:text-gray-300 transition-colors duration-300 cursor-default">
              Three simple steps to transform your studying
            </p>
          </div>

          <div className="space-y-16">
            {[
              {
                step: "01",
                title: "Upload your materials",
                description: "Drop your PDFs, documents, or text files. Our AI supports all major formats and processes them instantly.",
                color: "blue",
                gradient: "from-blue-500/10 to-cyan-500/5"
              },
              {
                step: "02", 
                title: "AI analyzes your content",
                description: "Advanced algorithms extract key concepts, identify important themes, and understand the context of your materials.",
                color: "purple",
                gradient: "from-purple-500/10 to-violet-500/5"
              },
              {
                step: "03",
                title: "Study with AI assistance",
                description: "Get summaries, generate flashcards, ask questions, and listen to content with our comprehensive learning tools.",
                color: "emerald",
                gradient: "from-emerald-500/10 to-teal-500/5"
              }
            ].map((item, index) => (
              <div key={index} className="group relative">
                <div className={`absolute -inset-4 bg-gradient-to-r ${item.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl blur-xl`} />
                
                <div className="relative flex gap-8 items-start cursor-default">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-2xl border border-white/20 flex items-center justify-center text-sm font-light text-gray-400 group-hover:border-blue-400/50 group-hover:text-blue-300 group-hover:bg-blue-500/10 group-hover:rounded-3xl transition-all duration-500 transform group-hover:scale-110">
                      {item.step}
                    </div>
                  </div>
                  <div className="group-hover:translate-x-2 transition-transform duration-300">
                    <h3 className="text-2xl font-light text-white mb-3 group-hover:text-blue-200 transition-colors duration-300">
                      {item.title}
                    </h3>
                    <p className="text-gray-400 font-light leading-relaxed max-w-lg group-hover:text-gray-300 transition-colors duration-300">
                      {item.description}
                    </p>
                  </div>
                  
                  {index < 2 && (
                    <div className="absolute left-6 top-16 w-px h-16 bg-gradient-to-b from-white/20 to-transparent group-hover:from-white/40 transition-colors duration-500" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Pricing Section */}
<section id="pricing" className="py-24 px-6 lg:px-8 relative z-10">
  <div className="max-w-6xl mx-auto">
    <div className="text-center mb-16">
      <h2 className="text-6xl font-light tracking-tight mb-4 hover:text-emerald-100 transition-colors duration-300 cursor-default">
        <em>Choose</em> your plan
      </h2>
      <p className="text-gray-400 text-lg font-light hover:text-gray-300 transition-colors duration-300 cursor-default">
        Start free, upgrade when you're ready to unlock your full potential
      </p>
    </div>

    <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
      {/* Free Plan */}
      <div className="group relative">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-cyan-500/3 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl blur-sm" />
        
        <div className="relative border border-white/10 rounded-2xl p-8 group-hover:border-blue-400/30 group-hover:rounded-3xl transition-all duration-500 transform group-hover:scale-[1.02] group-hover:shadow-2xl backdrop-blur-sm">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-light text-white mb-2 group-hover:text-blue-100 transition-colors duration-300">
              Free
            </h3>
            <p className="text-gray-400 text-sm group-hover:text-gray-300 transition-colors duration-300">
              Perfect to get started
            </p>
            <div className="mt-6">
              <span className="text-4xl font-light text-white group-hover:text-blue-100 transition-colors duration-300">₹0</span>
              <span className="text-gray-500 text-lg group-hover:text-gray-400 transition-colors duration-300">/month</span>
            </div>
          </div>

          <ul className="space-y-4 mb-8">
            {[
              "20 documents per month",
              "Basic AI summarization", 
              "Simple Q&A assistance",
              "5 flashcard sets",
              "Text-to-speech",
              "Export to PDF",
              "Community support"
            ].map((feature, index) => (
              <li key={index} className="flex items-center text-sm text-gray-300 group-hover:text-white transition-colors duration-300">
                <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-3 group-hover:bg-blue-300 transition-colors duration-300"></div>
                {feature}
              </li>
            ))}
          </ul>

          <button 
            onClick={() => navigate('/auth')}
            className="w-full border border-white/20 text-white px-6 py-3 rounded-xl font-medium hover:border-blue-400/50 hover:bg-blue-500/10 hover:text-blue-200 hover:rounded-2xl transition-all duration-300"
          >
            Start Free
          </button>
        </div>
      </div>

      {/* Pro Plan - Most Popular */}
      <div className="group relative">
        {/* Popular Badge */}
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-20">
          <div className="bg-gradient-to-r from-purple-500 to-violet-500 text-white px-4 py-1 rounded-full text-xs font-medium group-hover:from-purple-400 group-hover:to-violet-400 transition-all duration-300">
            Most Popular
          </div>
        </div>

        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-violet-500/5 to-transparent opacity-60 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl blur-sm" />
        
        <div className="relative border border-purple-400/30 rounded-2xl p-8 group-hover:border-purple-400/50 group-hover:rounded-3xl transition-all duration-500 transform group-hover:scale-[1.05] group-hover:shadow-2xl group-hover:shadow-purple-500/20 backdrop-blur-sm">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-light text-white mb-2 group-hover:text-purple-100 transition-colors duration-300">
              Pro
            </h3>
            <p className="text-gray-400 text-sm group-hover:text-gray-300 transition-colors duration-300">
              For serious students
            </p>
            <div className="mt-6">
              <span className="text-4xl font-light text-white group-hover:text-purple-100 transition-colors duration-300">₹59</span>
              <span className="text-gray-500 text-lg group-hover:text-gray-400 transition-colors duration-300">/month</span>
            </div>
            <p className="text-xs text-gray-500 mt-2 group-hover:text-gray-400 transition-colors duration-300">
              Billed annually: ₹699/year (2 months free)
            </p>
          </div>

          <ul className="space-y-4 mb-8">
            {[
              "Unlimited documents",
              "Advanced AI summarization",
              "Unlimited Q&A assistance", 
              "Unlimited flashcards & MCQs",
              "Unlimited text-to-speech",
              "AI-generated mind maps",
              "Priority processing",
              "Export to PDF/Word/Text",
              "Priority email support"
            ].map((feature, index) => (
              <li key={index} className="flex items-center text-sm text-gray-300 group-hover:text-white transition-colors duration-300">
                <div className="w-1.5 h-1.5 bg-purple-400 rounded-full mr-3 group-hover:bg-purple-300 transition-colors duration-300"></div>
                {feature}
              </li>
            ))}
          </ul>

          <button 
            onClick={() => navigate('/auth')}
            className="w-full bg-gradient-to-r from-purple-500 to-violet-500 text-white px-6 py-3 rounded-xl font-medium hover:from-purple-400 hover:to-violet-400 hover:shadow-lg hover:shadow-purple-500/30 hover:rounded-2xl transition-all duration-300"
          >
            Upgrade to Pro
          </button>
        </div>
      </div>

      {/* Enterprise Plan */}
      <div className="group relative">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-teal-500/3 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl blur-sm" />
        
        <div className="relative border border-white/10 rounded-2xl p-8 group-hover:border-emerald-400/30 group-hover:rounded-3xl transition-all duration-500 transform group-hover:scale-[1.02] group-hover:shadow-2xl backdrop-blur-sm">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-light text-white mb-2 group-hover:text-emerald-100 transition-colors duration-300">
              Enterprise
            </h3>
            <p className="text-gray-400 text-sm group-hover:text-gray-300 transition-colors duration-300">
              For institutions & teams
            </p>
            <div className="mt-6">
              <span className="text-4xl font-light text-white group-hover:text-emerald-100 transition-colors duration-300">Custom</span>
            </div>
            <p className="text-xs text-gray-500 mt-2 group-hover:text-gray-400 transition-colors duration-300">
              Contact us for pricing
            </p>
          </div>

          <ul className="space-y-4 mb-8">
            {[
              "Everything in Pro",
              "Custom AI model training",
              "Advanced analytics dashboard", 
              "Team collaboration tools",
              "SSO & advanced security",
              "API access",
              "Custom integrations",
              "Dedicated account manager",
              "24/7 phone support"
            ].map((feature, index) => (
              <li key={index} className="flex items-center text-sm text-gray-300 group-hover:text-white transition-colors duration-300">
                <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full mr-3 group-hover:bg-emerald-300 transition-colors duration-300"></div>
                {feature}
              </li>
            ))}
          </ul>

          <button 
            onClick={() => window.open('mailto:enterprise@studymate.ai', '_blank')}
            className="w-full border border-white/20 text-white px-6 py-3 rounded-xl font-medium hover:border-emerald-400/50 hover:bg-emerald-500/10 hover:text-emerald-200 hover:rounded-2xl transition-all duration-300"
          >
            Contact Sales
          </button>
        </div>
      </div>
    </div>

    {/* Money-back guarantee */}
    <div className="text-center mt-16">
      <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/[0.08] hover:border-white/20 hover:rounded-3xl transition-all duration-300 group cursor-default">
        <div className="w-6 h-6 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </div>
        <span className="text-gray-300 text-sm group-hover:text-white transition-colors duration-300">
          30-day money-back guarantee • Cancel anytime
        </span>
      </div>
    </div>
  </div>
</section>

      {/* Testimonials */}
      <section id="testimonials" className="py-24 px-6 lg:px-8 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-6xl font-light tracking-tight mb-4 hover:text-yellow-100 transition-colors duration-300 cursor-default">
              <em>What</em> students say
            </h2>
            <p className="text-gray-400 text-lg font-light hover:text-gray-300 transition-colors duration-300 cursor-default">
              Real feedback from our learning community
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: "Ayesha Karim",
                role: "Computer Student",
                content: "StudyMate transformed my study routine. I can now process textbooks in minutes instead of hours.",
                gradient: "from-blue-500/10 to-cyan-500/5",
                borderColor: "group-hover:border-blue-500/30"
              },
              {
                name: "Manisha Kashyap",
                role: "Engineering Student",
                content: "The Q&A feature is incredible. It's like having a personal tutor available 24/7.",
                gradient: "from-purple-500/10 to-violet-500/5",
                borderColor: "group-hover:border-purple-500/30"
              },
              {
                name: "Rashmi Mishra",
                role: "Law Student", 
                content: "Flashcard generation saves me so much time. My retention has improved dramatically.",
                gradient: "from-emerald-500/10 to-teal-500/5",
                borderColor: "group-hover:border-emerald-500/30"
              }
            ].map((testimonial, index) => (
              <div key={index} className="group relative">
                <div className={`absolute inset-0 bg-gradient-to-br ${testimonial.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl blur-sm`} />
                
                <div className={`relative border border-white/10 rounded-2xl p-8 ${testimonial.borderColor} group-hover:rounded-3xl transition-all duration-500 transform group-hover:scale-[1.02] group-hover:shadow-2xl backdrop-blur-sm`}>
                  <div className="relative">
                    <p className="text-gray-300 font-light mb-8 leading-relaxed group-hover:text-white transition-colors duration-300 text-lg">
                      "{testimonial.content}"
                    </p>
                    
                    <div className="border-t border-white/10 pt-6 group-hover:border-white/20 transition-colors duration-300">
                      <div className="font-medium text-white text-base group-hover:text-white transition-colors duration-300">
                        {testimonial.name}
                      </div>
                      <div className="text-gray-500 text-sm group-hover:text-gray-400 transition-colors duration-300 mt-1">
                        {testimonial.role}
                      </div>
                    </div>
                    
                    <div className="absolute -top-2 -left-2 text-6xl text-white/5 group-hover:text-white/10 transition-colors duration-500 font-serif">
                      "
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id='faqs' className="py-24 px-6 lg:px-8 bg-white/[0.02] relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-6xl font-light tracking-tight mb-4 hover:text-blue-100 transition-colors duration-300 cursor-default">
              <em>Frequently</em> asked questions
            </h2>
            <p className="text-gray-400 text-lg font-light hover:text-gray-300 transition-colors duration-300 cursor-default">
              Everything you need to know about StudyMate
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="group">
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full text-left p-6 bg-white/5 hover:bg-white/[0.08] border border-white/10 hover:border-white/20 rounded-2xl hover:rounded-3xl transition-all duration-300 flex items-center justify-between"
                >
                  <h3 className="text-lg font-medium text-white group-hover:text-blue-100 transition-colors duration-300 pr-4">
                    {faq.question}
                  </h3>
                  <div className="flex-shrink-0">
                    {openFAQ === index ? (
                      <ChevronUp className="w-5 h-5 text-gray-400 group-hover:text-white transition-all duration-300" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-400 group-hover:text-white transition-all duration-300" />
                    )}
                  </div>
                </button>
                
                <div className={`overflow-hidden transition-all duration-500 ease-in-out ${
                  openFAQ === index 
                    ? 'max-h-screen opacity-100 mt-0' 
                    : 'max-h-0 opacity-0 mt-0'
                }`}>
                  <div className="px-6 pb-6 pt-4 bg-white/[0.03] border-x border-b border-white/10 rounded-b-2xl -mt-2">
                    <p className="text-gray-300 leading-relaxed text-sm">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-light tracking-tight mb-6 hover:text-blue-100 transition-colors duration-300 cursor-default">
            Ready to transform
            <br />
            your learning?
          </h2>
          <p className="text-gray-400 text-lg font-light mb-12 hover:text-gray-300 transition-colors duration-300 cursor-default">
            Join thousands of students who are already studying smarter with StudyMate.
          </p>
          <button 
            onClick={() => navigate('/dashboard')}
            className="bg-white text-black px-8 py-3 rounded-xl font-medium hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:shadow-lg hover:shadow-blue-500/20 hover:rounded-2xl transition-all duration-300 inline-flex items-center gap-2 group"
          >
            <span className="group-hover:text-blue-700 transition-colors duration-300">Get started now</span>
            <ArrowRight className="w-4 h-4 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all duration-300" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12 px-6 lg:px-8 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="font-medium mb-4 hover:text-blue-300 transition-colors duration-300 cursor-pointer">
                StudyMate
              </div>
              <p className="text-gray-500 text-sm font-light hover:text-gray-400 transition-colors duration-300 cursor-default">
                AI-powered learning for students.
              </p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-white mb-4 hover:text-blue-200 transition-colors duration-300 cursor-default">
                Product
              </h4>
              <ul className="space-y-2 text-sm text-gray-500">
                <li><a href="#" className="hover:text-blue-300 transition-colors duration-300">Features</a></li>
                <li><a href="#" className="hover:text-purple-300 transition-colors duration-300">Pricing</a></li>
                <li><a href="#" className="hover:text-emerald-300 transition-colors duration-300">API</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-medium text-white mb-4 hover:text-purple-200 transition-colors duration-300 cursor-default">
                Company
              </h4>
              <ul className="space-y-2 text-sm text-gray-500">
                <li><a href="#" className="hover:text-blue-300 transition-colors duration-300">About</a></li>
                <li><a href="#" className="hover:text-purple-300 transition-colors duration-300">Blog</a></li>
                <li><a href="#" className="hover:text-emerald-300 transition-colors duration-300">Careers</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-medium text-white mb-4 hover:text-emerald-200 transition-colors duration-300 cursor-default">
                Support
              </h4>
              <ul className="space-y-2 text-sm text-gray-500">
                <li><a href="#" className="hover:text-blue-300 transition-colors duration-300">Help</a></li>
                <li><a href="#" className="hover:text-purple-300 transition-colors duration-300">Contact</a></li>
                <li><a href="#" className="hover:text-emerald-300 transition-colors duration-300">Privacy</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 mt-8 pt-8 text-center text-gray-500 text-sm hover:text-gray-400 transition-colors duration-300 cursor-default">
            © 2025 StudyMate. All rights reserved.
          </div>
        </div>
      </footer>
      {/* Custom Styles for smooth scrolling */}
      <style jsx>{`
        html {
          scroll-behavior: smooth;
        }
      `}</style>
          <ScrollToTop />
    </div>
  );
};

export default LandingPage;
