
import React, { useState, useEffect } from 'react';
import { Timer, ArrowRight, ChevronRight, ChevronLeft, Zap, Swords } from 'lucide-react';
import { CYCLE_START_TIME, CYCLE_DURATION_MS, MOCK_FACTIONS } from '../constants';

interface HeroProps {
  onConnect: () => void;
}

const Hero: React.FC<HeroProps> = ({ onConnect }) => {
  const [timeLeft, setTimeLeft] = useState<{d: number, h: number, m: number, s: number}>({ d: 0, h: 0, m: 0, s: 0 });
  const [cycleProgress, setCycleProgress] = useState(0);
  const [cycleNum, setCycleNum] = useState<number>(42);
  
  // Battle Mode State
  const [matchupIndex, setMatchupIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Cycle Timer Logic
  useEffect(() => {
    const updateTimer = () => {
      const now = Date.now();
      const elapsed = now - CYCLE_START_TIME;
      const currentCycle = Math.floor(elapsed / CYCLE_DURATION_MS) + 1;
      setCycleNum(currentCycle);
      
      const timeIntoCycle = elapsed % CYCLE_DURATION_MS;
      const distance = CYCLE_DURATION_MS - timeIntoCycle;
      
      // Calculate percentage (0 to 100)
      const progress = (timeIntoCycle / CYCLE_DURATION_MS) * 100;
      setCycleProgress(progress);

      setTimeLeft({
        d: Math.floor(distance / (1000 * 60 * 60 * 24)),
        h: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        m: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        s: Math.floor((distance % (1000 * 60)) / 1000),
      });
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, []);

  // Auto-rotate Matchups
  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
        setMatchupIndex(prev => (prev + 1) % 5); // Cycle through top 5 pairs (Top 10 factions)
    }, 6000);
    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const handleNextMatchup = () => {
      setIsAutoPlaying(false);
      setMatchupIndex(prev => (prev + 1) % 5);
  };

  const handlePrevMatchup = () => {
      setIsAutoPlaying(false);
      setMatchupIndex(prev => (prev - 1 + 5) % 5);
  };

  const handleExplore = () => {
    const element = document.getElementById('how-it-works');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Get current factions for the battle
  const factionA = MOCK_FACTIONS[matchupIndex * 2];
  const factionB = MOCK_FACTIONS[(matchupIndex * 2) + 1];
  
  // Calculate relative dominance for the bar
  const totalLockedInMatch = factionA.totalLocked + factionB.totalLocked;
  const percentA = totalLockedInMatch > 0 ? (factionA.totalLocked / totalLockedInMatch) * 100 : 50;
  const percentB = 100 - percentA;

  const formattedTotal = '1.2M';

  // Circular Progress Calculation
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (cycleProgress / 100) * circumference;

  return (
    <div className="relative pt-28 pb-12 md:pt-32 md:pb-20 px-6 overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] md:w-[800px] h-[300px] md:h-[500px] bg-primary/10 rounded-full blur-[80px] md:blur-[120px] -z-10" />
      <div className="absolute bottom-0 right-0 w-[300px] md:w-[600px] h-[200px] md:h-[400px] bg-accent/5 rounded-full blur-[60px] md:blur-[100px] -z-10" />

      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6 md:space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-medium uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            Cycle #{cycleNum} Live
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold leading-tight">
            Build Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-white">Faction.</span><br />
            Dominate The <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-white">Cycle.</span>
          </h1>
          
          <p className="text-base md:text-lg text-gray-400 max-w-lg leading-relaxed">
            A social on-chain strategy game powered by XRPL. <strong className="text-gray-300">Factions compete in dynamic tiers based on TVL size.</strong> Your balance is your influence. Join forces, lock liquidity, and claim the rewards.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <button 
              onClick={onConnect}
              className="px-8 py-4 bg-white text-black font-bold rounded-xl hover:bg-gray-100 transition-colors flex items-center justify-center gap-2 text-sm md:text-base"
            >
              Start Playing
              <ArrowRight size={18} />
            </button>
            <button 
              onClick={handleExplore}
              className="px-8 py-4 bg-white/5 text-white font-medium rounded-xl hover:bg-white/10 transition-colors border border-white/10 text-sm md:text-base"
            >
              Explore Protocol
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8 border-t border-white/10">
            <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
              <div className="text-2xl font-bold text-white font-mono">{formattedTotal} XRP</div>
              <div className="text-xs text-gray-500 uppercase tracking-wide mt-1">Total Locked</div>
            </div>
            <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
              <div className="text-2xl font-bold text-white font-mono">1000+</div>
              <div className="text-xs text-gray-500 uppercase tracking-wide mt-1">Active Factions</div>
            </div>
            <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
              <div className="text-2xl font-bold text-accent font-mono">~14% APY</div>
              <div className="text-xs text-gray-500 uppercase tracking-wide mt-1">Avg. Reward</div>
            </div>
          </div>
        </div>

        {/* Dynamic Card / Visualization */}
        <div className="relative mt-8 lg:mt-0">
          <div className="glass-card rounded-2xl p-6 md:p-8 relative z-10 border border-white/10 shadow-2xl backdrop-blur-xl">
            
            {/* Timer Header - Vertically Centered */}
            <div className="flex items-center justify-between mb-8 pb-6 border-b border-white/5">
              <div className="space-y-1 md:space-y-2">
                 <div className="flex items-center gap-2 mb-1">
                    <div className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse shadow-[0_0_8px_rgba(60,242,194,0.8)]"></div>
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Cycle Ends In</span>
                 </div>
                 <div className="flex items-baseline gap-1 md:gap-2 text-4xl md:text-5xl lg:text-5xl font-mono font-bold text-white tracking-tight tabular-nums leading-none">
                    <span>{String(timeLeft.d).padStart(2, '0')}</span>
                    <span className="text-gray-600 text-2xl lg:text-3xl align-top pt-2 opacity-50">:</span>
                    <span>{String(timeLeft.h).padStart(2, '0')}</span>
                    <span className="text-gray-600 text-2xl lg:text-3xl align-top pt-2 opacity-50">:</span>
                    <span>{String(timeLeft.m).padStart(2, '0')}</span>
                    <span className="text-gray-600 text-2xl lg:text-3xl align-top pt-2 opacity-50">:</span>
                    <span>{String(timeLeft.s).padStart(2, '0')}</span>
                 </div>
              </div>
              
              {/* Circular Progress Indicator - Centered */}
              <div className="relative w-14 h-14 md:w-16 md:h-16 flex-shrink-0 ml-4">
                 <svg className="w-full h-full transform -rotate-90" viewBox="0 0 64 64">
                    <circle
                      cx="32"
                      cy="32"
                      r="28"
                      stroke="rgba(255,255,255,0.05)"
                      strokeWidth="3"
                      fill="transparent"
                    />
                    <circle
                      cx="32"
                      cy="32"
                      r="28"
                      stroke="#3CF2C2"
                      strokeWidth="3"
                      fill="transparent"
                      strokeDasharray={circumference}
                      strokeDashoffset={strokeDashoffset}
                      strokeLinecap="round"
                      className="transition-all duration-1000 ease-linear drop-shadow-[0_0_4px_rgba(60,242,194,0.5)]"
                    />
                 </svg>
                 <div className="absolute inset-0 flex items-center justify-center text-accent">
                    <Timer size={20} className="md:w-6 md:h-6 drop-shadow-[0_0_8px_rgba(60,242,194,0.8)]" />
                 </div>
              </div>
            </div>

            {/* Faction Battle Area */}
            <div className="space-y-6">
              {/* Navigation */}
              <div className="flex justify-between items-center">
                 <div className="flex items-center gap-2 text-gray-500">
                    <Swords size={14} />
                    <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest">Battle #{matchupIndex + 1}</span>
                 </div>
                 <div className="flex gap-1">
                    <button onClick={handlePrevMatchup} className="w-6 h-6 flex items-center justify-center hover:bg-white/10 rounded transition-colors text-gray-500 hover:text-white">
                        <ChevronLeft size={14} />
                    </button>
                    <button onClick={handleNextMatchup} className="w-6 h-6 flex items-center justify-center hover:bg-white/10 rounded transition-colors text-gray-500 hover:text-white">
                        <ChevronRight size={14} />
                    </button>
                 </div>
              </div>

              {/* Faction Names & Momentum */}
              <div className="flex justify-between items-end pb-1">
                 {/* Left Faction (Primary Color side) */}
                 <div className="flex flex-col items-start gap-0.5">
                    <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-base md:text-lg leading-tight">{factionA.name}</span>
                        {factionA.growthRate > factionB.growthRate && (
                            <Zap size={16} className="text-warning fill-warning drop-shadow-[0_0_8px_rgba(242,158,60,0.8)]" />
                        )}
                    </div>
                    <span className="text-xs text-gray-500 font-mono tracking-wide">
                        {(factionA.totalLocked/1000).toFixed(0)}k XRP
                    </span>
                 </div>

                 {/* Right Faction (Accent Color side) */}
                 <div className="flex flex-col items-end gap-0.5 text-right">
                    <div className="flex items-center justify-end gap-2">
                        {factionB.growthRate > factionA.growthRate && (
                            <Zap size={16} className="text-warning fill-warning drop-shadow-[0_0_8px_rgba(242,158,60,0.8)]" />
                        )}
                        <span className="font-bold text-white text-base md:text-lg leading-tight">{factionB.name}</span>
                    </div>
                    <span className="text-xs text-gray-500 font-mono tracking-wide">
                        {(factionB.totalLocked/1000).toFixed(0)}k XRP
                    </span>
                 </div>
              </div>

              {/* Battle Progress Bar - Push Effect */}
              <div className="relative pt-1">
                 {/* Percentages */}
                 <div className="flex justify-between items-end mb-2 px-0.5">
                     <span className={`text-[10px] font-bold font-mono tracking-wider ${percentA > 50 ? 'text-primary' : 'text-gray-600'}`}>
                         {percentA.toFixed(1)}%
                     </span>
                     <span className={`text-[10px] font-bold font-mono tracking-wider ${percentB > 50 ? 'text-accent' : 'text-gray-600'}`}>
                         {percentB.toFixed(1)}%
                     </span>
                 </div>

                 {/* Bar */}
                 <div className="relative w-full h-3 md:h-4 bg-gray-800 rounded-full overflow-hidden flex shadow-inner border border-white/5">
                    {/* Left Side (Faction A) */}
                    <div 
                      className="h-full bg-primary shadow-[0_0_15px_rgba(88,101,242,0.4)] relative z-10 transition-all duration-1000 ease-in-out"
                      style={{ width: `${percentA}%` }}
                    ></div>

                    {/* Right Side (Faction B) */}
                    <div 
                      className="h-full bg-accent shadow-[0_0_15px_rgba(60,242,194,0.4)] relative z-10 transition-all duration-1000 ease-in-out"
                      style={{ width: `${percentB}%` }}
                    ></div>

                    {/* VS Badge Moving with the bar */}
                    <div 
                        className="absolute top-0 bottom-0 z-20 w-px bg-black/50 backdrop-blur-sm transition-all duration-1000 ease-in-out flex items-center justify-center"
                        style={{ left: `${percentA}%` }}
                    >
                         <div className="bg-[#0A0B10] text-[8px] font-black px-1.5 py-0.5 rounded border border-white/10 text-gray-500 shadow-xl transform scale-90 md:scale-100">
                            VS
                        </div>
                    </div>
                 </div>
              </div>
              
              {/* Quick Actions Grid */}
              <div className="grid grid-cols-3 gap-3 pt-3 border-t border-white/5 mt-2">
                 {['LOCK', 'RECRUIT', 'WIN'].map((label) => (
                   <button key={label} className="py-3 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 rounded-lg transition-all group active:scale-95 flex items-center justify-center">
                      <span className="text-[10px] md:text-xs font-bold text-gray-500 group-hover:text-white tracking-widest uppercase">{label}</span>
                   </button>
                 ))}
              </div>
            </div>
          </div>

          {/* Decorative Elements behind card */}
          <div className="absolute -top-4 -right-4 w-full h-full border border-white/10 rounded-2xl -z-10" />
          <div className="absolute -bottom-4 -left-4 w-full h-full border border-white/5 rounded-2xl -z-10" />
        </div>
      </div>
    </div>
  );
};

export default Hero;
