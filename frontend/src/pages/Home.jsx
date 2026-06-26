import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0a0f1d] text-slate-100 flex flex-col justify-between font-sans selection:bg-[#00f2fe] selection:text-black">
      {/* Ambient Radial Glow Elements */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none"></div>

      <header className="border-b border-slate-800/60 backdrop-blur-md sticky top-0 z-50 px-6 lg:px-16 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#00f2fe] to-[#4facfe] flex items-center justify-center p-2 shadow-lg shadow-cyan-500/20">
            <span className="text-black font-black text-xl tracking-tighter">M</span>
          </div>
          <span className="text-xl font-extrabold tracking-wider bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
            Med<span className="text-[#00f2fe]">Intel</span>
          </span>
        </div>
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => navigate('/login')} 
            className="text-sm font-semibold text-slate-400 hover:text-white transition-colors duration-200"
          >
            Sign In
          </button>
          <button 
            onClick={() => navigate('/register')} 
            className="px-4 py-2 text-sm font-bold bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-600 rounded-lg transition-all duration-200"
          >
            Get Started
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 pt-20 pb-16 flex-grow flex flex-col items-center text-center justify-center relative z-10">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-500/5 text-[#00f2fe] text-xs font-semibold tracking-wide mb-6 uppercase animate-pulse">
          <span>⚡ Next-Generation Medical RAG Engine</span>
        </div>
        
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-tight max-w-4xl mb-6 bg-gradient-to-b from-white via-slate-200 to-slate-500 bg-clip-text text-transparent">
        Demystify Medical Reports With <span className="bg-gradient-to-r from-[#00f2fe] to-[#4facfe] bg-clip-text text-transparent">Semantic Intelligence</span>
        </h1>

        <p className="text-slate-400 text-sm md:text-lg max-w-2xl mb-10 leading-relaxed">
        Upload your clinical laboratory dossiers and seamlessly interact with an advanced cross-cluster AI assistant grounded in localized vector data mappings.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
          <button 
            onClick={() => navigate('/register')}
            className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-[#00f2fe] to-[#4facfe] text-black font-extrabold text-base rounded-xl shadow-xl shadow-cyan-500/10 hover:shadow-cyan-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
          >
            Initialize Platform
          </button>
          <button 
            onClick={() => navigate('/login')}
            className="w-full sm:w-auto px-8 py-4 bg-slate-900/80 hover:bg-slate-800 text-white font-bold text-base rounded-xl border border-slate-800 hover:border-slate-700 backdrop-blur-sm transition-all duration-200"
          >
            Access Dashboard
          </button>
        </div>
      </main>

      <footer className="border-t border-slate-900 px-6 py-6 text-center text-xs text-slate-600">
        &copy; {new Date().getFullYear()} MedIntel Architecture Lab. All Rights Reserved.
      </footer>
    </div>
  );
};

export default Home;