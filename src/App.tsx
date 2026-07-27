import { Suspense, lazy, useEffect } from 'react';
import {
  HashRouter,
  Route,
  Routes,
  useLocation,
} from 'react-router-dom';
import { Layout } from './components/Layout';
import { CatalogPage } from './pages/CatalogPage';
import { NotFoundPage } from './pages/NotFoundPage';

// Route-split the content-heavy pages (they pull in Markdown + Mermaid).
const ModulePage = lazy(() =>
  import('./pages/ModulePage').then((m) => ({ default: m.ModulePage })),
);
const LabPage = lazy(() =>
  import('./pages/LabPage').then((m) => ({ default: m.LabPage })),
);

function PageFallback() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 text-sm text-slate-400 sm:px-6">
      Loading…
    </div>
  );
}

/** Scroll to the top on every path change (query-only changes are ignored). */
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [pathname]);
  return null;
}

export function App() {
  return (
    <HashRouter>
      <ScrollToTop />
      <Suspense fallback={<PageFallback />}>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<CatalogPage />} />
            <Route path="/modules/:slug" element={<ModulePage />} />
            <Route path="/labs/:slug" element={<LabPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </Suspense>
    </HashRouter>
  );
}
