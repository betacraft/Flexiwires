import type { APIRoute } from 'astro';

export const prerender = false;

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
