import { useState, useEffect } from 'react';
import { track } from '@vercel/analytics';

// 1. 타입 정의
interface UpgradeItem {
  id: number;
  name: string;
  cost: number;
  cps: number;
}

interface ClickParticle {
  id: number;
  x: number;
  y: number;
}

// 2. 상점 데이터
const UPGRADES: UpgradeItem[] = [
  { id: 1, name: "🖱️ 자동 클릭커", cost: 10, cps: 1 },
  { id: 2, name: "👩‍🍳 숙련된 제과사", cost: 100, cps: 10 },
  { id: 3, name: "🏭 쿠키 공장", cost: 500, cps: 50 },
  { id: 4, name: "🚀 우주 베이커리", cost: 2000, cps: 200 },
];

function App() {
  // --- 상태 관리 ---
  const [cookies, setCookies] = useState<number>(0);
  const [totalCps, setTotalCps] = useState<number>(0);
  const [particles, setParticles] = useState<ClickParticle[]>([]);

  // --- 로직: 자동 생산 ---
  useEffect(() => {
    const timer = setInterval(() => {
      setCookies((prev) => prev + totalCps / 10);
    }, 100);
    return () => clearInterval(timer);
  }, [totalCps]);

  // --- 로직: 핸들러 ---
  const handleManualClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    setCookies(prev => prev + 1);
    
    // Vercel 트래킹
    track('cookie_clicked');

    // 클릭 임팩트(파티클) 생성
    const newParticle: ClickParticle = {
      id: Date.now(),
      x: e.clientX,
      y: e.clientY,
    };
    setParticles(prev => [...prev, newParticle]);

    // 1초 뒤 파티클 제거
    setTimeout(() => {
      setParticles(prev => prev.filter(p => p.id !== newParticle.id));
    }, 1000);
  };

  const buyUpgrade = (item: UpgradeItem) => {
    if (cookies >= item.cost) {
      setCookies(prev => prev - item.cost);
      setTotalCps(prev => prev + item.cps);
      
      // Vercel 트래킹
      track('upgrade_purchased', { item: item.name });
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center p-10 font-sans overflow-hidden">
      
      {/* 상단 스탯 영역 */}
      <div className="text-center mb-10 z-10">
        <h1 className="text-4xl font-bold mb-4 text-yellow-400 drop-shadow-md">
          토리 메이커 🍪
        </h1>
        <div className="bg-slate-800/80 backdrop-blur-md p-6 rounded-3xl shadow-2xl border border-slate-700 min-w-[300px]">
          <h2 className="text-5xl font-black mb-2 text-white">
            {Math.floor(cookies).toLocaleString()}
          </h2>
          <p className="text-yellow-500 font-medium tracking-wide">
            초당 생산량(CPS): {totalCps.toFixed(1)}
          </p>
        </div>
      </div>

      {/* 메인 클릭 버튼 */}
      <div className="relative mb-12">
        <button 
          onClick={handleManualClick}
          className="text-9xl transition-transform hover:scale-110 active:scale-90 select-none cursor-pointer drop-shadow-[0_0_35px_rgba(250,204,21,0.4)] z-20 relative"
        >
          🍪
        </button>
      </div>

      {/* 클릭 임팩트 레이어 (Portal처럼 화면 전체에 뿌림) */}
      {particles.map(particle => (
        <span
          key={particle.id}
          className="fixed pointer-events-none text-3xl font-black text-yellow-400 select-none animate-float-up z-50 shadow-sm"
          style={{ left: particle.x - 20, top: particle.y - 20 }}
        >
          +1
        </span>
      ))}

      {/* 상점 영역 */}
      <div className="w-full max-w-md z-10">
        <h3 className="text-xl font-bold mb-4 text-slate-300 flex items-center gap-2">
          <span className="w-2 h-6 bg-yellow-500 rounded-full"></span>
          업그레이드 상점
        </h3>
        <div className="flex flex-col gap-3">
          {UPGRADES.map(item => {
            const canBuy = cookies >= item.cost;
            return (
              <button 
                key={item.id} 
                onClick={() => buyUpgrade(item)}
                disabled={!canBuy}
                className={`group flex justify-between items-center p-4 rounded-2xl font-bold transition-all duration-200
                  ${canBuy 
                    ? 'bg-slate-800 hover:bg-slate-700 border border-slate-600 shadow-lg' 
                    : 'bg-slate-900/50 opacity-40 cursor-not-allowed border border-transparent'}`}
              >
                <div className="text-left">
                  <div className={`text-lg ${canBuy ? 'text-white' : 'text-slate-500'}`}>
                    {item.name}
                  </div>
                  <div className="text-sm text-yellow-500/80 font-normal">
                    +{item.cps} CPS
                  </div>
                </div>
                <div className={`text-xl ${canBuy ? 'text-yellow-400' : 'text-slate-600'}`}>
                  {item.cost.toLocaleString()} 🍪
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 배경 장식 (선택 사항) */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none opacity-10 z-0">
        <div className="absolute top-10 left-10 text-4xl animate-pulse">✨</div>
        <div className="absolute bottom-20 right-20 text-4xl animate-bounce">✨</div>
      </div>
    </div>
  );
}

export default App;