// FY27 GTM framework taxonomy — the vocabulary the catalog filters against.
import type {
  AssetType,
  ConversationId,
  SolutionAreaId,
  Tier,
} from '../lib/types';

export interface ConversationDef {
  id: ConversationId;
  label: string;
  tier: Tier;
  /** Product cue from the framework (shown as a subtle hint). */
  products: string;
}

export const TIERS: Tier[] = ['Frontier', 'Core'];

export const CONVERSATIONS: ConversationDef[] = [
  // Frontier
  {
    id: 'ai-flow-human-ambition',
    label: 'AI in the flow of human ambition',
    tier: 'Frontier',
    products: 'M365 Copilot, Studio',
  },
  {
    id: 'ubiquitous-innovation',
    label: 'Ubiquitous Innovation',
    tier: 'Frontier',
    products: 'GitHub, Studio, Foundry',
  },
  {
    id: 'amplify-intelligence',
    label: 'Amplify your intelligence',
    tier: 'Frontier',
    products: 'Microsoft IQ',
  },
  {
    id: 'trusted-secure-platform',
    label: 'Establish a trusted and secure platform for AI',
    tier: 'Frontier',
    products: 'Security, Agent 365',
  },
  // Core
  {
    id: 'ai-ready-productivity',
    label: 'AI-ready productivity & security for every employee',
    tier: 'Core',
    products: 'M365 Core, W365, Security',
  },
  {
    id: 'agentify-processes',
    label: 'Agentify your business processes',
    tier: 'Core',
    products: 'Dynamics 365, Power Platform, Copilot Studio',
  },
  {
    id: 'modernize-confidence',
    label: 'Modernize with confidence',
    tier: 'Core',
    products: 'Infra, Apps, Data',
  },
  {
    id: 'unified-data-ai-estate',
    label: 'Build a unified, governed data and AI estate',
    tier: 'Core',
    products: 'Fabric, Data, Foundry',
  },
];

export interface SolutionAreaDef {
  id: SolutionAreaId;
  label: string;
  color: string;
}

export const SOLUTION_AREAS: SolutionAreaDef[] = [
  { id: 'CAIP', label: 'Cloud & AI Platforms', color: '#0078d4' },
  { id: 'ABS', label: 'AI Business Solutions', color: '#2aa79b' },
  { id: 'Security', label: 'Security', color: '#b4009e' },
];

export interface AssetTypeDef {
  id: AssetType;
  label: string;
  color: string;
  icon: string; // FontAwesome-style class fragment reused as emoji fallback
}

export const ASSET_TYPES: AssetTypeDef[] = [
  { id: 'Workshop', label: 'Hands-on Workshop', color: '#0078d4', icon: '🧪' },
  { id: 'Demo', label: 'Demo', color: '#7b2fbf', icon: '▶️' },
  { id: 'Reference Architecture', label: 'Reference Architecture', color: '#107c10', icon: '🏗️' },
  { id: 'Case Study', label: 'Case Study / Customer Zero', color: '#b45309', icon: '📖' },
];

export const LEVELS = [100, 200, 300, 400, 500];

// ---- Lookups ----
export const conversationById = new Map(CONVERSATIONS.map((c) => [c.id, c]));
export const solutionAreaById = new Map(SOLUTION_AREAS.map((s) => [s.id, s]));
export const assetTypeById = new Map(ASSET_TYPES.map((a) => [a.id, a]));

export function tierColor(tier: Tier): string {
  return tier === 'Frontier' ? '#2aa79b' : '#1f4e9c';
}

export function conversationTier(id: ConversationId): Tier {
  return conversationById.get(id)?.tier ?? 'Core';
}

export function conversationLabel(id: ConversationId): string {
  return conversationById.get(id)?.label ?? id;
}
