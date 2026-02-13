import { Faction, Proposal } from './types';

export const CYCLE_DURATION_DAYS = 7;
export const CYCLE_DURATION_MS = CYCLE_DURATION_DAYS * 24 * 60 * 60 * 1000;

export const CYCLE_START_TIME = Date.now();

// Raw data provided by user
const RAW_DATA = [
  { rank: 1, name: "Obsidian Dominion", tier: "Diamond", locked: 271430, members: 1392 },
  { rank: 2, name: "Apex Quantum Order", tier: "Diamond", locked: 258920, members: 1328 },
  { rank: 3, name: "Crimson Ledger Pact", tier: "Platinum", locked: 118740, members: 612 },
  { rank: 4, name: "Azure Syndicate Prime", tier: "Platinum", locked: 112860, members: 584 },
  { rank: 5, name: "Helix Treasury", tier: "Platinum", locked: 108320, members: 563 },
  { rank: 6, name: "Nova Directive", tier: "Platinum", locked: 104110, members: 548 },
  { rank: 7, name: "Cipher Dominion", tier: "Platinum", locked: 101540, members: 526 },
  { rank: 8, name: "Iron Horizon", tier: "Platinum", locked: 100870, members: 519 },
  { rank: 9, name: "Neon Covenant", tier: "Gold", locked: 88420, members: 471 },
  { rank: 10, name: "Silent Validators", tier: "Gold", locked: 82730, members: 444 },
  { rank: 11, name: "Phantom Treasury", tier: "Gold", locked: 77950, members: 416 },
  { rank: 12, name: "Solar Accord", tier: "Gold", locked: 74380, members: 392 },
  { rank: 13, name: "Vertex Coalition", tier: "Gold", locked: 70610, members: 368 },
  { rank: 14, name: "Delta Reclaim", tier: "Gold", locked: 68240, members: 354 },
  { rank: 15, name: "Blackstone Grid", tier: "Gold", locked: 64890, members: 332 },
  { rank: 16, name: "Lunar Axis", tier: "Gold", locked: 62740, members: 318 },
  { rank: 17, name: "Ether Dominion", tier: "Gold", locked: 59380, members: 301 },
  { rank: 18, name: "Arc Treasury", tier: "Gold", locked: 57920, members: 287 },
  { rank: 19, name: "Radiant Core", tier: "Gold", locked: 55610, members: 274 },
  { rank: 20, name: "Helios Pact", tier: "Gold", locked: 53740, members: 263 },
  { rank: 21, name: "Quantum Relay", tier: "Gold", locked: 52880, members: 259 },
  { rank: 22, name: "Oblique Syndic", tier: "Gold", locked: 51740, members: 251 },
  { rank: 23, name: "Prism Authority", tier: "Gold", locked: 50920, members: 246 },
  { rank: 24, name: "Nova Pulse", tier: "Gold", locked: 50140, members: 241 },
  { rank: 25, name: "Rift Collective", tier: "Gold", locked: 49820, members: 237 },
  { rank: 26, name: "Titan Ledger", tier: "Silver", locked: 44380, members: 211 },
  { rank: 27, name: "DeepLock Union", tier: "Silver", locked: 42910, members: 204 },
  { rank: 28, name: "Axis Vault", tier: "Silver", locked: 41640, members: 198 },
  { rank: 29, name: "Iron Pulse", tier: "Silver", locked: 40280, members: 192 },
  { rank: 30, name: "Ember Chain", tier: "Silver", locked: 38920, members: 186 },
  { rank: 31, name: "Shadow Mint", tier: "Silver", locked: 37540, members: 179 },
  { rank: 32, name: "Neon Forge", tier: "Silver", locked: 36480, members: 172 },
  { rank: 33, name: "Flux Directive", tier: "Silver", locked: 35310, members: 166 },
  { rank: 34, name: "Chainwave Order", tier: "Silver", locked: 34270, members: 161 },
  { rank: 35, name: "Phantom Grid", tier: "Silver", locked: 33180, members: 155 },
  { rank: 36, name: "Titan Relay", tier: "Silver", locked: 32060, members: 149 },
  { rank: 37, name: "Solar Vault", tier: "Silver", locked: 30980, members: 143 },
  { rank: 38, name: "Delta Syndicate", tier: "Silver", locked: 29740, members: 137 },
  { rank: 39, name: "Cipher Network", tier: "Silver", locked: 28910, members: 132 },
  { rank: 40, name: "Nova Authority", tier: "Silver", locked: 27840, members: 126 },
  { rank: 41, name: "Apex Relay", tier: "Silver", locked: 26920, members: 121 },
  { rank: 42, name: "Iron Accord", tier: "Silver", locked: 25780, members: 116 },
  { rank: 43, name: "Obsidian Pulse", tier: "Silver", locked: 24640, members: 110 },
  { rank: 44, name: "Helix Union", tier: "Silver", locked: 23810, members: 105 },
  { rank: 45, name: "Lunar Pact", tier: "Silver", locked: 22940, members: 100 },
  { rank: 46, name: "Quantum Axis", tier: "Silver", locked: 21870, members: 95 },
  { rank: 47, name: "Titan Collective", tier: "Silver", locked: 20980, members: 90 },
  { rank: 48, name: "Shadow Relay", tier: "Silver", locked: 19760, members: 86 },
  { rank: 49, name: "Prism Vault", tier: "Silver", locked: 18880, members: 82 },
  { rank: 50, name: "Neon Directive", tier: "Silver", locked: 17940, members: 78 },
  { rank: 51, name: "Ember Vault", tier: "Bronze", locked: 9820, members: 61 },
  { rank: 52, name: "Rift Order", tier: "Bronze", locked: 9340, members: 58 },
  { rank: 53, name: "Nova Collective", tier: "Bronze", locked: 8970, members: 56 },
  { rank: 54, name: "Helios Grid", tier: "Bronze", locked: 8540, members: 53 },
  { rank: 55, name: "Cipher Pact", tier: "Bronze", locked: 8120, members: 50 },
  { rank: 56, name: "Iron Syndic", tier: "Bronze", locked: 7840, members: 48 },
  { rank: 57, name: "Solar Chain", tier: "Bronze", locked: 7510, members: 46 },
  { rank: 58, name: "Phantom Accord", tier: "Bronze", locked: 7140, members: 44 },
  { rank: 59, name: "Titan Grid", tier: "Bronze", locked: 6820, members: 42 },
  { rank: 60, name: "Delta Vault", tier: "Bronze", locked: 6540, members: 40 },
  { rank: 61, name: "Neon Authority", tier: "Bronze", locked: 6180, members: 38 },
  { rank: 62, name: "Shadow Core", tier: "Bronze", locked: 5940, members: 36 },
  { rank: 63, name: "Apex Network", tier: "Bronze", locked: 5610, members: 34 },
  { rank: 64, name: "Prism Directive", tier: "Bronze", locked: 5240, members: 32 },
  { rank: 65, name: "Flux Vault", tier: "Bronze", locked: 4980, members: 30 },
  { rank: 66, name: "Oblique Chain", tier: "Bronze", locked: 4740, members: 29 },
  { rank: 67, name: "Iron Grid", tier: "Bronze", locked: 4520, members: 27 },
  { rank: 68, name: "Lunar Authority", tier: "Bronze", locked: 4260, members: 26 },
  { rank: 69, name: "Titan Forge", tier: "Bronze", locked: 3980, members: 24 },
  { rank: 70, name: "Nova Relay", tier: "Bronze", locked: 3720, members: 23 },
  { rank: 71, name: "Cipher Axis", tier: "Bronze", locked: 3480, members: 22 },
  { rank: 72, name: "Helix Grid", tier: "Bronze", locked: 3260, members: 21 },
  { rank: 73, name: "Shadow Pact", tier: "Bronze", locked: 3040, members: 20 },
  { rank: 74, name: "Apex Vault", tier: "Bronze", locked: 2880, members: 19 },
  { rank: 75, name: "Ember Authority", tier: "Bronze", locked: 2640, members: 18 },
  { rank: 76, name: "Delta Grid", tier: "Bronze", locked: 2420, members: 17 },
  { rank: 77, name: "Phantom Directive", tier: "Bronze", locked: 2260, members: 16 },
  { rank: 78, name: "Iron Collective", tier: "Bronze", locked: 2080, members: 15 },
  { rank: 79, name: "Solar Network", tier: "Bronze", locked: 1940, members: 14 },
  { rank: 80, name: "Neon Vault", tier: "Bronze", locked: 1780, members: 13 },
  { rank: 81, name: "Rift Authority", tier: "Bronze", locked: 1620, members: 12 },
  { rank: 82, name: "Cipher Relay", tier: "Bronze", locked: 1480, members: 11 },
  { rank: 83, name: "Obsidian Forge", tier: "Bronze", locked: 1340, members: 10 },
  { rank: 84, name: "Lunar Core", tier: "Bronze", locked: 1220, members: 9 },
  { rank: 85, name: "Titan Pulse", tier: "Bronze", locked: 1110, members: 8 },
  { rank: 86, name: "Helios Vault", tier: "Bronze", locked: 1020, members: 7 },
  { rank: 87, name: "Delta Authority", tier: "Bronze", locked: 940, members: 7 },
  { rank: 88, name: "Iron Directive", tier: "Bronze", locked: 860, members: 6 },
  { rank: 89, name: "Apex Core", tier: "Bronze", locked: 780, members: 6 },
  { rank: 90, name: "Nova Axis", tier: "Bronze", locked: 710, members: 5 },
  { rank: 91, name: "Cipher Forge", tier: "Bronze", locked: 640, members: 5 },
  { rank: 92, name: "Phantom Pulse", tier: "Bronze", locked: 580, members: 4 },
  { rank: 93, name: "Oblique Vault", tier: "Bronze", locked: 520, members: 4 },
  { rank: 94, name: "Titan Authority", tier: "Bronze", locked: 470, members: 4 },
  { rank: 95, name: "Solar Grid", tier: "Bronze", locked: 420, members: 3 },
  { rank: 96, name: "Neon Core", tier: "Bronze", locked: 380, members: 3 },
  { rank: 97, name: "Rift Collective X", tier: "Bronze", locked: 340, members: 3 },
  { rank: 98, name: "Helix Forge", tier: "Bronze", locked: 300, members: 2 },
  { rank: 99, name: "Cipher Beacon", tier: "Bronze", locked: 260, members: 2 },
  { rank: 100, name: "Last Horizon", tier: "Bronze", locked: 220, members: 2 },
];

// Calculate real total from data to ensure accuracy
export const GLOBAL_TOTAL_LOCKED = RAW_DATA.reduce((acc, curr) => acc + curr.locked, 0);

const generateRandomGrowth = () => {
  // Generate a random growth between -5% and +18%
  // Skew slightly positive for top ranks logic, but purely random here for variety
  const val = (Math.random() * 23) - 5; 
  return parseFloat(val.toFixed(1));
};

export const MOCK_FACTIONS: Faction[] = RAW_DATA.map((f, i) => ({
  id: `f${i + 1}`,
  name: f.name,
  tier: f.tier,
  members: f.members,
  totalLocked: f.locked,
  growthRate: generateRandomGrowth(),
  dominance: parseFloat(((f.locked / GLOBAL_TOTAL_LOCKED) * 100).toFixed(2)),
  rank: f.rank
}));

export const MOCK_PROPOSALS: Proposal[] = [
  {
    id: 'prop-104',
    title: 'Adjust Cycle Duration',
    description: 'Reduce the standard cycle duration from 7 days to 5 days to increase reward frequency and dynamic engagement.',
    status: 'Active',
    votesFor: 1240500,
    votesAgainst: 890200,
    endTime: Date.now() + 172800000, // +2 days
    tags: ['Economy', 'Game Mechanics']
  },
  {
    id: 'prop-103',
    title: 'Introduce Diamond+ Tier',
    description: 'Create an exclusive tier for factions with over 500k XRP TVL with a 1.2x reward multiplier.',
    status: 'Passed',
    votesFor: 3500000,
    votesAgainst: 450000,
    endTime: Date.now() - 604800000, // Past
    tags: ['Tiers', 'Rewards']
  },
  {
    id: 'prop-102',
    title: 'Reduce Creation Fee',
    description: 'Lower the faction creation fee from 25 XRP to 10 XRP to encourage new squad formations.',
    status: 'Rejected',
    votesFor: 890000,
    votesAgainst: 2100000,
    endTime: Date.now() - 1209600000, // Past
    tags: ['Economy']
  }
];

export const COLORS = {
  background: '#0A0B10',
  primary: '#5865F2',
  accent: '#3CF2C2',
  success: '#00D084',
  warning: '#F29E3C',
};