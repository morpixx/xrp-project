
import React, { useState, useEffect } from 'react';
import { Timer, ArrowRight, Lock, Users, Activity } from 'lucide-react';
import { CYCLE_START_TIME, CYCLE_DURATION_MS, GLOBAL_TOTAL_LOCKED, MOCK_FACTIONS } from '../constants';

interface HeroProps {
  onConnect: () => void;
}

const Hero: React.FC<HeroProps> = ({ onConnect }) => {
  const [timeLeft, setTimeLeft] = useState<{d: number, h: number, m: number, s: number}>({ d: 7, h: 0, m: 0, s: 0 });

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      
      // Calculate elapsed time since the code launched (app loaded)
      const elapsed = now - CYCLE_START_TIME;
      
      // Find the position within the current 7-day cycle
      const timeIntoCycle = elapsed % CYCLE_DURATION_MS;
      
      // Calculate remaining time
      const distance = CYCLE_DURATION_MS - timeIntoCycle;

      setTimeLeft({
        d: Math.floor(distance / (1000 * 60 * 60 * 24)),
        h: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        m: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        s: Math.floor((distance % (1000 * 60)) / 1000),
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleExplore = () => {
    const element = document.getElementById('how-it-works');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const leadingFaction = MOCK_FACTIONS[0];
  const formattedTotal = '1.2M';

  return (
    <div className="relative pt-28 pb-12 md:pt-32 md:pb-20 px-6 overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] md:w-[800px] h-[300px] md:h-[500px] bg-primary/10 rounded-full blur-[80px] md:blur-[120px] -z-10" />
      <div className="absolute bottom-0 right-0 w-[300px] md:w-[600px] h-[200px] md:h-[400px] bg-accent/5 rounded-full blur-[60px] md:blur-[100px] -z-10" />

      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6 md:space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-medium uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            Cycle #42 Live
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
              <div className="text-2xl font-bold text-white font-mono">100+</div>
              <div className="text-xs text-gray-500 uppercase tracking-wide mt-1">Active Factions</div>
            </div>
            <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
              <div className="text-2xl font-bold text-accent font-mono">~14% APY</div>
              <div className="text-xs text-gray-500 uppercase tracking-wide mt-1">Avg. Reward</div>
            </div>
          </div>
        </div>

        {/* Dynamic Card / Visualization */}
        <div className="relative mt-4 lg:mt-0">
          <div className="glass-card rounded-2xl p-6 md:p-8 relative z-10 transform transition-transform hover:scale-[1.01]">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-gray-400 text-sm font-medium uppercase">Cycle Ends In</h3>
                <div className="text-3xl md:text-4xl font-mono font-bold text-white mt-1 flex gap-2">
                   <span>{String(timeLeft.d).padStart(2, '0')}</span><span className="text-gray-600">:</span>
                   <span>{String(timeLeft.h).padStart(2, '0')}</span><span className="text-gray-600">:</span>
                   <span>{String(timeLeft.m).padStart(2, '0')}</span><span className="text-gray-600">:</span>
                   <span>{String(timeLeft.s).padStart(2, '0')}</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center text-primary">
                <Timer />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between text-sm flex-wrap gap-2">
                <span className="text-gray-400">Winning: {leadingFaction.name}</span>
                <span className="text-accent font-bold">{leadingFaction.dominance}% Dominance</span>
              </div>
              <div className="w-full h-3 bg-gray-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-primary to-accent rounded-full relative"
                  style={{ width: `${leadingFaction.dominance}%` }}
                >
                    <div className="absolute top-0 right-0 bottom-0 w-1 bg-white/50 animate-pulse"></div>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-2 mt-6">
                 <div className="bg-white/5 p-3 rounded-lg text-center">
                    <Lock size={16} className="mx-auto text-primary mb-2" />
                    <div className="text-xs text-gray-400">Lock</div>
                 </div>
                 <div className="bg-white/5 p-3 rounded-lg text-center">
                    <Users size={16} className="mx-auto text-accent mb-2" />
                    <div className="text-xs text-gray-400">Recruit</div>
                 </div>
                 <div className="bg-white/5 p-3 rounded-lg text-center">
                    <Activity size={16} className="mx-auto text-warning mb-2" />
                    <div className="text-xs text-gray-400">Win</div>
                 </div>
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
