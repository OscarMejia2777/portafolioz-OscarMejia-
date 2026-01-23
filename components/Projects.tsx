
import React, { useState, useMemo } from 'react';
import ProjectCard from './ProjectCard';
import { PROJECTS } from '../constants';

const Projects: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState('All');
  const filters = ['All', 'E-Commerce', 'Fintech', 'Web3', 'Dashboards'];

  const filteredProjects = useMemo(() => {
    if (activeFilter === 'All') return PROJECTS;
    return PROJECTS.filter(p => p.category === activeFilter);
  }, [activeFilter]);

  return (
    <section id="work" className="py-24 px-6 max-w-[1200px] mx-auto">
      <div className="mb-16 space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-[0.2em]">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
          </span>
          Selected Works
        </div>
        
        <h2 className="text-5xl md:text-7xl font-black tracking-tighter leading-none">
          Recent <span className="text-primary italic">Projects</span>
        </h2>
        
        <p className="text-slate-400 text-lg md:text-xl max-w-2xl font-light leading-relaxed">
          A collection of high-impact digital products and experimental web technologies built with modern frameworks.
        </p>
      </div>

      {/* Filter Controls */}
      <div className="flex items-center gap-3 mb-12 overflow-x-auto pb-4 no-scrollbar">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className={`px-6 py-2.5 rounded-lg text-sm font-bold whitespace-nowrap transition-all ${
              activeFilter === f 
                ? 'bg-primary text-[#101c22]' 
                : 'bg-[#1c2327] text-slate-400 hover:bg-white/5 hover:text-white'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredProjects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
      
      {/* Featured CTA */}
      <div className="mt-24 p-12 bg-white/5 rounded-3xl text-center flex flex-col items-center max-w-4xl mx-auto border border-dashed border-white/10">
        <h3 className="text-3xl font-bold mb-4">Have a special project?</h3>
        <p className="text-slate-400 mb-8 max-w-md">
          I love working on complex UI challenges and high-performance applications. Let's discuss your next big idea.
        </p>
        <button className="bg-primary text-[#101c22] px-10 py-4 rounded-xl text-base font-black hover:shadow-xl hover:shadow-primary/10 transition-all flex items-center gap-3">
          <span className="material-symbols-outlined">mail</span>
          Start a Conversation
        </button>
      </div>
    </section>
  );
};

export default Projects;
