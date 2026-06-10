import { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';

mermaid.initialize({ startOnLoad: false, theme: 'default', securityLevel: 'strict' });

let diagramId = 0;

export function MermaidBlock({ chart }: { chart: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const id = `mermaid-diagram-${diagramId++}`;

    mermaid
      .render(id, chart)
      .then(({ svg }) => {
        if (!cancelled && ref.current) {
          ref.current.innerHTML = svg;
          setError(null);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Diagrama inválido');
        }
      });

    return () => {
      cancelled = true;
    };
  }, [chart]);

  if (error) {
    return (
      <div className="my-3 rounded-md border border-amber-300 bg-amber-50 p-3 text-sm text-amber-700">
        <strong>Diagrama Mermaid inválido.</strong>
        <pre className="mt-1 whitespace-pre-wrap font-mono text-xs">{error}</pre>
      </div>
    );
  }

  return <div ref={ref} className="my-4 flex justify-center overflow-x-auto" />;
}
