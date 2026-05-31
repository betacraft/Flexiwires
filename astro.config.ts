import cloudflare from '@astrojs/cloudflare';
import netlify from '@astrojs/netlify';
import partytown from '@astrojs/partytown';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

import vercel from '@astrojs/vercel';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig, envField, fontProviders } from 'astro/config';

import { SITE } from './src/consts/site';

type AdapterTarget = 'vercel' | 'cloudflare' | 'netlify' | 'none';
const adapterTarget = (process.env.DEPLOY_TARGET ?? 'vercel') as AdapterTarget;

const adapter = (() => {
  switch (adapterTarget) {
    case 'cloudflare':
      return cloudflare({ imageService: 'compile' });
    case 'netlify':
      return netlify();
    case 'none':
      return undefined;
    case 'vercel':
      return vercel({
        webAnalytics: { enabled: true },
        imageService: true,
        imagesConfig: {
          sizes: [320, 640, 768, 1024, 1280, 1536, 1920, 2560],
          formats: ['image/avif', 'image/webp'],
          minimumCacheTTL: 60 * 60 * 24 * 365,
        },
        maxDuration: 30,
      });
  }
})();

export default defineConfig({
  site: SITE.url,
  trailingSlash: 'never',

  // Static by default; switch to 'server' or 'hybrid' per route via `export const prerender`.
  output: 'static',
  ...(adapter ? { adapter } : {}),

  // Astro v6 native Fonts API — zero-config preloading + self-hosting.
  fonts: [
    {
      provider: fontProviders.google(),
      name: 'Inter',
      cssVariable: '--font-sans',
      weights: ['400', '500', '600', '700'],
      styles: ['normal'],
      subsets: ['latin'],
      display: 'swap',
      fallbacks: [
        'ui-sans-serif',
        'system-ui',
        '-apple-system',
        'Segoe UI',
        'Roboto',
        'sans-serif',
      ],
    },
    {
      provider: fontProviders.google(),
      name: 'JetBrains Mono',
      cssVariable: '--font-mono',
      weights: ['400', '500', '600'],
      styles: ['normal'],
      subsets: ['latin'],
      display: 'swap',
      fallbacks: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
    },
  ],

  integrations: [
    react(),
    sitemap({
      changefreq: 'weekly',
      priority: 0.7,
      lastmod: new Date(),
    }),
    partytown({
      config: {
        forward: ['dataLayer.push', 'gtag', 'plausible'],
      },
    }),
  ],

  image: {
    // Built-in sharp service; replaced by adapter image service on Vercel/Cloudflare when set above.
    service: { entrypoint: 'astro/assets/services/sharp' },
    responsiveStyles: true,
    layout: 'constrained',
    domains: [],
    remotePatterns: [
      { protocol: 'https', hostname: 'cdn.sanity.io' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
    ],
  },

  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'viewport',
  },

  build: {
    inlineStylesheets: 'auto',
    assets: '_assets',
  },

  vite: {
    plugins: [tailwindcss()],
    ssr: {
      noExternal: ['motion'],
    },
    build: {
      cssCodeSplit: true,
      sourcemap: false,
    },
  },

  env: {
    schema: {
      SITE_URL: envField.string({ context: 'client', access: 'public', optional: true }),
      PUBLIC_ANALYTICS_PROVIDER: envField.enum({
        context: 'client',
        access: 'public',
        values: ['none', 'plausible', 'vercel', 'ga4', 'posthog'],
        default: 'none',
      }),
      PUBLIC_ANALYTICS_DOMAIN: envField.string({
        context: 'client',
        access: 'public',
        optional: true,
      }),
      SANITY_PROJECT_ID: envField.string({ context: 'server', access: 'secret', optional: true }),
      SANITY_DATASET: envField.string({
        context: 'server',
        access: 'public',
        default: 'production',
      }),
      SANITY_API_VERSION: envField.string({
        context: 'server',
        access: 'public',
        default: '2026-01-01',
      }),
      SANITY_READ_TOKEN: envField.string({ context: 'server', access: 'secret', optional: true }),
    },
    validateSecrets: true,
  },

  security: {
    checkOrigin: true,
  },

  devToolbar: {
    enabled: true,
  },
});
