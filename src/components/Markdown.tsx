import { Suspense, isValidElement, lazy, type ReactNode } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeSlug from 'rehype-slug';
import rehypeHighlight from 'rehype-highlight';

const Mermaid = lazy(() =>
  import('./Mermaid').then((m) => ({ default: m.Mermaid })),
);

/** Flatten React children to a plain string (used to recover mermaid source). */
function nodeText(node: ReactNode): string {
  if (node == null || node === false) return '';
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(nodeText).join('');
  if (isValidElement(node)) {
    return nodeText((node.props as { children?: ReactNode }).children);
  }
  return '';
}

/** Renders Markdown with GFM, raw HTML, syntax highlighting, and Mermaid. */
export function Markdown({ content }: { content: string }) {
  return (
    <div className="markdown-body prose prose-slate max-w-none prose-headings:scroll-mt-24 prose-a:text-azure prose-a:no-underline hover:prose-a:underline">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[
          rehypeRaw,
          rehypeSlug,
          [rehypeHighlight, { ignoreMissing: true, detect: true }],
        ]}
        components={{
          // Intercept ```mermaid fenced blocks and render live diagrams.
          pre(props: any) {
            const child = Array.isArray(props.children)
              ? props.children[0]
              : props.children;
            const className: string =
              (isValidElement(child) &&
                ((child.props as { className?: string }).className ?? '')) ||
              '';
            if (/language-mermaid/.test(className)) {
              const source = nodeText(
                isValidElement(child)
                  ? (child.props as { children?: ReactNode }).children
                  : '',
              );
              return (
                <Suspense fallback={<div className="mermaid text-sm text-slate-400">Rendering diagram…</div>}>
                  <Mermaid chart={source.trim()} />
                </Suspense>
              );
            }
            return <pre {...props} />;
          },
          // Open external links safely in a new tab.
          a(props: any) {
            const { href, children, ...rest } = props;
            const external = typeof href === 'string' && /^https?:\/\//.test(href);
            return (
              <a
                href={href}
                {...(external ? { target: '_blank', rel: 'noreferrer noopener' } : {})}
                {...rest}
              >
                {children}
              </a>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
