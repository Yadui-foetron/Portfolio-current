
import React, { useState, useEffect, useRef, useCallback } from 'react';

type GameType = 'RACER' | 'SNAKE' | 'PACMAN' | 'COLLECTOR';

const Arcade: React.FC = () => {
  const [activeGame, setActiveGame] = useState<GameType>('RACER');
  const [isBooting, setIsBooting] = useState(false);
  const [gameState, setGameState] = useState<'START' | 'PLAYING' | 'GAMEOVER'>('START');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  
  // Controls
  const [moveDir, setMoveDir] = useState<{ x: number, y: number }>({ x: 0, y: 0 });
  const lastDirRef = useRef({ x: 0, y: 0 });

  // Common State
  const [entities, setEntities] = useState<any[]>([]);
  const [playerPos, setPlayerPos] = useState({ x: 50, y: 50 });
  const [speed, setSpeed] = useState(1);

  const requestRef = useRef<number>(null);
  const frameCountRef = useRef<number>(0);

  // Switching Logic
  const switchGame = (type: GameType) => {
    if (activeGame === type || isBooting) return;
    setIsBooting(true);
    setGameState('START');
    setTimeout(() => {
      setActiveGame(type);
      setIsBooting(false);
    }, 800);
  };

  // Game Initializers
  const startGame = () => {
    setScore(0);
    setGameState('PLAYING');
    setSpeed(1);
    frameCountRef.current = 0;
    lastDirRef.current = { x: 0, y: 0 };

    if (activeGame === 'RACER') {
      setPlayerPos({ x: 50, y: 80 });
      setEntities([]);
      setMoveDir({ x: 0, y: 0 });
    } else if (activeGame === 'SNAKE') {
      setPlayerPos({ x: 50, y: 50 });
      setMoveDir({ x: 5, y: 0 });
      setEntities([{ x: 45, y: 50 }, { x: 40, y: 50 }, { x: 80, y: 50, type: 'FOOD' }]); // Body + Food
    } else if (activeGame === 'PACMAN') {
      setPlayerPos({ x: 50, y: 80 });
      setMoveDir({ x: 0, y: 0 });
      // Initialize dots properly
      const dots = [...Array(15)].map(() => ({ 
        id: Math.random(),
        x: 15 + Math.random() * 70, 
        y: 15 + Math.random() * 70, 
        type: 'DOT' 
      }));
      setEntities([
        ...dots,
        { id: 'ghost', x: 50, y: 20, type: 'GHOST' }
      ]);
    } else if (activeGame === 'COLLECTOR') {
      setPlayerPos({ x: 50, y: 85 });
      setEntities([]);
      setMoveDir({ x: 0, y: 0 });
    }
  };

  // Unified Engine
  useEffect(() => {
    if (gameState !== 'PLAYING') return;

    const update = () => {
      frameCountRef.current++;

      if (activeGame === 'RACER') {
        setPlayerPos(prev => ({ ...prev, x: Math.max(15, Math.min(85, prev.x + (moveDir.x * 2))) }));
        setEntities(prev => {
          const moved = prev.map(e => ({ ...e, y: e.y + (3 + speed) }));
          const filtered = moved.filter(e => e.y < 110);
          if (Math.random() < 0.08 && frameCountRef.current % 10 === 0) {
            filtered.push({ id: Math.random(), x: 20 + Math.random() * 60, y: -10, type: Math.random() > 0.3 ? 'BUG' : 'COIN' });
          }
          filtered.forEach((e, i) => {
            if (e.y > 75 && e.y < 95 && Math.abs(e.x - playerPos.x) < 8) {
              if (e.type === 'COIN') { setScore(s => s + 100); filtered.splice(i, 1); }
              else { setGameState('GAMEOVER'); }
            }
          });
          return filtered;
        });
        setSpeed(s => Math.min(8, s + 0.002));
      } 
      
      else if (activeGame === 'SNAKE') {
        const snakeSpeed = Math.max(2, 12 - Math.floor(score / 3));
        if (frameCountRef.current % snakeSpeed === 0) {
          setPlayerPos(prevHead => {
            const nextHead = { x: prevHead.x + moveDir.x, y: prevHead.y + moveDir.y };
            
            if (nextHead.x < 0 || nextHead.x > 95 || nextHead.y < 0 || nextHead.y > 95) {
              setGameState('GAMEOVER');
              return prevHead;
            }

            setEntities(currentEntities => {
              const body = currentEntities.filter(e => !e.type);
              const food = currentEntities.find(e => e.type === 'FOOD');
              
              if (body.some(segment => Math.abs(segment.x - nextHead.x) < 2 && Math.abs(segment.y - nextHead.y) < 2)) {
                setGameState('GAMEOVER');
                return currentEntities;
              }

              if (food && Math.abs(food.x - nextHead.x) < 6 && Math.abs(food.y - nextHead.y) < 6) {
                setScore(s => s + 1);
                const newFood = { x: 10 + Math.random() * 80, y: 10 + Math.random() * 80, type: 'FOOD' };
                return [prevHead, ...body, newFood];
              }

              return [prevHead, ...body.slice(0, -1), food];
            });
            return nextHead;
          });
        }
      }

      else if (activeGame === 'PACMAN') {
        setPlayerPos(prev => ({ 
          x: Math.max(5, Math.min(95, prev.x + moveDir.x * 1.5)), 
          y: Math.max(5, Math.min(95, prev.y + moveDir.y * 1.5)) 
        }));
        
        setEntities(prev => {
          const nextEntities = prev.map(e => {
            if (e.type === 'GHOST') {
              const dx = playerPos.x - e.x;
              const dy = playerPos.y - e.y;
              const angle = Math.atan2(dy, dx);
              const nextGhost = { ...e, x: e.x + Math.cos(angle) * 0.7, y: e.y + Math.sin(angle) * 0.7 };
              
              if (Math.abs(nextGhost.x - playerPos.x) < 5 && Math.abs(nextGhost.y - playerPos.y) < 5) {
                setGameState('GAMEOVER');
              }
              return nextGhost;
            }
            return e;
          });

          const dotsRemaining = nextEntities.filter(e => {
            if (e.type === 'DOT') {
              const hit = Math.abs(e.x - playerPos.x) < 5 && Math.abs(e.y - playerPos.y) < 5;
              if (hit) setScore(s => s + 10);
              return !hit;
            }
            return true;
          });

          if (dotsRemaining.filter(e => e.type === 'DOT').length === 0) {
            setScore(s => s + 500);
            return [
              ...[...Array(15)].map(() => ({ id: Math.random(), x: 15 + Math.random() * 70, y: 15 + Math.random() * 70, type: 'DOT' })),
              dotsRemaining.find(e => e.type === 'GHOST')
            ];
          }
          return dotsRemaining;
        });
      }

      else if (activeGame === 'COLLECTOR') {
        setPlayerPos(prev => ({ ...prev, x: Math.max(10, Math.min(90, prev.x + moveDir.x * 2.5)) }));
        setEntities(prev => {
          const moved = prev.map(e => ({ ...e, y: e.y + (2 + speed * 0.5) }));
          const filtered = moved.filter(e => e.y < 105);
          if (Math.random() < 0.05 && frameCountRef.current % 15 === 0) {
            filtered.push({ id: Math.random(), x: 10 + Math.random() * 80, y: -5, type: Math.random() > 0.2 ? 'GADGET' : 'GHOST' });
          }
          filtered.forEach((e, i) => {
            if (e.y > 80 && e.y < 95 && Math.abs(e.x - playerPos.x) < 10) {
              if (e.type === 'GADGET') { setScore(s => s + 100); filtered.splice(i, 1); }
              else { setGameState('GAMEOVER'); }
            }
          });
          return filtered;
        });
        setSpeed(s => Math.min(10, s + 0.005));
      }

      requestRef.current = requestAnimationFrame(update);
    };

    requestRef.current = requestAnimationFrame(update);
    return () => cancelAnimationFrame(requestRef.current!);
  }, [gameState, activeGame, moveDir, playerPos, speed, entities, score]);

  // Input Handling
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState !== 'PLAYING') return;

      if (activeGame === 'SNAKE') {
        if (e.key === 'ArrowLeft' && moveDir.x === 0) setMoveDir({ x: -5, y: 0 });
        if (e.key === 'ArrowRight' && moveDir.x === 0) setMoveDir({ x: 5, y: 0 });
        if (e.key === 'ArrowUp' && moveDir.y === 0) setMoveDir({ x: 0, y: -5 });
        if (e.key === 'ArrowDown' && moveDir.y === 0) setMoveDir({ x: 0, y: 5 });
      } else {
        if (e.key === 'ArrowLeft') setMoveDir({ x: -1, y: 0 });
        if (e.key === 'ArrowRight') setMoveDir({ x: 1, y: 0 });
        if (e.key === 'ArrowUp') setMoveDir({ x: 0, y: -1 });
        if (e.key === 'ArrowDown') setMoveDir({ x: 0, y: 1 });
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (activeGame !== 'SNAKE') {
        if (['ArrowLeft', 'ArrowRight'].includes(e.key)) setMoveDir(prev => ({ ...prev, x: 0 }));
        if (['ArrowUp', 'ArrowDown'].includes(e.key)) setMoveDir(prev => ({ ...prev, y: 0 }));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [gameState, activeGame, moveDir]);

  useEffect(() => {
    if (score > highScore) setHighScore(score);
  }, [score, highScore]);

  const GameVisuals = () => {
    if (activeGame === 'RACER') {
      return (
        <div className="w-full h-full bg-[#1e293b] relative overflow-hidden">
          {/* Road Lines Animation */}
          <div className="absolute inset-0 z-0">
            <div 
              className="absolute left-1/2 -translate-x-1/2 w-2 h-[200%] flex flex-col gap-16 opacity-40" 
              style={{ 
                animation: `roadMove ${0.6/speed}s linear infinite`,
                backgroundImage: 'linear-gradient(to bottom, white 50%, transparent 50%)',
                backgroundSize: '100% 64px'
              }}
            ></div>
          </div>
          <div className="absolute left-[5%] w-2 h-full bg-gray-600/50"></div>
          <div className="absolute right-[5%] w-2 h-full bg-gray-600/50"></div>
          
          <div className="absolute bottom-10 w-12 h-16 bg-[#00A1FF] border-2 border-black rounded shadow-[3px_3px_0px_#000] z-20 flex flex-col items-center justify-start p-1" style={{ left: `${playerPos.x}%`, transform: 'translateX(-50%)' }}>
             <div className="w-8 h-4 bg-white/30 rounded-sm"></div>
             <div className="w-full h-1 bg-blue-400 mt-2"></div>
             <div className="flex justify-between w-full mt-auto mb-1">
                <div className="w-2 h-2 bg-yellow-400"></div>
                <div className="w-2 h-2 bg-yellow-400"></div>
             </div>
          </div>
          {entities.map(e => (
            <div key={e.id} className="absolute text-2xl z-10" style={{ left: `${e.x}%`, top: `${e.y}%`, transform: 'translate(-50%, -50%)' }}>
              {e.type === 'BUG' ? '👾' : '🔋'}
            </div>
          ))}
        </div>
      );
    }
    if (activeGame === 'SNAKE') {
      return (
        <div className="w-full h-full bg-black relative border-4 border-green-900/40">
          <div className="absolute w-4 h-4 bg-green-400 border border-black z-30" style={{ left: `${playerPos.x}%`, top: `${playerPos.y}%` }}></div>
          {entities.map((ent, i) => (
            <div key={i} className={`absolute ${ent.type === 'FOOD' ? 'w-5 h-5 bg-red-500 animate-pulse rounded-full border border-white' : 'w-4 h-4 bg-green-700 opacity-60 border border-black'}`} 
                 style={{ left: `${ent.x}%`, top: `${ent.y}%` }}>
            </div>
          ))}
        </div>
      );
    }
    if (activeGame === 'PACMAN') {
      return (
        <div className="w-full h-full bg-[#000033] relative border-4 border-blue-900/50 overflow-hidden">
          <div className="absolute text-3xl z-30 transition-all duration-75" 
               style={{ left: `${playerPos.x}%`, top: `${playerPos.y}%`, transform: `translate(-50%, -50%) rotate(${moveDir.x > 0 ? 0 : moveDir.x < 0 ? 180 : moveDir.y > 0 ? 90 : -90}deg)` }}>
            🟡
          </div>
          {entities.map((e, i) => (
            <div key={i} className={`absolute flex items-center justify-center ${e.type === 'GHOST' ? 'text-2xl animate-bounce' : 'w-3 h-3 bg-yellow-100 rounded-full shadow-[0_0_8px_white]'}`}
                 style={{ left: `${e.x}%`, top: `${e.y}%`, transform: 'translate(-50%, -50%)' }}>
              {e.type === 'GHOST' ? '👻' : ''}
            </div>
          ))}
        </div>
      );
    }
    if (activeGame === 'COLLECTOR') {
      return (
        <div className="w-full h-full bg-[#FFF9E6] relative overflow-hidden">
          <div className="absolute bottom-6 w-16 h-16 z-20" style={{ left: `${playerPos.x}%`, transform: 'translateX(-50%)' }}>
            <img src="https://api.dicebear.com/7.x/adventurer/svg?seed=Shinchan" className="w-full h-full drop-shadow-md" alt="Player" />
          </div>
          {entities.map(e => (
            <div key={e.id} className="absolute text-3xl z-10" style={{ left: `${e.x}%`, top: `${e.y}%`, transform: 'translate(-50%, -50%)' }}>
              {e.type === 'GADGET' ? '🚁' : '👹'}
            </div>
          ))}
          <div className="absolute bottom-0 w-full h-4 bg-black/10"></div>
        </div>
      );
    }
    return null;
  };

  return (
    <section className="py-24 px-4 bg-[#FFD600] border-y-8 border-black flex flex-col items-center overflow-hidden relative">
      <div className="absolute inset-0 halftone-bg opacity-10 pointer-events-none"></div>
      
      <div className="max-w-6xl w-full flex flex-col lg:flex-row items-center justify-center gap-16 relative z-10">
        
        <div className="flex lg:flex-col gap-4 order-2 lg:order-1">
          <div className="bg-black text-white px-4 py-2 font-black text-xs uppercase mb-2 text-center lg:block hidden">System Menu</div>
          {(['RACER', 'SNAKE', 'PACMAN', 'COLLECTOR'] as GameType[]).map(type => (
            <button 
              key={type}
              onClick={() => switchGame(type)}
              className={`cartoon-btn px-6 py-4 font-black text-sm uppercase transition-all duration-300 min-w-[140px] ${activeGame === type ? 'bg-[#FF4B4B] text-white -translate-x-2' : 'bg-white text-black hover:bg-gray-100'}`}
            >
              {type === 'RACER' && '🏎️ Racer'}
              {type === 'SNAKE' && '🐍 Snake'}
              {type === 'PACMAN' && '🟡 Pacman'}
              {type === 'COLLECTOR' && '🚁 Gadget'}
            </button>
          ))}
        </div>

        <div className="w-full max-w-[480px] order-1 lg:order-2 perspective-1000">
          <div className="bg-[#1A1A1A] border-[10px] border-black shadow-[25px_25px_0px_#000] rounded-t-[60px] overflow-hidden relative">
            <div className="bg-[#333] h-14 border-b-8 border-black flex items-center justify-between px-10">
              <div className="text-[#FFD600] font-black italic text-lg tracking-tighter uppercase">NEURAL_ARCADE v4.2</div>
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
            </div>

            <div className="p-4 bg-[#222]">
              <div className="crt-screen aspect-[4/5] relative bg-[#000] rounded-2xl border-4 border-[#333] overflow-hidden">
                {isBooting ? (
                  <div className="absolute inset-0 bg-black flex flex-col items-center justify-center p-8 z-[60]">
                    <div className="text-[#0f0] font-mono text-xs w-full overflow-hidden whitespace-nowrap animate-typing">
                      {'>'} INIT SECTOR 0xFF...<br/>
                      {'>'} ALLOCATING SPRITES...<br/>
                      {'>'} SYNCING INPUT...
                    </div>
                    <div className="w-full bg-gray-900 h-1.5 mt-8 overflow-hidden">
                       <div className="bg-[#0f0] h-full animate-[progress_0.8s_ease-in-out]"></div>
                    </div>
                  </div>
                ) : (
                  <>
                    {gameState === 'START' && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center z-30 bg-black/40 backdrop-blur-[2px]">
                        <div className="text-7xl mb-6 floating drop-shadow-[0_0_15px_white]">
                          {activeGame === 'RACER' && '🏎️'}
                          {activeGame === 'SNAKE' && '🐍'}
                          {activeGame === 'PACMAN' && '🟡'}
                          {activeGame === 'COLLECTOR' && '🚁'}
                        </div>
                        <h3 className="text-white text-4xl font-black mb-1 italic uppercase tracking-tighter" style={{ WebkitTextStroke: '1px black' }}>{activeGame}</h3>
                        <p className="text-[#FFD600] font-black uppercase text-xs mb-10 tracking-[0.3em]">Insert Emotion to Start</p>
                        <button 
                          onClick={startGame}
                          className="cartoon-btn bg-[#FF4B4B] text-white px-12 py-5 font-black text-2xl uppercase shadow-[6px_6px_0px_#000] hover:scale-105"
                        >
                          PUSH START
                        </button>
                      </div>
                    )}

                    {gameState === 'PLAYING' && (
                      <div className="w-full h-full relative">
                        <div className="absolute top-4 left-4 z-40 bg-black/80 border-2 border-[#FFD600] px-3 py-1 text-[#FFD600] font-black text-xs uppercase tracking-widest shadow-lg">
                          HI: {highScore} | SC: {score}
                        </div>
                        <GameVisuals />
                      </div>
                    )}

                    {gameState === 'GAMEOVER' && (
                      <div className="absolute inset-0 bg-red-950/90 backdrop-blur-md flex flex-col items-center justify-center p-8 text-center z-50">
                        <div className="text-6xl mb-4">💥</div>
                        <h3 className="text-white text-5xl font-black mb-2 italic tracking-tighter uppercase">REBOOT!</h3>
                        <p className="text-[#FFD600] text-2xl font-black mb-10 uppercase tracking-widest">Score: {score}</p>
                        <button 
                          onClick={startGame}
                          className="cartoon-btn bg-white text-black px-12 py-5 font-black text-2xl uppercase hover:bg-[#FFD600]"
                        >
                          TRY AGAIN
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

            <div className="bg-[#444] px-8 pt-10 pb-12 border-t-[10px] border-black shadow-[inset_0px_10px_30px_rgba(0,0,0,0.6)] relative overflow-hidden">
              <div className="flex items-center justify-between gap-8 relative z-10">
                <div className="relative w-36 h-36 flex items-center justify-center">
                   <div className="absolute w-12 h-32 bg-[#222] border-4 border-black rounded-lg"></div>
                   <div className="absolute w-32 h-12 bg-[#222] border-4 border-black rounded-lg"></div>
                   
                   <button 
                      onMouseDown={() => {
                        if (activeGame === 'SNAKE' && moveDir.y === 0) setMoveDir({x: 0, y: -5});
                        else if (activeGame !== 'SNAKE') setMoveDir({x: 0, y: -1});
                      }}
                      className="absolute top-1 w-10 h-10 flex items-center justify-center text-white text-xl active:scale-95 transition-transform"
                    >▲</button>
                   <button 
                      onMouseDown={() => {
                        if (activeGame === 'SNAKE' && moveDir.y === 0) setMoveDir({x: 0, y: 5});
                        else if (activeGame !== 'SNAKE') setMoveDir({x: 0, y: 1});
                      }}
                      className="absolute bottom-1 w-10 h-10 flex items-center justify-center text-white text-xl active:scale-95 transition-transform"
                    >▼</button>
                   <button 
                      onMouseDown={() => {
                        if (activeGame === 'SNAKE' && moveDir.x === 0) setMoveDir({x: -5, y: 0});
                        else if (activeGame !== 'SNAKE') setMoveDir({x: -1, y: 0});
                      }}
                      className="absolute left-1 w-10 h-10 flex items-center justify-center text-white text-xl active:scale-95 transition-transform"
                    >◀</button>
                   <button 
                      onMouseDown={() => {
                        if (activeGame === 'SNAKE' && moveDir.x === 0) setMoveDir({x: 5, y: 0});
                        else if (activeGame !== 'SNAKE') setMoveDir({x: 1, y: 0});
                      }}
                      className="absolute right-1 w-10 h-10 flex items-center justify-center text-white text-xl active:scale-95 transition-transform"
                    >▶</button>
                   <div className="w-8 h-8 bg-[#333] border-4 border-black rounded-full z-10 shadow-lg"></div>
                </div>

                <div className="flex gap-6">
                  <div className="flex flex-col items-center">
                    <button 
                      onClick={() => gameState !== 'PLAYING' && startGame()}
                      className="w-20 h-20 bg-red-600 rounded-full border-[6px] border-black shadow-[8px_8px_0px_#000] active:translate-y-2 active:translate-x-2 active:shadow-none transition-all flex items-center justify-center text-white font-black text-xl"
                    >A</button>
                    <span className="mt-3 font-black text-[10px] uppercase text-gray-800">Start</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <button className="w-20 h-20 bg-[#00A1FF] rounded-full border-[6px] border-black shadow-[8px_8px_0px_#000] active:translate-y-2 active:translate-x-2 active:shadow-none transition-all flex items-center justify-center text-white font-black text-xl">B</button>
                    <span className="mt-3 font-black text-[10px] uppercase text-gray-800">Turbo</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes roadMove {
          from { background-position: 0 0; }
          to { background-position: 0 64px; }
        }
        @keyframes typing { from { width: 0; } to { width: 100%; } }
        @keyframes progress { from { width: 0%; } to { width: 100%; } }
      `}</style>
    </section>
  );
};

export default Arcade;
