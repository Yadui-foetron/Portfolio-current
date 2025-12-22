
import React, { useEffect, useRef, useState } from 'react';
import { PROJECTS } from '../constants';

const Scribble: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 100 20" className={`absolute fill-none stroke-current ${className}`} style={{ strokeWidth: 3, strokeLinecap: 'round' }}>
    <path d="M5,15 Q25,5 45,15 T85,10" />
  </svg>
);

const ProjectCard: React.FC<{ project: typeof PROJECTS[0]; index: number; onVisible: (color: string) => void }> = ({ project, index, onVisible }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
        if (entry.isIntersecting) {
          onVisible(project.color);
        }
      },
      { threshold: 0.1 }
    );

    if (cardRef.current) observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, [project.color, onVisible]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || window.innerWidth < 1024) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMousePos({ x, y });
  };

  const isEven = index % 2 === 0;

  return (
    <div 
      ref={cardRef}
      onMouseMove={handleMouseMove}
      className="relative w-full flex items-center justify-center py-12 md:py-20 px-4 md:px-0"
      style={{ perspective: '2000px' }}
    >
      {/* Background Large Index Number - Subtler move for readability */}
      <div 
        className={`absolute text-[15rem] md:text-[35rem] font-black text-black opacity-[0.03] select-none pointer-events-none leading-none z-0 transition-all duration-1000 ease-out hidden lg:block ${
          isVisible ? 'translate-x-0' : (isEven ? 'translate-x-40' : '-translate-x-40')
        }`}
        style={{ 
            left: isEven ? '2%' : 'auto', 
            right: isEven ? 'auto' : '2%',
            transform: `translateY(${mousePos.y * 20}px) rotate(${mousePos.x * 5}deg)`
        }}
      >
        0{index + 1}
      </div>

      <div 
        className={`relative w-full max-w-6xl transition-all duration-1000 ease-out flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-10 lg:gap-0`}
        style={{
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? `translateY(0)` : `translateY(80px)`
        }}
      >
        {/* The "Case File" Folder / Visual Section */}
        <div 
            className="relative w-full lg:w-3/5 aspect-[4/3] md:aspect-video z-20 group"
            style={{ 
                transform: `rotateX(${mousePos.y * -5}deg) rotateY(${mousePos.x * 8}deg)`,
                transition: 'transform 0.3s ease-out'
            }}
        >
            {/* Folder Tab */}
            <div className={`absolute -top-8 ${isEven ? 'left-0' : 'right-0'} bg-black text-white px-8 py-2 font-black uppercase text-sm skew-x-[-15deg] border-t-4 border-x-4 border-black z-30`}>
                SCHEMA_ENTRY_{index + 1}
            </div>

            {/* Main Visual Frame */}
            <div className="absolute inset-0 bg-white border-[8px] border-black shadow-[20px_20px_0px_#000] md:shadow-[30px_30px_0px_#000] overflow-hidden transition-all duration-500">
                <img 
                    src={project.image} 
                    alt={project.title}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 scale-105 group-hover:scale-100"
                />
                
                {/* CRT / Scanline Overlay */}
                <div className="absolute inset-0 opacity-20 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,255,0,0.01),rgba(0,0,255,0.03))] bg-[length:100%_4px,4px_100%]"></div>
            </div>

            {/* Decorative elements */}
            <div className="absolute -bottom-6 -left-8 w-24 h-8 bg-[#FFD600] border-2 border-black rotate-6 pointer-events-none z-30 flex items-center justify-center font-black text-[10px] uppercase">VERIFIED</div>
        </div>

        {/* Content Section - Much clearer and stabilized */}
        <div 
            className={`w-full lg:w-[45%] flex flex-col p-6 md:p-10 z-30 lg:-mx-12 ${isEven ? 'lg:text-left' : 'lg:text-right lg:items-end'}`}
        >
            <div className="mb-6 flex items-center gap-3">
                {!isEven && <div className="hidden lg:block w-12 h-1 bg-black"></div>}
                <span className="font-black text-sm md:text-base uppercase tracking-[0.2em] text-[#FF4B4B] bg-white border-2 border-black px-3 py-1 shadow-[3px_3px_0px_#000]">
                    PROTOCOL {index + 1}
                </span>
                {isEven && <div className="hidden lg:block w-12 h-1 bg-black"></div>}
            </div>

            <h3 className="text-5xl md:text-7xl font-black uppercase leading-[0.9] tracking-tighter mb-8 break-words text-black">
                {project.title.split(' ').map((word, i) => (
                    <span key={i} className="block drop-shadow-[2px_2px_0px_white]">
                        {word}
                    </span>
                ))}
            </h3>

            <div className="bg-white border-[4px] border-black p-6 md:p-8 shadow-[10px_10px_0px_#000] mb-8 relative">
                <Scribble className="w-16 text-[#FFD600] -top-8 right-4 rotate-12" />
                <p className="text-xl md:text-2xl font-bold text-gray-900 leading-tight italic">
                    "{project.description}"
                </p>
            </div>

            <div className={`flex flex-wrap gap-2 mb-10 ${!isEven ? 'lg:justify-end' : ''}`}>
                {project.tags.map(tag => (
                    <span key={tag} className="bg-[#00A1FF] text-white px-3 py-1 font-black text-[10px] md:text-xs uppercase border-2 border-black shadow-[4px_4px_0px_#000]">
                        {tag}
                    </span>
                ))}
            </div>

            <a 
                href="#"
                onClick={(e) => e.preventDefault()}
                className="cartoon-btn bg-white group/btn flex items-center justify-center gap-4 px-10 py-6 font-black text-xl md:text-2xl uppercase tracking-tighter shadow-[12px_12px_0px_#000] border-[4px] border-black hover:bg-black hover:text-white transition-all active:translate-y-2 active:shadow-none"
            >
                OPEN PROJECT 
                <span className="text-3xl group-hover/btn:translate-x-2 transition-transform">→</span>
            </a>
        </div>
      </div>
    </div>
  );
};

const Projects: React.FC = () => {
  const [bgColor, setBgColor] = useState('#FFF9E6');

  return (
    <section 
      id="projects" 
      className="relative transition-colors duration-[1500ms] ease-in-out pb-24 overflow-x-hidden"
      style={{ backgroundColor: bgColor }}
    >
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
           style={{ backgroundImage: `linear-gradient(#000 2px, transparent 2px), linear-gradient(90deg, #000 2px, transparent 2px)`, 
                    backgroundSize: '100px 100px' }}>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
        <header className="py-20 md:py-32 text-center relative">
          <div className="inline-block relative">
            {/* Title - Increased z-index and added subtle stroke to ensure visibility over shadow */}
            <h2 className="text-7xl md:text-[14rem] font-black uppercase tracking-tighter leading-none mb-4 relative z-20 italic">
                W<span className="text-white" style={{ WebkitTextStroke: '3px black', textShadow: '10px 10px 0px #FF4B4B' }}>OR</span>KS
            </h2>
            
            {/* Background Block - Lowered z-index to avoid hiding text */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[115%] h-[45%] bg-[#FFD600] border-y-8 border-black -rotate-2 z-10 shadow-[25px_25px_0px_rgba(0,0,0,1)]"></div>
            
            {/* Floating Banner Badge */}
            <div className="absolute -top-12 -right-12 md:-top-20 md:-right-20 bg-black text-[#FFD600] px-6 py-4 border-4 border-[#FFD600] rotate-12 font-black uppercase text-xl md:text-3xl shadow-[8px_8px_0px_rgba(255,214,0,0.3)] animate-bounce z-30">
                EST. 2024
            </div>
          </div>

          <div className="mt-20 flex flex-col items-center">
             <div className="w-full max-w-xl h-1 bg-black mb-8 relative">
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-black rounded-full"></div>
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-black rounded-full"></div>
             </div>
             <p className="text-2xl md:text-4xl font-black uppercase tracking-tight max-w-3xl px-6 leading-tight">
                A Curated Collection of <span className="text-[#00A1FF] bg-white px-2">Algorithmic</span> Marvels and <span className="text-[#FF4B4B] bg-white px-2">Synthetic</span> Wonders.
             </p>
          </div>
        </header>

        <div className="space-y-10 md:space-y-16">
          {PROJECTS.map((project, index) => (
            <ProjectCard 
              key={project.id} 
              project={project} 
              index={index} 
              onVisible={(color) => setBgColor(`${color}10`)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
