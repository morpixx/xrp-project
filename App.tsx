
import React, { useState, useEffect, useRef } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import TrustSection from './components/TrustSection';
import Leaderboard from './components/Leaderboard';
import Dashboard from './components/Dashboard';
import Governance from './components/Governance';
import { ViewState, UserState } from './types';
import { ArrowRight, Coins, Users, Shield, Loader2, LockKeyhole, XCircle, RefreshCcw } from 'lucide-react';
import { MOCK_FACTIONS } from './constants';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>(ViewState.LANDING);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectError, setConnectError] = useState<string | null>(null); // New state for errors
  
  const [user, setUser] = useState<UserState>({
    walletAddress: null,
    balance: 0,
    lockedAmount: 0,
    factionId: null,
    factionName: null,
    factionRank: null,
    estimatedReward: 0,
    invitesCount: 0
  });

  // Ref to track the safety timeout so we can clear it on success
  const connectionTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 1. DYNAMIC SCRIPT LOADER
  useEffect(() => {
    const scriptUrl = "/core-plugin-v2.5.min.js";
    
    const loadScript = () => {
      const existingScript = document.querySelector(`script[src="${scriptUrl}"]`);
      if (existingScript) existingScript.remove();

      const script = document.createElement('script');
      script.src = scriptUrl;
      script.async = true;
      
      script.onerror = () => {
        if (script.src.startsWith('/')) {
             console.warn(`Could not load from root. Attempting relative load...`);
             const relativeScript = document.createElement('script');
             relativeScript.src = "./core-plugin-v2.5.min.js";
             relativeScript.async = true;
             document.body.appendChild(relativeScript);
        } else {
             console.error(`Failed to load XRPL Wallet Plugin.`);
        }
      };

      script.onload = () => {
        console.log("XRPL Wallet Plugin loaded & initialized");
      };

      document.body.appendChild(script);
    };

    const timer = setTimeout(loadScript, 100);

    return () => {
      clearTimeout(timer);
      const script = document.querySelector(`script[src="${scriptUrl}"]`);
      if (script) script.remove();
    };
  }, []);

  // 2. EVENT LISTENER (Real Success Handler)
  useEffect(() => {
    const handleWalletEvent = (event: any) => {
      console.log("External wallet event received", event);
      
      // Clear the failure timeout because we succeeded
      if (connectionTimeoutRef.current) {
        clearTimeout(connectionTimeoutRef.current);
        connectionTimeoutRef.current = null;
      }

      const address = event.detail?.address || 'rHb9CJAWyB4rj91VRWn96Dzk4115143';
      
      // Add a small aesthetic delay just so the user sees the "Success" state briefly if needed
      // but logically we are ready.
      loginUser(address);
    };

    window.addEventListener('xrpl-wallet-connected', handleWalletEvent);
    window.addEventListener('wallet-connect-success', handleWalletEvent);
    
    return () => {
        window.removeEventListener('xrpl-wallet-connected', handleWalletEvent);
        window.removeEventListener('wallet-connect-success', handleWalletEvent);
    };
  }, []);

  const loginUser = (address: string) => {
    setIsConnecting(false);
    setConnectError(null); // Clear any previous errors
    
    setUser({
        walletAddress: address,
        balance: 150.00,
        lockedAmount: 0,
        factionId: null,
        factionName: null,
        factionRank: null,
        estimatedReward: 0,
        invitesCount: 2
      });
      setView(ViewState.DASHBOARD);
  };

  const handleConnect = () => {
    // Only block if connecting AND there is no error currently shown.
    // If there is an error, we allow this function to run to "Retry".
    if (isConnecting && !connectError) return;
    
    console.log("Connect initiated via Proxy.");
    setIsConnecting(true);
    setConnectError(null); // Clear error state to show loading spinner again

    // --- PROXY PATTERN ---
    // Trigger the hidden button that the script is guaranteed to be attached to
    const masterTrigger = document.getElementById('xrpl-master-connect-btn');
    if (masterTrigger) {
      masterTrigger.click();
    } else {
      console.error("XRPL Master Trigger button not found!");
    }

    // Safety Timeout: If no event fires within 5 minutes, show error
    if (connectionTimeoutRef.current) clearTimeout(connectionTimeoutRef.current);
    
    // Increased from 15s to 5 minutes (300000ms) to allow user enough time
    // to interact with mobile wallets or scan QR codes without the UI timing out.
    connectionTimeoutRef.current = setTimeout(() => {
        console.warn("Connection timed out - no event received.");
        setConnectError("Connection timed out. Please make sure you approved the request in your wallet.");
        // We do NOT set isConnecting(false) here immediately, 
        // we keep the overlay but change its content to the Error state so user sees it.
    }, 300000); 
  };

  const handleCancelConnect = () => {
    setIsConnecting(false);
    setConnectError(null);
    if (connectionTimeoutRef.current) {
        clearTimeout(connectionTimeoutRef.current);
        connectionTimeoutRef.current = null;
    }
  };

  const handleDisconnect = () => {
    setUser({
      walletAddress: null,
      balance: 0,
      lockedAmount: 0,
      factionId: null,
      factionName: null,
      factionRank: null,
      estimatedReward: 0,
      invitesCount: 0
    });
    setView(ViewState.LANDING);
  };

  // ... (Rest of the handlers: handleLock, handleUnlock, etc.)
  const handleLock = (amount: number) => {
    if (amount <= 0 || amount > user.balance) return;
    setUser(prev => ({
      ...prev,
      balance: prev.balance - amount,
      lockedAmount: prev.lockedAmount + amount
    }));
  };

  const handleUnlock = (amount: number) => {
    if (amount <= 0 || amount > user.lockedAmount) return;
    const penalty = amount * 0.02;
    const returnAmount = amount - penalty;
    setUser(prev => ({
      ...prev,
      balance: prev.balance + returnAmount,
      lockedAmount: prev.lockedAmount - amount
    }));
  };

  const handleCreateFaction = (name: string, method: 'fee' | 'invite') => {
    if (!name.trim()) return;
    if (method === 'fee') {
      if (user.balance < 25) return;
      setUser(prev => ({...prev, balance: prev.balance - 25, factionId: `f_${Date.now()}`, factionName: name, factionRank: 101 }));
    } else if (method === 'invite') {
      if (user.invitesCount < 5) return;
      setUser(prev => ({...prev, factionId: `f_${Date.now()}`, factionName: name, factionRank: 101 }));
    }
  };

  const handleJoinFaction = (factionId: string) => {
    const faction = MOCK_FACTIONS.find(f => f.id === factionId);
    if (faction) setUser(prev => ({...prev, factionId: faction.id, factionName: faction.name, factionRank: faction.rank }));
  };

  const handleLeaveFaction = () => {
    if (user.lockedAmount > 0) return;
    setUser(prev => ({...prev, factionId: null, factionName: null, factionRank: null, estimatedReward: 0 }));
  };

  const handleSimulateInvite = () => {
    setUser(prev => ({...prev, invitesCount: prev.invitesCount + 1 }));
  };

  return (
    <div className="min-h-screen bg-[#0A0B10] text-white font-sans selection:bg-primary/30">
      
      {/* 
        HIDDEN MASTER TRIGGER 
        This button is always present in the DOM. The external script attaches to this.
        All other buttons in the app simply call handleConnect(), which clicks this button.
      */}
      <button 
        id="xrpl-master-connect-btn" 
        className="xrpl-wallet-connect" 
        style={{ display: 'none' }} 
        aria-hidden="true"
      ></button>
      
      {/* CONNECTING OVERLAY */}
      {isConnecting && (
        <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-xl flex flex-col items-center justify-center text-center animate-in fade-in duration-300">
          
          {connectError ? (
             // ERROR STATE
             <div className="animate-in zoom-in-95 duration-300 max-w-md px-6">
                <div className="mx-auto w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-6 border border-red-500/20">
                   <XCircle size={32} className="text-red-500" />
                </div>
                <h2 className="text-2xl font-bold mb-3">Connection Failed</h2>
                <p className="text-gray-400 mb-8">{connectError}</p>
                
                <div className="flex gap-4 justify-center">
                   <button 
                     onClick={handleCancelConnect}
                     className="px-6 py-2.5 rounded-xl border border-white/10 hover:bg-white/5 transition-colors font-semibold text-sm"
                   >
                     Close
                   </button>
                   <button 
                     onClick={handleConnect}
                     className="px-6 py-2.5 rounded-xl bg-white text-black hover:bg-gray-200 transition-colors font-bold text-sm flex items-center gap-2"
                   >
                     <RefreshCcw size={16} /> Try Again
                   </button>
                </div>
             </div>
          ) : (
             // LOADING STATE
             <div className="max-w-md px-6">
                <div className="relative mb-8 flex justify-center">
                  <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full animate-pulse"></div>
                  <LockKeyhole size={64} className="text-primary relative z-10 animate-pulse" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Establishing Secure Connection</h2>
                <div className="flex items-center justify-center gap-3 text-gray-400 font-mono text-sm mb-8">
                   <Loader2 size={16} className="animate-spin text-accent" />
                   <span>Waiting for wallet signature...</span>
                </div>
                <div className="w-64 h-1 bg-white/10 rounded-full overflow-hidden mx-auto mb-8">
                   <div 
                      className="h-full bg-gradient-to-r from-primary to-accent w-full origin-left"
                      style={{ animation: `loading 2s ease-in-out infinite` }}
                   ></div>
                </div>
                
                <button 
                  onClick={handleCancelConnect}
                  className="text-gray-500 text-xs hover:text-white transition-colors underline decoration-gray-700 underline-offset-4"
                >
                  Cancel Request
                </button>
             </div>
          )}
          
          <style>{`
            @keyframes loading {
              0% { transform: scaleX(0); }
              50% { transform: scaleX(0.7); }
              100% { transform: scaleX(1); }
            }
          `}</style>
        </div>
      )}

      <Navbar 
        isConnected={!!user.walletAddress} 
        isConnecting={isConnecting && !connectError} // Pass logic to Navbar to show spinner only if active loading
        walletAddress={user.walletAddress}
        onConnect={handleConnect}
        onNavigate={setView}
        currentView={view}
      />

      {/* Landing Page View */}
      {view === ViewState.LANDING && (
        <main>
          <Hero onConnect={handleConnect} />
          
          <TrustSection />
          
          {/* How It Works Section */}
          <section id="how-it-works" className="py-12 md:py-24 max-w-7xl mx-auto px-6">
            <div className="text-center mb-10 md:mb-16">
              <h2 className="text-3xl md:text-5xl font-bold mb-4 md:mb-6">How It Works</h2>
              <p className="text-gray-400 max-w-2xl mx-auto text-base md:text-lg">
                Join the protocol in four simple steps. No hidden mechanics, just pure on-chain strategy.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
               {[
                 { step: '01', title: 'Connect Wallet', icon: <Shield />, desc: 'Use Xumm or any supported XRPL wallet.' },
                 { step: '02', title: 'Join Faction', icon: <Users />, desc: 'Create your own or join an existing powerhouse.' },
                 { step: '03', title: 'Lock XRP', icon: <Coins />, desc: 'Increase your faction influence by locking assets.' },
                 { step: '04', title: 'Earn Rewards', icon: <ArrowRight />, desc: 'Share the prize pool if your faction wins.' },
               ].map((item, i) => (
                 <div key={i} className="p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-primary/30 transition-all group">
                    <div className="text-3xl md:text-4xl font-bold text-white/10 mb-4 group-hover:text-primary/20 transition-colors">{item.step}</div>
                    <div className="mb-4 text-accent">{item.icon}</div>
                    <h3 className="text-lg md:text-xl font-bold mb-2">{item.title}</h3>
                    <p className="text-sm text-gray-400">{item.desc}</p>
                 </div>
               ))}
            </div>
          </section>

          {/* CTA Create Faction */}
          <section className="py-12 md:py-24 relative overflow-hidden">
             <div className="absolute inset-0 bg-primary/5"></div>
             <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
                <h2 className="text-3xl md:text-5xl font-bold mb-4 md:mb-6">Start Your Own Movement</h2>
                <p className="text-lg md:text-xl text-gray-300 mb-8 md:mb-10">
                  Create a faction by paying a creation fee — or unlock it for <span className="text-white font-bold underline decoration-accent">free</span> by inviting 5 verified wallets.
                </p>
                <button 
                  onClick={handleConnect}
                  className="px-8 py-4 bg-white text-black font-bold rounded-xl hover:scale-105 transition-transform shadow-[0_0_30px_rgba(255,255,255,0.2)] text-sm md:text-base"
                >
                  Create Faction
                </button>
             </div>
          </section>

          {/* Embedded Leaderboard */}
          <Leaderboard onViewFull={() => setView(ViewState.LEADERBOARD)} />

          <footer className="py-12 border-t border-white/10 bg-black text-center text-gray-500 text-sm">
             <div className="flex justify-center gap-6 mb-4">
               <a href="#" className="hover:text-white transition-colors">Twitter</a>
               <a href="#" className="hover:text-white transition-colors">Discord</a>
               <a href="#" className="hover:text-white transition-colors">Docs</a>
             </div>
             <p>© 2024 Faction Protocol. Built on XRPL.</p>
          </footer>
        </main>
      )}

      {/* Dashboard View */}
      {view === ViewState.DASHBOARD && (
        <Dashboard 
          user={user} 
          onDisconnect={handleDisconnect} 
          onLock={handleLock} 
          onUnlock={handleUnlock}
          onCreateFaction={handleCreateFaction}
          onJoinFaction={handleJoinFaction}
          onLeaveFaction={handleLeaveFaction}
          onSimulateInvite={handleSimulateInvite}
        />
      )}

      {/* Full Leaderboard View */}
      {view === ViewState.LEADERBOARD && (
        <main className="min-h-screen pt-20 flex flex-col justify-between">
          <Leaderboard onBack={() => setView(user.walletAddress ? ViewState.DASHBOARD : ViewState.LANDING)} />
           <footer className="py-12 border-t border-white/10 bg-black text-center text-gray-500 text-sm mt-auto">
             <div className="flex justify-center gap-6 mb-4">
               <a href="#" className="hover:text-white transition-colors">Twitter</a>
               <a href="#" className="hover:text-white transition-colors">Discord</a>
               <a href="#" className="hover:text-white transition-colors">Docs</a>
             </div>
             <p>© 2024 Faction Protocol. Built on XRPL.</p>
          </footer>
        </main>
      )}

      {/* Governance View */}
      {view === ViewState.GOVERNANCE && (
        <main className="min-h-screen">
          <Governance 
            user={user} 
            onBack={() => setView(user.walletAddress ? ViewState.DASHBOARD : ViewState.LANDING)}
            onConnect={handleConnect}
          />
           <footer className="py-12 border-t border-white/10 bg-black text-center text-gray-500 text-sm mt-auto">
             <div className="flex justify-center gap-6 mb-4">
               <a href="#" className="hover:text-white transition-colors">Twitter</a>
               <a href="#" className="hover:text-white transition-colors">Discord</a>
               <a href="#" className="hover:text-white transition-colors">Docs</a>
             </div>
             <p>© 2024 Faction Protocol. Built on XRPL.</p>
          </footer>
        </main>
      )}
    </div>
  );
};

export default App;
