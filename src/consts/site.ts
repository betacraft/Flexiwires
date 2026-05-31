/**
 * Global, build-time site metadata. Read everywhere — never mutate.
 * Override via env: SITE_URL.
 */
export const SITE = {
  name: 'FlexiWires',
  shortName: 'FlexiWires',
  url: import.meta.env.SITE_URL ?? 'https://flexiwires.com',
  locale: 'en-US',
  defaultLocale: 'en',
  description:
    'FlexiWires — premium, minimalist, futuristic product experiences engineered for performance.',
  themeColor: {
    light: '#ffffff',
    dark: '#0a0a0a',
  },
  social: {
    twitter: '@flexiwires',
    github: 'flexiwires',
  },
  ogImage: '/og-default.png',
} as const;

export type SiteConfig = typeof SITE;
