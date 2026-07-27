// Builds the typed catalog from the generated metadata index (no Markdown
// bodies here — those load lazily via ./body.ts).
import index from '../generated/catalog-index.json';
import type {
  AssetType,
  ConversationId,
  Lab,
  ModuleAsset,
  SolutionAreaId,
} from './types';

interface RawLab {
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

interface RawModule {
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
  conversations: string[];
  solutionAreas: string[];
  assetType: string;
  products: string[];
  draft?: boolean;
  externalUrl?: string;
  labSlugs: string[];
  levels: number[];
}

export const labs: Lab[] = (index.labs as RawLab[]).map((l) => ({
  slug: l.slug,
  title: l.title,
  module: l.module,
  excerpt: l.excerpt,
  level: l.level,
  duration: l.duration,
  docType: l.docType,
  persona: l.persona,
  learningPath: l.learningPath,
  navOrder: l.navOrder,
  featured: l.featured,
  reportIssue: l.reportIssue,
}));

const labBySlug = new Map(labs.map((l) => [l.slug, l]));

export const modules: ModuleAsset[] = (index.modules as RawModule[]).map((m) => ({
  slug: m.slug,
  title: m.title,
  excerpt: m.excerpt,
  levelRange: m.levelRange,
  durationTotal: m.durationTotal,
  order: m.order,
  icon: m.icon,
  color: m.color,
  sourceSite: m.sourceSite,
  sourceRepo: m.sourceRepo,
  conversations: m.conversations as ConversationId[],
  solutionAreas: m.solutionAreas as SolutionAreaId[],
  assetType: m.assetType as AssetType,
  products: m.products,
  draft: m.draft,
  externalUrl: m.externalUrl,
  labs: m.labSlugs
    .map((s) => labBySlug.get(s))
    .filter((l): l is Lab => Boolean(l)),
  levels: m.levels,
}));

/** Every catalog card is an asset (currently === a module). */
export const assets: ModuleAsset[] = modules;

export function getModule(slug: string): ModuleAsset | undefined {
  return modules.find((m) => m.slug === slug);
}

export function getLab(slug: string): Lab | undefined {
  return labs.find((l) => l.slug === slug);
}

/** All distinct product tags across the catalog, sorted for the filter UI. */
export const allProducts: string[] = [
  ...new Set(modules.flatMap((m) => m.products)),
].sort((a, b) => a.localeCompare(b));
