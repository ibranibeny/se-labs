import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-24 text-center sm:px-6">
      <p className="text-6xl font-black text-slate-200">404</p>
      <h1 className="mt-4 text-2xl font-bold text-slate-900">Asset not found</h1>
      <p className="mt-2 text-slate-600">
        The page you’re looking for doesn’t exist or may have moved.
      </p>
      <Link
        href="/"
        className="mt-6 inline-block rounded-lg bg-azure px-5 py-2.5 text-sm font-semibold text-white hover:bg-azure-dark"
      >
        &larr; Back to catalog
      </Link>
    </div>
  );
}
