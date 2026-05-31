# FlexiWires

Production-ready Astro v6 scaffold. Pages and product content are intentionally not built yet — this commit only sets up the architecture.

## Stack

- **Astro 6.3+** (static + server islands), **TypeScript** strict
- **Tailwind CSS v4** via `@tailwindcss/vite` + token-driven design system
- **Motion** for animation islands; CSS-only fade for the default reveal
- **Sanity** client (lazy, no-op when unconfigured) + provider-agnostic content types
- **Biome** for lint + format, **Husky** + **lint-staged** for pre-commit
- **Vercel** default adapter; **Cloudflare** & **Netlify** swappable via `DEPLOY_TARGET`
- **PNPM 11** on **Node 22+**

## Scripts

```sh
pnpm dev          # astro dev
pnpm build        # production build using DEPLOY_TARGET adapter
pnpm preview      # local preview of built output
pnpm typecheck    # astro check
pnpm check        # biome lint + format check
pnpm check:fix    # biome lint + format auto-fix
pnpm ci           # typecheck + check (mirrors GH Actions)
```

## Folder layout

```
src/
├─ assets/              static-imported assets (optimized at build time)
├─ components/
│  ├─ ui/               shadcn-style primitives (cva + cn pattern)
│  ├─ layout/           Header, Footer, page chrome
│  ├─ sections/         marketing/product sections (empty for now)
│  ├─ animations/       motion + CSS animation wrappers
│  └─ seo/              <Seo />, <JsonLd />
├─ consts/              site, navigation, seo defaults
├─ content/             content collections (blog, docs, legal)
├─ layouts/             BaseLayout, MarketingLayout
├─ lib/
│  ├─ analytics/        provider-agnostic analytics shim
│  ├─ animation/        Motion presets + reduced-motion helpers
│  ├─ cms/              Sanity client + provider-agnostic types
│  ├─ env/              typed env wrapper around astro:env
│  ├─ seo/              meta resolver
│  └─ utils/            cn() etc.
├─ pages/
│  ├─ api/              server endpoints (prerender: false)
│  ├─ index.astro       scaffold placeholder — replace
│  └─ robots.txt.ts     dynamic robots
├─ styles/              tokens.css + globals.css
├─ types/               ambient types
└─ middleware.ts        security headers + request context
```

## Switching deployment targets

```sh
# default
pnpm build

# alternates
DEPLOY_TARGET=cloudflare pnpm build
DEPLOY_TARGET=netlify pnpm build
DEPLOY_TARGET=none pnpm build   # static, no adapter (CI mode)
```

## Environment

Copy `.env.example` to `.env.local`. The schema is enforced by `astro:env` (see `astro.config.ts`).
