// Generates a lightweight metadata index (no Markdown bodies) consumed by the
// catalog at runtime. Bodies are loaded lazily per page, so the landing bundle
// stays small as the catalog grows.
//
// Runs automatically via the "predev"/"prebuild" npm hooks.

import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import fm from 'front-matter';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const MOD_DIR = path.join(ROOT, 'src', 'content', 'modules');
const LAB_DIR = path.join(ROOT, 'src', 'content', 'labs');
const OUT = path.join(ROOT, 'src', 'generated', 'catalog-index.json');
const SUPPORTED_LEVELS = [100, 200, 300, 400, 500];

const str = (v, d = '') => (typeof v === 'string' ? v : d);
const num = (v, d = 0) => (typeof v === 'number' ? v : d);
const bool = (v) => v === true;
const arr = (v) =>
  Array.isArray(v)
    ? v.map((x) => String(x).trim()).filter(Boolean)
    : typeof v === 'string'
      ? v.split(',').map((s) => s.trim()).filter(Boolean)
      : [];

function deriveLevelsFromRange(levelRange) {
  const match = str(levelRange)
    .trim()
    .toUpperCase()
    .replace(/[–—]/g, '-')
    .match(/^L?(\d{3})(?:\s*-\s*L?(\d{3}))?$/);

  if (!match) return [];

  const start = Number(match[1]);
  const end = Number(match[2] ?? match[1]);
  const [min, max] = start <= end ? [start, end] : [end, start];

  return SUPPORTED_LEVELS.filter((level) => level >= min && level <= max);
}

async function readMarkdown(dir) {
  const files = (await fs.readdir(dir)).filter((f) => f.endsWith('.md'));
  return Promise.all(
    files.map(async (f) => {
      const raw = await fs.readFile(path.join(dir, f), 'utf8');
      const { attributes } = fm(raw);
      return { slug: f.replace(/\.md$/, ''), a: attributes };
    }),
  );
}

async function main() {
  const labsRaw = await readMarkdown(LAB_DIR);
  const labs = labsRaw
    .map(({ slug, a }) => ({
      slug,
      title: str(a.title),
      module: str(a.module),
      excerpt: str(a.excerpt),
      level: num(a.level),
      duration: str(a.duration),
      docType: str(a.doc_type),
      persona: str(a.persona),
      learningPath: str(a.learning_path),
      navOrder: num(a.nav_order),
      featured: bool(a.featured),
      reportIssue: a.report_issue ? str(a.report_issue) : undefined,
    }))
    .sort((x, y) => x.navOrder - y.navOrder);

  const modsRaw = await readMarkdown(MOD_DIR);
  const modules = modsRaw
    .map(({ slug, a }) => {
      const mlabs = labs.filter((l) => l.module === slug);
      const derivedLabLevels = [...new Set(mlabs.map((l) => l.level).filter((n) => n > 0))].sort(
        (m, n) => m - n,
      );
      const levels =
        derivedLabLevels.length > 0 ? derivedLabLevels : deriveLevelsFromRange(a.level_range);
      return {
        slug,
        title: str(a.title),
        excerpt: str(a.excerpt),
        levelRange: str(a.level_range),
        durationTotal: str(a.duration_total),
        order: num(a.order, 999),
        icon: str(a.icon),
        color: str(a.color, '#0078d4'),
        sourceSite: a.source_site ? str(a.source_site) : undefined,
        sourceRepo: a.source_repo ? str(a.source_repo) : undefined,
        conversations: arr(a.conversations),
        solutionAreas: arr(a.solution_areas),
        assetType: str(a.asset_type, 'Workshop'),
        products: arr(a.products),
        draft: bool(a.draft),
        externalUrl: a.external_url ? str(a.external_url) : undefined,
        labSlugs: mlabs.map((l) => l.slug),
        levels,
      };
    })
    .sort((x, y) => x.order - y.order);

  await fs.mkdir(path.dirname(OUT), { recursive: true });
  await fs.writeFile(OUT, `${JSON.stringify({ modules, labs }, null, 2)}\n`, 'utf8');
  console.log(`Wrote ${modules.length} modules + ${labs.length} labs to catalog-index.json`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
