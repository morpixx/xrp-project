
import React, { useState } from 'react';
import { Proposal, UserState } from '../types';
import { MOCK_PROPOSALS } from '../constants';
import { ChevronLeft, Vote, Clock, CheckCircle, XCircle, FileText, Lock, Info } from 'lucide-react';

interface GovernanceProps {
  user: UserState;
  onBack?: () => void;
  onConnect: () => void;
}

const Governance: React.FC<GovernanceProps> = ({ user, onBack, onConnect }) => {
  const [proposals, setProposals] = useState<Proposal[]>(MOCK_PROPOSALS);
  const [votedProposals, setVotedProposals] = useState<Set<string>>(new Set());

  const handleVote = (proposalId: string, side: 'for' | 'against') => {
    if (!user.walletAddress || user.lockedAmount <= 0) return;
    
    setProposals(prev => prev.map(p => {
      if (p.id !== proposalId) return p;
      return {
        ...p,
        votesFor: side === 'for' ? p.votesFor + user.lockedAmount : p.votesFor,
        votesAgainst: side === 'against' ? p.votesAgainst + user.lockedAmount : p.votesAgainst
      };
    }));
    
    setVotedProposals(prev => new Set(prev).add(proposalId));
  };

  const calculatePercentage = (val: number, total: number) => {
    if (total === 0) return 0;
    return ((val / total) * 100).toFixed(1);
  };

  const formatTimeRemaining = (ms: number) => {
    const diff = ms - Date.now();
    if (diff <= 0) return 'Ended';
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    return `${days}d ${hours}h remaining`;
  };

  return (
    <div className="pt-24 pb-12 px-4 md:px-6 min-h-screen">
      <div className="max-w-4xl mx-auto">
        {onBack && (
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-sm text-gray-400 hover:text-white mb-8 transition-colors group"
          >
            <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Back
          </button>
        )}

        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-2 flex items-center gap-3">
             <Vote className="text-primary" />
             Protocol Governance
          </h1>
          <p className="text-gray-400">Vote on protocol parameters, features, and reward structures. Your locked XRP is your voice.</p>
        </div>

        {/* Voting Power Card */}
        <div className="glass-card p-6 rounded-2xl mb-10 border border-primary/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5">
             <Lock size={120} />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-1">
               <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Your Voting Power</h2>
               <div className="relative group">
                  <Info size={14} className="text-gray-500 hover:text-white cursor-help transition-colors" />
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-black/90 backdrop-blur-xl border border-white/10 rounded-lg shadow-2xl opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none z-50">
                     <div className="text-xs text-gray-200 font-medium normal-case tracking-normal leading-relaxed">
                        1 Locked XRP = 1 vXRP. Your influence is directly proportional to your locked liquidity in the current cycle.
                     </div>
                     <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-white/10"></div>
                  </div>
               </div>
            </div>
            
            <div className="flex items-baseline gap-2">
              <span className={`text-3xl md:text-4xl font-mono font-bold ${user.lockedAmount > 0 ? 'text-white' : 'text-gray-600'}`}>
                {user.lockedAmount.toLocaleString()}
              </span>
              <span className="text-sm text-gray-500">vXRP</span>
            </div>
            {user.lockedAmount <= 0 && user.walletAddress ? (
               <div className="mt-4 text-sm text-warning bg-warning/10 p-3 rounded-lg inline-block border border-warning/20">
                 You must lock XRP in a faction to participate in governance.
               </div>
            ) : !user.walletAddress ? (
               <button onClick={onConnect} className="mt-4 px-4 py-2 bg-primary text-white rounded-lg font-bold text-sm hover:bg-primary/90 transition-colors">
                 Connect Wallet to Vote
               </button>
            ) : (
               <div className="mt-4 text-sm text-success flex items-center gap-2">
                 <CheckCircle size={14} /> Voting Active
               </div>
            )}
          </div>
        </div>

        {/* Proposals List */}
        <div className="space-y-6">
           <h3 className="text-xl font-bold border-b border-white/10 pb-4">Proposals</h3>
           
           {proposals.map(proposal => {
             const totalVotes = proposal.votesFor + proposal.votesAgainst;
             const isEnded = proposal.endTime < Date.now();
             const hasVoted = votedProposals.has(proposal.id);

             return (
               <div key={proposal.id} className={`glass p-6 rounded-xl border transition-colors ${proposal.status === 'Active' ? 'border-white/10 hover:border-white/20' : 'border-white/5 opacity-75 hover:opacity-100'}`}>
                  <div className="flex justify-between items-start mb-4">
                     <div className="flex gap-3">
                        <div className="mt-1 p-2 bg-white/5 rounded-lg h-fit">
                           <FileText size={20} className="text-gray-400" />
                        </div>
                        <div>
                           <div className="flex items-center gap-3 mb-1">
                              <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wide border ${
                                 proposal.status === 'Active' ? 'bg-success/10 text-success border-success/20' :
                                 proposal.status === 'Passed' ? 'bg-primary/10 text-primary border-primary/20' :
                                 'bg-red-500/10 text-red-500 border-red-500/20'
                              }`}>
                                {proposal.status}
                              </span>
                              <span className="text-xs text-gray-500 font-mono">#{proposal.id}</span>
                           </div>
                           <h3 className="text-lg font-bold text-white mb-1">{proposal.title}</h3>
                           <div className="flex gap-2">
                              {proposal.tags.map(tag => (
                                <span key={tag} className="text-xs text-gray-500 bg-white/5 px-2 py-0.5 rounded">{tag}</span>
                              ))}
                           </div>
                        </div>
                     </div>
                     {!isEnded && (
                        <div className="text-xs font-mono text-gray-400 flex items-center gap-1.5 bg-black/30 px-3 py-1.5 rounded-full border border-white/5">
                           <Clock size={12} />
                           {formatTimeRemaining(proposal.endTime)}
                        </div>
                     )}
                  </div>

                  <p className="text-gray-300 text-sm mb-6 leading-relaxed bg-black/20 p-4 rounded-lg">
                    {proposal.description}
                  </p>

                  {/* Voting Bars */}
                  <div className="space-y-3 mb-6">
                     <div>
                        <div className="flex justify-between text-xs mb-1">
                           <span className="text-gray-400">Yes</span>
                           <span className="font-mono text-white">{calculatePercentage(proposal.votesFor, totalVotes)}%</span>
                        </div>
                        <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                           <div className="h-full bg-success transition-all duration-500" style={{ width: `${calculatePercentage(proposal.votesFor, totalVotes)}%` }} />
                        </div>
                     </div>
                     <div>
                        <div className="flex justify-between text-xs mb-1">
                           <span className="text-gray-400">No</span>
                           <span className="font-mono text-white">{calculatePercentage(proposal.votesAgainst, totalVotes)}%</span>
                        </div>
                        <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                           <div className="h-full bg-red-500 transition-all duration-500" style={{ width: `${calculatePercentage(proposal.votesAgainst, totalVotes)}%` }} />
                        </div>
                     </div>
                  </div>

                  {/* Actions */}
                  {proposal.status === 'Active' && (
                     <div className="grid grid-cols-2 gap-4">
                        <button 
                          onClick={() => handleVote(proposal.id, 'for')}
                          disabled={!user.walletAddress || user.lockedAmount <= 0 || hasVoted}
                          className="py-2.5 rounded-lg border border-success/30 bg-success/5 text-success font-bold text-sm hover:bg-success/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                          <CheckCircle size={16} /> Vote YES
                        </button>
                        <button 
                           onClick={() => handleVote(proposal.id, 'against')}
                           disabled={!user.walletAddress || user.lockedAmount <= 0 || hasVoted}
                           className="py-2.5 rounded-lg border border-red-500/30 bg-red-500/5 text-red-500 font-bold text-sm hover:bg-red-500/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                          <XCircle size={16} /> Vote NO
                        </button>
                     </div>
                  )}
                  {hasVoted && (
                    <div className="mt-4 text-center text-xs text-gray-500 font-mono">
                      Your vote has been recorded on-chain.
                    </div>
                  )}
               </div>
             );
           })}
        </div>
      </div>
    </div>
  );
};

export default Governance;
