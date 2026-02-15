
import React, { useState, useEffect, useRef } from 'react';
import { UserState } from '../types';
import { PlusCircle, LogOut, Wallet, Trophy, Users, AlertCircle, Lock, Unlock, CheckCircle2, ChevronLeft, Link as LinkIcon, Sparkles, Coins, Zap, Search, Copy, Check, DoorOpen } from 'lucide-react';
import LiveActivity from './LiveActivity';
import { MOCK_FACTIONS } from '../constants';

interface DashboardProps {
  user: UserState;
  onDisconnect: () => void;
  onLock: (amount: number) => void;
  onUnlock: (amount: number) => void;
  onCreateFaction: (name: string, method: 'fee' | 'invite') => void;
  onJoinFaction: (factionId: string) => void;
  onLeaveFaction: () => void;
  onSimulateInvite: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, onDisconnect, onLock, onUnlock, onCreateFaction, onJoinFaction, onLeaveFaction, onSimulateInvite }) => {
  const [stakeAmount, setStakeAmount] = useState('');
  const [activeTab, setActiveTab] = useState<'lock' | 'unlock'>('lock');
  
  // UI States
  const [isCreating, setIsCreating] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const [newFactionName, setNewFactionName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [copied, setCopied] = useState(false);
  const [creationInviteCopied, setCreationInviteCopied] = useState(false);

  // Animation States
  const [displayBalance, setDisplayBalance] = useState(0);
  const [showBonus, setShowBonus] = useState(false);
  const requestRef = useRef<number | undefined>(undefined);
  const startTimeRef = useRef<number | undefined>(undefined);
  const startValueRef = useRef<number>(0);
  const endValueRef = useRef<number>(user.balance);

  // Invite Animation States
  const prevInvitesRef = useRef(user.invitesCount);
  const [showInviteSuccess, setShowInviteSuccess] = useState(false);

  useEffect(() => {
    if (user.invitesCount > prevInvitesRef.current) {
      setShowInviteSuccess(true);
      setTimeout(() => setShowInviteSuccess(false), 3000);
    }
    prevInvitesRef.current = user.invitesCount;
  }, [user.invitesCount]);

  // Check for bonus on mount (simulated logic: if balance is exactly 150 initially)
  useEffect(() => {
    if (user.balance === 150) {
      setShowBonus(true);
      // Increased duration to 6s to match slower animation
      const timer = setTimeout(() => setShowBonus(false), 6000);
      return () => clearTimeout(timer);
    }
  }, []);

  // Animate balance changes
  useEffect(() => {
    startValueRef.current = displayBalance;
    endValueRef.current = user.balance;
    startTimeRef.current = undefined;

    const animate = (time: number) => {
      if (startTimeRef.current === undefined) {
        startTimeRef.current = time;
      }
      const timeElapsed = time - startTimeRef.current;
      const duration = 3000; // Increased to 3s for slower counting effect

      if (timeElapsed < duration) {
        const progress = 1 - Math.pow(1 - (timeElapsed / duration), 4); // Quartic ease out
        const nextVal = startValueRef.current + (endValueRef.current - startValueRef.current) * progress;
        setDisplayBalance(nextVal);
        requestRef.current = requestAnimationFrame(animate);
      } else {
        setDisplayBalance(endValueRef.current);
      }
    };

    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [user.balance]);

  // Safe Environment Domain Access
  const getAppDomain = () => {
    try {
      // @ts-ignore
      if (typeof process !== 'undefined' && process.env && process.env.REACT_APP_DOMAIN) {
        // @ts-ignore
        return process.env.REACT_APP_DOMAIN;
      }
    } catch (e) {
      // ignore error
    }
    
    if (typeof window !== 'undefined') {
      return window.location.origin;
    }
    
    return 'https://factionprotocol.io';
  };

  const APP_DOMAIN = getAppDomain();

  const handleAction = () => {
    const amount = parseFloat(stakeAmount);
    if (isNaN(amount) || amount <= 0) return;

    if (activeTab === 'lock') {
      if (amount > user.balance) return; 
      onLock(amount);
    } else {
      if (amount > user.lockedAmount) return;
      onUnlock(amount);
    }
    setStakeAmount('');
  };

  const generateInviteLink = () => {
    return `${APP_DOMAIN}/join?ref=${user.walletAddress}`;
  };

  const handleCopyInvite = () => {
    navigator.clipboard.writeText(generateInviteLink());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyCreationInvite = () => {
    navigator.clipboard.writeText(generateInviteLink());
    setCreationInviteCopied(true);
    setTimeout(() => setCreationInviteCopied(false), 2000);

    // Simulate an invite conversion for demo purposes
    if (user.invitesCount < 5) {
        // Random delay between 1.5s and 3s to mimic a friend clicking the link
        const delay = 1500 + Math.random() * 1500;
        setTimeout(() => {
            onSimulateInvite();
        }, delay);
    }
  };

  const amountNum = parseFloat(stakeAmount) || 0;
  const penalty = activeTab === 'unlock' ? amountNum * 0.02 : 0;
  const receiveAmount = activeTab === 'unlock' ? amountNum - penalty : amountNum;
  
  const isValid = activeTab === 'lock' 
    ? amountNum > 0 && amountNum <= user.balance
    : amountNum > 0 && amountNum <= user.lockedAmount;

  // Faction Creation Helper States
  const canAffordFee = user.balance >= 25;
  const isInviteUnlocked = user.invitesCount >= 5;
  const canLeave = user.lockedAmount <= 0;

  // Filter factions for Join View
  const filteredFactions = MOCK_FACTIONS.filter(f => 
    f.name.toLowerCase().includes(searchQuery.toLowerCase())
  ).slice(0, 10); // Show top 10 matching

  // Formatting helper for consistent "150,00" style (comma decimal)
  const formatXRP = (val: number) => {
    return val.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  return (
    <div className="pt-24 pb-12 px-4 md:px-6 min-h-screen bg-[#0A0B10]">
      <div className="max-w-7xl mx-auto space-y-6 md:space-y-8">
        
        {/* User Status Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Command Center</h1>
            <p className="text-gray-400 text-sm">Manage your assets and faction influence.</p>
          </div>
          <button 
            onClick={onDisconnect}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors text-sm font-medium w-full md:w-auto justify-center"
          >
            <LogOut size={16} /> Disconnect
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <div className={`glass-card p-6 rounded-xl relative overflow-hidden transition-all duration-1000 ${showBonus ? 'border-success/40 shadow-[0_0_40px_rgba(0,208,132,0.2)]' : ''}`}>
            {/* Bonus Visual Effects */}
            {showBonus && (
                <>
                  <div className="absolute -top-12 -right-12 w-32 h-32 bg-success/20 rounded-full blur-3xl animate-[pulse_3s_ease-in-out_infinite] pointer-events-none"></div>
                  <div className="absolute top-2 right-2 animate-in fade-in slide-in-from-right duration-1000">
                    <span className="px-2 py-0.5 rounded-full bg-success/10 border border-success/20 text-success text-[10px] font-bold uppercase tracking-wider shadow-sm">
                        Bonus Active
                    </span>
                  </div>
                </>
            )}

            <div className="flex items-center gap-3 mb-2 relative z-10">
              <div className={`p-2 rounded-lg transition-colors duration-1000 ${showBonus ? 'bg-success/20 text-success' : 'bg-primary/20 text-primary'}`}>
                <Wallet size={20} className={showBonus ? 'animate-[pulse_2s_ease-in-out_infinite]' : ''} />
              </div>
              <span className="text-gray-400 text-sm font-medium">Wallet Balance</span>
            </div>
            
            <div className="relative z-10">
                 <div className={`text-xl md:text-2xl font-mono font-bold truncate transition-all duration-1000 ${showBonus ? 'text-white text-glow' : ''}`}>
                    {formatXRP(displayBalance)} XRP
                </div>
                 {/* Floating Bonus Text Animation */}
                 <div className={`absolute top-0 left-0 text-success font-bold font-mono text-sm pointer-events-none ${
                    showBonus ? 'opacity-100' : 'opacity-0 hidden'
                 }`}
                 style={{ animation: showBonus ? 'floatUp 4s ease-out forwards' : 'none' }}
                 >
                    +150,00
                 </div>
                 
                 {/* CSS Keyframes for the floatUp */}
            </div>
            <style>{`
                @keyframes floatUp {
                    0% { transform: translateY(0px); opacity: 0; }
                    20% { transform: translateY(-15px); opacity: 1; }
                    80% { transform: translateY(-35px); opacity: 1; }
                    100% { transform: translateY(-45px); opacity: 0; }
                }
            `}</style>
          </div>

          <div className="glass-card p-6 rounded-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-3 opacity-10"><Trophy size={64} /></div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-accent/20 rounded-lg text-accent"><Trophy size={20} /></div>
              <span className="text-gray-400 text-sm font-medium">Est. Reward</span>
            </div>
            <div className="text-xl md:text-2xl font-mono font-bold text-accent">+{user.estimatedReward} XRP</div>
            <div className="text-xs text-gray-500 mt-1">Based on current dominance</div>
          </div>

           <div className="glass-card p-6 rounded-xl">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-warning/20 rounded-lg text-warning"><Users size={20} /></div>
              <span className="text-gray-400 text-sm font-medium">My Faction</span>
            </div>
            <div className="text-xl md:text-2xl font-bold truncate">
                {user.factionId ? (user.factionName || 'Unknown') : 'None'}
            </div>
            {user.factionId && <div className="text-xs text-success mt-1">Rank #{user.factionRank} • Top Tier</div>}
          </div>

           <div className="glass-card p-6 rounded-xl border border-primary/20">
             <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-white/10 rounded-lg text-white"><AlertCircle size={20} /></div>
              <span className="text-gray-400 text-sm font-medium">Locked Assets</span>
            </div>
            <div className="text-xl md:text-2xl font-mono font-bold truncate">{formatXRP(user.lockedAmount)} XRP</div>
             <div className="text-xs text-gray-500 mt-1">Unlocks in 3d 14h</div>
          </div>
        </div>

        {/* Action Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
            {/* Left Column: Faction Actions */}
            <div className="lg:col-span-2 space-y-6">
                {!user.factionId ? (
                    // ---------------- NO FACTION (ROGUE) STATE ----------------
                    isCreating ? (
                      // === CREATE VIEW ===
                      <div className="glass p-6 md:p-8 rounded-2xl border border-primary/20 animate-in fade-in slide-in-from-bottom-4">
                        <div className="flex items-center gap-3 mb-6">
                          <button onClick={() => setIsCreating(false)} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                            <ChevronLeft size={20} />
                          </button>
                          <h3 className="text-xl font-bold">Establish New Faction</h3>
                        </div>

                        <div className="mb-8">
                          <label className="block text-sm text-gray-400 mb-2 font-medium">Faction Name</label>
                          <input 
                            type="text" 
                            value={newFactionName}
                            onChange={(e) => setNewFactionName(e.target.value)}
                            placeholder="Enter a unique name" 
                            className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary/50 transition-colors text-lg"
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Option 1: Pay Fee */}
                          <div className={`p-5 rounded-xl border transition-all ${
                            canAffordFee 
                              ? 'bg-white/5 border-white/10 hover:border-primary/30' 
                              : 'bg-red-500/5 border-red-500/20'
                          }`}>
                             <div className="flex items-start justify-between mb-4">
                                <div className={`p-2 rounded-lg ${canAffordFee ? 'bg-primary/20 text-primary' : 'bg-red-500/20 text-red-500'}`}>
                                  <Coins size={20} />
                                </div>
                                <span className={`px-2 py-1 text-xs font-bold rounded ${canAffordFee ? 'bg-primary/10 text-primary' : 'bg-red-500/10 text-red-500'}`}>
                                  Instant
                                </span>
                             </div>
                             <h4 className="font-bold text-lg">Pay Creation Fee</h4>
                             <p className="text-sm text-gray-400 mt-1 mb-4">Use your XRP balance to instantly register your faction on-chain.</p>
                             <div className={`text-2xl font-mono font-bold mb-4 ${canAffordFee ? 'text-white' : 'text-red-400'}`}>
                               25 XRP
                               {!canAffordFee && <span className="block text-xs font-sans font-normal mt-1 opacity-70">Insufficient funds</span>}
                             </div>
                             <button 
                               onClick={() => onCreateFaction(newFactionName, 'fee')}
                               disabled={!newFactionName || !canAffordFee}
                               className={`w-full py-2.5 rounded-lg font-bold text-sm transition-all ${
                                 !newFactionName || !canAffordFee
                                 ? 'bg-white/5 text-gray-500 cursor-not-allowed'
                                 : 'bg-primary text-white hover:bg-primary/90'
                               }`}
                             >
                               {!canAffordFee ? 'Insufficient Balance' : 'Pay & Create'}
                             </button>
                          </div>

                          {/* Option 2: Invite Friends */}
                          <div className={`p-5 rounded-xl border transition-all ${
                            isInviteUnlocked 
                              ? 'bg-accent/5 border-accent/50 shadow-[0_0_20px_rgba(60,242,194,0.1)]' 
                              : 'bg-white/5 border-white/10 hover:border-accent/30'
                          }`}>
                             <div className="flex items-start justify-between mb-4">
                                <div className={`p-2 rounded-lg ${isInviteUnlocked ? 'bg-accent text-black' : 'bg-accent/20 text-accent'}`}>
                                  <Zap size={20} fill={isInviteUnlocked ? "currentColor" : "none"} />
                                </div>
                                <span className="px-2 py-1 bg-accent/10 text-accent text-xs font-bold rounded">Free</span>
                             </div>
                             <h4 className="font-bold text-lg">Community Growth</h4>
                             <p className="text-sm text-gray-400 mt-1 mb-4">Invite 5 active wallets to waive the fee completely.</p>
                             
                             <div className="mb-4 relative">
                                <div className="flex justify-between text-xs mb-2">
                                  <span className="text-gray-400 font-medium">Progress Tracker</span>
                                  <span className={`transition-colors duration-300 ${isInviteUnlocked ? "text-accent font-bold" : "text-white"}`}>
                                    {user.invitesCount}/5 Invites
                                  </span>
                                </div>
                                <div className="flex gap-1 h-2 relative">
                                  {[1, 2, 3, 4, 5].map((step) => (
                                    <div 
                                      key={step}
                                      className={`flex-1 rounded-full transition-all duration-500 ${
                                        user.invitesCount >= step 
                                          ? 'bg-accent shadow-[0_0_8px_rgba(60,242,194,0.6)]' 
                                          : 'bg-white/10'
                                      }`}
                                    />
                                  ))}
                                </div>
                                
                                {/* Success Toast for Invite */}
                                <div className={`absolute -right-2 -top-8 bg-accent text-black text-[10px] font-bold px-2 py-1 rounded transition-all duration-500 transform ${showInviteSuccess ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'}`}>
                                    +1 Recruit Joined! 🚀
                                </div>
                             </div>

                             <div className="flex gap-2">
                               <button 
                                 onClick={handleCopyCreationInvite}
                                 className={`flex-1 py-2.5 rounded-lg font-bold text-xs border border-white/10 transition-all flex items-center justify-center gap-2 ${
                                    creationInviteCopied ? 'bg-success text-black' : 'bg-white/5 hover:bg-white/10 text-white'
                                 }`}
                               >
                                 {creationInviteCopied ? <Check size={14} /> : <LinkIcon size={14} />} 
                                 {creationInviteCopied ? 'Copied' : 'Copy Invite Link'}
                               </button>
                               <button 
                                  onClick={() => onCreateFaction(newFactionName, 'invite')}
                                  disabled={!newFactionName || !isInviteUnlocked}
                                  className={`flex-1 py-2.5 rounded-lg font-bold text-xs transition-all flex items-center justify-center gap-2 ${
                                    !newFactionName || !isInviteUnlocked
                                    ? 'bg-white/5 text-gray-500 cursor-not-allowed'
                                    : 'bg-accent text-black hover:bg-accent/90 shadow-[0_0_15px_rgba(60,242,194,0.3)]'
                                  }`}
                               >
                                 <Sparkles size={14} /> 
                                 {isInviteUnlocked ? 'Create Free' : 'Locked'}
                               </button>
                             </div>
                          </div>
                        </div>
                      </div>
                    ) : isJoining ? (
                      // === JOIN VIEW ===
                      <div className="glass p-6 md:p-8 rounded-2xl border border-white/10 animate-in fade-in slide-in-from-bottom-4">
                        <div className="flex items-center gap-3 mb-6">
                           <button onClick={() => setIsJoining(false)} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                            <ChevronLeft size={20} />
                          </button>
                          <h3 className="text-xl font-bold">Join Existing Faction</h3>
                        </div>

                        {/* Search Bar */}
                        <div className="relative mb-6">
                           <Search className="absolute left-4 top-3.5 text-gray-500" size={20} />
                           <input 
                              type="text" 
                              placeholder="Search faction name..." 
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                              className="w-full bg-black/40 border border-white/10 rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:border-accent/50 transition-colors text-white"
                           />
                        </div>

                        {/* Results List */}
                        <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                           {filteredFactions.map(faction => (
                             <div key={faction.id} className="p-4 rounded-xl bg-white/5 border border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-accent/30 transition-all group">
                                <div className="flex items-center gap-4">
                                   <div className="w-10 h-10 rounded-full bg-black/50 flex items-center justify-center font-bold text-sm border border-white/10 text-gray-400 group-hover:text-accent group-hover:border-accent/30 transition-colors">
                                      #{faction.rank}
                                   </div>
                                   <div>
                                      <div className="font-bold text-white text-lg">{faction.name}</div>
                                      <div className="text-xs text-gray-400 flex items-center gap-3">
                                         <span>{faction.members} Members</span>
                                         <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
                                         <span>{(faction.totalLocked/1000).toFixed(1)}k locked</span>
                                      </div>
                                   </div>
                                </div>
                                <button 
                                  onClick={() => onJoinFaction(faction.id)}
                                  className="w-full sm:w-auto px-6 py-2 bg-white/10 hover:bg-accent hover:text-black text-white rounded-lg font-bold text-sm transition-all"
                                >
                                  Join
                                </button>
                             </div>
                           ))}
                           {filteredFactions.length === 0 && (
                              <div className="text-center py-10 text-gray-500">
                                No factions found matching "{searchQuery}"
                              </div>
                           )}
                        </div>
                      </div>
                    ) : (
                      // === DEFAULT SELECTION VIEW ===
                      <div className="glass p-6 md:p-8 rounded-2xl border border-accent/20">
                          <h3 className="text-xl font-bold mb-4">You are rogue. Choose a side.</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <button 
                                onClick={() => setIsJoining(true)}
                                className="h-40 rounded-xl border border-white/10 hover:border-white/30 hover:bg-white/5 transition-all group flex flex-col items-center justify-center gap-3"
                              >
                                  <Users className="text-gray-400 group-hover:text-white w-8 h-8 transition-colors" />
                                  <span className="font-bold">Join Existing Faction</span>
                                  <span className="text-xs text-gray-500">Browse the leaderboard</span>
                              </button>
                               <button 
                                onClick={() => setIsCreating(true)}
                                className="h-40 rounded-xl border border-white/10 hover:border-primary hover:bg-primary/5 transition-all group flex flex-col items-center justify-center gap-3 relative overflow-hidden"
                              >
                                  <div className="absolute top-2 right-2 px-2 py-0.5 bg-primary text-white text-[10px] font-bold uppercase rounded">New</div>
                                  <PlusCircle className="text-gray-400 group-hover:text-primary w-8 h-8 transition-colors" />
                                  <span className="font-bold">Create New Faction</span>
                                  <span className="text-xs text-gray-500">25 XRP Fee OR Invite 5 Friends</span>
                              </button>
                          </div>
                      </div>
                    )
                ) : (
                    // ---------------- ACTIVE FACTION MEMBER STATE ----------------
                    <div className="glass p-6 md:p-8 rounded-2xl animate-in fade-in">
                        <div className="flex items-center justify-between mb-6">
                          <div className="flex items-center gap-3">
                             <h3 className="text-xl font-bold">Faction Operations</h3>
                             <div className="flex items-center gap-2 px-3 py-1 bg-success/10 text-success rounded-full text-xs font-bold">
                               <CheckCircle2 size={14} /> Member
                             </div>
                          </div>
                          
                          {/* LEAVE FACTION BUTTON */}
                          <div className="relative group">
                            <button 
                              onClick={onLeaveFaction}
                              disabled={!canLeave}
                              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                                canLeave 
                                  ? 'bg-red-500/10 text-red-500 hover:bg-red-500/20' 
                                  : 'bg-white/5 text-gray-500 cursor-not-allowed'
                              }`}
                            >
                              <DoorOpen size={14} />
                              Leave Faction
                            </button>
                            {/* Tooltip for disabled state */}
                            {!canLeave && (
                              <div className="absolute top-full right-0 mt-2 w-48 p-2 bg-black/90 border border-white/10 rounded-lg text-[10px] text-gray-300 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity z-20 shadow-xl">
                                You must withdraw all locked assets before leaving the faction.
                              </div>
                            )}
                          </div>
                        </div>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                             {/* Manage Stake Card */}
                             <div className="rounded-xl bg-white/5 border border-white/5 overflow-hidden">
                                 {/* Tabs */}
                                 <div className="flex border-b border-white/5">
                                   <button 
                                     onClick={() => setActiveTab('lock')}
                                     className={`flex-1 py-3 text-sm font-bold flex items-center justify-center gap-2 transition-colors ${activeTab === 'lock' ? 'bg-primary/10 text-primary' : 'hover:bg-white/5 text-gray-400'}`}
                                   >
                                     <Lock size={14} /> Lock
                                   </button>
                                   <button 
                                     onClick={() => setActiveTab('unlock')}
                                     className={`flex-1 py-3 text-sm font-bold flex items-center justify-center gap-2 transition-colors ${activeTab === 'unlock' ? 'bg-warning/10 text-warning' : 'hover:bg-white/5 text-gray-400'}`}
                                   >
                                     <Unlock size={14} /> Unlock
                                   </button>
                                 </div>

                                 <div className="p-4">
                                     <div className="flex justify-between items-center mb-4">
                                       <h4 className="font-bold text-lg">{activeTab === 'lock' ? 'Increase Stake' : 'Early Withdraw'}</h4>
                                       <span className="text-xs text-gray-400 font-mono">
                                         Available: {activeTab === 'lock' ? formatXRP(user.balance) : formatXRP(user.lockedAmount)}
                                       </span>
                                     </div>
                                     
                                     {activeTab === 'unlock' && (
                                       <div className="mb-4 p-3 bg-warning/10 border border-warning/20 rounded-lg flex items-start gap-3">
                                          <AlertCircle className="text-warning shrink-0 mt-0.5" size={16} />
                                          <div className="text-xs text-warning/90">
                                            <span className="font-bold block mb-1">Early Unlock Penalty</span>
                                            Withdrawing before cycle end incurs a 2% fee on the unlocked amount.
                                          </div>
                                       </div>
                                     )}

                                     <div className="flex gap-2 mb-2">
                                         <div className="relative w-full">
                                            <input 
                                              type="number" 
                                              value={stakeAmount}
                                              onChange={(e) => setStakeAmount(e.target.value)}
                                              placeholder="Amount" 
                                              className="w-full bg-black/50 border border-white/10 rounded-lg pl-3 pr-12 py-2 text-sm focus:outline-none focus:border-primary/50 transition-colors" 
                                            />
                                            <span className="absolute right-3 top-2 text-xs text-gray-500 font-bold">XRP</span>
                                         </div>
                                         <button 
                                           onClick={() => setStakeAmount(activeTab === 'lock' ? user.balance.toString() : user.lockedAmount.toString())}
                                           className="px-3 py-2 bg-white/5 hover:bg-white/10 text-xs font-bold rounded-lg transition-colors"
                                         >
                                           MAX
                                         </button>
                                     </div>

                                     {amountNum > 0 && activeTab === 'unlock' && (
                                        <div className="flex justify-between text-xs text-gray-400 mb-4 px-1">
                                            <span>Penalty (2%):</span>
                                            <span className="text-red-400">-{penalty.toFixed(2)} XRP</span>
                                        </div>
                                     )}
                                     
                                     <button 
                                       disabled={!isValid}
                                       onClick={handleAction}
                                       className={`w-full py-2.5 rounded-lg font-bold text-sm transition-all ${
                                         isValid 
                                           ? activeTab === 'lock' 
                                             ? 'bg-primary text-white hover:bg-primary/90' 
                                             : 'bg-warning text-black hover:bg-warning/90'
                                           : 'bg-white/5 text-gray-500 cursor-not-allowed'
                                       }`}
                                     >
                                       {activeTab === 'lock' ? 'Lock Liquidity' : `Withdraw ${receiveAmount > 0 ? receiveAmount.toFixed(2) : ''} XRP`}
                                     </button>
                                 </div>
                             </div>

                             {/* Invite Card */}
                              <div className="p-4 rounded-xl bg-white/5 border border-white/5 flex flex-col justify-between h-full">
                                 <div>
                                   <h4 className="font-bold text-lg mb-2">Invite Recruits</h4>
                                   <p className="text-sm text-gray-400 mb-4">Grow your faction score. Get a unique referral link to onboard new wallets.</p>
                                   <div className="p-3 bg-black/30 rounded-lg border border-white/5 flex items-center justify-between mb-4">
                                     <div>
                                        <span className="text-xs text-gray-500 block mb-1">Your Referral Code</span>
                                        <span className="font-mono font-bold tracking-widest text-accent text-sm md:text-base">XRP-77-WIN</span>
                                     </div>
                                     <div className="text-right">
                                        <span className="text-xs text-gray-500 block mb-1">Invited</span>
                                        <span className="font-bold text-white">{user.invitesCount}</span>
                                     </div>
                                   </div>
                                 </div>
                                 <button 
                                   onClick={handleCopyInvite}
                                   className={`w-full py-2.5 rounded-lg font-bold text-sm transition-all border border-white/5 flex items-center justify-center gap-2 ${
                                      copied ? 'bg-success text-black' : 'bg-white/10 hover:bg-white/20 text-white'
                                   }`}
                                 >
                                   {copied ? <Check size={14} /> : <Copy size={14} />}
                                   {copied ? 'Copied!' : 'Copy Invite Link'}
                                 </button>
                             </div>
                         </div>
                    </div>
                )}
            </div>

            {/* Right Column: Live Activity Feed */}
            <div className="w-full">
               <LiveActivity />
            </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
