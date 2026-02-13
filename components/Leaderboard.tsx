import React from 'react';
import { MOCK_FACTIONS } from '../constants';
import { TrendingUp, TrendingDown, Users, Coins, ChevronLeft, Swords } from 'lucide-react';
import LiveActivity from './LiveActivity';

interface LeaderboardProps {
  onViewFull?: () => void;
  onBack?: () => void;
}

const Leaderboard: React.FC<LeaderboardProps> = ({ onViewFull, onBack }) => {
  const isLandingMode = !!onViewFull;
  
  // Show only top 5 on landing page, all 100 on full view
  const displayFactions = isLandingMode ? MOCK_FACTIONS.slice(0, 5) : MOCK_FACTIONS;

  return (
    <section className={`px-4 md:px-6 relative ${isLandingMode ? 'py-12 md:py-24' : 'py-8 md:py-12'}`}>
      <div className="max-w-7xl mx-auto">
        {onBack && (
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-sm text-gray-400 hover:text-white mb-8 transition-colors group"
          >
            <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Back to Menu
          </button>
        )}

        {/* Layout Container */}
        <div className={`grid gap-8 ${isLandingMode ? 'lg:grid-cols-3' : 'grid-cols-1'}`}>
          
          {/* Left Column: Table */}
          <div className={`${isLandingMode ? 'lg:col-span-2' : ''}`}>
             <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 md:mb-8 gap-4 md:gap-6">
                <div>
                  <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2">
                    {isLandingMode ? 'Live Faction Standings' : 'Global Leaderboard'}
                  </h2>
                  <p className="text-gray-400 flex items-center gap-2 text-sm md:text-base">
                    <Swords size={16} className="text-accent" />
                    Real-time performance. Factions compete within their TVL tiers.
                  </p>
                </div>
                {onViewFull && (
                  <button 
                    onClick={onViewFull}
                    className="text-sm font-semibold text-primary hover:text-white transition-colors"
                  >
                    View Full Leaderboard →
                  </button>
                )}
              </div>

              <div className="glass-card rounded-2xl overflow-hidden shadow-2xl shadow-black/50">
                {/* Horizontal scroll wrapper for mobile, but optimized columns to try to fit */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-white/10 bg-white/5">
                        <th className="p-3 md:p-6 text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-wider w-12 md:w-auto">Rank</th>
                        <th className="p-3 md:p-6 text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-wider">Faction</th>
                        <th className="hidden md:table-cell p-3 md:p-6 text-xs font-bold text-gray-400 uppercase tracking-wider">Tier</th>
                        <th className="p-3 md:p-6 text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-wider text-right md:text-left">Locked</th>
                        <th className="hidden lg:table-cell p-3 md:p-6 text-xs font-bold text-gray-400 uppercase tracking-wider">Members</th>
                        <th className="p-3 md:p-6 text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-wider text-right md:text-left">Growth</th>
                        <th className="hidden sm:table-cell p-3 md:p-6 text-xs font-bold text-gray-400 uppercase tracking-wider">Dominance</th>
                      </tr>
                    </thead>
                    <tbody>
                      {displayFactions.map((faction) => (
                        <tr key={faction.id} className={`border-b border-white/5 transition-colors group ${
                          faction.rank <= 3 ? 'hover:bg-white/10' : 'hover:bg-white/5'
                        }`}>
                          <td className="p-3 md:p-6">
                            <div className={`w-6 h-6 md:w-8 md:h-8 flex items-center justify-center rounded-full font-bold font-mono text-xs md:text-sm border
                              ${faction.rank === 1 ? 'bg-primary/10 border-primary/30 text-primary' : 
                                faction.rank <= 3 ? 'bg-white/5 border-white/20 text-white' : 
                                'bg-transparent border-transparent text-gray-500'}
                            `}>
                              {faction.rank}
                            </div>
                          </td>
                          <td className="p-3 md:p-6">
                            <div className={`font-bold text-sm md:text-base max-w-[110px] md:max-w-none truncate ${faction.rank === 1 ? 'text-white' : 'text-gray-200'} group-hover:text-primary transition-colors`}>
                              {faction.name}
                            </div>
                            {/* Mobile only tier indicator */}
                            <div className="md:hidden text-[10px] text-gray-500 mt-0.5">{faction.tier}</div>
                          </td>
                          <td className="hidden md:table-cell p-3 md:p-6">
                             <span className={`text-xs font-bold px-2 py-1 rounded border ${
                               faction.tier === 'Diamond' ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400' :
                               faction.tier === 'Platinum' ? 'bg-slate-400/10 border-slate-400/30 text-slate-300' :
                               faction.tier === 'Gold' ? 'bg-yellow-600/10 border-yellow-600/30 text-yellow-500' :
                               faction.tier === 'Silver' ? 'bg-gray-400/10 border-gray-400/30 text-gray-400' :
                               'bg-orange-800/10 border-orange-800/30 text-orange-700'
                             }`}>
                               {faction.tier}
                             </span>
                          </td>
                          <td className="p-3 md:p-6 text-right md:text-left">
                            <div className="flex items-center justify-end md:justify-start gap-1 md:gap-2 text-gray-300 font-mono font-medium text-xs md:text-base">
                              <Coins size={12} className="text-gray-500 hidden md:block" />
                              {(faction.totalLocked / 1000).toFixed(1)}k <span className="text-gray-600 hidden sm:inline">XRP</span>
                            </div>
                          </td>
                          <td className="hidden lg:table-cell p-3 md:p-6">
                             <div className="flex items-center gap-2 text-gray-300 font-mono">
                              <Users size={14} className="text-gray-500" />
                              {faction.members}
                            </div>
                          </td>
                          <td className="p-3 md:p-6 text-right md:text-left">
                            <div className={`flex items-center justify-end md:justify-start gap-1 text-xs md:text-sm font-bold w-full md:w-fit px-0 md:px-2 md:py-1 rounded ${
                                faction.growthRate >= 0 ? 'md:bg-success/10 text-success' : 'md:bg-red-500/10 text-red-500'
                            }`}>
                              {faction.growthRate >= 0 ? <TrendingUp size={12} className="md:w-3.5 md:h-3.5" /> : <TrendingDown size={12} className="md:w-3.5 md:h-3.5" />}
                              {faction.growthRate > 0 ? '+' : ''}{faction.growthRate}%
                            </div>
                          </td>
                          <td className="hidden sm:table-cell p-3 md:p-6">
                            <div className="flex items-center gap-3">
                              <div className="flex-1 h-1.5 bg-gray-800 rounded-full overflow-hidden min-w-[60px]">
                                <div 
                                  className={`h-full rounded-full ${faction.rank === 1 ? 'bg-gradient-to-r from-primary to-accent' : 'bg-gray-600'}`}
                                  style={{ width: `${Math.max(faction.dominance, 1)}%` }} 
                                />
                              </div>
                              <span className="text-xs font-bold text-gray-400 w-10 text-right">{faction.dominance}%</span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
          </div>

          {/* Right Column: Live Activity (Only in Landing Mode) */}
          {isLandingMode && (
             <div className="mt-0 lg:mt-0">
               <div className="hidden lg:block mb-8 h-8"></div> {/* Spacer for desktop alignment */}
               <LiveActivity />
             </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Leaderboard;