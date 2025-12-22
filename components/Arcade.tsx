
import React, { useState, useEffect, useRef } from 'react';

// Animated Sprite Component
const NeuralNinja: React.FC<{ 
  facing: 'left' | 'right', 
  isWalking: boolean, 
  isJumping: boolean,
  isPowered: boolean 
}> = ({ facing, isWalking, isJumping, isPowered }) => {
  return (
    <div className={`w-full h-full relative transition-all duration-300 ${isJumping ? 'scale-110 -rotate-3' : ''}`}>
      <div 
        className={`absolute inset-0 border-[3px] border-white rounded-xl flex items-center justify-center overflow-hidden shadow-[4px_4px_0px_rgba(0,0,0,0.4)] transition-colors duration-300 ${isPowered ? 'bg-yellow-400' : 'bg-black'}`}
      >
        <div className={`absolute top-1 w-full h-4 border-y-2 border-white flex justify-center ${isPowered ? 'bg-red-500' : 'bg-[#FF4B4B]'}`}>
           <div className={`w-1 h-5 border-2 border-white absolute -right-1 rotate-12 ${isPowered ? 'bg-red-500' : 'bg-[#FF4B4B]'}`}></div>
        </div>
        <div className="flex gap-2 mt-2">
          <div className={`w-2 h-2 bg-white rounded-full ${isWalking ? 'animate-pulse' : ''} ${isPowered ? 'bg-black' : ''}`}></div>
          <div className={`w-2 h-2 bg-white rounded-full ${isWalking ? 'animate-pulse' : ''} ${isPowered ? 'bg-black' : ''}`}></div>
        </div>
        {isPowered && (
          <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(255,255,255,0.4)_0%,transparent_70%)] animate-pulse"></div>
        )}
      </div>
      <div className="absolute -bottom-2 left-0 right-0 flex justify-around px-1">
        <div className={`w-3 h-4 bg-black border-2 border-white rounded-full ${isWalking ? 'animate-bounce' : ''}`}></div>
        <div className={`w-3 h-4 bg-black border-2 border-white rounded-full ${isWalking ? 'animate-bounce' : ''}`} style={{ animationDelay: '0.1s' }}></div>
      </div>
    </div>
  );
};

const Arcade: React.FC = () => {
  const [gameState, setGameState] = useState<'START' | 'PLAYING' | 'GAMEOVER'>('START');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [powerTimeLeft, setPowerTimeLeft] = useState(0);

  // Mario Physics Constants
  const GRAVITY = 0.6;
  const JUMP_FORCE = -12;
  const ACCELERATION = 0.08;
  const FRICTION = 0.92;
  const MAX_SPEED = 1.2;
  const POWER_MAX_SPEED = 2.0;

  const gameRunning = useRef(false);
  const keys = useRef<{ [key: string]: boolean }>({});
  
  const playerRef = useRef({ 
    x: 10, y: 50, vx: 0, vy: 0, 
    isJumping: false, 
    facing: 'right' as 'left' | 'right', 
    isWalking: false,
    isPowered: false,
    powerTimeout: 0
  });

  const cameraRef = useRef(0);
  const coinsRef = useRef<{ x: number, y: number, collected: boolean, type: 'coin' | 'power' }[]>([]);
  
  const obstaclesRef = useRef([
    { x: 120, y: 75, range: 25, startX: 115, dir: 1, type: 'ground' },
    { x: 235, y: 75, range: 40, startX: 235, dir: 1, type: 'ground' },
    { x: 170, y: 30, range: 30, startX: 170, dir: 1, type: 'fly', phase: 0 },
    { x: 300, y: 20, range: 50, startX: 300, dir: -1, type: 'fly', phase: Math.PI },
    { x: 450, y: 65, range: 60, startX: 450, dir: 1, type: 'ground' },
    { x: 600, y: 35, range: 40, startX: 600, dir: -1, type: 'fly', phase: 0.5 },
  ]);

  const platforms = useRef([
    { x: 0, y: 80, w: 45 },
    { x: 55, y: 65, w: 25 },
    { x: 90, y: 50, w: 20 },
    { x: 120, y: 75, w: 80 }, // Longer platform
    { x: 210, y: 60, w: 30 },
    { x: 250, y: 80, w: 100 }, // Long bridge
    { x: 360, y: 60, w: 25 },
    { x: 395, y: 45, w: 20 },
    { x: 425, y: 75, w: 60 },
    { x: 500, y: 80, w: 150 }, // The Great Wall
    { x: 670, y: 60, w: 40 },
    { x: 730, y: 50, w: 200 }, // Endgame long path
  ]);

  const [renderState, setRenderState] = useState({
    player: { x: 10, y: 50, facing: 'right' as 'left' | 'right', isJumping: false, isWalking: false, isPowered: false },
    cameraX: 0,
    coins: [] as { x: number, y: number, collected: boolean, type: string }[],
    obstacles: [] as { x: number, y: number, type: string }[]
  });

  const startGame = () => {
    playerRef.current = { x: 10, y: 50, vx: 0, vy: 0, isJumping: false, facing: 'right', isWalking: false, isPowered: false, powerTimeout: 0 };
    cameraRef.current = 0;
    coinsRef.current = [
      { x: 58, y: 55, collected: false, type: 'coin' },
      { x: 95, y: 40, collected: false, type: 'coin' },
      { x: 150, y: 65, collected: false, type: 'power' }, // Power up!
      { x: 215, y: 50, collected: false, type: 'coin' },
      { x: 300, y: 70, collected: false, type: 'coin' },
      { x: 410, y: 35, collected: false, type: 'coin' },
      { x: 520, y: 70, collected: false, type: 'power' }, // Another one
      { x: 600, y: 70, collected: false, type: 'coin' },
      { x: 700, y: 50, collected: false, type: 'coin' },
    ];
    setScore(0);
    setPowerTimeLeft(0);
    gameRunning.current = true;
    setGameState('PLAYING');
  };

  const handleGameOver = () => {
    gameRunning.current = false;
    setGameState('GAMEOVER');
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => (keys.current[e.code] = true);
    const handleKeyUp = (e: KeyboardEvent) => (keys.current[e.code] = false);
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  useEffect(() => {
    if (gameState !== 'PLAYING') return;
    let frameId: number;

    const loop = () => {
      if (!gameRunning.current) return;

      const p = playerRef.current;
      const speedLimit = p.isPowered ? POWER_MAX_SPEED : MAX_SPEED;

      // Horizontal movement with momentum
      const moveRight = keys.current['ArrowRight'] || keys.current['KeyD'] || keys.current['BtnRight'];
      const moveLeft = keys.current['ArrowLeft'] || keys.current['KeyA'] || keys.current['BtnLeft'];

      if (moveRight) {
        p.vx += ACCELERATION;
        p.facing = 'right';
        p.isWalking = true;
      } else if (moveLeft) {
        p.vx -= ACCELERATION;
        p.facing = 'left';
        p.isWalking = true;
      } else {
        p.vx *= FRICTION;
        if (Math.abs(p.vx) < 0.01) {
          p.vx = 0;
          p.isWalking = false;
        }
      }

      // Cap horizontal speed
      p.vx = Math.max(-speedLimit, Math.min(speedLimit, p.vx));
      p.x += p.vx;

      // Vertical movement / Gravity
      const isJumpPressed = keys.current['Space'] || keys.current['ArrowUp'] || keys.current['KeyW'] || keys.current['BtnJump'];
      
      if (isJumpPressed && !p.isJumping) {
        p.vy = JUMP_FORCE;
        p.isJumping = true;
      }

      // Variable jump height (Mario-style)
      if (!isJumpPressed && p.vy < -3) {
        p.vy *= 0.5; // Cut jump short if released
      }

      p.vy += GRAVITY;
      p.y += p.vy;

      // Collision Detection
      let onPlatform = false;
      for (const plat of platforms.current) {
        const withinPlatformX = p.x + 4 > plat.x && p.x - 4 < plat.x + plat.w;
        if (withinPlatformX) {
          if (p.vy >= 0 && p.y >= plat.y && p.y - p.vy <= plat.y) {
            p.y = plat.y;
            p.vy = 0;
            onPlatform = true;
            break;
          }
        }
      }
      p.isJumping = !onPlatform;

      // Obstacle Movement & Collision
      obstaclesRef.current.forEach(obs => {
        if (obs.type === 'ground') {
          obs.x += 0.25 * obs.dir;
          if (Math.abs(obs.x - obs.startX) > obs.range) obs.dir *= -1;
        } else {
          obs.x += 0.35 * obs.dir;
          if (Math.abs(obs.x - obs.startX) > obs.range) obs.dir *= -1;
          const phase = (obs as any).phase || 0;
          obs.y = 25 + Math.sin(Date.now() / 400 + phase) * 12;
        }
        
        const dx = Math.abs(obs.x - p.x);
        const dy = Math.abs(obs.y - (p.y - 5));
        if (dx < 4 && dy < 7) {
          if (p.isPowered) {
            // Smash enemy if powered
            obs.y = 200; // Knock off screen
            setScore(s => s + 500);
          } else {
            handleGameOver();
          }
        }
      });

      if (p.y > 120) { handleGameOver(); return; }

      // Camera Follow
      const targetCam = p.x - 45;
      cameraRef.current += (targetCam - cameraRef.current) * 0.1;
      cameraRef.current = Math.max(0, cameraRef.current);

      // Collectibles
      coinsRef.current.forEach(c => {
        if (!c.collected && Math.abs(c.x - p.x) < 5 && Math.abs(c.y - p.y) < 10) {
          c.collected = true;
          if (c.type === 'coin') {
            setScore(s => s + 100);
          } else {
            p.isPowered = true;
            p.powerTimeout = Date.now() + 10000;
            setScore(s => s + 1000);
          }
        }
      });

      // Power Up Expiry
      if (p.isPowered && Date.now() > p.powerTimeout) {
        p.isPowered = false;
        setPowerTimeLeft(0);
      } else if (p.isPowered) {
        setPowerTimeLeft(Math.ceil((p.powerTimeout - Date.now()) / 1000));
      }

      setRenderState({
        player: { ...p },
        cameraX: cameraRef.current,
        coins: [...coinsRef.current],
        obstacles: obstaclesRef.current.map(o => ({ x: o.x, y: o.y, type: o.type }))
      });

      frameId = requestAnimationFrame(loop);
    };

    frameId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frameId);
  }, [gameState]);

  useEffect(() => {
    if (score > highScore) setHighScore(score);
  }, [score, highScore]);

  const setKey = (k: string, v: boolean) => (keys.current[k] = v);

  return (
    <section id="arcade" className="py-24 px-4 bg-[#FFD600] border-y-8 border-black flex flex-col items-center overflow-hidden relative">
      <div className="absolute inset-0 halftone-bg opacity-10 pointer-events-none"></div>
      
      <div className="max-w-6xl w-full flex flex-col items-center justify-center relative z-10">
        <header className="text-center mb-10">
          <div className="inline-block bg-black text-white px-6 py-2 font-black uppercase text-xl mb-4 rotate-[-1deg] shadow-[6px_6px_0px_#00A1FF]">
            NEURAL ARCADE V5.0
          </div>
          <h2 className="text-5xl sm:text-7xl md:text-[8rem] font-black uppercase tracking-tighter leading-none">
            ACTION <span className="text-white" style={{ WebkitTextStroke: '2px black', textShadow: '8px 8px 0px #FF4B4B' }}>BASTION</span>
          </h2>
        </header>

        <div className="w-full max-w-[1000px] aspect-[16/9] bg-[#111] border-[12px] border-black rounded-[4rem] shadow-[40px_40px_0px_#000] relative overflow-hidden flex flex-col p-4">
          
          <div className="flex-1 rounded-[3rem] bg-gradient-to-b from-sky-400 to-sky-200 overflow-hidden relative border-4 border-black/30 crt-screen">
            {/* Parallax Background */}
            <div 
              className="absolute inset-0 opacity-20 pointer-events-none"
              style={{ transform: `translateX(-${renderState.cameraX * 0.3}%)` }}
            >
               <div className="absolute bottom-0 w-[500%] h-32 bg-sky-900 clip-path-city"></div>
            </div>

            <div 
              className="absolute inset-0 transition-transform duration-75 ease-out"
              style={{ transform: `translateX(-${renderState.cameraX}%)` }}
            >
              {/* Decorative Clouds */}
              {[10, 80, 180, 280, 380, 480, 580, 680].map(x => (
                <div key={x} className="absolute text-7xl opacity-40 select-none animate-pulse" style={{ left: `${x}%`, top: `${15 + (x % 20)}%` }}>☁️</div>
              ))}

              {/* Platforms / Walls */}
              {platforms.current.map((p, i) => (
                <div 
                  key={i}
                  className="absolute bg-[#3E2723] border-[6px] border-black shadow-[inset_0_4px_0_rgba(255,255,255,0.2)]"
                  style={{ left: `${p.x}%`, top: `${p.y}%`, width: `${p.w}%`, height: '200%' }}
                >
                  <div className="w-full h-8 bg-emerald-500 border-b-4 border-black"></div>
                  <div className="w-full h-full opacity-20 bg-[repeating-linear-gradient(90deg,transparent,transparent_20px,rgba(0,0,0,0.4)_20px,rgba(0,0,0,0.4)_22px)]"></div>
                </div>
              ))}

              {/* Collectibles */}
              {renderState.coins.map((c, i) => !c.collected && (
                <div 
                  key={i}
                  className={`absolute text-5xl flex flex-col items-center justify-center animate-bounce`}
                  style={{ left: `${c.x}%`, top: `${c.y-10}%`, transform: 'translateX(-50%)' }}
                >
                  <span className={c.type === 'power' ? 'drop-shadow-[0_0_15px_#FFD600] scale-125' : ''}>
                    {c.type === 'coin' ? '💎' : '⭐'}
                  </span>
                  {c.type === 'power' && <span className="text-[10px] font-black uppercase bg-black text-white px-1 mt-1">POWER</span>}
                </div>
              ))}

              {/* Obstacles */}
              {renderState.obstacles.map((obs, i) => (
                <div 
                  key={i}
                  className="absolute w-[6%] h-[10%] flex flex-col items-center justify-center text-6xl"
                  style={{ left: `${obs.x}%`, top: `${obs.y}%`, transform: 'translate(-50%, -100%)' }}
                >
                  <div className="animate-bounce" style={{ animationDuration: '0.8s' }}>
                    {obs.type === 'fly' ? '👾' : '😈'}
                  </div>
                </div>
              ))}

              {/* Player Sprite */}
              <div 
                className="absolute"
                style={{ 
                  left: `${renderState.player.x}%`, 
                  top: `${renderState.player.y}%`, 
                  transform: `translate(-50%, -100%) scaleX(${renderState.player.facing === 'left' ? -1 : 1})`,
                  width: '6%',
                  height: '14%',
                  zIndex: 50
                }}
              >
                <NeuralNinja 
                  facing={renderState.player.facing} 
                  isWalking={renderState.player.isWalking} 
                  isJumping={renderState.player.isJumping} 
                  isPowered={renderState.player.isPowered}
                />
              </div>
            </div>

            {/* UI Overlay */}
            <div className="absolute top-10 left-10 right-10 z-[110] flex justify-between pointer-events-none items-start">
              <div className="flex flex-col gap-2">
                <div className="bg-black text-white px-6 py-2 font-black text-3xl border-4 border-white shadow-[8px_8px_0px_#000] rotate-[-1deg]">
                  DATA: {score}
                </div>
                {powerTimeLeft > 0 && (
                  <div className="bg-[#FFD600] text-black px-4 py-1 font-black text-xl border-4 border-black animate-pulse rotate-1">
                    BASTION MODE: {powerTimeLeft}s
                  </div>
                )}
              </div>
              <div className="bg-white border-4 border-black px-6 py-2 font-black text-3xl shadow-[8px_8px_0px_#000] rotate-[1deg]">
                PEAK: {highScore}
              </div>
            </div>

            {/* Start Screen */}
            {gameState === 'START' && (
              <div className="absolute inset-0 z-[150] bg-black/80 flex items-center justify-center backdrop-blur-md p-6">
                <div className="bg-white border-[12px] border-black p-12 shadow-[30px_30px_0px_#FFD600] text-center rotate-1 w-full max-w-lg">
                  <h3 className="text-8xl font-black mb-6 italic tracking-tighter uppercase">READY?</h3>
                  <div className="grid grid-cols-2 gap-8 mb-12 text-left">
                    <div className="bg-gray-100 p-4 border-4 border-black font-black uppercase">
                       <p className="text-blue-600">Move:</p> Arrows / WASD
                    </div>
                    <div className="bg-gray-100 p-4 border-4 border-black font-black uppercase">
                       <p className="text-red-600">Jump:</p> Space (Hold for higher)
                    </div>
                  </div>
                  <button 
                    onClick={startGame}
                    className="cartoon-btn w-full bg-black text-white py-8 font-black text-5xl uppercase tracking-tighter"
                  >
                    DEPLOY!
                  </button>
                </div>
              </div>
            )}

            {/* Game Over Screen */}
            {gameState === 'GAMEOVER' && (
              <div className="absolute inset-0 z-[150] bg-red-600/80 flex items-center justify-center backdrop-blur-md p-6">
                <div className="bg-white border-[12px] border-black p-12 shadow-[30px_30px_0px_#000] text-center -rotate-1 w-full max-w-lg">
                  <h3 className="text-7xl font-black mb-4 italic tracking-tighter uppercase text-red-600">CRASHED</h3>
                  <p className="text-4xl font-black mb-12 text-gray-800 uppercase">SCORE: {score}</p>
                  <button 
                    onClick={startGame}
                    className="cartoon-btn w-full bg-[#00A1FF] text-white py-8 font-black text-5xl uppercase tracking-tighter"
                  >
                    REBOOT
                  </button>
                </div>
              </div>
            )}
            
            {/* On-Screen Controls */}
            <div className="absolute bottom-10 left-10 right-10 flex justify-between items-end z-[200] pointer-events-none">
              <div className="flex gap-6 pointer-events-auto">
                <button 
                  onPointerDown={() => setKey('BtnLeft', true)}
                  onPointerUp={() => setKey('BtnLeft', false)}
                  className="w-24 h-24 bg-black/60 border-4 border-white/50 rounded-3xl flex items-center justify-center text-white text-5xl active:scale-90 transition-all backdrop-blur-md"
                >
                  ◀
                </button>
                <button 
                  onPointerDown={() => setKey('BtnRight', true)}
                  onPointerUp={() => setKey('BtnRight', false)}
                  className="w-24 h-24 bg-black/60 border-4 border-white/50 rounded-3xl flex items-center justify-center text-white text-5xl active:scale-90 transition-all backdrop-blur-md"
                >
                  ▶
                </button>
              </div>
              <div className="pointer-events-auto">
                <button 
                  onPointerDown={() => setKey('BtnJump', true)}
                  onPointerUp={() => setKey('BtnJump', false)}
                  className="w-32 h-32 bg-[#FF4B4B] border-[8px] border-black rounded-full flex items-center justify-center text-white font-black text-4xl shadow-[0_12px_0_#000] active:shadow-none active:translate-y-3 transition-all"
                >
                  JUMP
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .clip-path-city {
          clip-path: polygon(0% 100%, 0% 40%, 5% 40%, 5% 20%, 10% 20%, 10% 50%, 15% 50%, 15% 10%, 20% 10%, 20% 40%, 25% 40%, 25% 30%, 30% 30%, 30% 60%, 35% 60%, 35% 20%, 40% 20%, 40% 45%, 45% 45%, 45% 5%, 50% 5%, 50% 35%, 55% 35%, 55% 55%, 60% 55%, 60% 15%, 65% 15%, 65% 40%, 70% 40%, 70% 25%, 75% 25%, 75% 50%, 80% 50%, 80% 10%, 85% 10%, 85% 45%, 90% 45%, 90% 30%, 95% 30%, 95% 60%, 100% 60%, 100% 100%);
        }
      `}</style>
    </section>
  );
};

export default Arcade;
