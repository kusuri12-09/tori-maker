import { useState, useEffect } from 'react';

interface UpgradeItem {
  id: number;
  name: string;
  cost: number;
  cps: number;
}

const UPGRADES: UpgradeItem[] = [
  { id: 1, name: "🖱️ 자동 클릭커", cost: 10, cps: 1 },
  { id: 2, name: "👩‍🍳 숙련된 제과사", cost: 100, cps: 10 },
  { id: 3, name: "🏭 쿠키 공장", cost: 500, cps: 50 },
];

function App() {
  const [cookies, setCookies] = useState<number>(0);
  const [totalCps, setTotalCps] = useState<number>(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCookies((prev) => prev + totalCps / 10);
    }, 100);
    return () => clearInterval(timer);
  }, [totalCps]);

  return (
    // bg-slate-900: 배경색, text-white: 글자색, min-h-screen: 화면 전체 높이
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center p-10 font-sans">
      
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold mb-2 text-yellow-400">승리의 쿠키 월드</h1>
        <div className="bg-slate-800 p-6 rounded-2xl shadow-xl border border-slate-700">
          <h2 className="text-5xl font-black mb-2">{Math.floor(cookies).toLocaleString()} 🍪</h2>
          <p className="text-slate-400 italic">현재 초당 생산량: {totalCps.toFixed(1)}</p>
        </div>
      </div>

      {/* 클릭 버튼: hover 효과와 active(눌렀을 때) 효과 추가 */}
      <button 
        onClick={() => setCookies(prev => prev + 1)}
        className="text-9xl mb-12 transition-transform hover:scale-110 active:scale-95 drop-shadow-[0_0_20px_rgba(250,204,21,0.5)]"
      >
        🍪
      </button>

      <div className="w-full max-w-md">
        <h3 className="text-xl font-semibold mb-4 border-b border-slate-700 pb-2">업그레이드 상점</h3>
        <div className="flex flex-col gap-3">
          {UPGRADES.map(item => {
            const canBuy = cookies >= item.cost;
            return (
              <button 
                key={item.id} 
                onClick={() => {
                  if (canBuy) {
                    setCookies(prev => prev - item.cost);
                    setTotalCps(prev => prev + item.cps);
                  }
                }}
                disabled={!canBuy}
                // 조건부 스타일링: 돈이 없으면 흐릿하게(opacity-50)
                className={`flex justify-between items-center p-4 rounded-xl font-medium transition-all
                  ${canBuy 
                    ? 'bg-slate-700 hover:bg-slate-600 border-l-4 border-yellow-500' 
                    : 'bg-slate-800 opacity-50 cursor-not-allowed'}`}
              >
                <div className="text-left">
                  <div className="text-lg">{item.name}</div>
                  <div className="text-sm text-yellow-500">+{item.cps} CPS</div>
                </div>
                <div className="text-xl font-bold">{item.cost} 🍪</div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default App;