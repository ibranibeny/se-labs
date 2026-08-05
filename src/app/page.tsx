import { Suspense } from 'react';
import { CatalogClient } from '@/components/CatalogClient';

function CatalogFallback() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 text-sm text-slate-400 sm:px-6">
      Loading…
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<CatalogFallback />}>
      <CatalogClient />
    </Suspense>
  );
}
