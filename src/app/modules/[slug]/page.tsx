import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getModule, modules } from '@/lib/catalog';
import { loadModuleBody } from '@/lib/body';
import {
  assetTypeById,
  conversationById,
  solutionAreaById,
  tierColor,
} from '@/data/taxonomy';
import { Markdown } from '@/components/Markdown';
import { Pill } from '@/components/Badge';
import { FloatNav } from '@/components/FloatNav';

export function generateStaticParams() {
  return modules.map((m) => ({ slug: m.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const mod = getModule(slug);
  return {
    title: mod ? `${mod.title} — Major Growth SE` : 'Asset not found',
    description: mod?.excerpt,
  };
}

export default async function ModulePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const mod = getModule(slug);
  if (!mod) notFound();

  const body = await loadModuleBody(mod.slug);
  const at = assetTypeById.get(mod.assetType);
  const firstLab = mod.labs[0];

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <FloatNav
        prev={{ to: '/', label: 'Catalog' }}
        next={firstLab ? { to: `/labs/${firstLab.slug}`, label: firstLab.title } : undefined}
      />

      <Link href="/" className="text-sm font-semibold text-azure hover:underline">
        &larr; Back to catalog
      </Link>

      <div className="mt-4 flex flex-wrap items-center gap-2 border-b border-slate-200 pb-5">
        {mod.draft && (
          <Pill color="#b45309" dot>
            Draft
          </Pill>
        )}
        {mod.levelRange && (
          <Pill color="#0078d4" solid>
            {mod.levelRange}
          </Pill>
        )}
        {mod.labs.length > 0 && <Pill>{mod.labs.length} labs</Pill>}
        {mod.durationTotal && <Pill color="#1b5e20">{mod.durationTotal}</Pill>}
        {at && (
          <Pill color={at.color} dot>
            {at.icon} {at.id}
          </Pill>
        )}
        {mod.solutionAreas.map((id) => {
          const s = solutionAreaById.get(id);
          return s ? (
            <Pill key={id} color={s.color} dot title={s.label}>
              {s.id}
            </Pill>
          ) : null;
        })}
        {mod.conversations.map((id) => {
          const c = conversationById.get(id);
          return c ? (
            <Pill key={id} color={tierColor(c.tier)} dot title={`${c.tier}: ${c.label}`}>
              <span className="max-w-[16rem] truncate">{c.label}</span>
            </Pill>
          ) : null;
        })}
      </div>

      {mod.externalUrl && (
        <a
          href={mod.externalUrl}
          target="_blank"
          rel="noreferrer noopener"
          className="mt-5 flex flex-col items-start gap-3 rounded-xl border border-azure/30 bg-azure/5 p-4 transition hover:border-azure hover:bg-azure/10 sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <p className="font-bold text-slate-900">
              {mod.draft
                ? 'Draft entry — the full content lives on the source site'
                : 'Open the full workshop on the source site'}
            </p>
            <p className="text-sm text-slate-600">
              The complete, hands-on workshop opens in a new tab.
            </p>
          </div>
          <span className="shrink-0 rounded-lg bg-azure px-4 py-2 text-sm font-semibold text-white">
            Open the workshop ↗
          </span>
        </a>
      )}

      <article className="mt-6">
        <Markdown content={body} />
      </article>

      {mod.labs.length > 0 && (
        <section className="mt-10">
          <h2 className="text-xl font-bold text-slate-900">Labs in this asset</h2>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {mod.labs.map((lab) => (
              <Link
                key={lab.slug}
                href={`/labs/${lab.slug}`}
                className="group rounded-xl border border-slate-200 bg-white p-4 transition hover:-translate-y-0.5 hover:border-azure hover:shadow-md"
              >
                <Pill color="#0078d4" solid>
                  L{lab.level}
                </Pill>
                <h3 className="mt-2 font-bold text-slate-900 group-hover:text-azure">
                  {lab.title}
                </h3>
                <p className="mt-1 line-clamp-2 text-sm text-slate-600">{lab.excerpt}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {(mod.sourceSite || mod.sourceRepo) && (
        <section className="mt-10 rounded-lg border-l-4 border-azure bg-slate-50 p-4 text-sm">
          <p className="font-semibold text-slate-700">Reference</p>
          <ul className="mt-1 space-y-1">
            {mod.sourceSite && (
              <li>
                📖 Original workshop:{' '}
                <a
                  href={mod.sourceSite}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="font-semibold text-azure hover:underline"
                >
                  {mod.sourceSite}
                </a>
              </li>
            )}
            {mod.sourceRepo && (
              <li>
                💻 Source repository:{' '}
                <a
                  href={mod.sourceRepo}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="font-semibold text-azure hover:underline"
                >
                  {mod.sourceRepo}
                </a>
              </li>
            )}
          </ul>
        </section>
      )}

      <nav className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-5">
        <Link
          href="/"
          className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >
          &larr; All assets
        </Link>
        {firstLab ? (
          <Link
            href={`/labs/${firstLab.slug}`}
            className="rounded-lg bg-azure px-4 py-2 text-sm font-semibold text-white hover:bg-azure-dark"
          >
            Start: {firstLab.title} &rarr;
          </Link>
        ) : mod.externalUrl ? (
          <a
            href={mod.externalUrl}
            target="_blank"
            rel="noreferrer noopener"
            className="rounded-lg bg-azure px-4 py-2 text-sm font-semibold text-white hover:bg-azure-dark"
          >
            Open the workshop ↗
          </a>
        ) : null}
      </nav>
    </div>
  );
}
