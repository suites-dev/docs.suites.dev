# UI Primitives

These Astro components reproduce the dark, restrained, technical language of the supplied Suites reference. They use semantic values from `src/styles/tokens.css` and do not change existing pages until those pages import them.

## Component API

| Component         | Props                                                                                                                    | Slots                                                                  |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------- |
| `Container`       | `width`: `wide`, `focused`, `text`                                                                                       | Default content                                                        |
| `Section`         | `spacing`: `default`, `compact`, `spacious`; `align`: `start`, `center`                                                  | `heading`, `description`, `aside`, `content`; default content fallback |
| `Panel`           | `surface`: `default`, `code`, `technical`; `tag`: `div`, `article`, `figure`, `a`; `href`; `interactive`                 | Default content                                                        |
| `Button`          | `variant`: `primary`, `secondary`, `ghost`; `href`; `disabled`; `loading`; `loadingLabel`; native button/link attributes | Default label                                                          |
| `TextLink`        | `href`; `external`; `indicator`: `auto`, `internal`, `external`, `none`; native anchor attributes                        | Default label                                                          |
| `StatusBadge`     | `state`: `stable`, `alpha`, `planned`                                                                                    | Optional label override                                                |
| `CodePanel`       | `title`; `filename`; `meta`; `ariaLabel`                                                                                 | `title`, `meta`, default code, `footer`                                |
| `TechnicalFigure` | `index`; `label`; `caption`; `decorative`; `visualLabel`                                                                 | `visual`, `caption`                                                    |
| `GridBackdrop`    | `mode`: `full`, `contained`; `origin`; `fade`: `down`, `up`, `left`, `right`, `radial`, `none`                           | None                                                                   |

All components that render a wrapper forward `class`, `id`, `aria-*`, `data-*`, and compatible native HTML attributes.

## Usage

```astro
---
import Container from '@/components/ui/primitives/Container.astro';
import Section from '@/components/ui/primitives/Section.astro';
import Panel from '@/components/ui/primitives/Panel.astro';
---

<Container width="wide">
  <Section spacing="default" align="start">
    <h2 slot="heading">Automatic mocks, explicit intent</h2>
    <p slot="description">Build focused tests without manual setup.</p>
    <Panel tag="article">Panel content</Panel>
  </Section>
</Container>
```

Use `interactive` only when a panel needs hover and focus feedback. The prop changes visual feedback; it does not add button semantics to a `div` or `article`.

## Expressive Code

Place an `astro-expressive-code` frame in the `CodePanel` default slot. The component detects `.expressive-code` and removes its outer frame, header, and footer so the integration keeps a single frame.

For raw code, use a complete `pre > code` block. The body owns horizontal scrolling, which prevents long commands from widening the page.

## Technical SVG Conventions

Build each illustration for its own view box. Do not create a universal generator.

- Use a `14px` frame grid as a construction guide.
- Use `0.5-0.8px` structural strokes at the SVG view-box scale.
- Add `data-figure-plane="top|left|right"` to neutral isometric planes.
- Add `data-figure-outline` to solid neutral outlines.
- Add `data-figure-construction` to dashed implied containers and relationships.
- Add `data-figure-active` only to the active node.
- Add `data-figure-path` only to the proven path.
- Add `data-figure-layer="rear|active"` to layers that may separate slightly on hover.

Keep the complete, readable state in the static SVG. Hover motion may add depth, but it must not reveal required information.

Purely decorative SVGs must include `aria-hidden="true"`. `TechnicalFigure` hides its visual subtree by default. For a meaningful diagram, set `decorative={false}` and provide accessible SVG text or `visualLabel`.
