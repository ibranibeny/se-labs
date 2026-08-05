// Shared, framework-agnostic logic for the "Submit an asset" flow:
// validation against the GTM taxonomy + rendering the asset Markdown file.
// Used by the client-side GitHub issue handoff.
import type { AssetType, ConversationId, SolutionAreaId } from './types';
import { ASSET_TYPES, CONVERSATIONS, SOLUTION_AREAS } from '../data/taxonomy';

const CONVERSATION_IDS = new Set<string>(CONVERSATIONS.map((c) => c.id));
const SOLUTION_AREA_IDS = new Set<string>(SOLUTION_AREAS.map((s) => s.id));
const ASSET_TYPE_IDS = new Set<string>(ASSET_TYPES.map((a) => a.id));

/** Raw values as they arrive from the HTML form (all strings / string[]). */
export interface RawSubmission {
  title: string;
  slug: string;
  excerpt: string;
  assetType: string;
  conversations: string[];
  solutionAreas: string[];
  levelRange?: string;
  durationTotal?: string;
  products?: string;
  color?: string;
  order?: string;
  draft?: boolean;
  externalUrl?: string;
  body?: string;
}

/** Validated + typed submission ready to render into a Markdown asset file. */
export interface NormalizedSubmission {
  title: string;
  slug: string;
  excerpt: string;
  assetType: AssetType;
  conversations: ConversationId[];
  solutionAreas: SolutionAreaId[];
  levelRange?: string;
  durationTotal?: string;
  products: string[];
  color?: string;
  order?: number;
  draft: boolean;
  externalUrl?: string;
  body: string;
}

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const HEX_RE = /^#[0-9a-fA-F]{6}$/;

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function validateSubmission(raw: RawSubmission): {
  data?: NormalizedSubmission;
  errors?: Record<string, string>;
} {
  const errors: Record<string, string> = {};

  const title = (raw.title ?? '').trim();
  if (!title) errors.title = 'Title is required.';

  const slug = ((raw.slug ?? '').trim() || slugify(title)).toLowerCase();
  if (!SLUG_RE.test(slug)) {
    errors.slug = 'Slug must be kebab-case (lowercase letters, numbers, hyphens).';
  }

  const excerpt = (raw.excerpt ?? '').trim();
  if (!excerpt) errors.excerpt = 'Excerpt is required.';

  const assetType = raw.assetType as AssetType;
  if (!ASSET_TYPE_IDS.has(assetType)) errors.assetType = 'Choose a valid asset type.';

  const conversations = (raw.conversations ?? []).filter((c) =>
    CONVERSATION_IDS.has(c),
  ) as ConversationId[];
  if (conversations.length === 0) errors.conversations = 'Select at least one conversation.';

  const solutionAreas = (raw.solutionAreas ?? []).filter((s) =>
    SOLUTION_AREA_IDS.has(s),
  ) as SolutionAreaId[];
  if (solutionAreas.length === 0) errors.solutionAreas = 'Select at least one solution area.';

  const color = (raw.color ?? '').trim();
  if (color && !HEX_RE.test(color)) errors.color = 'Color must be a hex value like #0078D4.';

  let order: number | undefined;
  if (raw.order && raw.order.trim()) {
    const n = Number(raw.order);
    if (Number.isNaN(n)) errors.order = 'Order must be a number.';
    else order = n;
  }

  const externalUrl = (raw.externalUrl ?? '').trim();
  if (externalUrl) {
    try {
      if (new URL(externalUrl).protocol !== 'https:') {
        errors.externalUrl = 'External URL must start with https://.';
      }
    } catch {
      errors.externalUrl = 'External URL is not a valid URL.';
    }
  }

  const products = (raw.products ?? '')
    .split(',')
    .map((p) => p.trim())
    .filter(Boolean);

  if (Object.keys(errors).length > 0) return { errors };

  return {
    data: {
      title,
      slug,
      excerpt,
      assetType,
      conversations,
      solutionAreas,
      levelRange: (raw.levelRange ?? '').trim() || undefined,
      durationTotal: (raw.durationTotal ?? '').trim() || undefined,
      products,
      color: color || undefined,
      order,
      draft: Boolean(raw.draft),
      externalUrl: externalUrl || undefined,
      body: (raw.body ?? '').trim(),
    },
  };
}

function yamlString(s: string): string {
  return `"${s.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`;
}

function defaultBody(d: NormalizedSubmission): string {
  const parts = [`## ${d.title}`, '', d.excerpt];
  if (d.externalUrl) parts.push('', `[Open the workshop ↗](${d.externalUrl})`);
  return parts.join('\n');
}

/** Render the asset Markdown file (frontmatter + body) that build-index.mjs reads. */
export function renderAssetMarkdown(d: NormalizedSubmission): string {
  const fm: string[] = ['---'];
  fm.push(`title: ${yamlString(d.title)}`);
  fm.push(`slug: ${d.slug}`);
  fm.push(`excerpt: ${yamlString(d.excerpt)}`);
  if (d.levelRange) fm.push(`level_range: ${yamlString(d.levelRange)}`);
  if (d.durationTotal) fm.push(`duration_total: ${yamlString(d.durationTotal)}`);
  if (d.order !== undefined) fm.push(`order: ${d.order}`);
  if (d.color) fm.push(`color: ${yamlString(d.color)}`);
  fm.push(`conversations: [${d.conversations.join(', ')}]`);
  fm.push(`solution_areas: [${d.solutionAreas.join(', ')}]`);
  fm.push(`asset_type: ${yamlString(d.assetType)}`);
  if (d.products.length) fm.push(`products: [${d.products.join(', ')}]`);
  if (d.draft) fm.push('draft: true');
  if (d.externalUrl) fm.push(`external_url: ${yamlString(d.externalUrl)}`);
  fm.push('---', '');
  return `${fm.join('\n')}\n${d.body || defaultBody(d)}\n`;
}

export interface Submitter {
  name: string;
  email: string;
  context: string;
}

const fstr = (v: FormDataEntryValue | null): string =>
  typeof v === 'string' ? v : '';

/** Build the raw submission from the client-side form fields. */
export function rawFromFormData(fd: FormData): RawSubmission {
  return {
    title: fstr(fd.get('title')),
    slug: fstr(fd.get('slug')),
    excerpt: fstr(fd.get('excerpt')),
    assetType: fstr(fd.get('assetType')),
    conversations: fd.getAll('conversations').map(String),
    solutionAreas: fd.getAll('solutionAreas').map(String),
    levelRange: fstr(fd.get('levelRange')),
    durationTotal: fstr(fd.get('durationTotal')),
    products: fstr(fd.get('products')),
    color: fstr(fd.get('color')),
    order: fstr(fd.get('order')),
    draft: fstr(fd.get('draft')) === 'on' || fstr(fd.get('draft')) === 'true',
    externalUrl: fstr(fd.get('externalUrl')),
    body: fstr(fd.get('body')),
  };
}

export function submitterFromFormData(fd: FormData): Submitter {
  return {
    name: fstr(fd.get('submitterName')),
    email: fstr(fd.get('submitterEmail')),
    context: fstr(fd.get('submitterContext')),
  };
}

export function assetFilePath(slug: string): string {
  return `src/content/modules/${slug}.md`;
}

// Four backticks so any inner ``` code/mermaid fences in the asset stay intact.
const ISSUE_FENCE = '````';

/** Render the GitHub issue body, embedding the proposed Markdown asset file. */
export function renderIssueBody(d: NormalizedSubmission, s: Submitter): string {
  const filePath = assetFilePath(d.slug);
  const fileContent = renderAssetMarkdown(d);
  const lines = [
    "New asset requested via the portal's **Submit an asset** form.",
    '',
    `**Title:** ${d.title}`,
    `**Proposed file:** \`${filePath}\``,
    `**Asset type:** ${d.assetType}`,
    `**Conversations:** ${d.conversations.join(', ')}`,
    `**Solution areas:** ${d.solutionAreas.join(', ')}`,
  ];
  if (d.products.length) lines.push(`**Products:** ${d.products.join(', ')}`);
  if (d.externalUrl) lines.push(`**External URL:** ${d.externalUrl}`);
  if (s.context) lines.push('', '**Submitter notes:**', '', s.context);
  if (s.name || s.email) {
    lines.push('', `**Submitted by:** ${s.name || 'anonymous'}${s.email ? ` <${s.email}>` : ''}`);
  }
  lines.push(
    '',
    '---',
    '',
    `Proposed contents of \`${filePath}\` — a maintainer can create the file from this:`,
    '',
    `${ISSUE_FENCE}markdown`,
    fileContent.trimEnd(),
    ISSUE_FENCE,
    '',
    '### Reviewer checklist',
    '- [ ] Taxonomy tags (conversations / solution areas / asset type) are correct',
    '- [ ] Slug matches the filename and is unique',
    '- [ ] Content is accurate, on-brand, and appropriate',
  );
  return lines.join('\n');
}

/** Prefilled GitHub "new issue" URL — no App/backend required. */
export function buildPrefilledIssueUrl(
  owner: string,
  repo: string,
  title: string,
  body: string,
): string {
  const params = new URLSearchParams({ title, body, labels: 'asset-submission' });
  return `https://github.com/${owner}/${repo}/issues/new?${params.toString()}`;
}

// GitHub rejects prefilled issue URLs beyond ~8 KB; stay well under to be safe.
const ISSUE_URL_MAX = 6000;

export interface PreparedIssue {
  url: string; // GitHub "new issue" URL to open
  clipboard?: string; // when set, the body was too long for the URL — paste this in
}

/**
 * Prepare a no-backend issue submission. Small assets embed everything in the
 * URL; large ones keep the URL tiny and carry the body via the clipboard,
 * so GitHub's URL-length limit can't reject them.
 */
export function prepareIssueSubmission(
  owner: string,
  repo: string,
  d: NormalizedSubmission,
  s: Submitter,
): PreparedIssue {
  const title = `Onboard asset: ${d.title}`;
  const fullBody = renderIssueBody(d, s);

  const fullUrl = buildPrefilledIssueUrl(owner, repo, title, fullBody);
  if (fullUrl.length <= ISSUE_URL_MAX) {
    return { url: fullUrl };
  }

  const stub = [
    `**${d.title}**`,
    '',
    'The full asset request (metadata + proposed file) is on your clipboard —',
    'paste it here with **Ctrl/Cmd + V**, then submit.',
  ].join('\n');
  return {
    url: buildPrefilledIssueUrl(owner, repo, title, stub),
    clipboard: fullBody,
  };
}
