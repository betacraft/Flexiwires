import type { APIRoute } from 'astro';
import { SITE } from '@/consts/site';

const robotsTxt = `User-agent: *
Allow: /
Disallow: /api/

Sitemap: ${new URL('sitemap-index.xml', SITE.url).toString()}
`;

export const GET: APIRoute = () =>
  new Response(robotsTxt, {
    headers: { 'content-type': 'text/plain; charset=utf-8' },
  });
