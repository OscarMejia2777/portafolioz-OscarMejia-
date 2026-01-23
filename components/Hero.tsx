
import React from 'react';

const Hero: React.FC = () => {
  const socialLinks = [
    { name: 'GitHub', icon: 'code', url: '#' },
    { name: 'LinkedIn', icon: 'work', url: '#' },
    { name: 'Twitter', icon: 'alternate_email', url: '#' }
  ];

  const techStack = ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'TailwindCSS'];

  return (
    <section className="mesh-gradient min-h-[100vh] flex flex-col items-center justify-center px-6 relative overflow-hidden pt-20">
      <div className="max-w-[960px] w-full text-center z-10">
        
        {/* Social Floating Bar */}
        <div className="flex justify-center gap-8 mb-16">
          {socialLinks.map((link) => (
            <a key={link.name} href={link.url} className="group flex flex-col items-center gap-2">
              <div className="size-11 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-primary/50 group-hover:bg-primary/10 transition-all">
                <span className="material-symbols-outlined text-xl group-hover:text-primary">{link.icon}</span>
              </div>
              <span className="text-[10px] uppercase font-bold tracking-widest opacity-40 group-hover:opacity-100 transition-opacity">{link.name}</span>
            </a>
          ))}
        </div>

        <h1 className="text-5xl md:text-8xl font-black leading-[1.1] tracking-tighter mb-8 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60">
          Software Engineer <br /> & <span className="text-primary italic">Designer</span>
        </h1>

        <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-14 leading-relaxed font-medium">
          Building scalable web applications and intuitive user experiences with a focus on modern aesthetics and high-performance engineering.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
          <button className="w-full sm:w-auto min-w-[200px] bg-primary text-[#101c22] h-14 px-8 rounded-xl font-bold text-lg hover:shadow-[0_0_30px_-5px_rgba(43,173,238,0.5)] transition-all flex items-center justify-center gap-2 group">
            View My Work
            <span className="material-symbols-outlined font-bold transition-transform group-hover:translate-x-1">arrow_forward</span>
          </button>
          <button className="w-full sm:w-auto min-w-[200px] bg-white/5 border border-white/10 text-white h-14 px-8 rounded-xl font-bold text-lg hover:bg-white/10 transition-all flex items-center justify-center gap-2">
            <span className="material-symbols-outlined">download</span>
            Resume
          </button>
        </div>

        {/* Tech Stack Chips */}
        <div className="mt-24 flex flex-wrap justify-center gap-3">
          {techStack.map((tech) => (
            <div key={tech} className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full backdrop-blur-sm group hover:border-primary/50 transition-colors">
              <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></div>
              <span className="text-xs font-bold tracking-wide uppercase">{tech}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Background Decor */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-primary/10 blur-[100px] rounded-full"></div>
      </div>
    </section>
  );
};

export default Hero;
