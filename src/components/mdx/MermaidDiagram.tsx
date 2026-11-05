import React, { useEffect, useRef, useState } from 'react';

interface MermaidDiagramProps {
  chart: string;
  /** Accessible description of what the diagram shows. */
  alt?: string;
  /** Optional visible caption rendered below the diagram. */
  caption?: string;
}

// Mermaid has global configuration. Keep initialization and rendering together.
let renderQueue: Promise<void> = Promise.resolve();

function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined' || !window.matchMedia) return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export default function MermaidDiagram({ chart, alt, caption }: MermaidDiagramProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svg, setSvg] = useState<string>('');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    let cancelled = false;
    let revision = 0;

    const render = () => {
      const currentRevision = ++revision;
      renderQueue = renderQueue.then(async () => {
        if (cancelled || currentRevision !== revision) return;
        try {
          const mermaid = (await import('mermaid')).default;
          const styles = getComputedStyle(document.documentElement);
          const color = (name: string) => styles.getPropertyValue(name).trim();
          mermaid.initialize({
            startOnLoad: false,
            theme: 'base',
            securityLevel: 'strict',
            fontFamily:
              '"Hanken Grotesk Local", "Hanken Grotesk", "Geist", "Inter", ui-sans-serif, system-ui, sans-serif',
            flowchart: {
              useMaxWidth: true,
              htmlLabels: true,
              curve: prefersReducedMotion() ? 'linear' : 'basis',
            },
            sequence: { useMaxWidth: true },
            themeVariables: {
              darkMode: document.documentElement.dataset.theme !== 'light',
              background: color('--bg'),
              primaryColor: color('--surface-raised'),
              primaryTextColor: color('--text'),
              primaryBorderColor: color('--primary-light'),
              secondaryColor: color('--bg-subtle'),
              tertiaryColor: color('--surface'),
              lineColor: color('--text-muted'),
              textColor: color('--text'),
              mainBkg: color('--surface-raised'),
              nodeBorder: color('--primary-light'),
              clusterBkg: color('--bg-subtle'),
              clusterBorder: color('--text-soft'),
              edgeLabelBackground: color('--bg'),
              noteBkgColor: color('--bg-subtle'),
              noteTextColor: color('--text'),
              noteBorderColor: color('--text-soft'),
            },
          });
          const id = `mermaid-${Math.random().toString(36).slice(2)}`;
          const { svg: rendered } = await mermaid.render(id, chart);
          if (!cancelled && currentRevision === revision) {
            setError('');
            setSvg(rendered);
          }
        } catch (err) {
          if (!cancelled && currentRevision === revision) {
            setError(err instanceof Error ? err.message : String(err));
          }
        }
      });
    };

    const observer = new MutationObserver(render);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });
    render();

    return () => {
      cancelled = true;
      observer.disconnect();
    };
  }, [chart]);

  // Reserve vertical space while the diagram loads so layout does not jump.
  // 240px is a reasonable median for the diagrams used in this codebase; the
  // figure shrinks to fit content once rendered.
  const placeholderStyle: React.CSSProperties = {
    minHeight: svg ? undefined : 240,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  if (error) {
    return (
      <pre role="alert" style={{ color: 'var(--error, #FF6B6B)' }}>
        Mermaid render error: {error}
      </pre>
    );
  }

  const accessibleLabel = alt ?? caption ?? 'Diagram';

  return (
    <figure className="mermaid-figure" role="group" aria-label={accessibleLabel}>
      {svg ? (
        <div
          ref={containerRef}
          className="mermaid-diagram"
          role="img"
          aria-label={accessibleLabel}
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: svg }}
        />
      ) : (
        <div
          ref={containerRef}
          className="mermaid-diagram mermaid-loading"
          role="img"
          aria-label={`Loading: ${accessibleLabel}`}
          aria-busy="true"
          style={placeholderStyle}
        />
      )}
      {caption ? <figcaption className="mermaid-caption">{caption}</figcaption> : null}
    </figure>
  );
}
