'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

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

export function SiteHeader() {
  const pathname = usePathname();
  const linkBase =
    'rounded-md px-3 py-1.5 text-sm font-semibold transition hover:bg-slate-100';

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <BrandMark />
          <span className="flex flex-col leading-tight">
            <span className="text-sm font-black text-slate-900">Major Growth SE</span>
            <span className="text-[0.7rem] font-medium uppercase tracking-wider text-slate-500">
              Asset Portal
            </span>
          </span>
        </Link>
        <nav className="flex items-center gap-1">
          <Link
            href="/"
            className={`${linkBase} ${pathname === '/' ? 'text-azure' : 'text-slate-700'}`}
          >
            Catalog
          </Link>
          <Link
            href="/submit"
            className={`${linkBase} ${pathname === '/submit' ? 'text-azure' : 'text-slate-700'}`}
          >
            Submit an asset
          </Link>
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
  );
}
