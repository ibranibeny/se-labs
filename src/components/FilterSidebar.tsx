import type { ReactNode } from 'react';
import type { ModuleAsset } from '../lib/types';
import {
  ASSET_TYPES,
  CONVERSATIONS,
  LEVELS,
  SOLUTION_AREAS,
  TIERS,
  tierColor,
} from '../data/taxonomy';
import { allProducts } from '../lib/catalog';
import {
  activeFilterCount,
  countFor,
  type FacetKey,
  type FilterState,
} from '../lib/filters';

interface Props {
  assets: ModuleAsset[];
  filters: FilterState;
  toggle: (key: FacetKey, value: string | number) => void;
  clearAll: () => void;
}

interface RowProps {
  checked: boolean;
  count: number;
  label: ReactNode;
  color?: string;
  onToggle: () => void;
}

function FacetRow({ checked, count, label, color, onToggle }: RowProps) {
  const disabled = count === 0 && !checked;
  return (
    <button
      type="button"
      onClick={onToggle}
      disabled={disabled}
      className={`flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm transition ${
        disabled
          ? 'cursor-not-allowed text-slate-300'
          : 'text-slate-700 hover:bg-slate-100'
      }`}
    >
      <span
        className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border ${
          checked ? 'border-azure bg-azure text-white' : 'border-slate-300 bg-white'
        }`}
      >
        {checked && (
          <svg width="10" height="10" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path d="M2 6l3 3 5-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </span>
      {color && (
        <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: color }} />
      )}
      <span className="flex-1 leading-tight">{label}</span>
      <span className="shrink-0 text-xs font-semibold text-slate-400">{count}</span>
    </button>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="border-b border-slate-100 py-4">
      <h3 className="mb-1.5 px-2 text-xs font-bold uppercase tracking-wider text-slate-500">
        {title}
      </h3>
      <div className="space-y-0.5">{children}</div>
    </div>
  );
}

export function FilterSidebar({ assets, filters, toggle, clearAll }: Props) {
  const active = activeFilterCount(filters);

  return (
    <aside className="flex flex-col">
      <div className="flex items-center justify-between px-2 pb-2">
        <span className="text-sm font-bold text-slate-800">
          Filters{active > 0 && <span className="ml-1 text-azure">({active})</span>}
        </span>
        {active > 0 && (
          <button
            type="button"
            onClick={clearAll}
            className="text-xs font-semibold text-azure hover:underline"
          >
            Clear all
          </button>
        )}
      </div>

      <Section title="Conversation">
        {TIERS.map((tier) => (
          <div key={tier} className="mb-1">
            <p
              className="px-2 py-1 text-[0.68rem] font-bold uppercase tracking-wide"
              style={{ color: tierColor(tier) }}
            >
              {tier}
            </p>
            {CONVERSATIONS.filter((c) => c.tier === tier).map((c) => (
              <FacetRow
                key={c.id}
                checked={filters.conversations.includes(c.id)}
                count={countFor(assets, filters, 'conversations', c.id)}
                color={tierColor(tier)}
                label={c.label}
                onToggle={() => toggle('conversations', c.id)}
              />
            ))}
          </div>
        ))}
      </Section>

      <Section title="Solution Area">
        {SOLUTION_AREAS.map((s) => (
          <FacetRow
            key={s.id}
            checked={filters.solutionAreas.includes(s.id)}
            count={countFor(assets, filters, 'solutionAreas', s.id)}
            color={s.color}
            label={`${s.id} — ${s.label}`}
            onToggle={() => toggle('solutionAreas', s.id)}
          />
        ))}
      </Section>

      <Section title="Asset Type">
        {ASSET_TYPES.map((a) => (
          <FacetRow
            key={a.id}
            checked={filters.assetTypes.includes(a.id)}
            count={countFor(assets, filters, 'assetTypes', a.id)}
            color={a.color}
            label={`${a.icon} ${a.label}`}
            onToggle={() => toggle('assetTypes', a.id)}
          />
        ))}
      </Section>

      <Section title="Technical Level">
        {LEVELS.map((lv) => (
          <FacetRow
            key={lv}
            checked={filters.levels.includes(lv)}
            count={countFor(assets, filters, 'levels', lv)}
            label={`L${lv}`}
            onToggle={() => toggle('levels', lv)}
          />
        ))}
      </Section>

      <Section title="Product / Technology">
        <div className="scroll-slim max-h-64 overflow-y-auto pr-1">
          {allProducts.map((p) => (
            <FacetRow
              key={p}
              checked={filters.products.includes(p)}
              count={countFor(assets, filters, 'products', p)}
              label={p}
              onToggle={() => toggle('products', p)}
            />
          ))}
        </div>
      </Section>
    </aside>
  );
}
