
import React from 'react';
import { PROJECTS } from '../constants';

const ProjectPanel: React.FC<{ project: typeof PROJECTS[0]; index: number }> = ({ project, index }) => {
  return (
    <div 
      className="sticky top-24 sm:top-32 w-full mb-[12vh] last:mb-0"
      style={{ zIndex: index + 1 }}
    >
      <div 
        className="bg-white border-[6px] border-black shadow-[15px_15px_0px_#000] overflow-hidden flex flex-col lg:flex-row h-auto min-h-[500px] lg:h-[650px] group transition-transform duration-500 hover:scale-[1.01]"
      >
        {/* Visual Half */}
        <div className="lg:w-1/2 relative bg-gray-100 border-b-[6px] lg:border-b-0 lg:border-r-[6px] border-black overflow-hidden bg-[radial-gradient(#eee_1px,transparent_0)] bg-[size:20px_20px]">
          <img 
            src={project.image} 
            alt={project.title} 
            className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 ease-out scale-100 group-hover:scale-110"
          />
          <div className="absolute inset-0 halftone-bg pointer-events-none"></div>
          
          <div className="absolute top-6 left-6 bg-black text-white px-6 py-3 font-black text-2xl border-4 border-white shadow-[6px_6px_0px_#000] transform -rotate-3 group-hover:rotate-0 transition-transform">
            GADGET {String(index + 1).padStart(2, '0')}
          </div>
          
          {/* Hover Action Lines Overlay */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-30 pointer-events-none transition-opacity duration-500">
            <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,#000_10px,#000_11px)]"></div>
          </div>
        </div>

        {/* Content Half */}
        <div className="lg:w-1/2 p-8 lg:p-16 flex flex-col justify-center relative bg-white">
          <div 
            className="absolute -top-10 -right-10 p-4 font-black opacity-5 text-[15rem] select-none leading-none -z-10 transition-transform duration-1000 group-hover:scale-125"
            style={{ color: project.color }}
          >
            {project.id}
          </div>
          
          <div className="mb-8">
            <span className="bg-[#FFD600] text-black px-6 py-2 font-black text-sm uppercase tracking-[0.3em] inline-block transform -rotate-1 shadow-[4px_4px_0px_#000]">
              DEPLOYED V1.0
            </span>
          </div>

          <h3 className="text-4xl lg:text-7xl font-black uppercase mb-8 leading-tight tracking-tighter transition-colors group-hover:text-blue-600">
            {project.title}
          </h3>

          <p className="text-xl lg:text-2xl font-bold text-gray-700 leading-relaxed mb-10 border-l-[10px] border-black pl-8">
            {project.description}
          </p>

          <div className="flex flex-wrap gap-4 mb-12">
            {project.tags.map(tag => (
              <span key={tag} className="px-4 py-2 bg-white border-4 border-black font-black uppercase text-sm shadow-[4px_4px_0px_#000] hover:bg-black hover:text-white transition-colors cursor-default">
                {tag}
              </span>
            ))}
          </div>

          <div className="mt-auto">
            <button 
              className="cartoon-btn w-full lg:w-auto px-16 py-6 font-black text-2xl uppercase tracking-tighter"
              style={{ backgroundColor: project.color, color: '#fff' }}
            >
              Analyze Neural Flow →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Projects: React.FC = () => {
  return (
    <section id="projects" className="py-40 px-6 relative bg-[#FFF9E6]">
       {/* Background accent text */}
      <div className="absolute top-0 right-0 p-10 text-[25vw] font-black text-black/5 select-none leading-none pointer-events-none uppercase">
        GENAI
      </div>

      <div className="max-w-7xl mx-auto">
        <header className="mb-32 relative text-center lg:text-left">
          <div className="inline-block bg-[#FF4B4B] text-white px-8 py-3 font-black uppercase text-2xl cartoon-btn shadow-none transform -rotate-2 mb-8 cursor-default">
            Selected Works
          </div>
          <h2 className="text-6xl lg:text-[9rem] font-black uppercase tracking-tighter leading-none mb-4 relative z-10">
            LAB <br /> <span className="text-[#00A1FF]" style={{ WebkitTextStroke: '3px black', textShadow: '10px 10px 0px #000' }}>MANIFESTO</span>
          </h2>
          <div className="w-full h-8 bg-black mt-12 rounded-full overflow-hidden">
            <div className="h-full bg-[#FFD600] w-1/3 animate-[pulse_2s_infinite]"></div>
          </div>
        </header>

        <div className="flex flex-col gap-32">
          {PROJECTS.map((project, index) => (
            <ProjectPanel key={project.id} project={project} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
