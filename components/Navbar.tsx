
import React, { useState } from 'react';
import { Shield, Wallet, LayoutDashboard, Trophy, Menu, X, Vote, Loader2 } from 'lucide-react';
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
  const formatAddress = (addr: string) => `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;

  const handleLogoClick = () => {
    onNavigate(isConnected ? ViewState.DASHBOARD : ViewState.LANDING);
    setIsMobileMenuOpen(false);
  };

  const handleNavClick = (view: ViewState) => {
    onNavigate(view);
    setIsMobileMenuOpen(false);
  };

  const handleConnectClick = () => {
    if (isConnecting) return; // Prevent double clicks
    onConnect();
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-[200] border-b border-white/10 bg-[#0A0B10]/90 backdrop-blur-md transform-gpu">
      <div className="w-full px-6 md:px-8 lg:px-12 h-20 flex items-center justify-between">
        <div className="flex items-center gap-3 cursor-pointer group" onClick={handleLogoClick}>
          <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center border border-primary/50 text-primary group-hover:bg-primary/30 transition-colors">
            <Shield size={24} />
          </div>
          <span className="text-xl font-bold tracking-tight text-white group-hover:text-primary/90 transition-colors">
            FACTION <span className="text-accent">PROTOCOL</span>
          </span>
        </div>

        {/* Desktop Menu */}
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
            } ${isConnecting ? 'opacity-80 cursor-wait' : ''}`}
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

        {/* Mobile Menu Toggle */}
        <div className="md:hidden">
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-gray-400 hover:text-white"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-x-0 top-20 bottom-0 bg-[#0A0B10] border-t border-white/10 p-6 flex flex-col gap-6 animate-in fade-in slide-in-from-top-5 z-[190] overflow-y-auto">
           <button 
            onClick={() => handleNavClick(ViewState.LEADERBOARD)}
            className={`flex items-center gap-3 text-lg transition-colors ${
              currentView === ViewState.LEADERBOARD ? 'text-white font-bold' : 'text-gray-400'
            }`}
          >
            <Trophy size={20} />
            Leaderboard
          </button>
          
          {isConnected && (
             <button 
              onClick={() => handleNavClick(ViewState.DASHBOARD)}
              className={`flex items-center gap-3 text-lg transition-colors ${
                currentView === ViewState.DASHBOARD ? 'text-white font-bold' : 'text-gray-400'
              }`}
            >
              <LayoutDashboard size={20} />
              Dashboard
            </button>
          )}

          <button 
            onClick={() => handleNavClick(ViewState.GOVERNANCE)}
            className={`flex items-center gap-3 text-lg transition-colors ${
              currentView === ViewState.GOVERNANCE ? 'text-white font-bold' : 'text-gray-400'
            }`}
          >
            <Vote size={20} />
            Governance
          </button>

           <button 
            onClick={handleConnectClick}
            disabled={isConnecting}
            className={`w-full flex items-center justify-center gap-2 px-5 py-4 rounded-xl text-lg font-semibold transition-all mt-2 ${
              isConnected 
                ? 'bg-surface border border-accent/50 text-accent' 
                : 'bg-primary text-white'
            }`}
          >
            {isConnecting ? (
               <Loader2 size={20} className="animate-spin" />
            ) : (
               <Wallet size={20} />
            )}
            {isConnecting ? 'Verifying...' : (isConnected && walletAddress ? formatAddress(walletAddress) : 'Connect Wallet')}
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
