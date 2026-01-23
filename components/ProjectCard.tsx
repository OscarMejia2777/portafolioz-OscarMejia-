
import React from 'react';
import { Project } from '../types';

interface ProjectCardProps {
  project: Project;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  return (
    <div className="flex flex-col group rounded-xl overflow-hidden bg-[#1c2327]/40 border border-white/5 hover:border-primary/40 transition-all hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/5">
      <div className="relative w-full aspect-[16/10] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-background-dark/90 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-6">
           <button className="flex items-center gap-2 text-primary font-bold text-sm">
             Open Case Study <span className="material-symbols-outlined text-sm">north_east</span>
           </button>
        </div>
        <img 
          src={project.imageUrl} 
          alt={project.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
      </div>
      
      <div className="p-6 flex flex-col flex-1">
        <div className="flex flex-wrap gap-2 mb-4">
          {project.tags.map((tag, idx) => (
            <span key={idx} className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${idx === 0 ? 'bg-primary/10 border border-primary/20 text-primary' : 'bg-white/5 border border-white/10 text-slate-400'}`}>
              {tag}
            </span>
          ))}
        </div>
        
        <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">{project.title}</h3>
        <p className="text-slate-500 text-sm leading-relaxed mb-6 flex-1">
          {project.description}
        </p>
        
        <div className="flex items-center justify-between pt-4 border-t border-white/5">
          <a href="#" className="inline-flex items-center gap-2 text-sm font-bold text-primary group/link">
            View Case Study
            <span className="material-symbols-outlined text-lg group-hover/link:translate-x-1 transition-transform">arrow_forward</span>
          </a>
          <a href="#" className="text-slate-500 hover:text-white transition-colors">
            <span className="material-symbols-outlined text-xl">open_in_new</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
