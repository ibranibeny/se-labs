import Link from 'next/link';

export interface NavItem {
  to: string;
  label: string;
}

/** Fixed left/right circular quick-nav buttons that follow the scroll. */
export function FloatNav({ prev, next }: { prev?: NavItem; next?: NavItem }) {
  const base =
    'group fixed top-1/2 z-50 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-azure text-white shadow-lg shadow-azure/30 opacity-85 transition hover:bg-azure-dark hover:opacity-100 focus:opacity-100';
  const label =
    'pointer-events-none absolute hidden max-w-[240px] truncate rounded-md bg-slate-900 px-2 py-1 text-xs font-semibold text-white opacity-0 transition group-hover:block group-hover:opacity-95';

  return (
    <>
      {prev && (
        <Link href={prev.to} aria-label={`Previous: ${prev.label}`} className={`${base} left-3.5`}>
          <span className="text-xl leading-none">&larr;</span>
          <span className={`${label} left-14`}>{prev.label}</span>
        </Link>
      )}
      {next && (
        <Link href={next.to} aria-label={`Next: ${next.label}`} className={`${base} right-3.5`}>
          <span className="text-xl leading-none">&rarr;</span>
          <span className={`${label} right-14`}>{next.label}</span>
        </Link>
      )}
    </>
  );
}
