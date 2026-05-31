import { DEFAULT_SEO } from '@/consts/seo';
import { SITE } from '@/consts/site';

export interface SeoInput {
  title?: string;
  description?: string;
  canonical?: string | URL;
  noindex?: boolean;
  image?: string | URL;
  type?: 'website' | 'article' | 'product';
  publishedTime?: string;
  modifiedTime?: string;
  authors?: readonly string[];
  keywords?: readonly string[];
}

export interface ResolvedSeo {
  title: string;
  description: string;
  canonical: string;
  noindex: boolean;
  image: string;
  type: NonNullable<SeoInput['type']>;
  twitterCard: 'summary_large_image';
  twitterSite: string;
  publishedTime: string | undefined;
  modifiedTime: string | undefined;
  authors: readonly string[];
  keywords: readonly string[];
}

/**
 * Resolve a page-level SEO input into a fully populated record.
 * Pass the current request URL so we can derive the canonical from it.
 */
export function resolveSeo(input: SeoInput, currentUrl: URL): ResolvedSeo {
  const title = input.title
    ? DEFAULT_SEO.titleTemplate.replace('%s', input.title)
    : DEFAULT_SEO.defaultTitle;

  const canonical = input.canonical
    ? new URL(input.canonical, SITE.url).toString()
    : new URL(currentUrl.pathname, SITE.url).toString();

  const image = input.image
    ? new URL(input.image, SITE.url).toString()
    : new URL(SITE.ogImage, SITE.url).toString();

  return {
    title,
    description: input.description ?? DEFAULT_SEO.description,
    canonical,
    noindex: input.noindex ?? false,
    image,
    type: input.type ?? 'website',
    twitterCard: DEFAULT_SEO.twitter.card,
    twitterSite: DEFAULT_SEO.twitter.site,
    publishedTime: input.publishedTime,
    modifiedTime: input.modifiedTime,
    authors: input.authors ?? [],
    keywords: input.keywords ?? [],
  };
}
