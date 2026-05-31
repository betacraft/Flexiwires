import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'zod';

/**
 * Content collections. Schemas are enforced at build time and types are auto-generated
 * into .astro/types.d.ts — use them via `getEntry`, `getCollection`, `getEntries`.
 *
 * Pages should NOT be authored here yet (per the brief) — the collections are pre-defined
 * so when content lands the rest of the codebase is ready to render it.
 */

const seoSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  image: z.string().optional(),
  noindex: z.boolean().default(false),
});

const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: ({ image }) =>
    z.object({
      title: z.string().min(2).max(160),
      description: z.string().min(20).max(280),
      publishedAt: z.coerce.date(),
      updatedAt: z.coerce.date().optional(),
      author: z.string().default('FlexiWires'),
      tags: z.array(z.string()).default([]),
      hero: image().optional(),
      heroAlt: z.string().optional(),
      draft: z.boolean().default(false),
      seo: seoSchema.optional(),
    }),
});

const docs = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/docs' }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    order: z.number().default(0),
    section: z.string().default('general'),
    draft: z.boolean().default(false),
  }),
});

const legal = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/legal' }),
  schema: z.object({
    title: z.string(),
    effectiveDate: z.coerce.date(),
    version: z.string().default('1.0.0'),
  }),
});

export const collections = { blog, docs, legal };
