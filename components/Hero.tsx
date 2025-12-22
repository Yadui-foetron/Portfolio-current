
import React from 'react';

const Hero: React.FC = () => {
  return (
    <section className="min-h-[85vh] md:min-h-screen pt-16 md:pt-24 pb-6 px-4 md:px-6 flex flex-col items-center justify-center relative overflow-hidden bg-transparent">
      <div className="max-w-6xl w-full text-center z-10">
        <div className="inline-block bg-[#FF4B4B] text-white px-4 md:px-6 py-2 text-sm md:text-base font-black cartoon-btn mb-4 md:mb-6 rotate-[-2deg] shadow-[4px_4px_0px_#000] cursor-default">
          HI! I'M MANISHI YADAV
        </div>
        
        <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-[7rem] font-black leading-[0.9] mb-4 md:mb-6 uppercase tracking-tighter break-words">
          GEN AI <br className="hidden sm:block" />
          <span 
            className="text-[#00A1FF] hover:scale-105 transition-transform inline-block cursor-pointer px-2" 
            style={{ WebkitTextStroke: '2px black', textShadow: '4px 4px 0px #000' }}
          >
            ENGINEER
          </span>
        </h1>
        
        <p className="max-w-2xl mx-auto text-base md:text-xl lg:text-2xl font-bold mb-6 md:mb-8 text-gray-800 leading-tight px-4">
          Crafting 22nd-century AI gadgets with <br className="hidden md:block" />
          <span className="bg-[#FFD600] border-2 border-black px-2 inline-block my-1">Action Bastion</span> energy & Doraemon's precision.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6 px-6">
          <a href="#projects" className="cartoon-btn bg-[#FFD600] text-black text-base md:text-xl font-black px-8 md:px-10 py-3 md:py-4 uppercase no-underline w-full sm:w-auto">
            View My Lab 🔬
          </a>
          <a href="mailto:monty.my1234@gmail.com" className="cartoon-btn bg-white text-black text-base md:text-xl font-black px-8 md:px-10 py-3 md:py-4 uppercase no-underline w-full sm:w-auto">
            Collaborate
          </a>
        </div>
      </div>
      
      {/* Foreground decorative icons */}
      <div className="absolute top-[10%] left-[5%] w-16 h-16 md:w-24 md:h-24 floating opacity-20 md:opacity-60 z-20">
        <img src="https://api.dicebear.com/7.x/adventurer/svg?seed=Shinchan&backgroundColor=FFD600" alt="Shinchan" className="w-full h-full object-contain filter drop-shadow-lg" />
      </div>
      <div className="absolute top-[15%] right-[5%] w-20 h-20 md:w-32 md:h-32 floating opacity-20 md:opacity-60 z-20" style={{ animationDelay: '1.5s' }}>
        <img src="https://api.dicebear.com/7.x/bottts/svg?seed=Doraemon&backgroundColor=00A1FF" alt="Doraemon" className="w-full h-full object-contain filter drop-shadow-lg" />
      </div>
    </section>
  );
};

export default Hero;
