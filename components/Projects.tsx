
import React, { useEffect, useRef, useState } from 'react';
import { PROJECTS } from '../constants';

const Scribble: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 100 20" className={`absolute fill-none stroke-current ${className}`} style={{ strokeWidth: 3, strokeLinecap: 'round' }}>
    <path d="M5,15 Q25,5 45,15 T85,10" />
  </svg>
);

const ProjectCard: React.FC<{ project: typeof PROJECTS[0]; index: number }> = ({ project, index }) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (window.innerWidth < 1024) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMousePos({ x, y });
  };

  return (
    <div 
      onMouseMove={handleMouseMove}
      className="flex-shrink-0 w-[95vw] md:w-[90vw] h-[85vh] flex items-center justify-center px-4 md:px-12 relative group"
      style={{ perspective: '2000px' }}
    >
      <div 
        className="relative w-full h-full transition-transform duration-300 ease-out flex flex-col md:flex-row items-center gap-8 md:gap-0"
        style={{ 
          transform: `rotateX(${mousePos.y * -3}deg) rotateY(${mousePos.x * 5}deg)`
        }}
      >
        {/* Background Index Number */}
        <div className="absolute -top-10 left-0 text-[15rem] md:text-[25rem] font-black text-black opacity-[0.03] select-none pointer-events-none leading-none z-0">
          0{index + 1}
        </div>

        {/* Big Image Visual */}
        <div className="relative w-full md:w-[65%] h-[50%] md:h-[85%] z-20 group/img">
           {/* Folder Tab Decorative */}
           <div className="absolute -top-6 left-10 bg-black text-[#FFD600] px-6 py-1 font-black uppercase text-xs skew-x-[-15deg] border-t-2 border-x-2 border-black z-30">
              SCHEMA_DATA_{index + 1}
           </div>

           <div className="absolute inset-0 bg-white border-[6px] md:border-[10px] border-black shadow-[15px_15px_0px_#000] overflow-hidden group-hover/img:shadow-[5px_5px_0px_#000] transition-all">
              <img 
                src={project.image} 
                alt={project.title} 
                className="w-full h-full object-cover grayscale group-hover/img:grayscale-0 transition-all duration-700 scale-105 group-hover/img:scale-100"
              />
              <div className="absolute inset-0 opacity-20 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%)] bg-[length:100%_4px]"></div>
           </div>
           
           {/* Image Badge */}
           <div className="absolute top-8 right-8 bg-[#FF4B4B] text-white p-4 rounded-full border-4 border-black font-black text-sm rotate-12 animate-pulse hidden md:flex items-center justify-center shadow-[4px_4px_0px_#000]">
             NEW_TECH
           </div>
        </div>

        {/* Content Section - Overlapping the image slightly on desktop */}
        <div className="w-full md:w-[45%] bg-white border-[6px] border-black p-8 md:p-12 shadow-[15px_15px_0px_#00A1FF] z-40 md:-ml-20 transform -rotate-1 group-hover:rotate-0 transition-all">
           <div className="flex items-center gap-2 mb-4">
              <div className="w-3 h-3 rounded-full bg-green-500 border-2 border-black animate-ping"></div>
              <span className="font-black text-xs uppercase tracking-widest text-gray-500">Live Lab Entry</span>
           </div>
           
           <h3 className="text-4xl md:text-7xl font-black uppercase leading-[0.85] mb-6 tracking-tighter text-black">
             {project.title}
           </h3>
           
           <div className="bg-yellow-50 border-2 border-dashed border-black/20 p-4 mb-8 relative">
              <Scribble className="w-12 text-[#FF4B4B] -top-4 -right-2" />
              <p className="font-bold text-gray-800 italic leading-tight text-lg md:text-xl">
                "{project.description}"
              </p>
           </div>

           <div className="flex flex-wrap gap-2 mb-10">
              {project.tags.map(tag => (
                <span key={tag} className="bg-black text-white px-3 py-1 text-xs font-black uppercase tracking-tighter border-2 border-black">
                  {tag}
                </span>
              ))}
           </div>

           <a 
              href="#"
              onClick={(e) => e.preventDefault()}
              className="cartoon-btn w-full bg-[#FFD600] group/btn flex items-center justify-center gap-4 py-5 font-black text-2xl uppercase border-4 border-black shadow-[10px_10px_0px_#000] hover:bg-black hover:text-[#FFD600] transition-all active:translate-y-1 active:shadow-none"
           >
              VIEW PROJECT
              <span className="text-4xl group-hover/btn:translate-x-3 transition-transform">→</span>
           </a>
        </div>
      </div>
    </div>
  );
};

const Projects: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const totalDist = rect.height - windowHeight;
      const progress = Math.min(Math.max(-rect.top / totalDist, 0), 1);
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // ADJUSTED TIMINGS:
  // 0.0 -> 0.15: Header is pinned center, fully visible (intro phase)
  // 0.15 -> 0.3: Header transitions to sidebar
  // 0.3 -> 0.95: Projects scroll horizontally
  
  const introEnd = 0.15;
  const transitionEnd = 0.3;

  const titleX = scrollProgress < introEnd 
    ? 50 // Stay centered
    : scrollProgress < transitionEnd 
      ? 50 - ((scrollProgress - introEnd) / (transitionEnd - introEnd)) * 50 // Move to 0
      : 0;
  
  const titleScale = scrollProgress < introEnd 
    ? 1 
    : scrollProgress < transitionEnd 
      ? 1 - ((scrollProgress - introEnd) / (transitionEnd - introEnd)) * 0.6 
      : 0.4;

  const titleRotation = scrollProgress < introEnd 
    ? 0 
    : scrollProgress < transitionEnd 
      ? ((scrollProgress - introEnd) / (transitionEnd - introEnd)) * -90 
      : -90;

  const horizontalMove = scrollProgress > transitionEnd 
    ? (scrollProgress - transitionEnd) / (1 - transitionEnd) * 100 
    : 0;

  return (
    <section 
      ref={sectionRef}
      id="projects" 
      className="relative h-[600vh] bg-[#FFF9E6]"
    >
      {/* Background Grid - Sticky */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none sticky top-0 h-screen"
           style={{ backgroundImage: `linear-gradient(#000 2px, transparent 2px), linear-gradient(90deg, #000 2px, transparent 2px)`, 
                    backgroundSize: '80px 80px' }}>
      </div>

      {/* STICKY VIEWPORT */}
      <div className="sticky top-0 h-screen w-full flex items-center overflow-hidden">
        
        {/* THE "WORKS" HEADER - STICKY AND ANIMATING */}
        <div 
          className="absolute z-[60] pointer-events-none transition-all duration-75 ease-out flex items-center justify-center whitespace-nowrap"
          style={{ 
            left: `${titleX}%`,
            top: '45%', // Moved up as requested
            transform: `translate(-50%, -50%) scale(${titleScale}) rotate(${titleRotation}deg)`,
            width: '100vw'
          }}
        >
          <div className="relative">
            <h2 className="text-[12rem] md:text-[22rem] font-black uppercase tracking-tighter leading-none italic">
                W<span className="text-white" style={{ WebkitTextStroke: '5px black', textShadow: '12px 12px 0px #FF4B4B' }}>OR</span>KS
            </h2>
            {/* Background Block for Title */}
            <div 
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[115%] h-[45%] bg-[#FFD600] border-y-8 border-black -rotate-1 -z-10 shadow-[25px_25px_0px_#000] transition-opacity duration-500"
              style={{ opacity: scrollProgress < transitionEnd ? 1 : 0.8 }}
            ></div>
            
            {/* Floating Hint */}
            {scrollProgress < 0.1 && (
              <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 bg-black text-white px-6 py-2 font-black uppercase text-sm animate-bounce shadow-[6px_6px_0px_#00A1FF]">
                Scroll to explore lab
              </div>
            )}
          </div>
        </div>

        {/* PROJECTS CONTAINER - HORIZONTAL SLIDE */}
        <div 
          className="flex items-center h-full pl-[20vw] transition-transform duration-100 ease-out"
          style={{ 
            transform: `translateX(calc(100vw - ${horizontalMove * 1.3}%))` 
          }}
        >
          {PROJECTS.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
          
          {/* END OF LINE - Final Branding */}
          <div className="flex-shrink-0 w-[50vw] flex items-center justify-center">
            <div className="bg-white border-[12px] border-black p-16 rotate-3 shadow-[30px_30px_0px_#FFD600] text-center">
              <h4 className="text-6xl md:text-8xl font-black uppercase tracking-tighter italic mb-4">FIN_DATA</h4>
              <p className="font-bold text-2xl uppercase tracking-widest text-[#FF4B4B]">Action Bastion Sequence Complete!</p>
            </div>
          </div>
        </div>

        {/* BRUTALIST PROGRESS INDICATOR */}
        <div className="absolute bottom-12 right-12 flex flex-col items-end gap-2 z-[70]">
           <span className="font-black uppercase text-xs tracking-widest bg-black text-white px-3 py-1">Lab Progress: {Math.round(scrollProgress * 100)}%</span>
           <div className="w-64 h-4 border-4 border-black bg-white shadow-[6px_6px_0px_#000] overflow-hidden">
              <div 
                className="h-full bg-[#00A1FF] transition-all duration-100 ease-out"
                style={{ width: `${scrollProgress * 100}%` }}
              ></div>
           </div>
        </div>
      </div>
    </section>
  );
};

export default Projects;
