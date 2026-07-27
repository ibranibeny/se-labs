import { Link, NavLink, Outlet } from 'react-router-dom';

const GITHUB_URL = 'https://github.com/ibranibeny/se-labs';

function BrandMark() {
  return (
    <span
      className="flex h-8 w-8 items-center justify-center rounded-lg text-sm font-black text-white"
      style={{ background: 'linear-gradient(135deg, #2aa79b 0%, #1f4e9c 100%)' }}
    >
      SE
    </span>
  );
}

export function Layout() {
  const linkBase =
    'rounded-md px-3 py-1.5 text-sm font-semibold transition hover:bg-slate-100';
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <Link to="/" className="flex items-center gap-2.5">
            <BrandMark />
            <span className="flex flex-col leading-tight">
              <span className="text-sm font-black text-slate-900">Major Growth SE</span>
              <span className="text-[0.7rem] font-medium uppercase tracking-wider text-slate-500">
                Asset Portal
              </span>
            </span>
          </Link>
          <nav className="flex items-center gap-1">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `${linkBase} ${isActive ? 'text-azure' : 'text-slate-700'}`
              }
            >
              Catalog
            </NavLink>
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noreferrer noopener"
              className={`${linkBase} text-slate-700`}
            >
              GitHub
            </a>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-8 text-sm text-slate-500 sm:px-6">
          <p className="font-semibold text-slate-700">Major Growth SE — Asset Portal</p>
          <p className="mt-1 max-w-2xl">
            A single access point to demos, hands-on workshops, and reference
            architectures — mapped to the FY27 GTM framework so AEs and DES can find the
            right accelerator to move a deal forward.
          </p>
          <p className="mt-3 text-xs">
            Technical content grounded in Microsoft Learn ·{' '}
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noreferrer noopener"
              className="font-semibold text-azure hover:underline"
            >
              Source on GitHub
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
