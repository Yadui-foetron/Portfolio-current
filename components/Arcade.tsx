
import React, { useState, useEffect, useRef } from 'react';

const Arcade: React.FC = () => {
  const [gameState, setGameState] = useState<'START' | 'PLAYING' | 'GAMEOVER'>('START');
  const [score, setScore] = useState(0);
  const [playerX, setPlayerX] = useState(50);
  const [items, setItems] = useState<{ id: number, x: number, y: number, type: 'PROMPT' | 'BUG' }[]>([]);
  const gameRef = useRef<HTMLDivElement>(null);

  // Game Loop
  useEffect(() => {
    if (gameState !== 'PLAYING') return;

    const interval = setInterval(() => {
      setItems(prev => {
        // Move items down
        const moved = prev.map(item => ({ ...item, y: item.y + 2 }));
        
        // Remove off-screen items
        const filtered = moved.filter(item => item.y < 100);

        // Spawn new item
        if (Math.random() < 0.1) {
          filtered.push({
            id: Date.now() + Math.random(),
            x: Math.random() * 90,
            y: 0,
            type: Math.random() > 0.3 ? 'PROMPT' : 'BUG'
          });
        }

        // Collision Detection
        filtered.forEach((item, index) => {
          if (item.y > 80 && Math.abs(item.x - playerX) < 10) {
            if (item.type === 'PROMPT') {
              setScore(s => s + 10);
              filtered.splice(index, 1);
            } else {
              setGameState('GAMEOVER');
            }
          }
        });

        return filtered;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [gameState, playerX]);

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'ArrowLeft') setPlayerX(prev => Math.max(5, prev - 10));
    if (e.key === 'ArrowRight') setPlayerX(prev => Math.min(95, prev + 10));
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const startGame = () => {
    setScore(0);
    setItems([]);
    setPlayerX(50);
    setGameState('PLAYING');
  };

  return (
    <section className="py-32 px-6 bg-[#00A1FF] border-y-8 border-black flex flex-col items-center overflow-hidden">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter" style={{ WebkitTextStroke: '2px black', textShadow: '6px 6px 0px #000' }}>
            The Gadget-O-Matic
          </h2>
          <p className="text-2xl font-bold text-black mt-4 uppercase">Win tokens to power Manishi's next LLM!</p>
        </div>

        {/* Arcade Cabinet */}
        <div className="mx-auto w-full max-w-[500px] bg-[#222] border-[10px] border-black shadow-[20px_20px_0px_#000] rounded-t-[40px] relative">
          <div className="bg-[#444] h-12 rounded-t-[30px] border-b-4 border-black flex items-center justify-center gap-4">
             <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></div>
             <div className="w-3 h-3 rounded-full bg-yellow-500 animate-pulse" style={{ animationDelay: '0.2s' }}></div>
             <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" style={{ animationDelay: '0.4s' }}></div>
          </div>

          <div className="p-4 bg-[#333]">
            <div className="crt-screen aspect-square relative flex items-center justify-center">
              {gameState === 'START' && (
                <div className="text-center z-20">
                  <h3 className="text-white text-4xl font-black mb-6 animate-bounce">READY?</h3>
                  <button onClick={startGame} className="cartoon-btn bg-[#FFD600] px-8 py-3 font-black text-xl uppercase">Insert Coin</button>
                </div>
              )}

              {gameState === 'PLAYING' && (
                <div className="w-full h-full relative p-4">
                  <div className="absolute top-2 left-2 text-[#0f0] font-black text-xl">SCORE: {score}</div>
                  {/* Player */}
                  <div 
                    className="absolute bottom-4 w-12 h-12 transition-all duration-75"
                    style={{ left: `${playerX}%`, transform: 'translateX(-50%)' }}
                  >
                    <img src="https://api.dicebear.com/7.x/bottts/svg?seed=DoraemonRobot" className="w-full h-full" alt="Player" />
                  </div>
                  {/* Items */}
                  {items.map(item => (
                    <div 
                      key={item.id}
                      className="absolute w-8 h-8 transition-all duration-75"
                      style={{ left: `${item.x}%`, top: `${item.y}%` }}
                    >
                      {item.type === 'PROMPT' ? '⭐' : '👾'}
                    </div>
                  ))}
                </div>
              )}

              {gameState === 'GAMEOVER' && (
                <div className="text-center z-20">
                  <h3 className="text-red-500 text-4xl font-black mb-2">SYSTEM ERROR</h3>
                  <p className="text-white font-bold mb-6">FINAL SCORE: {score}</p>
                  <button onClick={startGame} className="cartoon-btn bg-white px-8 py-3 font-black text-xl uppercase">Try Again</button>
                </div>
              )}
            </div>
          </div>

          {/* Controls Panel */}
          <div className="bg-[#555] p-8 border-t-[10px] border-black flex items-center justify-between">
            <div className="flex gap-4">
              <div className="w-16 h-16 bg-red-600 border-4 border-black rounded-full shadow-[inset_4px_4px_10px_rgba(0,0,0,0.5)] active:translate-y-2 active:shadow-none transition-all"></div>
              <div className="w-16 h-16 bg-yellow-500 border-4 border-black rounded-full shadow-[inset_4px_4px_10px_rgba(0,0,0,0.5)] active:translate-y-2 active:shadow-none transition-all"></div>
            </div>
            <div className="w-20 h-20 bg-[#222] rounded-full border-4 border-black flex items-center justify-center">
              <div className="w-10 h-10 bg-[#FFD600] rounded-full border-2 border-black"></div>
            </div>
          </div>
        </div>
        
        <div className="text-center mt-12">
          <p className="text-black font-black uppercase text-xl">Use Left/Right Arrows or Click the Machine!</p>
        </div>
      </div>
    </section>
  );
};

export default Arcade;
