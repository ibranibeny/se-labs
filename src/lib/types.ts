// Core domain types for the SE asset portal.

export type Tier = 'Frontier' | 'Core';

export type SolutionAreaId = 'CAIP' | 'ABS' | 'Security';

export type AssetType = 'Workshop' | 'Demo' | 'Reference Architecture' | 'Case Study';

export type ConversationId =
  | 'ai-flow-human-ambition'
  | 'ubiquitous-innovation'
  | 'amplify-intelligence'
  | 'trusted-secure-platform'
  | 'ai-ready-productivity'
  | 'agentify-processes'
  | 'modernize-confidence'
  | 'unified-data-ai-estate';

/** A single hands-on step within a workshop asset. */
export interface Lab {
  slug: string;
  title: string;
  module: string;
  excerpt: string;
  level: number;
  duration: string;
  docType: string;
  persona: string;
  learningPath: string;
  navOrder: number;
  featured: boolean;
  reportIssue?: string;
}

/**
 * A catalog asset. Today every asset maps to a former Jekyll "module"
 * (a workshop with ordered labs), but the model also supports standalone
 * assets (a Demo / Case Study with no child labs).
 */
export interface ModuleAsset {
  slug: string;
  title: string;
  excerpt: string;
  levelRange: string;
  durationTotal: string;
  order: number;
  icon: string;
  color: string;
  sourceSite?: string;
  sourceRepo?: string;
  // GTM taxonomy
  conversations: ConversationId[];
  solutionAreas: SolutionAreaId[];
  assetType: AssetType;
  products: string[];
  // derived
  labs: Lab[];
  levels: number[];
}
