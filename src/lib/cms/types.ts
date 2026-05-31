/**
 * Provider-agnostic content shape. The Sanity (or any future CMS) layer should map its
 * native records into these types before they enter the rest of the app — keeping the
 * domain layer decoupled from the CMS choice.
 */

export interface CmsImage {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  blurDataUrl?: string;
}

export interface CmsLink {
  label: string;
  href: string;
  external?: boolean;
}

export interface CmsSeo {
  title?: string;
  description?: string;
  image?: CmsImage;
  noindex?: boolean;
}

export interface CmsPage {
  slug: string;
  title: string;
  publishedAt?: string;
  updatedAt?: string;
  seo?: CmsSeo;
  body: unknown;
}
