
import React, { useState, useEffect } from 'react';

const Footer: React.FC = () => {
  const [time, setTime] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date().toLocaleTimeString()), 1000);
    return () => clearInterval(timer);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <footer className="bg-black text-white pt-32 pb-12 px-6 relative overflow-hidden border-t-8 border-black">
      {/* Background oversized name */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[18vw] font-black text-white/5 uppercase select-none pointer-events-none whitespace-nowrap">
        MANISHI YADAV
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-32">
          {/* Brand Col */}
          <div className="lg:col-span-2">
            <h2 className="text-5xl md:text-8xl font-black uppercase tracking-tighter mb-8 leading-none">
              Let's build <br /> <span className="text-[#FFD600]">Future Tech</span>
            </h2>
            <div className="flex gap-4 items-center">
              <div className="w-4 h-4 rounded-full bg-green-500 animate-pulse"></div>
              <span className="font-black uppercase tracking-widest text-gray-400">Available for innovative gadgets</span>
            </div>
          </div>

          {/* Links Col */}
          <div>
            <h4 className="text-xl font-black uppercase mb-8 text-[#FF4B4B]">Navigation</h4>
            <ul className="space-y-4 text-2xl font-bold">
              <li><a href="#about" className="hover:text-[#FFD600] transition-colors underline decoration-2">Mission</a></li>
              <li><a href="#projects" className="hover:text-[#FFD600] transition-colors underline decoration-2">Lab Artifacts</a></li>
              <li><a href="#skills" className="hover:text-[#FFD600] transition-colors underline decoration-2">Neural Stats</a></li>
              <li><a href="mailto:monty.my1234@gmail.com" className="hover:text-[#FFD600] transition-colors underline decoration-2">Contact</a></li>
            </ul>
          </div>

          {/* Contact Col */}
          <div>
            <h4 className="text-xl font-black uppercase mb-8 text-[#00A1FF]">Digital Space</h4>
            <ul className="space-y-4 text-2xl font-bold">
              <li><a href="#" className="hover:line-through transition-all">GitHub</a></li>
              <li><a href="#" className="hover:line-through transition-all">Twitter / X</a></li>
              <li><a href="#" className="hover:line-through transition-all">LinkedIn</a></li>
              <li><a href="#" className="hover:line-through transition-all">Dribbble</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-12 border-t border-white/20 flex flex-col md:flex-row justify-between items-end gap-12">
          <div className="flex flex-col gap-2">
            <span className="text-gray-500 font-black uppercase tracking-[0.3em] text-xs">Based in Planet Earth</span>
            <div className="text-3xl font-black">{time}</div>
          </div>

          <div className="text-center md:text-right">
            <div className="text-xs font-black uppercase tracking-[0.2em] text-gray-500 mb-4">Crafted with Action Bastion Energy</div>
            <div className="text-xl font-black uppercase">© {new Date().getFullYear()} MANISHI YADAV — NO BUGS ALLOWED</div>
          </div>

          <button 
            onClick={scrollToTop}
            className="cartoon-btn w-20 h-20 bg-white text-black flex items-center justify-center group"
          >
            <span className="text-4xl group-hover:-translate-y-2 transition-transform">↑</span>
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
