import { useMemo, useState } from 'react';
import { assets } from '../lib/catalog';
import { filterAssets } from '../lib/filters';
import { useCatalogFilters } from '../hooks/useCatalogFilters';
import { FilterSidebar } from '../components/FilterSidebar';
import { SearchBox } from '../components/SearchBox';
import { AssetCard } from '../components/AssetCard';

export function CatalogPage() {
  const { filters, setQ, toggle, clearAll } = useCatalogFilters();
  const [showFilters, setShowFilters] = useState(false);

  const results = useMemo(() => filterAssets(assets, filters), [filters]);

  return (
    <>
      {/* Hero */}
      <section
        className="text-white"
        style={{ background: 'linear-gradient(110deg, #2aa79b 0%, #1f4e9c 55%, #0b3d91 100%)' }}
      >
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/80">
            FY27 GTM · Major Growth Solution Engineering
          </p>
          <h1 className="mt-2 max-w-3xl text-3xl font-black leading-tight sm:text-4xl">
            Find the right accelerator to move the deal forward
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-white/90 sm:text-base">
            One catalog of demos, hands-on workshops, and reference architectures —
            filterable by GTM conversation and solution area. Built for AEs and DES to
            discover what SE assets exist to accelerate deal closure.
          </p>
        </div>
      </section>

      {/* Body */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="lg:grid lg:grid-cols-[260px_1fr] lg:gap-8">
          {/* Sidebar */}
          <div
            className={`${
              showFilters ? 'block' : 'hidden'
            } lg:block lg:sticky lg:top-20 lg:h-fit`}
          >
            <div className="rounded-xl border border-slate-200 bg-white p-2">
              <FilterSidebar
                assets={assets}
                filters={filters}
                toggle={toggle}
                clearAll={clearAll}
              />
            </div>
          </div>

          {/* Results */}
          <div className="mt-6 lg:mt-0">
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="flex-1">
                <SearchBox value={filters.q} onChange={setQ} placeholder="Search demos, workshops, products…" />
              </div>
              <button
                type="button"
                onClick={() => setShowFilters((s) => !s)}
                className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 lg:hidden"
              >
                {showFilters ? 'Hide filters' : 'Filters'}
              </button>
            </div>

            <p className="mb-4 text-sm text-slate-500">
              <span className="font-bold text-slate-800">{results.length}</span>{' '}
              {results.length === 1 ? 'asset' : 'assets'}
            </p>

            {results.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center">
                <p className="text-sm font-semibold text-slate-700">No assets match these filters.</p>
                <button
                  type="button"
                  onClick={clearAll}
                  className="mt-3 rounded-lg bg-azure px-4 py-2 text-sm font-semibold text-white hover:bg-azure-dark"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {results.map((a) => (
                  <AssetCard key={a.slug} asset={a} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
