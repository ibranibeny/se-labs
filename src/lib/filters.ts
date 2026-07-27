// Faceted filtering + facet-count logic for the catalog.
import type {
  AssetType,
  ConversationId,
  ModuleAsset,
  SolutionAreaId,
} from './types';

export interface FilterState {
  q: string;
  conversations: ConversationId[];
  solutionAreas: SolutionAreaId[];
  assetTypes: AssetType[];
  levels: number[];
  products: string[];
}

export const EMPTY_FILTERS: FilterState = {
  q: '',
  conversations: [],
  solutionAreas: [],
  assetTypes: [],
  levels: [],
  products: [],
};

export type FacetKey = Exclude<keyof FilterState, 'q'>;

function textMatch(a: ModuleAsset, q: string): boolean {
  if (!q.trim()) return true;
  const needle = q.toLowerCase();
  const haystack = [
    a.title,
    a.excerpt,
    a.assetType,
    ...a.products,
    ...a.labs.map((l) => l.title),
    ...a.labs.map((l) => l.excerpt),
  ]
    .join(' ')
    .toLowerCase();
  return haystack.includes(needle);
}

/** A predicate per facet dimension. AND across dimensions, OR within one. */
const predicates: Record<FacetKey, (a: ModuleAsset, f: FilterState) => boolean> = {
  conversations: (a, f) =>
    f.conversations.length === 0 ||
    f.conversations.some((c) => a.conversations.includes(c)),
  solutionAreas: (a, f) =>
    f.solutionAreas.length === 0 ||
    f.solutionAreas.some((s) => a.solutionAreas.includes(s)),
  assetTypes: (a, f) =>
    f.assetTypes.length === 0 || f.assetTypes.includes(a.assetType),
  levels: (a, f) =>
    f.levels.length === 0 || f.levels.some((lv) => a.levels.includes(lv)),
  products: (a, f) =>
    f.products.length === 0 || f.products.some((p) => a.products.includes(p)),
};

export function matchesAsset(a: ModuleAsset, f: FilterState): boolean {
  if (!textMatch(a, f.q)) return false;
  return (Object.keys(predicates) as FacetKey[]).every((k) =>
    predicates[k](a, f),
  );
}

export function filterAssets(
  assets: ModuleAsset[],
  f: FilterState,
): ModuleAsset[] {
  return assets.filter((a) => matchesAsset(a, f));
}

/**
 * Count how many assets a facet value WOULD yield, evaluating every other
 * active dimension but ignoring the dimension being counted. This keeps
 * sibling options in the same group meaningful after one is selected.
 */
export function countFor(
  assets: ModuleAsset[],
  f: FilterState,
  dimension: FacetKey,
  value: ConversationId | SolutionAreaId | AssetType | number | string,
): number {
  const withoutDim = { ...f, [dimension]: [] } as FilterState;
  return assets.filter((a) => {
    if (!textMatch(a, withoutDim.q)) return false;
    const otherPass = (Object.keys(predicates) as FacetKey[])
      .filter((k) => k !== dimension)
      .every((k) => predicates[k](a, withoutDim));
    if (!otherPass) return false;
    switch (dimension) {
      case 'conversations':
        return a.conversations.includes(value as ConversationId);
      case 'solutionAreas':
        return a.solutionAreas.includes(value as SolutionAreaId);
      case 'assetTypes':
        return a.assetType === value;
      case 'levels':
        return a.levels.includes(value as number);
      case 'products':
        return a.products.includes(value as string);
    }
  }).length;
}

export function activeFilterCount(f: FilterState): number {
  return (
    f.conversations.length +
    f.solutionAreas.length +
    f.assetTypes.length +
    f.levels.length +
    f.products.length +
    (f.q.trim() ? 1 : 0)
  );
}
