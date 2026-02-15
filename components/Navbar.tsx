
import React, { useState, useEffect, useRef } from 'react';
import { Shield, Wallet, LayoutDashboard, Trophy, Menu, X, Vote, Loader2, Home } from 'lucide-react';
import { ViewState } from '../types';

interface NavbarProps {
  isConnected: boolean;
  isConnecting?: boolean;
  onConnect: () => void;
  walletAddress: string | null;
  onNavigate: (view: ViewState) => void;
  currentView: ViewState;
}

const Navbar: React.FC<NavbarProps> = ({ isConnected, isConnecting = false, onConnect, walletAddress, onNavigate, currentView }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  
  // Use ref to store the last scroll position
  const lastScrollY = useRef(0);
  
  const formatAddress = (addr: string) => `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Determine background transparency
      setIsScrolled(currentScrollY > 20);

      // Auto-collapse mobile menu on scroll
      // We check if the scroll difference is significant (>5px) to avoid accidental triggers
      if (Math.abs(currentScrollY - lastScrollY.current) > 5) {
         setIsMobileMenuOpen(false);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogoClick = () => {
    onNavigate(isConnected ? ViewState.DASHBOARD : ViewState.LANDING);
    setIsMobileMenuOpen(false);
  };

  const handleNavClick = (view: ViewState) => {
    onNavigate(view);
    setIsMobileMenuOpen(false);
  };

  const handleConnectClick = () => {
    if (isConnecting) return;
    onConnect();
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <nav 
        className={`fixed top-0 left-0 w-full z-[200] border-b transition-all duration-300 ease-in-out transform-gpu ${
          isScrolled || isMobileMenuOpen
            ? 'bg-[#0A0B10]/95 backdrop-blur-xl border-white/10 shadow-lg shadow-black/50' 
            : 'bg-transparent border-transparent'
        }`}
      >
        <div 
          className={`w-full px-6 md:px-8 lg:px-12 flex items-center justify-between transition-all duration-300 ease-in-out ${
            isScrolled ? 'h-16' : 'h-24'
          }`}
        >
          
          {/* Logo Section */}
          <div 
            className={`flex items-center gap-3 cursor-pointer group transition-all duration-300 origin-left ${
              isScrolled ? 'scale-90' : 'scale-100'
            }`} 
            onClick={handleLogoClick}
          >
            <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center border border-primary/50 text-primary group-hover:bg-primary/30 transition-colors">
              <Shield size={24} />
            </div>
            <span className="text-xl font-bold tracking-tight text-white group-hover:text-primary/90 transition-colors">
              FACTION <span className="text-accent">PROTOCOL</span>
            </span>
          </div>

          {/* Desktop Menu Actions */}
          <div className="hidden md:flex items-center gap-6 lg:gap-8">
            <button 
              onClick={() => onNavigate(ViewState.LEADERBOARD)}
              className={`flex items-center gap-2 text-sm transition-colors ${
                currentView === ViewState.LEADERBOARD ? 'text-white font-bold' : 'text-gray-400 hover:text-white'
              }`}
            >
              <Trophy size={16} />
              Leaderboard
            </button>
            
            {isConnected && (
              <button 
                onClick={() => onNavigate(ViewState.DASHBOARD)}
                className={`flex items-center gap-2 text-sm transition-colors ${
                  currentView === ViewState.DASHBOARD ? 'text-white font-bold' : 'text-gray-400 hover:text-white'
                }`}
              >
                <LayoutDashboard size={16} />
                Dashboard
              </button>
            )}

            <button 
              onClick={() => onNavigate(ViewState.GOVERNANCE)}
              className={`flex items-center gap-2 text-sm transition-colors ${
                currentView === ViewState.GOVERNANCE ? 'text-white font-bold' : 'text-gray-400 hover:text-white'
              }`}
            >
              <Vote size={16} />
              Governance
            </button>
            
            <button 
              onClick={handleConnectClick}
              disabled={isConnecting}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                isConnected 
                  ? 'bg-surface border border-accent/50 text-accent' 
                  : 'bg-primary hover:bg-primary/90 text-white accent-glow'
              } ${isConnecting ? 'opacity-80 cursor-wait' : ''} ${isScrolled ? 'scale-95 origin-right' : ''}`}
            >
              {isConnecting ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Connecting...
                </>
              ) : (
                <>
                  <Wallet size={16} />
                  {isConnected && walletAddress ? formatAddress(walletAddress) : 'Connect Wallet'}
                </>
              )}
            </button>
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="md:hidden flex items-center">
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={`p-2 rounded-xl transition-all ${
                  isMobileMenuOpen ? 'bg-white/10 text-white' : 'text-gray-400 hover:bg-white/10 hover:text-white'
                }`}
                aria-label="Toggle Menu"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu with CSS Transition for smooth collapsing */}
        <div 
            className={`md:hidden bg-[#0A0B10] overflow-hidden transition-all duration-300 ease-in-out ${
                isMobileMenuOpen 
                    ? 'max-h-[500px] opacity-100 border-t border-white/10 shadow-2xl' 
                    : 'max-h-0 opacity-0 border-none'
            }`}
        >
          <nav className="flex flex-col p-4 space-y-2">
              <button 
                onClick={() => handleNavClick(ViewState.LANDING)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium transition-colors ${
                  currentView === ViewState.LANDING ? 'bg-white/10 text-white' : 'text-gray-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Home size={20} />
                Home
              </button>

              <button 
                onClick={() => handleNavClick(ViewState.LEADERBOARD)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium transition-colors ${
                  currentView === ViewState.LEADERBOARD ? 'bg-white/10 text-white' : 'text-gray-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Trophy size={20} />
                Leaderboard
              </button>
              
              <button 
                onClick={() => handleNavClick(ViewState.GOVERNANCE)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium transition-colors ${
                  currentView === ViewState.GOVERNANCE ? 'bg-white/10 text-white' : 'text-gray-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Vote size={20} />
                Governance
              </button>

              {isConnected && (
                 <button 
                  onClick={() => handleNavClick(ViewState.DASHBOARD)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium transition-colors ${
                    currentView === ViewState.DASHBOARD ? 'bg-white/10 text-white' : 'text-gray-400 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <LayoutDashboard size={20} />
                  Dashboard
                </button>
              )}

              <div className="h-px bg-white/10 my-2 mx-2"></div>

              <button 
                onClick={handleConnectClick}
                disabled={isConnecting}
                className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-base font-bold transition-all ${
                  isConnected 
                    ? 'bg-surface border border-accent/50 text-accent' 
                    : 'bg-primary text-white hover:bg-primary/90'
                }`}
              >
                {isConnecting ? (
                   <Loader2 size={18} className="animate-spin" />
                ) : (
                   <Wallet size={18} />
                )}
                {isConnecting ? 'Verifying...' : (isConnected && walletAddress ? formatAddress(walletAddress) : 'Connect Wallet')}
              </button>
          </nav>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
