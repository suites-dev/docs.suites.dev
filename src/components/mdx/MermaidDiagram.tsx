import React, { useEffect, useRef, useState } from 'react';

interface MermaidDiagramProps {
  chart: string;
  /** Accessible description of what the diagram shows. */
  alt?: string;
  /** Optional visible caption rendered below the diagram. */
  caption?: string;
}

let mermaidInitialized = false;

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

    const render = async () => {
      try {
        const mermaid = (await import('mermaid')).default;

        if (!mermaidInitialized) {
          // Dark palette tuned to suites.dev tokens (graphite bg #0F0F12,
          // brand pink #EF4779, muted #A1A1AA). All foreground colors verified
          // >= 4.5:1 against the diagram surface.
          // Reduced-motion users get the linear curve variant so edges don't
          // animate into Bezier shapes. Other rendering settings are identical.
          const reduceMotion = prefersReducedMotion();
          mermaid.initialize({
            startOnLoad: false,
            theme: 'base',
            securityLevel: 'strict',
            fontFamily:
              '"ABC Diatype", "Geist", "Inter", ui-sans-serif, system-ui, sans-serif',
            flowchart: {
              useMaxWidth: true,
              htmlLabels: true,
              curve: reduceMotion ? 'linear' : 'basis',
            },
            sequence: { useMaxWidth: true },
            themeVariables: {
              background: '#0F0F12',
              primaryColor: '#1A1A20',
              primaryTextColor: '#F4F4F5',
              primaryBorderColor: '#EF4779',
              secondaryColor: '#131318',
              tertiaryColor: '#0F0F12',
              lineColor: '#A1A1AA',
              textColor: '#F4F4F5',
              mainBkg: '#1A1A20',
              nodeBorder: '#EF4779',
              clusterBkg: '#131318',
              clusterBorder: 'rgba(255,255,255,0.16)',
              edgeLabelBackground: '#0F0F12',
              noteBkgColor: '#131318',
              noteTextColor: '#F4F4F5',
              noteBorderColor: 'rgba(255,255,255,0.16)',
            },
          });
          mermaidInitialized = true;
        }

        const id = `mermaid-${Math.random().toString(36).slice(2)}`;
        const { svg: rendered } = await mermaid.render(id, chart);

        if (!cancelled) {
          setSvg(rendered);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : String(err));
        }
      }
    };

    render();

    return () => {
      cancelled = true;
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
