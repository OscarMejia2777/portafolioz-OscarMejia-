
import React from 'react';

const Navbar: React.FC = () => {
  return (
    <header className="fixed top-0 w-full z-50 border-b border-white/5 bg-[#101c22]/80 backdrop-blur-md">
      <div className="max-w-[1200px] mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-3 cursor-pointer group">
          <div className="size-8 bg-primary rounded-lg flex items-center justify-center text-background-dark shadow-lg shadow-primary/20">
            <span className="material-symbols-outlined text-xl font-bold">terminal</span>
          </div>
          <h2 className="text-xl font-extrabold tracking-tight hidden sm:block">
            DEV<span className="text-primary">PORTFOLIO</span>
          </h2>
        </div>
        
        <nav className="hidden md:flex items-center gap-10">
          <a href="#work" className="text-sm font-medium hover:text-primary transition-colors">Work</a>
          <a href="#skills" className="text-sm font-medium text-slate-400 hover:text-primary transition-colors">Skills</a>
          <a href="#experience" className="text-sm font-medium text-slate-400 hover:text-primary transition-colors">Experience</a>
          <a href="#contact" className="text-sm font-medium text-slate-400 hover:text-primary transition-colors">Contact</a>
        </nav>

        <div className="flex items-center gap-4">
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[10px] uppercase tracking-widest font-bold text-emerald-500">Available for hire</span>
          </div>
          <button className="bg-primary hover:bg-primary/90 text-[#101c22] px-6 py-2.5 rounded-lg text-sm font-bold transition-all transform hover:scale-105 shadow-lg shadow-primary/20">
            Get in touch
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
