import { clientEnv } from '@/lib/env';
import type { AnalyticsEvent } from './events';

/**
 * Provider-agnostic analytics surface.
 *
 * Switch providers via PUBLIC_ANALYTICS_PROVIDER without touching call sites.
 * All providers are loaded lazily on first event so the homepage stays fast.
 */

type Provider = 'none' | 'plausible' | 'vercel' | 'ga4' | 'posthog';

interface ProviderApi {
  track(event: AnalyticsEvent): void;
  pageview(url: string): void;
}

declare global {
  interface Window {
    plausible?: (event: string, options?: { props?: Record<string, unknown> }) => void;
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
    va?: (event: string, data?: Record<string, unknown>) => void;
  }
}

const noop: ProviderApi = { track: () => {}, pageview: () => {} };

function plausibleProvider(): ProviderApi {
  return {
    track: (event) => window.plausible?.(event.name, { props: event.properties ?? {} }),
    pageview: () => window.plausible?.('pageview'),
  };
}

function vercelProvider(): ProviderApi {
  return {
    track: (event) => window.va?.('event', { name: event.name, ...event.properties }),
    pageview: () => window.va?.('pageview'),
  };
}

function ga4Provider(): ProviderApi {
  return {
    track: (event) => window.gtag?.('event', event.name, event.properties ?? {}),
    pageview: (url) => window.gtag?.('event', 'page_view', { page_location: url }),
  };
}

function getProvider(): ProviderApi {
  if (typeof window === 'undefined') return noop;
  const p = clientEnv.analytics.provider as Provider;
  switch (p) {
    case 'plausible':
      return plausibleProvider();
    case 'vercel':
      return vercelProvider();
    case 'ga4':
      return ga4Provider();
    case 'posthog':
      // PostHog uses its own SDK loader — wire it once installed.
      return noop;
    default:
      return noop;
  }
}

export const analytics = {
  track(event: AnalyticsEvent): void {
    getProvider().track(event);
  },
  pageview(url: string = typeof window !== 'undefined' ? window.location.href : ''): void {
    getProvider().pageview(url);
  },
};
