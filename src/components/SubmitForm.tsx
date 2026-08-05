'use client';

import { useEffect, useRef, useState, type FormEvent } from 'react';
import type { AssetType, ConversationId, ModuleAsset, SolutionAreaId } from '@/lib/types';
import {
  ASSET_TYPES,
  CONVERSATIONS,
  SOLUTION_AREAS,
  TIERS,
  tierColor,
} from '@/data/taxonomy';
import {
  prepareIssueSubmission,
  rawFromFormData,
  slugify,
  submitterFromFormData,
  validateSubmission,
} from '@/lib/submit';
import { AssetCard } from '@/components/AssetCard';
import { Markdown } from '@/components/Markdown';

const OWNER = process.env.NEXT_PUBLIC_GITHUB_OWNER || 'ibranibeny';
const REPO = process.env.NEXT_PUBLIC_GITHUB_REPO || 'se-labs';

const inputCls =
  'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-azure focus:ring-2 focus:ring-azure/30';
const labelCls = 'block text-sm font-semibold text-slate-700';

function ErrorText({ msg }: { msg?: string }) {
  if (!msg) return null;
  return <p className="mt-1 text-xs font-semibold text-rose-600">{msg}</p>;
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">{children}</h2>
  );
}

type HandoffState =
  | { status: 'idle' }
  | { status: 'copying' }
  | { status: 'ready'; url: string }
  | { status: 'opened'; url: string }
  | { status: 'error'; message: string };

export function SubmitForm() {
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [slugEdited, setSlugEdited] = useState(false);
  const [excerpt, setExcerpt] = useState('');
  const [assetType, setAssetType] = useState<AssetType>('Workshop');
  const [conversations, setConversations] = useState<ConversationId[]>([]);
  const [solutionAreas, setSolutionAreas] = useState<SolutionAreaId[]>([]);
  const [levelRange, setLevelRange] = useState('');
  const [durationTotal, setDurationTotal] = useState('');
  const [products, setProducts] = useState('');
  const [color, setColor] = useState('#0078d4');
  const [draft, setDraft] = useState(false);
  const [externalUrl, setExternalUrl] = useState('');
  const [body, setBody] = useState('');
  const [expanded, setExpanded] = useState(false);
  const [previewSrc, setPreviewSrc] = useState('');
  const [clientErrors, setClientErrors] = useState<Record<string, string>>({});
  const [handoff, setHandoff] = useState<HandoffState>({ status: 'idle' });
  const handoffVersion = useRef(0);

  const err = clientErrors;

  const previewBody =
    body.trim() ||
    `## ${title || 'Your asset'}\n\n${excerpt || 'A short overview of the asset.'}` +
      (externalUrl ? `\n\n[Open the workshop ↗](${externalUrl})` : '');

  // Debounce the preview so mermaid doesn't re-render on every keystroke.
  useEffect(() => {
    const t = setTimeout(() => setPreviewSrc(previewBody), 200);
    return () => clearTimeout(t);
  }, [previewBody]);

  // Full-screen editor: close on Esc and lock background scroll while open.
  useEffect(() => {
    if (!expanded) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setExpanded(false);
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [expanded]);

  async function openPrefilledIssue(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const attempt = ++handoffVersion.current;
    const fd = new FormData(event.currentTarget);
    const { data, errors } = validateSubmission(rawFromFormData(fd));
    if (!data) {
      setClientErrors(errors ?? {});
      setHandoff({ status: 'idle' });
      return;
    }
    setClientErrors({});
    const prep = prepareIssueSubmission(OWNER, REPO, data, submitterFromFormData(fd));

    if (!prep.clipboard) {
      window.open(prep.url, '_blank', 'noopener,noreferrer');
      setHandoff({ status: 'opened', url: prep.url });
      return;
    }

    setHandoff({ status: 'copying' });
    if (!navigator.clipboard) {
      setHandoff({
        status: 'error',
        message:
          'Clipboard access is required for this larger submission. Enable it in your browser, then try again.',
      });
      return;
    }

    try {
      await navigator.clipboard.writeText(prep.clipboard);
      if (attempt !== handoffVersion.current) return;
      setHandoff({ status: 'ready', url: prep.url });
    } catch {
      if (attempt !== handoffVersion.current) return;
      setHandoff({
        status: 'error',
        message:
          'Clipboard access was not granted. Allow clipboard access for this site, then try again.',
      });
    }
  }

  const toggleConversation = (id: ConversationId) =>
    setConversations((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));
  const toggleSolutionArea = (id: SolutionAreaId) =>
    setSolutionAreas((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));

  const previewAsset: ModuleAsset = {
    slug: slug || 'your-asset',
    title: title || 'Your asset title',
    excerpt: excerpt || 'A one or two sentence summary of the asset.',
    levelRange,
    durationTotal,
    order: 0,
    icon: '',
    color: color || '#0078d4',
    conversations,
    solutionAreas,
    assetType,
    products: products.split(',').map((s) => s.trim()).filter(Boolean),
    draft,
    externalUrl: externalUrl || undefined,
    labs: [],
    levels: [],
  };

  return (
    <>
      <form
        onSubmit={openPrefilledIssue}
        onChange={() => {
          handoffVersion.current += 1;
          setHandoff({ status: 'idle' });
        }}
        className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]"
      >
        {/* ---- Fields ---- */}
        <div className="space-y-8">
          <section className="space-y-4">
            <SectionTitle>Basics</SectionTitle>

            <div>
              <label htmlFor="title" className={labelCls}>
                Title <span className="text-rose-500">*</span>
              </label>
              <input
                id="title"
                name="title"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (!slugEdited) setSlug(slugify(e.target.value));
                }}
                className={`${inputCls} mt-1`}
                placeholder="Self-hosted inference on AKS with KAITO"
              />
              <ErrorText msg={err.title} />
            </div>

            <div>
              <label htmlFor="slug" className={labelCls}>
                Slug <span className="text-rose-500">*</span>
              </label>
              <input
                id="slug"
                name="slug"
                value={slug}
                onChange={(e) => {
                  setSlug(e.target.value);
                  setSlugEdited(true);
                }}
                className={`${inputCls} mt-1 font-mono`}
                placeholder="self-hosted-inference-aks-kaito"
              />
              <p className="mt-1 text-xs text-slate-500">
                Kebab-case. Becomes the filename <code>src/content/modules/&lt;slug&gt;.md</code>.
              </p>
              <ErrorText msg={err.slug} />
            </div>

            <div>
              <label htmlFor="excerpt" className={labelCls}>
                Excerpt <span className="text-rose-500">*</span>
              </label>
              <textarea
                id="excerpt"
                name="excerpt"
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                rows={2}
                className={`${inputCls} mt-1`}
                placeholder="One or two sentences that summarize the asset for the card."
              />
              <ErrorText msg={err.excerpt} />
            </div>

            <div>
              <label htmlFor="assetType" className={labelCls}>
                Asset type <span className="text-rose-500">*</span>
              </label>
              <select
                id="assetType"
                name="assetType"
                value={assetType}
                onChange={(e) => setAssetType(e.target.value as AssetType)}
                className={`${inputCls} mt-1`}
              >
                {ASSET_TYPES.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.icon} {a.label}
                  </option>
                ))}
              </select>
              <ErrorText msg={err.assetType} />
            </div>
          </section>

          <section className="space-y-3">
            <SectionTitle>Conversation(s) *</SectionTitle>
            <ErrorText msg={err.conversations} />
            {TIERS.map((tier) => (
              <div key={tier}>
                <p
                  className="mb-1 text-[0.68rem] font-bold uppercase tracking-wide"
                  style={{ color: tierColor(tier) }}
                >
                  {tier}
                </p>
                <div className="space-y-1">
                  {CONVERSATIONS.filter((c) => c.tier === tier).map((c) => (
                    <label
                      key={c.id}
                      className="flex cursor-pointer items-start gap-2 rounded-md px-2 py-1 text-sm text-slate-700 hover:bg-slate-50"
                    >
                      <input
                        type="checkbox"
                        name="conversations"
                        value={c.id}
                        checked={conversations.includes(c.id)}
                        onChange={() => toggleConversation(c.id)}
                        className="mt-0.5 accent-azure"
                      />
                      <span>{c.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </section>

          <section className="space-y-2">
            <SectionTitle>Solution area(s) *</SectionTitle>
            <ErrorText msg={err.solutionAreas} />
            <div className="flex flex-wrap gap-3">
              {SOLUTION_AREAS.map((s) => (
                <label
                  key={s.id}
                  className="flex cursor-pointer items-center gap-2 rounded-md border border-slate-200 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50"
                >
                  <input
                    type="checkbox"
                    name="solutionAreas"
                    value={s.id}
                    checked={solutionAreas.includes(s.id)}
                    onChange={() => toggleSolutionArea(s.id)}
                    className="accent-azure"
                  />
                  <span>
                    {s.id} — {s.label}
                  </span>
                </label>
              ))}
            </div>
          </section>

          <section className="space-y-4">
            <SectionTitle>Details (optional)</SectionTitle>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="levelRange" className={labelCls}>
                  Level range
                </label>
                <input
                  id="levelRange"
                  name="levelRange"
                  value={levelRange}
                  onChange={(e) => setLevelRange(e.target.value)}
                  className={`${inputCls} mt-1`}
                  placeholder="L100–L400"
                />
              </div>
              <div>
                <label htmlFor="durationTotal" className={labelCls}>
                  Duration
                </label>
                <input
                  id="durationTotal"
                  name="durationTotal"
                  value={durationTotal}
                  onChange={(e) => setDurationTotal(e.target.value)}
                  className={`${inputCls} mt-1`}
                  placeholder="~2 hours"
                />
              </div>
              <div>
                <label htmlFor="order" className={labelCls}>
                  Order
                </label>
                <input
                  id="order"
                  name="order"
                  type="number"
                  className={`${inputCls} mt-1`}
                  placeholder="50"
                />
                <ErrorText msg={err.order} />
              </div>
              <div>
                <label htmlFor="color" className={labelCls}>
                  Card accent color
                </label>
                <input
                  id="color"
                  name="color"
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="mt-1 h-9 w-full cursor-pointer rounded-lg border border-slate-300 bg-white px-1"
                />
                <ErrorText msg={err.color} />
              </div>
            </div>

            <div>
              <label htmlFor="products" className={labelCls}>
                Products / technologies
              </label>
              <input
                id="products"
                name="products"
                value={products}
                onChange={(e) => setProducts(e.target.value)}
                className={`${inputCls} mt-1`}
                placeholder="AKS, KAITO, GPU"
              />
              <p className="mt-1 text-xs text-slate-500">Comma-separated tags.</p>
            </div>

            <label className="flex cursor-pointer items-center gap-2 text-sm font-semibold text-slate-700">
              <input
                type="checkbox"
                name="draft"
                checked={draft}
                onChange={(e) => setDraft(e.target.checked)}
                className="accent-azure"
              />
              Draft / external link-out asset
            </label>

            {draft && (
              <div>
                <label htmlFor="externalUrl" className={labelCls}>
                  External URL
                </label>
                <input
                  id="externalUrl"
                  name="externalUrl"
                  value={externalUrl}
                  onChange={(e) => setExternalUrl(e.target.value)}
                  className={`${inputCls} mt-1`}
                  placeholder="https://example.com/the-workshop"
                />
                <ErrorText msg={err.externalUrl} />
              </div>
            )}

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="body" className={labelCls}>
                  Body (Markdown)
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setPreviewSrc(previewBody);
                    setExpanded(true);
                  }}
                  className="inline-flex items-center gap-1 rounded-md border border-slate-300 px-3 py-1 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
                >
                  ⛶ Side-by-side preview
                </button>
              </div>
              <textarea
                id="body"
                name="body"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                rows={10}
                className={`${inputCls} mt-1 font-mono`}
                placeholder={'## Overview\n\nWhat this asset demonstrates…\n\n```mermaid\nflowchart LR\n  A --> B\n```'}
              />
              <p className="mt-1 text-xs text-slate-500">
                GitHub-flavored Markdown, code highlighting, and mermaid diagrams are supported.
                Leave blank to generate a starter body.
              </p>
            </div>
          </section>

          <section className="space-y-4">
            <SectionTitle>About you (optional)</SectionTitle>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="submitterName" className={labelCls}>
                  Name
                </label>
                <input id="submitterName" name="submitterName" className={`${inputCls} mt-1`} />
              </div>
              <div>
                <label htmlFor="submitterEmail" className={labelCls}>
                  Email
                </label>
                <input
                  id="submitterEmail"
                  name="submitterEmail"
                  type="email"
                  className={`${inputCls} mt-1`}
                />
              </div>
            </div>
            <div>
              <label htmlFor="submitterContext" className={labelCls}>
                Notes for the reviewer
              </label>
              <textarea
                id="submitterContext"
                name="submitterContext"
                rows={3}
                className={`${inputCls} mt-1`}
                placeholder="Anything a maintainer should know before merging."
              />
            </div>
          </section>
        </div>

        {/* ---- Preview + submit ---- */}
        <aside className="space-y-4 lg:sticky lg:top-20 lg:h-fit">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Card preview</p>
          <div className="pointer-events-none">
            <AssetCard asset={previewAsset} />
          </div>

          <div className="space-y-3 rounded-lg border border-slate-200 bg-white p-4">
              <p className="text-sm text-slate-600">
                We&rsquo;ll prepare a GitHub issue for a maintainer to review. You&rsquo;ll
                submit it with your GitHub account.
              </p>

              <button
                type="submit"
                disabled={handoff.status === 'copying'}
                className="w-full rounded-lg bg-azure px-4 py-2.5 text-sm font-bold text-white transition hover:bg-azure-dark disabled:cursor-wait disabled:opacity-60"
              >
                {handoff.status === 'copying' ? 'Preparing clipboard…' : 'Prepare GitHub issue'}
              </button>

              {Object.keys(clientErrors).length > 0 && (
                <p className="text-sm font-semibold text-rose-600">Please fix the highlighted fields.</p>
              )}

              {handoff.status === 'ready' && (
                <div
                  role="status"
                  className="rounded-md border border-emerald-300 bg-emerald-50 p-3 text-xs text-emerald-800"
                >
                  <p className="font-bold">Clipboard ready</p>
                  <p className="mt-1">
                    Your complete asset request is ready to paste. Open GitHub, paste it into the
                    issue description with <strong>Ctrl/Cmd + V</strong>, then submit the issue.
                  </p>
                  <a
                    href={handoff.url}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="mt-3 inline-block rounded-md bg-azure px-3 py-2 font-bold text-white hover:bg-azure-dark"
                  >
                    Continue to GitHub ↗
                  </a>
                </div>
              )}

              {handoff.status === 'opened' && (
                <div
                  role="status"
                  className="rounded-md border border-emerald-300 bg-emerald-50 p-3 text-xs text-emerald-800"
                >
                  Opened GitHub with your issue prefilled. Review it and click{' '}
                  <strong>Submit new issue</strong>.{' '}
                  <a
                    href={handoff.url}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="font-semibold text-azure hover:underline"
                  >
                    Didn&rsquo;t open? Click here ↗
                  </a>
                </div>
              )}

              {handoff.status === 'error' && (
                <p role="alert" className="text-sm font-semibold text-rose-600">
                  {handoff.message}
                </p>
              )}

              <p className="text-xs text-slate-500">
                Small submissions open prefilled. For larger submissions, we confirm the complete
                issue is on your clipboard before sending you to GitHub.
              </p>
            </div>
        </aside>
      </form>

      {expanded && (
        <div className="fixed inset-0 z-50 flex flex-col bg-white">
          <div className="flex items-center justify-between gap-4 border-b border-slate-200 px-4 py-3 sm:px-6">
            <div>
              <p className="text-sm font-bold text-slate-900">Body editor</p>
              <p className="text-xs text-slate-500">
                Markdown on the left · live preview on the right · press Esc to close
              </p>
            </div>
            <button
              type="button"
              onClick={() => setExpanded(false)}
              className="rounded-lg bg-azure px-4 py-2 text-sm font-bold text-white transition hover:bg-azure-dark"
            >
              Done
            </button>
          </div>
          <div className="grid min-h-0 flex-1 grid-cols-1 md:grid-cols-2">
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="h-full w-full resize-none border-b border-slate-200 p-4 font-mono text-sm outline-none md:border-b-0 md:border-r"
              placeholder={'## Overview\n\nWhat this asset demonstrates…\n\n```mermaid\nflowchart LR\n  A --> B\n```'}
              aria-label="Markdown body editor"
            />
            <div className="h-full overflow-auto bg-slate-50 p-4 sm:p-6">
              <div className="mx-auto max-w-3xl rounded-lg bg-white p-6 shadow-sm">
                <Markdown content={previewSrc} />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
