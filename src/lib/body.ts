// Lazily loads a single Markdown body on demand. Kept separate from catalog.ts
// so this (and its per-file chunks) only load with the content pages, never on
// the catalog landing.
//
// Metadata already comes from the generated index, so here we only need to
// strip the frontmatter block — no YAML parser required on the client.

const loaders = import.meta.glob('/src/content/**/*.md', {
  query: '?raw',
  import: 'default',
}) as Record<string, () => Promise<string>>;

/** Remove the leading `--- ... ---` frontmatter block. */
function stripFrontmatter(raw: string): string {
  const match = raw.match(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/);
  return match ? raw.slice(match[0].length) : raw;
}

/** Remove kramdown-only attributes React would warn about. */
function cleanBody(body: string): string {
  return body.replace(/\s+markdown="[^"]*"/g, '');
}

async function loadBody(dir: 'modules' | 'labs', slug: string): Promise<string> {
  const loader = loaders[`/src/content/${dir}/${slug}.md`];
  if (!loader) return '';
  const raw = await loader();
  return cleanBody(stripFrontmatter(raw));
}

export const loadModuleBody = (slug: string) => loadBody('modules', slug);
export const loadLabBody = (slug: string) => loadBody('labs', slug);
