// Loads a single Markdown body from disk on the server. Metadata already comes
// from the generated index, so here we only strip the frontmatter block — no
// YAML parser required. Called only from Server Components (module/lab pages),
// which are statically generated at build time.
import { promises as fs } from 'node:fs';
import path from 'node:path';

const CONTENT_DIR = path.join(process.cwd(), 'src', 'content');

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
  try {
    const raw = await fs.readFile(path.join(CONTENT_DIR, dir, `${slug}.md`), 'utf8');
    return cleanBody(stripFrontmatter(raw));
  } catch {
    return '';
  }
}

export const loadModuleBody = (slug: string) => loadBody('modules', slug);
export const loadLabBody = (slug: string) => loadBody('labs', slug);
