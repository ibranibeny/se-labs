import Link from 'next/link';
import type { ModuleAsset } from '../lib/types';
import {
  assetTypeById,
  conversationById,
  solutionAreaById,
  tierColor,
} from '../data/taxonomy';
import { Pill } from './Badge';

export function AssetCard({ asset }: { asset: ModuleAsset }) {
  const at = assetTypeById.get(asset.assetType);
  const shownConversations = asset.conversations.slice(0, 2);
  const extraConversations = asset.conversations.length - shownConversations.length;

  return (
    <Link
      href={`/modules/${asset.slug}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-azure hover:shadow-lg"
    >
      <span className="h-1.5 w-full" style={{ backgroundColor: asset.color }} />
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            {at && (
              <Pill color={at.color} dot className="shrink-0">
                {at.icon} {at.id}
              </Pill>
            )}
            {asset.draft && (
              <Pill color="#b45309" className="shrink-0">
                Draft
              </Pill>
            )}
          </div>
          {asset.levelRange && (
            <Pill color="#0078d4" solid className="shrink-0">
              {asset.levelRange}
            </Pill>
          )}
        </div>

        <h3 className="text-lg font-bold leading-snug text-slate-900 group-hover:text-azure">
          {asset.title}
        </h3>
        <p className="line-clamp-3 text-sm leading-relaxed text-slate-600">
          {asset.excerpt}
        </p>

        <div className="mt-auto flex flex-col gap-2 pt-1">
          <div className="flex flex-wrap gap-1.5">
            {shownConversations.map((id) => {
              const c = conversationById.get(id);
              if (!c) return null;
              return (
                <Pill key={id} color={tierColor(c.tier)} dot title={`${c.tier}: ${c.label}`}>
                  <span className="max-w-[13rem] truncate">{c.label}</span>
                </Pill>
              );
            })}
            {extraConversations > 0 && (
              <Pill className="bg-slate-100 text-slate-600">+{extraConversations}</Pill>
            )}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {asset.solutionAreas.map((id) => {
              const s = solutionAreaById.get(id);
              if (!s) return null;
              return (
                <Pill key={id} color={s.color} dot title={s.label}>
                  {s.id}
                </Pill>
              );
            })}
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-slate-100 pt-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
          <span>
            {asset.externalUrl
              ? 'External ↗'
              : asset.labs.length > 0
                ? `${asset.labs.length} labs`
                : 'Asset'}
            {asset.durationTotal ? ` · ${asset.durationTotal}` : ''}
          </span>
          <span className="text-azure opacity-0 transition group-hover:opacity-100">
            Open →
          </span>
        </div>
      </div>
    </Link>
  );
}
