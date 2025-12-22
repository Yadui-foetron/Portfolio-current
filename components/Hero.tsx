
import React from 'react';

const Hero: React.FC = () => {
  return (
    <section className="min-h-screen pt-40 pb-20 px-6 flex flex-col items-center justify-center relative overflow-hidden bg-[#FFF9E6]">
      <div className="max-w-6xl w-full text-center z-10">
        <div className="inline-block bg-[#FF4B4B] text-white px-6 py-2 text-lg font-black cartoon-btn mb-10 rotate-[-2deg] shadow-[4px_4px_0px_#000] cursor-default">
          HI! I'M MANISHI YADAV
        </div>
        
        <h1 className="text-6xl md:text-[10rem] font-black leading-none mb-10 uppercase tracking-tighter">
          GEN AI <br />
          <span 
            className="text-[#00A1FF] hover:scale-105 transition-transform inline-block cursor-pointer" 
            style={{ WebkitTextStroke: '4px black', textShadow: '12px 12px 0px #000' }}
          >
            ENGINEER
          </span>
        </h1>
        
        <p className="max-w-3xl mx-auto text-xl md:text-3xl font-bold mb-16 text-gray-800 leading-tight">
          Crafting 22nd-century AI gadgets with <br />
          <span className="bg-[#FFD600] border-2 border-black px-2">Action Bastion</span> energy & Doraemon's precision.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
          <a href="#projects" className="cartoon-btn bg-[#FFD600] text-black text-2xl font-black px-12 py-6 uppercase no-underline">
            View My Lab 🔬
          </a>
          <a href="mailto:monty.my1234@gmail.com" className="cartoon-btn bg-white text-black text-2xl font-black px-12 py-6 uppercase no-underline">
            Let's Collaborate
          </a>
        </div>
      </div>
      
      {/* Decorative bouncy icons */}
      <div className="absolute top-[20%] left-[8%] w-32 h-32 bouncy hidden lg:block">
        <img src="https://api.dicebear.com/7.x/adventurer/svg?seed=Shinchan&backgroundColor=FFD600" alt="Shinchan" className="w-full h-full object-contain filter drop-shadow-lg" />
      </div>
      <div className="absolute top-[25%] right-[8%] w-40 h-40 bouncy hidden lg:block" style={{ animationDelay: '1.5s' }}>
        <img src="https://api.dicebear.com/7.x/bottts/svg?seed=Doraemon&backgroundColor=00A1FF" alt="Doraemon" className="w-full h-full object-contain filter drop-shadow-lg" />
      </div>
    </section>
  );
};

export default Hero;
