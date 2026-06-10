import { useState } from 'react';
import Markdown, { type Components } from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize';
import 'katex/dist/katex.min.css';
import { MermaidBlock } from './MermaidBlock';

// MathML tags emitted by KaTeX that must survive sanitization.
const MATHML_TAGS = [
  'math', 'semantics', 'annotation', 'mrow', 'mi', 'mo', 'mn', 'ms', 'mtext',
  'mspace', 'msup', 'msub', 'msubsup', 'mfrac', 'mroot', 'msqrt', 'mtable',
  'mtr', 'mtd', 'mover', 'munder', 'munderover', 'mpadded', 'mphantom',
  'menclose', 'mstyle', 'mglyph', 'span', 'div',
];

// Allow className + style (KaTeX positioning) while still stripping scripts.
const schema = {
  ...defaultSchema,
  attributes: {
    ...defaultSchema.attributes,
    '*': [...(defaultSchema.attributes?.['*'] ?? []), 'className', 'style'],
  },
  tagNames: [...(defaultSchema.tagNames ?? []), ...MATHML_TAGS],
};

function MarkdownImage({ src, alt }: { src?: string; alt?: string }) {
  const [failed, setFailed] = useState(false);

  if (failed || !src) {
    return (
      <span className="my-2 inline-block rounded border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-400">
        🖼️ {alt || 'imagem indisponível'}
      </span>
    );
  }

  return (
    <img
      src={src}
      alt={alt ?? ''}
      onError={() => setFailed(true)}
      className="my-2 h-auto max-w-full rounded"
    />
  );
}

const components: Components = {
  code({ className, children, ...props }) {
    const match = /language-(\w+)/.exec(className ?? '');
    if (match?.[1] === 'mermaid') {
      return <MermaidBlock chart={String(children).replace(/\n$/, '')} />;
    }
    return (
      <code className={className} {...props}>
        {children}
      </code>
    );
  },
  img: (props) => <MarkdownImage src={props.src} alt={props.alt} />,
};

// Convert "linkImagem:URL" markers into Markdown image blocks so they render
// as images instead of raw text. URLs run until the next whitespace.
function preprocessImageLinks(raw: string): string {
  return raw.replace(/linkImagem:(\S+)/g, (_match, url) => `\n\n![](${url})\n\n`);
}

export function RichContent({ content, className }: { content: string; className?: string }) {
  const processed = preprocessImageLinks(content);
  return (
    <div className={`prose prose-slate max-w-none ${className ?? ''}`}>
      <Markdown
        remarkPlugins={[remarkMath]}
        rehypePlugins={[rehypeKatex, [rehypeSanitize, schema]]}
        components={components}
      >
        {processed}
      </Markdown>
    </div>
  );
}
