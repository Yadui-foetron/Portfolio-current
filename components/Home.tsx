import React, { useEffect } from 'react';
import Hero from './Hero';
import Projects from './Projects';
import Skills from './Skills';
import Arcade from './Arcade';
import Achievements from './Achievements';
import ContactForm from './ContactForm';

interface HomeProps {
    targetSection: string | null;
    setTargetSection: (section: string | null) => void;
}

const Home: React.FC<HomeProps> = ({ targetSection, setTargetSection }) => {

    useEffect(() => {
        if (targetSection) {
            const timer = setTimeout(() => {
                const element = document.getElementById(targetSection);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                    setTargetSection(null);
                }
            }, 100);
            return () => clearTimeout(timer);
        }
    }, [targetSection, setTargetSection]);

    return (
        <>
            <Hero />
            
            <section id="about" className="pt-20 pb-0 px-6 bg-white/40 backdrop-blur-[2px] border-t-8 border-black relative z-10 overflow-hidden">
                <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-16 pb-0">
                <div className="w-full md:w-1/3 aspect-square cartoon-border overflow-hidden rotate-[-3deg] hover:rotate-0 transition-transform bg-[#FF4B4B] border-4 border-black shadow-[8px_8px_0px_#000]">
                    <img src="https://api.dicebear.com/7.x/adventurer/svg?seed=ManishiYadav&backgroundColor=FF4B4B" alt="Manishi Yadav" className="w-full h-full scale-110" />
                </div>
                <div className="flex-1 pb-16 md:pb-20">
                    <div className="inline-block px-6 py-2 bg-yellow-400 border-4 border-black font-black uppercase text-xl mb-8 transform -rotate-1">
                    The Architect
                    </div>
                    <p className="text-3xl md:text-5xl font-black leading-tight mb-8">
                    I build machines that <span className="text-blue-600 underline decoration-8">imagine</span> things.
                    </p>
                    <p className="text-xl md:text-2xl font-medium text-gray-800 leading-relaxed">
                    Manishi Yadav here! Based in the digital clouds. I turn complex neural architectures into playful, robust tools that feel as intuitive as Doraemon's magic pocket gadgets.
                    </p>
                </div>
                </div>
            </section>

            <Projects />
            
            <div className="bg-[#FFD600]/40 backdrop-blur-sm border-y-8 border-black">
                <Achievements />
            </div>

            <div className="bg-[#00A1FF]/40 backdrop-blur-sm">
                <Skills />
            </div>

            <Arcade />

            <section id="contact-banner" className="py-24 px-6 text-center bg-[#FF4B4B]/80 backdrop-blur-lg relative z-10 border-t-8 border-black text-white">
                <div className="max-w-6xl mx-auto">
                <h2 className="text-4xl md:text-6xl font-black uppercase mb-12 leading-none tracking-tighter">
                    Deploy <br /> <span className="text-[#FFD600]" style={{ WebkitTextStroke: '2px black' }}>With Me</span>
                </h2>
                
                <ContactForm />

                <div className="mt-20 flex flex-wrap justify-center gap-8 text-black font-black uppercase">
                    <div className="bg-white border-4 border-black px-6 py-2 rotate-1">Available 24/7</div>
                    <div className="bg-[#FFD600] border-4 border-black px-6 py-2 -rotate-1">Action Bastion Energy</div>
                    <div className="bg-[#00A1FF] text-white border-4 border-black px-6 py-2 rotate-2">22nd Century Tech</div>
                </div>
                </div>
            </section>
        </>
    );
};

export default Home;
