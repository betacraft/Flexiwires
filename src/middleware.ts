import { defineMiddleware, sequence } from 'astro:middleware';

/**
 * Sets standard security headers on every response.
 * CSP is intentionally permissive for dev — tighten when going live.
 */
const securityHeaders = defineMiddleware(async (_ctx, next) => {
  const response = await next();
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  response.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
  return response;
});

/**
 * Annotates context.locals so downstream handlers/components can read request metadata
 * (e.g. nonce, country, A/B variant) in a typed way without re-parsing headers.
 */
const requestContext = defineMiddleware(async (ctx, next) => {
  ctx.locals.requestId = crypto.randomUUID();
  // Skip header reads on prerendered routes — they have no real request.
  if (!ctx.isPrerendered) {
    ctx.locals.country = ctx.request.headers.get('x-vercel-ip-country') ?? undefined;
  }
  return next();
});

export const onRequest = sequence(requestContext, securityHeaders);
