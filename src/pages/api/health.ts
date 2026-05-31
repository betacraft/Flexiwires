import type { APIRoute } from 'astro';

// Static (GitHub Pages, DEPLOY_TARGET=none) has no server runtime, so prerender
// this route into a snapshot there; keep it dynamic for SSR adapters.
export const prerender = process.env.DEPLOY_TARGET === 'none';

export const GET: APIRoute = ({ locals }) => {
  return new Response(
    JSON.stringify({
      status: 'ok',
      requestId: locals.requestId,
      timestamp: new Date().toISOString(),
    }),
    {
      status: 200,
      headers: {
        'content-type': 'application/json',
        'cache-control': 'no-store',
      },
    },
  );
};
