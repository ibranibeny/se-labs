import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { AssetType, ConversationId, SolutionAreaId } from '../lib/types';
import { EMPTY_FILTERS, type FacetKey, type FilterState } from '../lib/filters';

type FacetValue = ConversationId | SolutionAreaId | AssetType | number | string;

function csv(params: URLSearchParams, key: string): string[] {
  const raw = params.get(key);
  return raw ? raw.split(',').map((s) => s.trim()).filter(Boolean) : [];
}

function paramsToFilters(params: URLSearchParams): FilterState {
  return {
    q: params.get('q') ?? '',
    conversations: csv(params, 'conversation') as ConversationId[],
    solutionAreas: csv(params, 'solution') as SolutionAreaId[],
    assetTypes: csv(params, 'type') as AssetType[],
    levels: csv(params, 'level').map(Number).filter((n) => !Number.isNaN(n)),
    products: csv(params, 'product'),
  };
}

function filtersToParams(f: FilterState): URLSearchParams {
  const p = new URLSearchParams();
  if (f.q.trim()) p.set('q', f.q.trim());
  if (f.conversations.length) p.set('conversation', f.conversations.join(','));
  if (f.solutionAreas.length) p.set('solution', f.solutionAreas.join(','));
  if (f.assetTypes.length) p.set('type', f.assetTypes.join(','));
  if (f.levels.length) p.set('level', f.levels.join(','));
  if (f.products.length) p.set('product', f.products.join(','));
  return p;
}

/** Filter state that lives in the URL query string (shareable + deep-linkable). */
export function useCatalogFilters() {
  const [params, setParams] = useSearchParams();
  const filters = useMemo(() => paramsToFilters(params), [params]);

  const commit = useCallback(
    (next: FilterState) => setParams(filtersToParams(next), { replace: true }),
    [setParams],
  );

  const setQ = useCallback(
    (q: string) => commit({ ...filters, q }),
    [commit, filters],
  );

  const toggle = useCallback(
    (key: FacetKey, value: FacetValue) => {
      const current = filters[key] as FacetValue[];
      const exists = current.includes(value);
      const nextValues = exists
        ? current.filter((v) => v !== value)
        : [...current, value];
      commit({ ...filters, [key]: nextValues });
    },
    [commit, filters],
  );

  const clearAll = useCallback(() => commit(EMPTY_FILTERS), [commit]);

  return { filters, setQ, toggle, clearAll };
}
