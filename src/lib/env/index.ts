/**
 * Validated env access.
 *
 * Server-side modules import { SANITY_PROJECT_ID, ... } from 'astro:env/server'.
 * Client-side modules import { PUBLIC_ANALYTICS_PROVIDER, ... } from 'astro:env/client'.
 *
 * This wrapper centralizes the imports so call sites don't reach into the framework directly,
 * and so consumers get one stable interface even if the underlying env API changes.
 */

import { PUBLIC_ANALYTICS_DOMAIN, PUBLIC_ANALYTICS_PROVIDER, SITE_URL } from 'astro:env/client';
import {
  SANITY_API_VERSION,
  SANITY_DATASET,
  SANITY_PROJECT_ID,
  SANITY_READ_TOKEN,
} from 'astro:env/server';

export const serverEnv = {
  sanity: {
    projectId: SANITY_PROJECT_ID,
    dataset: SANITY_DATASET,
    apiVersion: SANITY_API_VERSION,
    readToken: SANITY_READ_TOKEN,
  },
} as const;

export const clientEnv = {
  siteUrl: SITE_URL,
  analytics: {
    provider: PUBLIC_ANALYTICS_PROVIDER,
    domain: PUBLIC_ANALYTICS_DOMAIN,
  },
} as const;

export type ServerEnv = typeof serverEnv;
export type ClientEnv = typeof clientEnv;
