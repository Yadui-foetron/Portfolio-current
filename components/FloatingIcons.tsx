
import React from 'react';

const FloatingIcons: React.FC = () => {
  // Characters that move/float
  const muralCharacters = [
    { id: 'shinchan-1', url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Shinchan&backgroundColor=FFD600', x: '2%', y: '10%', size: '300px', rotate: '-15deg', opacity: 0.15, delay: '0s' },
    { id: 'doraemon-1', url: 'https://api.dicebear.com/7.x/bottts/svg?seed=Doraemon&backgroundColor=00A1FF', x: '80%', y: '15%', size: '350px', rotate: '12deg', opacity: 0.12, delay: '2s' },
    { id: 'action-bastion', url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=ActionBastion&backgroundColor=FF4B4B', x: '5%', y: '45%', size: '280px', rotate: '5deg', opacity: 0.1, delay: '4s' },
    { id: 'buriburi', url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=BuriBuri&backgroundColor=FFD600', x: '85%', y: '50%', size: '250px', rotate: '-8deg', opacity: 0.15, delay: '1s' },
    { id: 'ninja-hattori', url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Ninja&backgroundColor=6B4BFF', x: '10%', y: '80%', size: '320px', rotate: '10deg', opacity: 0.12, delay: '3s' },
    { id: 'gadget-cat', url: 'https://api.dicebear.com/7.x/bottts/svg?seed=Gadget1&backgroundColor=00A1FF', x: '75%', y: '85%', size: '280px', rotate: '-12deg', opacity: 0.1, delay: '5s' },
  ];

  // Static "Printed" Character Stamps
  const stamps = [
    { seed: 'Hero1', x: '15%', y: '25%' }, { seed: 'Robot', x: '65%', y: '35%' },
    { seed: 'Funny', x: '45%', y: '5%' }, { seed: 'Nerd', x: '35%', y: '55%' },
    { seed: 'Cool', x: '75%', y: '65%' }, { seed: 'Ninja2', x: '55%', y: '85%' },
    { seed: 'Cat', x: '25%', y: '75%' }, { seed: 'Boy', x: '90%', y: '95%' },
    { seed: 'Star', x: '5%', y: '60%' }, { seed: 'Whiz', x: '95%', y: '10%' },
    { seed: 'Gadget2', x: '50%', y: '30%' }, { seed: 'Zap', x: '10%', y: '90%' },
    { seed: 'Pop', x: '88%', y: '40%' }, { seed: 'Bam', x: '30%', y: '15%' },
    { seed: 'Art', x: '70%', y: '75%' }, { seed: 'Meow', x: '20%', y: '40%' },
  ];

  const actionText = [
    { text: 'POW!', x: '12%', y: '18%', rotate: '-15deg' },
    { text: 'BAM!', x: '78%', y: '42%', rotate: '12deg' },
    { text: 'ZAP!', x: '45%', y: '82%', rotate: '-8deg' },
    { text: 'WHAM!', x: '25%', y: '62%', rotate: '15deg' },
  ];

  return (
    <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden bg-[#FFF9E6]">
      {/* Base Patterns */}
      <div className="absolute inset-0 halftone-bg opacity-20"></div>
      <div className="absolute inset-0 bg-[radial-gradient(#000_1px,transparent_0)] bg-[size:40px_40px] opacity-[0.05]"></div>
      
      {/* Mural Stamped Layer (Very subtle, like printed wallpaper) */}
      {stamps.map((stamp, i) => (
        <div 
          key={i} 
          className="absolute grayscale opacity-[0.04] saturate-0"
          style={{ left: stamp.x, top: stamp.y, width: '150px', height: '150px' }}
        >
          <img 
            src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${stamp.seed}`} 
            alt="stamp" 
            className="w-full h-full object-contain"
          />
        </div>
      ))}

      {/* Action Text Stamps */}
      {actionText.map((item, i) => (
        <div 
          key={i} 
          className="absolute font-black text-6xl md:text-9xl text-black/5 select-none"
          style={{ left: item.x, top: item.y, transform: `rotate(${item.rotate})` }}
        >
          {item.text}
        </div>
      ))}

      {/* Floating Interactive Characters */}
      {muralCharacters.map((char) => (
        <div
          key={char.id}
          className="absolute floating select-none transition-all duration-1000"
          style={{
            left: char.x,
            top: char.y,
            width: char.size,
            height: char.size,
            opacity: char.opacity,
            transform: `rotate(${char.rotate})`,
            animationDelay: char.delay,
          }}
        >
          <img 
            src={char.url} 
            alt={char.id} 
            className="w-full h-full object-contain filter contrast-[0.8]"
          />
        </div>
      ))}

      {/* Neubrutalist Decorative Lines */}
      <div className="absolute left-[8%] top-0 bottom-0 w-[2px] bg-black/5"></div>
      <div className="absolute right-[8%] top-0 bottom-0 w-[2px] bg-black/5"></div>
    </div>
  );
};

export default FloatingIcons;
