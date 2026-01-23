
import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Projects from './components/Projects';
import Experience from './components/Experience';
import Contact from './components/Contact';
import AIAssistant from './components/AIAssistant';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-background-dark">
      <Navbar />
      <main>
        <Hero />
        <Projects />
        <Experience />
        <Contact />
      </main>
      
      {/* Smart AI Assistant con Gemini & Framer Motion */}
      <AIAssistant />
      
      {/* Floating Status Badge */}
      <div className="fixed bottom-10 left-10 z-40 pointer-events-none opacity-0 md:opacity-100 animate-pulse">
         <div className="bg-[#1c2327]/80 border border-white/5 backdrop-blur-md px-5 py-2.5 rounded-2xl text-slate-400 text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-3 shadow-2xl">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            Live Portfolio v2.1
         </div>
      </div>
    </div>
  );
};

export default App;
