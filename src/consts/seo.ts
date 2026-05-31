import { SITE } from './site';

export const DEFAULT_SEO = {
  titleTemplate: `%s — ${SITE.name}`,
  defaultTitle: SITE.name,
  description: SITE.description,
  openGraph: {
    type: 'website',
    locale: SITE.locale,
    siteName: SITE.name,
    image: SITE.ogImage,
  },
  twitter: {
    card: 'summary_large_image' as const,
    site: SITE.social.twitter,
    creator: SITE.social.twitter,
  },
} as const;
