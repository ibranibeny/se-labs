import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getLab, getModule, labs } from '@/lib/catalog';
import { loadLabBody } from '@/lib/body';
import { Markdown } from '@/components/Markdown';
import { Pill } from '@/components/Badge';
import { FloatNav, type NavItem } from '@/components/FloatNav';

export function generateStaticParams() {
  return labs.map((l) => ({ slug: l.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const lab = getLab(slug);
  return {
    title: lab ? `${lab.title} — Major Growth SE` : 'Lab not found',
    description: lab?.excerpt,
  };
}

export default async function LabPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const lab = getLab(slug);
  if (!lab) notFound();

  const body = await loadLabBody(lab.slug);
  const mod = getModule(lab.module);
  const siblings = mod?.labs ?? [];
  const idx = siblings.findIndex((l) => l.slug === lab.slug);

  const prevLab = idx > 0 ? siblings[idx - 1] : undefined;
  const nextLab = idx >= 0 && idx < siblings.length - 1 ? siblings[idx + 1] : undefined;
  const moduleHref = mod ? `/modules/${mod.slug}` : '/';

  const prevNav: NavItem = prevLab
    ? { to: `/labs/${prevLab.slug}`, label: prevLab.title }
    : { to: moduleHref, label: mod ? 'Asset home' : 'Catalog' };
  const nextNav: NavItem = nextLab
    ? { to: `/labs/${nextLab.slug}`, label: nextLab.title }
    : { to: moduleHref, label: 'Back to asset' };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <FloatNav prev={prevNav} next={nextNav} />

      {mod && (
        <Link
          href={moduleHref}
          className="text-sm font-semibold text-azure hover:underline"
        >
          &larr; Part of: {mod.title}
        </Link>
      )}

      <div className="mt-3 flex flex-wrap items-center gap-2 border-b border-slate-200 pb-5">
        {lab.level > 0 && (
          <Pill color="#0078d4" solid>
            Level {lab.level}
          </Pill>
        )}
        {lab.duration && <Pill>{lab.duration}</Pill>}
        {lab.learningPath && <Pill color="#1b5e20">{lab.learningPath}</Pill>}
        {lab.docType && <Pill color="#5c2d91">{lab.docType}</Pill>}
        {lab.persona && <Pill className="bg-slate-100 text-slate-600">{lab.persona}</Pill>}
        {lab.reportIssue && (
          <a
            href={lab.reportIssue}
            target="_blank"
            rel="noreferrer noopener"
            className="ml-auto text-sm font-semibold text-slate-500 hover:text-azure hover:underline"
          >
            ⚑ Report an issue
          </a>
        )}
      </div>

      <article className="mt-6">
        <Markdown content={body} />
      </article>

      {mod?.sourceSite && (
        <p className="mt-8 rounded-lg border-l-4 border-azure bg-slate-50 p-3 text-sm">
          🔗 Source workshop:{' '}
          <a
            href={mod.sourceSite}
            target="_blank"
            rel="noreferrer noopener"
            className="font-semibold text-azure hover:underline"
          >
            {mod.sourceSite}
          </a>
          {mod.sourceRepo && (
            <>
              {' · '}
              <a
                href={mod.sourceRepo}
                target="_blank"
                rel="noreferrer noopener"
                className="font-semibold text-azure hover:underline"
              >
                GitHub repo
              </a>
            </>
          )}
        </p>
      )}

      <nav className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-5">
        <Link
          href={prevNav.to}
          className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >
          &larr; {prevNav.label}
        </Link>
        <Link
          href={nextNav.to}
          className="rounded-lg bg-azure px-4 py-2 text-sm font-semibold text-white hover:bg-azure-dark"
        >
          {nextNav.label} &rarr;
        </Link>
      </nav>
    </div>
  );
}
