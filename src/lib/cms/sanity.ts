import { createClient, type SanityClient } from '@sanity/client';
import {
  createImageUrlBuilder,
  type ImageUrlBuilder,
  type SanityImageSource,
} from '@sanity/image-url';

import { serverEnv } from '@/lib/env';

let _client: SanityClient | null = null;
let _imageBuilder: ImageUrlBuilder | null = null;

/**
 * Returns a memoized Sanity client. Returns `null` if the project isn't configured —
 * callers should handle that gracefully (e.g. fall back to local content or render nothing).
 */
export function getSanityClient(): SanityClient | null {
  if (_client) return _client;
  if (!serverEnv.sanity.projectId) return null;

  _client = createClient({
    projectId: serverEnv.sanity.projectId,
    dataset: serverEnv.sanity.dataset,
    apiVersion: serverEnv.sanity.apiVersion,
    useCdn: !serverEnv.sanity.readToken,
    ...(serverEnv.sanity.readToken
      ? { token: serverEnv.sanity.readToken, perspective: 'previewDrafts' as const }
      : { perspective: 'published' as const }),
  });
  return _client;
}

/**
 * Build a CDN-served image URL for a Sanity asset reference.
 * Usage: `urlFor(asset).width(1200).auto('format').url()`
 */
export function urlFor(source: SanityImageSource): ImageUrlBuilder | null {
  const client = getSanityClient();
  if (!client) return null;
  if (!_imageBuilder) _imageBuilder = createImageUrlBuilder(client);
  return _imageBuilder.image(source);
}

/**
 * Typed query helper. Returns `null` when Sanity isn't configured rather than throwing,
 * so build-time pages can render in a not-yet-CMSed state.
 */
export async function sanityFetch<T>(
  query: string,
  params: Record<string, unknown> = {},
): Promise<T | null> {
  const client = getSanityClient();
  if (!client) return null;
  return client.fetch<T>(query, params);
}
