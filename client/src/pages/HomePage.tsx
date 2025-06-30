import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowRight, FiCode, FiUsers, FiCpu, FiMessageSquare, FiGitBranch, FiZap } from 'react-icons/fi';
import { Code2, Github, Sparkles } from 'lucide-react';

const FeatureCard = ({ icon, title, children, delay = 0 }: { 
  icon: React.ReactNode, 
  title: string, 
  children: React.ReactNode,
  delay?: number
}) => (
  <div 
    className="group relative overflow-hidden bg-gradient-to-br from-gray-800/50 to-gray-900/80 backdrop-blur-sm p-8 rounded-2xl border border-gray-700/50 hover:border-purple-500/30 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/10"
    style={{ animationDelay: `${delay}ms` }}
  >
    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
    <div className="relative z-10">
      <div className="text-purple-400 mb-6 transform group-hover:scale-110 transition-transform duration-300">{icon}</div>
      <h3 className="text-xl font-bold text-white mb-4 group-hover:text-purple-300 transition-colors duration-300">{title}</h3>
      <p className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors duration-300">{children}</p>
    </div>
  </div>
);

const FloatingElement = ({ children, className, delay = 0 }: { 
  children: React.ReactNode, 
  className?: string,
  delay?: number
}) => (
  <div 
    className={`absolute opacity-20 animate-pulse ${className}`}
    style={{ animationDelay: `${delay}ms`, animationDuration: '3s' }}
  >
    {children}
  </div>
);

const AnimatedBackground = () => (
  <div className="fixed inset-0 overflow-hidden pointer-events-none">
    <div className="absolute -inset-10 opacity-30">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute top-3/4 right-1/4 w-80 h-80 bg-pink-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
    </div>
  </div>
);

function HomePage() {
  const navigate = useNavigate();

  const handleOpenGitHub = () => {
    window.open('https://github.com/auraticabhi/PairFusion', '_blank');
  };

  // const scrollToFeatures = () => {
  //   const element = document.getElementById('features');
  //   if (element) {
  //     element.scrollIntoView({ behavior: 'smooth' });
  //   }
  // };

  return (
    <div className="bg-gray-900 text-white min-h-screen relative overflow-hidden">
      <AnimatedBackground />

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <FloatingElement className="top-20 left-10" delay={0}>
          <FiCode size={60} className="text-purple-500/20" />
        </FloatingElement>
        <FloatingElement className="top-40 right-20" delay={1000}>
          <FiGitBranch size={40} className="text-pink-500/20" />
        </FloatingElement>
        <FloatingElement className="bottom-40 left-20" delay={2000}>
          <FiUsers size={50} className="text-purple-400/20" />
        </FloatingElement>
        <FloatingElement className="bottom-20 right-10" delay={1500}>
          <FiZap size={45} className="text-pink-400/20" />
        </FloatingElement>
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/10 via-transparent to-pink-900/10 pointer-events-none"></div>

      {/* Header */}
      <header className="relative z-20 container mx-auto px-6 py-6 flex justify-between items-center backdrop-blur-sm">
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg">
                        <Code2 className="w-7 h-7 text-white" />
                    </div>

          <div>
            <span className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              PairFusion
            </span>
            <div className="text-xs text-gray-500 font-medium">NEXT-GEN COLLABORATIVE IDE</div>
          </div>
        </div>
        <button 
          onClick={() => navigate('/join')}
          className="group hidden sm:block relative overflow-hidden bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3 px-8 rounded-xl transition-all duration-300 shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 hover:scale-105"
        >
          <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12"></div>
          <span className="relative flex items-center gap-2">
            Launch App
            <FiArrowRight className="w-4 h-4" />
          </span>
        </button>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 container mx-auto px-6 text-center pt-20 pb-24">
        <div className="max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-full px-6 py-3 mb-8 backdrop-blur-sm">
            <Sparkles className="w-5 h-5 text-purple-400" />
            <span className="text-purple-300 font-medium">Powered by AI • Real-time Collaboration</span>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-extrabold mb-8 leading-tight">
            <span className="block bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent animate-gradient-x">
              Code Together
            </span>
            <span className="block bg-gradient-to-r from-purple-400 via-pink-400 to-purple-600 bg-clip-text text-transparent">
              Create Magic
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto mb-12 leading-relaxed">
            Experience the future of collaborative development. Write, edit, and run code together in real-time with AI-powered assistance and seamless team integration.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <button 
              onClick={() => navigate('/join')}
              className="group relative overflow-hidden bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:via-pink-700 hover:to-purple-800 text-white font-bold py-5 px-12 rounded-2xl text-xl transition-all duration-300 shadow-2xl shadow-purple-500/30 hover:shadow-purple-500/50 hover:scale-105 min-w-[280px]"
            >
              <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12"></div>
              <span className="relative flex items-center justify-center gap-3">
                Start Collaborating
                <FiArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </span>
            </button>
            
            <button 
              onClick={handleOpenGitHub}
              className="group flex items-center gap-3 text-gray-300 hover:text-white font-semibold py-5 px-8 rounded-2xl border border-gray-600 hover:border-purple-500/50 transition-all duration-300 hover:bg-purple-500/10 min-w-[200px] justify-center"
            >
              <Github className="w-6 h-6" />
              View on GitHub
            </button>
          </div>
        </div>
      </main>

      {/* Features Section */}
      <section id="features" className="relative z-10 container mx-auto px-6 py-24">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Powerful Features
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Everything you need for modern collaborative development, powered by cutting-edge technology.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          <FeatureCard icon={<FiCode size={32} />} title="Real-Time Collaboration" delay={0}>
            Experience zero-latency, multi-cursor editing with live presence indicators. See your teammates' changes as they type, creating a truly collaborative coding experience.
          </FeatureCard>
          
          <FeatureCard icon={<FiMessageSquare size={32} />} title="Integrated Communication" delay={200}>
            Built-in chat and file management keep your team connected. Discuss code, share ideas, and manage your project without leaving the editor.
          </FeatureCard>
          
          <FeatureCard icon={<FiCpu size={32} />} title="AI-Powered Assistant" delay={400}>
            Generate code, get intelligent suggestions, and overcome blocks with our integrated AI copilot featuring smart and curated responses.
          </FeatureCard>
          
          <FeatureCard icon={<FiGitBranch size={32} />} title="Live File System" delay={600}>
            Manage your project with a fully synchronized file explorer. Create, rename, or delete files, and see your changes appear instantly for everyone in the room.
          </FeatureCard>
          
          <FeatureCard icon={<FiZap size={32} />} title="Lightning Fast" delay={800}>
            Optimized for performance with instant loading, smooth interactions, and responsive design that works beautifully on any device.
          </FeatureCard>
          
          <FeatureCard icon={<FiUsers size={32} />} title="Team Presence" delay={1000}>
            See who's online, track user activity, and coordinate with your team through visual presence indicators and status updates.
          </FeatureCard>
        </div>
      </section>

{/* Stats Section */}
<section className="relative z-10 container mx-auto px-16 py-24">
    <div className="text-center mb-16">
        <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Engineered for Performance
        </h2>
        <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Built on a robust, scalable foundation to deliver a seamless, real-time experience.
        </p>
    </div>
    
    <div className="bg-gradient-to-r from-gray-800/40 to-gray-900/40 rounded-3xl p-12 border border-gray-700/50 backdrop-blur-sm">
        <div className="grid md:grid-cols-4 gap-8 text-center">

            <div className="group">
                <div className="text-4xl font-bold text-purple-400 mb-2 group-hover:scale-110 transition-transform">∞</div>
                <div className="text-gray-300">Horizontal Scalability</div>
                <div className="text-xs text-gray-500 mt-1">Stateless architecture with Redis</div>
            </div>
                   
            <div className="group">
                <div className="text-4xl font-bold text-purple-400 mb-2 group-hover:scale-110 transition-transform">50+</div>
                <div className="text-gray-300">Language Runtimes</div>
                <div className="text-xs text-gray-500 mt-1">Multi-Language Support</div>
            </div>

            <div className="group">
                <div className="text-4xl font-bold text-pink-400 mb-2 group-hover:scale-110 transition-transform">100%</div>
                <div className="text-gray-300 font-semibold">Self-Healing Sync</div>
                <div className="text-xs text-gray-500 mt-1">Resilient to network loss</div>
            </div>
            
            <div className="group">
                <div className="text-4xl font-bold text-pink-400 mb-2 group-hover:scale-110 transition-transform">1</div>
                <div className="text-gray-300">Command to Deploy</div>
                <div className="text-xs text-gray-500 mt-1">With Docker Compose</div>
            </div>
        </div>
    </div>
</section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-gray-800 bg-gray-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-4 mb-6 md:mb-0">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg">
                        <Code2 className="w-7 h-7 text-white" />
                    </div>

              <div>
                <div className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  PairFusion
                </div>
                <div className="text-xs text-gray-500">Next-Gen Collaborative IDE</div>
              </div>
            </div>
            <div className="text-gray-500 text-center md:text-right">
    <p>© {new Date().getFullYear()} PairFusion. Made with ❤️ by{'  '}
        <a 
            href="http://www.linkedin.com/in/abhijeet-gupta-0074a922b" 
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:text-purple-400 font-semibold underline underline-offset-2 transition-colors duration-300"
        >
            Abhi
        </a>
    </p>
    <p className="text-sm mt-1">Let's build the future, together.</p>
</div>
          </div>
        </div>
      </footer>

      <style>
        {`
          @keyframes gradient-x {
            0%, 100% {
              background-size: 200% 200%;
              background-position: left center;
            }
            50% {
              background-size: 200% 200%;
              background-position: right center;
            }
          }
          .animate-gradient-x {
            animation: gradient-x 3s ease infinite;
          }
        `}
      </style>
    </div>
  );
}

export default HomePage;