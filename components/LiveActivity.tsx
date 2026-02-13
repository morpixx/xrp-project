import React, { useState, useEffect } from 'react';
import { Activity, Globe } from 'lucide-react';

interface ActivityItem {
  id: string;
  wallet: string;
  amount: number;
  type: 'lock' | 'join' | 'create';
  timestamp: string;
}

const LiveActivity: React.FC = () => {
  const [items, setItems] = useState<ActivityItem[]>([]);
  const [txRate, setTxRate] = useState(142);
  const [blockHeight, setBlockHeight] = useState(84291004);

  useEffect(() => {
    // Helper to generate random wallet and amount
    const generateItem = () => {
      const chars = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
      const randomStr = (len: number) => Array.from({length: len}, () => chars[Math.floor(Math.random() * chars.length)]).join('');
      
      // Weigh 'lock' higher than others
      const weightedTypes = ['lock', 'lock', 'lock', 'join', 'create'];
      const type = weightedTypes[Math.floor(Math.random() * weightedTypes.length)] as 'lock' | 'join' | 'create';
      
      let amount = 0;
      if (type === 'lock') amount = Math.floor(Math.random() * 4500) + 100;
      if (type === 'create') amount = 25;
      
      return {
        id: Math.random().toString(36).substr(2, 9),
        wallet: `r${randomStr(4)}...${randomStr(4)}`,
        amount,
        type,
        timestamp: 'Just now'
      };
    };

    // Initial population
    setItems(Array.from({ length: 6 }).map(generateItem));

    // Live update simulation
    const interval = setInterval(() => {
      setItems(prev => {
        const newItem = generateItem();
        return [newItem, ...prev.slice(0, 5)]; // Keep recent 6 items
      });
      // Simulate slight fluctuation in TPS
      setTxRate(prev => Math.floor(Math.random() * 15) + 130);
      setBlockHeight(prev => prev + 1);
    }, 2000); // Update every 2 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="glass rounded-2xl p-5 md:p-6 h-full flex flex-col relative overflow-hidden group min-h-[340px]">
      {/* Decorative background pulse */}
      <div className="absolute -right-10 -top-10 w-32 h-32 bg-success/5 rounded-full blur-[50px] group-hover:bg-success/10 transition-all duration-700"></div>

      {/* Header */}
      <div className="flex items-start justify-between mb-6 relative z-10">
        <div>
          <div className="flex items-center gap-2 mb-1">
             <Activity size={18} className="text-success animate-pulse-slow" />
             <h3 className="font-bold text-white text-base md:text-lg">Network Pulse</h3>
          </div>
          <p className="text-xs text-gray-400 max-w-[200px]">Real-time verification of on-chain faction events.</p>
        </div>
        <div className="text-right">
             <div className="text-xl md:text-2xl font-mono font-bold text-white leading-none">{txRate}</div>
             <div className="text-[10px] uppercase tracking-wider text-success font-bold mt-1">TPS / 100</div>
        </div>
      </div>
      
      {/* Timeline List */}
      <div className="space-y-0 flex-1 relative z-10">
        {/* Timeline Vertical Line */}
        <div className="absolute left-[11px] top-2 bottom-4 w-[1px] bg-gradient-to-b from-white/10 to-transparent"></div>
        
        {items.map((item) => (
          <div 
            key={item.id} 
            className="flex items-center gap-4 py-3 animate-in fade-in slide-in-from-left-4 duration-500"
          >
            {/* Timeline Dot */}
            <div className="relative z-10 bg-[#0A0B10] border border-white/10 rounded-full p-1 transition-colors">
               <div className={`w-1.5 h-1.5 rounded-full ${
                   item.type === 'create' ? 'bg-primary shadow-[0_0_8px_rgba(88,101,242,0.8)]' : 
                   item.type === 'join' ? 'bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]' : 
                   'bg-success shadow-[0_0_8px_rgba(0,208,132,0.8)]'
               }`}></div>
            </div>
            
            {/* Content */}
            <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline mb-0.5">
                    <span className="text-gray-400 font-mono text-[10px] md:text-xs truncate">{item.wallet}</span>
                    <span className="text-[10px] text-gray-600">{item.timestamp}</span>
                </div>
                <div className="text-xs md:text-sm">
                    {item.type === 'lock' && (
                        <span className="text-gray-300">
                            Locked <span className="text-success font-mono font-bold ml-1">{item.amount.toLocaleString()} XRP</span>
                        </span>
                    )}
                    {item.type === 'join' && <span className="text-gray-500">Joined a faction</span>}
                    {item.type === 'create' && <span className="text-white font-bold">New Faction Created</span>}
                </div>
            </div>
          </div>
        ))}
      </div>

       {/* Footer Status */}
       <div className="mt-4 pt-4 border-t border-white/5 flex justify-between items-center text-[10px] md:text-xs text-gray-500 font-mono">
          <div className="flex items-center gap-2">
             <Globe size={12} className="text-gray-600" />
             XRPL Mainnet
          </div>
          <span className="opacity-50">Block #{blockHeight.toLocaleString()}</span>
       </div>
    </div>
  );
};

export default LiveActivity;