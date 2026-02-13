export enum ViewState {
  LANDING = 'LANDING',
  DASHBOARD = 'DASHBOARD',
  LEADERBOARD = 'LEADERBOARD',
  GOVERNANCE = 'GOVERNANCE'
}

export interface Faction {
  id: string;
  name: string;
  tier: string;
  members: number;
  totalLocked: number; // in XRP
  growthRate: number; // percentage
  dominance: number; // percentage
  rank: number;
}

export interface UserState {
  walletAddress: string | null;
  balance: number;
  lockedAmount: number;
  factionId: string | null;
  factionName: string | null;
  factionRank: number | null;
  estimatedReward: number;
  invitesCount: number;
}

export interface GameCycle {
  endTime: number; // Timestamp
  totalLockedGlobal: number;
  currentCycle: number;
}

export interface Proposal {
  id: string;
  title: string;
  description: string;
  status: 'Active' | 'Passed' | 'Rejected' | 'Pending';
  votesFor: number;
  votesAgainst: number;
  endTime: number;
  tags: string[];
}