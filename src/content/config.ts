import { defineCollection, z } from 'astro:content';

/*
 * Docs content collection schema.
 *
 * Prisma's docs pattern, applied: every page is the same page. The frontmatter
 * contract below is the single source of truth for what a docs page is. The
 * DocLayout reads from this schema to render breadcrumb, title, page-actions,
 * body, last-updated, and prev/next, so cross-cutting changes ship in one edit
 * (the layout) instead of one-per-page.
 *
 * Required: title.
 * All other fields are optional with sensible defaults computed in the layout.
 */
const docs = defineCollection({
  type: 'content',
  schema: z.object({
    /* Identity */
    title:       z.string(),
    description: z.string().optional(),
    badge:       z.enum(['alpha', 'beta', 'new', 'deprecated']).optional(),

    /* Ordering + routing */
    sidebar_position: z.number().optional(),
    slug:             z.string().optional(),

    /* SEO surface */
    keywords:         z.array(z.string()).optional(),
    meta_title:       z.string().optional(),  // overrides <title> when set
    meta_description: z.string().optional(),  // overrides description for OG/meta
    no_index:         z.boolean().optional(), // robots noindex on dev/draft pages

    /* Page chrome */
    last_updated:        z.string().optional(),  // ISO date; the layout will fall back to file mtime if missing
    edit_url:            z.string().url().optional(),  // override the auto-derived "Edit on GitHub" URL
    toc_min_heading_level: z.number().optional(),
    hide_toc:            z.boolean().optional(),  // full-bleed mode

    /* Legacy SEO block (kept for back-compat with existing pages) */
    seo: z.object({
      primary_keyword: z.string(),
      secondary_keywords: z.array(z.string()).optional(),
      search_intent: z.string().optional(),
      snippet_angle: z.string().optional(),
    }).nullable().optional(),
  }),
});

export const collections = { docs };
