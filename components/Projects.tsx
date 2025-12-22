
import React from 'react';
import { PROJECTS } from '../constants';

const ProjectPanel: React.FC<{ project: typeof PROJECTS[0]; index: number }> = ({ project, index }) => {
  // We create a stepped top offset so headers stay slightly visible (stack of cards effect)
  const stickyTop = 80 + (index * 12); // Adjusts top position per index

  return (
    <div 
      className="sticky w-full mb-[15vh] last:mb-0"
      style={{ 
        zIndex: index + 1,
        top: `${stickyTop}px`
      }}
    >
      <div 
        className="bg-white border-[6px] border-black shadow-[15px_15px_0px_#000] overflow-hidden flex flex-col lg:flex-row h-auto min-h-[400px] lg:h-[480px] group transition-transform duration-500 hover:translate-y-[-4px]"
      >
        {/* Visual Half */}
        <div className="lg:w-2/5 relative bg-gray-100 border-b-[6px] lg:border-b-0 lg:border-r-[6px] border-black overflow-hidden bg-[radial-gradient(#eee_1px,transparent_0)] bg-[size:20px_20px]">
          <img 
            src={project.image} 
            alt={project.title} 
            className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 ease-out scale-100 group-hover:scale-110"
          />
          <div className="absolute inset-0 halftone-bg pointer-events-none"></div>
          
          <div className="absolute top-4 left-4 bg-black text-white px-4 py-2 font-black text-lg border-4 border-white shadow-[4px_4px_0px_#000] transform -rotate-3 group-hover:rotate-0 transition-transform">
            #{String(index + 1).padStart(2, '0')}
          </div>
          
          {/* Hover Action Lines Overlay */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-20 pointer-events-none transition-opacity duration-500">
            <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,#000_10px,#000_11px)]"></div>
          </div>
        </div>

        {/* Content Half */}
        <div className="lg:w-3/5 p-6 lg:p-10 flex flex-col justify-center relative bg-white">
          <div 
            className="absolute -top-10 -right-10 p-4 font-black opacity-5 text-[10rem] select-none leading-none -z-10 transition-transform duration-1000 group-hover:scale-110"
            style={{ color: project.color }}
          >
            {project.id}
          </div>
          
          <div className="mb-4">
            <span className="bg-[#FFD600] text-black px-4 py-1 font-black text-[10px] uppercase tracking-[0.2em] inline-block transform -rotate-1 shadow-[3px_3px_0px_#000]">
              STABLE RELEASE
            </span>
          </div>

          <h3 className="text-3xl lg:text-5xl font-black uppercase mb-4 leading-tight tracking-tighter group-hover:text-blue-600 transition-colors">
            {project.title}
          </h3>

          <p className="text-base lg:text-lg font-bold text-gray-700 leading-relaxed mb-6 border-l-[6px] border-black pl-6">
            {project.description}
          </p>

          <div className="flex flex-wrap gap-2">
            {project.tags.map(tag => (
              <span key={tag} className="px-3 py-1 bg-white border-[3px] border-black font-black uppercase text-[10px] shadow-[3px_3px_0px_#000] hover:bg-black hover:text-white transition-colors cursor-default">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const Projects: React.FC = () => {
  return (
    <section id="projects" className="py-24 md:py-40 px-6 relative bg-[#FFF9E6]/40 backdrop-blur-[2px]">
       {/* Background accent text */}
      <div className="absolute top-0 right-0 p-10 text-[20vw] font-black text-black/5 select-none leading-none pointer-events-none uppercase">
        GENAI
      </div>

      <div className="max-w-6xl mx-auto">
        <header className="mb-20 md:mb-32 relative text-center lg:text-left">
          <div className="inline-block bg-[#FF4B4B] text-white px-6 py-2 font-black uppercase text-xl cartoon-btn shadow-none transform -rotate-2 mb-6 cursor-default">
            Selected Lab Works
          </div>
          <h2 className="text-5xl lg:text-[8rem] font-black uppercase tracking-tighter leading-none mb-4 relative z-10">
            GADGET <br /> <span className="text-[#00A1FF]" style={{ WebkitTextStroke: '2px black', textShadow: '8px 8px 0px #000' }}>REPOSITORY</span>
          </h2>
          <div className="w-full h-4 md:h-6 bg-black mt-8 rounded-full overflow-hidden">
            <div className="h-full bg-[#FFD600] w-1/4 animate-[pulse_2s_infinite]"></div>
          </div>
        </header>

        <div className="flex flex-col">
          {PROJECTS.map((project, index) => (
            <ProjectPanel key={project.id} project={project} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
