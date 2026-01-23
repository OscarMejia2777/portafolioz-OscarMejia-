
import React from 'react';
import { SKILLS, EXPERIENCES } from '../constants';

const Experience: React.FC = () => {
  return (
    <section id="skills" className="py-24 px-6 bg-[#0c1418]/50">
      <div className="max-w-[960px] mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-4">Technical Expertise</h2>
          <p className="text-slate-400 max-w-xl mx-auto">Specialized in building high-performance web applications with modern stacks and scalable architectures.</p>
        </div>

        {/* Skills Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-24">
          {SKILLS.map((skill, idx) => (
            <div key={idx} className="group flex flex-col gap-4 rounded-xl border border-white/10 bg-[#1c2327]/50 backdrop-blur-sm p-8 hover:border-primary/50 transition-all">
              <div className="text-primary group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-4xl">{skill.icon}</span>
              </div>
              <div>
                <h3 className="text-white text-xl font-bold leading-tight mb-1">{skill.name}</h3>
                <p className="text-slate-400 text-sm">{skill.level} • {skill.experience}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Experience Timeline */}
        <div id="experience" className="pt-24 border-t border-white/5">
          <h2 className="text-white text-3xl md:text-5xl font-bold mb-16 tracking-tight">Professional Journey</h2>
          
          <div className="relative">
            {/* Vertical Line */}
            <div className="absolute left-4 md:left-8 top-0 bottom-0 w-[2px] bg-gradient-to-b from-primary to-transparent opacity-20"></div>

            {EXPERIENCES.map((exp, idx) => (
              <div key={idx} className="relative pl-12 md:pl-20 pb-20 last:pb-0">
                {/* Node */}
                <div className={`absolute left-2.5 md:left-6.5 top-1.5 w-3.5 h-3.5 rounded-full ring-4 ring-offset-4 ring-offset-background-dark z-10 ${exp.isCurrent ? 'bg-primary ring-primary/20 animate-pulse' : 'bg-slate-700 ring-slate-700/20'}`}></div>
                
                <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-4 gap-3">
                  <div>
                    <h3 className="text-2xl font-bold text-white">{exp.role}</h3>
                    <p className="text-primary font-bold text-lg">{exp.company}</p>
                  </div>
                  <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${exp.isCurrent ? 'bg-primary/10 border-primary/20 text-primary' : 'bg-white/5 border-white/10 text-slate-500'}`}>
                    {exp.period}
                  </div>
                </div>

                <p className="text-slate-400 text-lg leading-relaxed mb-6 max-w-3xl">
                  {exp.description}
                </p>

                <ul className="space-y-3">
                  {exp.achievements.map((item, i) => (
                    <li key={i} className="flex gap-3 text-slate-300">
                      <span className="material-symbols-outlined text-primary text-xl">check_circle</span>
                      <span className="text-base">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Experience;
