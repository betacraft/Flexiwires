---
name: ui-animation-pro
description: >-
  The living animation playbook for the FlexiWires website. Use whenever a user
  wants to add, choose, or implement a UI animation — entrance/scroll reveals,
  component micro-interactions, layout/navigation motion, orchestrated React-island
  timelines, or page/view transitions. The user can pick a specific animation from
  the catalog ("use the stagger reveal on this section") or ask for the best fit
  ("animate this card nicely") and Claude selects from the catalog. This skill is
  self-maintaining: whenever a NEW animation is added to the codebase, append it to
  the catalog here using the Entry Template so the playbook stays in sync.
---

# UI Animation Pro

The single source of truth for **how motion works on this website** and **how to
add more of it consistently**. Every animation in the repo is generalized here into
a reusable, copy-pasteable recipe, grouped by where it lives (foundations →
components → layout → orchestration → page transitions).

It is a **learning skill**: the catalog grows as the site grows. When a new
animation lands in the codebase, capture it here (see
[Learning & Maintenance Protocol](#learning--maintenance-protocol)).

---

## How to use this skill

There are two modes. Detect which one the user wants from their phrasing.

### Mode A — User picks a specific animation
The user names a catalog entry or describes one closely ("add the **stagger
reveal**", "make the button do the hover-fill", "give this section a fade-up on
scroll"). → Jump to that entry, follow its **Implementation** block, adapt the
target element, done.

If the request is ambiguous about *which* entry, show the
[Catalog Index](#catalog-index) as a short menu and let them choose.

### Mode B — Best fit (Claude decides)
The user says "animate this", "make it feel premium", "add some motion here", or
hands Claude an element with no specific animation in mind. → Use the
[Best-Fit Decision Guide](#best-fit-decision-guide) to pick the right entry for the
element type + intent, state the choice in one line ("Using **`reveal/fade-in`** —
CSS-only, zero JS, right for a static section"), then implement it.

### Non-negotiable rules for every implementation
1. **Reuse the system, never reinvent.** Pull timing/easing from the
   [Foundations](#foundations) tokens & presets — never hardcode a `cubic-bezier`
   or a duration in a component.
2. **Respect `prefers-reduced-motion` every time.** Each entry states its a11y
   behavior; honor it. The global reset in `tokens.css` is a backstop, not an excuse.
3. **Cheapest tool that works.** Prefer CSS-only (`FadeIn`, `transition-*`
   utilities) over a React island. Only reach for Motion when you need stagger,
   gestures, layout animations, or an orchestrated timeline.
4. **Animate only `transform` and `opacity`** for anything on a hot path (scroll,
   hover, large lists). Avoid animating layout properties (width/height/top/left).

---

## Catalog Index

The menu. Pick by intent; click through for the recipe.

| ID | Category | What it does | Cost | Best for |
|----|----------|--------------|------|----------|
| [`reveal/fade-in`](#revealfade-in) | Reveal | Fade + rise on scroll into view | CSS-only, ~0 JS | Default section/element reveal |
| [`reveal/motion-reveal`](#revealmotion-reveal) | Reveal | Variant-driven reveal (fade/scale/up) | React island | When you need variants/orchestration |
| [`reveal/stagger`](#revealstagger) | Reveal | Children reveal one-by-one | React island | Lists, grids, feature rows |
| [`component/hover-color`](#componenthover-color) | Component | Color/bg shift on hover | CSS-only | Buttons, nav links, any link |
| [`component/icon-swap`](#componenticon-swap) | Component | Cross-fade/swap two icons on state | CSS-only | Theme toggle, play/pause, expand |
| [`component/scale-tap`](#componentscale-tap) | Component | Press-down scale feedback | CSS or Motion | Buttons, cards, interactive tiles |
| [`layout/sticky-blur-header`](#layoutsticky-blur-header) | Layout | Sticky bar with backdrop blur | CSS-only | Site header / sticky toolbars |
| [`layout/scroll-progress`](#layoutscroll-progress) | Layout | Reading/scroll progress indicator | Small JS | Articles, long pages |
| [`page/view-transition`](#pageview-transition) | Page | Cross-page morph/fade on navigation | Astro built-in | Route changes, shared elements |

> If an entry you want isn't here, it may not exist yet — implement it with the
> closest recipe, then **add it to this catalog** per the
> [Maintenance Protocol](#learning--maintenance-protocol).

---

## Foundations

Shared motion vocabulary. **Always build on these — do not hardcode values.**

### CSS tokens — `src/styles/tokens.css`
```css
/* Easing */
--ease-out-quad:  cubic-bezier(0.5, 1, 0.89, 1);
--ease-out-cubic: cubic-bezier(0.33, 1, 0.68, 1);
--ease-out-expo:  cubic-bezier(0.16, 1, 0.3, 1);   /* signature reveal easing */
--ease-spring:    cubic-bezier(0.34, 1.56, 0.64, 1); /* overshoot/bounce */

/* Duration */
--duration-instant: 100ms;
--duration-fast:    180ms;   /* hovers, taps */
--duration-default: 260ms;   /* most transitions */
--duration-slow:    420ms;   /* reveals */
--duration-slower:  640ms;   /* hero / large motion */
```
A global `@media (prefers-reduced-motion: reduce)` block in `tokens.css` already
collapses all animation/transition durations to `0.01ms` as a safety net.

### JS / Motion presets — `src/lib/animation/presets.ts`
For React islands, consume these instead of inline objects:
```ts
import { fadeIn, fadeUp, scaleIn, staggerChildren, springs, durations, easings } from '@/lib/animation/presets';

// Variants:  fadeIn · fadeUp · scaleIn
// Springs:   springs.soft · springs.default · springs.snappy
// Stagger:   staggerChildren(stagger = 0.06, delayChildren = 0)
```

### Reduced-motion helpers — `src/lib/animation/motion-safe.ts`
```ts
import { prefersReducedMotion, withMotionSafe } from '@/lib/animation/motion-safe';
// In React islands prefer Motion's own useReducedMotion() hook (see motion-reveal).
```

**Rule of thumb:** new easing/duration constant? Add it to `tokens.css` (and
mirror in `presets.ts` if islands need it) — never inline it in a component.

---

## Catalog

Each entry is generalized: a recipe you adapt to the target element, not a
one-off. Format defined in the [Entry Template](#entry-template).

### Reveal & Scroll

#### `reveal/fade-in`
- **Category:** Reveal · **Cost:** CSS-only (IntersectionObserver, no framework JS)
- **What:** Element starts faded + offset, animates to visible when scrolled into view.
- **When:** The **default reveal**. Reach for this first for any static section,
  heading, image, or card that should appear on scroll.
- **Source:** `src/components/animations/FadeIn.astro`
- **Props:** `delay` (ms), `y` (px to rise from; `0` = pure fade), `class`
- **A11y:** Renders fully visible, no transition under `prefers-reduced-motion`.
- **Implementation:**
  ```astro
  ---
  import FadeIn from '@/components/animations/FadeIn.astro';
  ---
  <FadeIn>
    <h2>Headline</h2>
  </FadeIn>

  <!-- staggered manually via delay -->
  <FadeIn delay={0}><Card /></FadeIn>
  <FadeIn delay={80}><Card /></FadeIn>
  <FadeIn delay={160}><Card /></FadeIn>
  ```
- **Notes:** The observer re-binds on `astro:after-swap`, so it survives view
  transitions. For more than ~3–4 staggered items, prefer `reveal/stagger`.

#### `reveal/motion-reveal`
- **Category:** Reveal · **Cost:** React island (`client:visible`)
- **What:** Reveal driven by a Motion **variant** (`fadeUp` default, or `fadeIn`,
  `scaleIn`, or a custom variant), triggered when scrolled into view.
- **When:** You need a non-trivial reveal feel (scale-in, spring), or this element
  is the parent of a stagger.
- **Source:** `src/components/animations/MotionReveal.tsx`
- **Props:** `variants` (default `fadeUp`), `amount` (visible fraction to trigger,
  default `0.2`), `once` (default `true`), `className`
- **A11y:** Uses `useReducedMotion()` — renders a plain `<div>` (no animation) when reduced.
- **Implementation:**
  ```astro
  ---
  import { MotionReveal } from '@/components/animations/MotionReveal';
  ---
  <MotionReveal client:visible>
    <FeatureCard />
  </MotionReveal>
  ```
  ```tsx
  // custom variant
  import { scaleIn } from '@/lib/animation/presets';
  <MotionReveal variants={scaleIn} amount={0.3} client:visible>…</MotionReveal>
  ```

#### `reveal/stagger`
- **Category:** Reveal · **Cost:** React island
- **What:** A parent reveals, then its children animate in sequence.
- **When:** Lists, grids, feature rows — any set of sibling items that should
  cascade rather than appear at once.
- **Source:** Composes `staggerChildren()` + `fadeUp` from `presets.ts` inside a
  Motion island (pattern; create a `<Stagger>` wrapper if reused).
- **A11y:** Same `useReducedMotion()` fallback as `motion-reveal`.
- **Implementation:**
  ```tsx
  import { motion, useReducedMotion } from 'motion/react';
  import { staggerChildren, fadeUp } from '@/lib/animation/presets';

  export function Stagger({ items }: { items: React.ReactNode[] }) {
    if (useReducedMotion()) return <>{items}</>;
    return (
      <motion.ul
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        variants={staggerChildren(0.06)}
      >
        {items.map((item, i) => (
          <motion.li key={i} variants={fadeUp}>{item}</motion.li>
        ))}
      </motion.ul>
    );
  }
  ```

### Component micro-interactions

#### `component/hover-color`
- **Category:** Component · **Cost:** CSS-only
- **What:** Smooth color / background shift on hover (and focus).
- **When:** Buttons, nav links, footer links, any inline interactive text.
- **Source:** `Button.astro` (`transition-colors hover:bg-primary/90`),
  `Header.astro` nav (`transition-colors hover:text-foreground`).
- **A11y:** Pair every `hover:` with a `focus-visible:` state; the global focus ring
  is defined in `globals.css`.
- **Implementation:**
  ```astro
  <a class="text-muted-foreground transition-colors hover:text-foreground" href="…">Link</a>
  <button class="bg-primary text-primary-foreground transition-colors hover:bg-primary/90">Action</button>
  ```
- **Notes:** Use `transition-colors` (not `transition-all`) so only color animates.
  Default duration comes from Tailwind (~150ms); add `duration-[--duration-fast]`
  to align with tokens if needed.

#### `component/icon-swap`
- **Category:** Component · **Cost:** CSS-only (state-attribute driven)
- **What:** Two icons occupy the same slot; the active one shows based on a state
  attribute (e.g. `[data-theme]`), with no hydration flash.
- **When:** Theme toggle, play/pause, expand/collapse, mute/unmute.
- **Source:** `src/components/ui/ThemeToggle.astro`
- **A11y:** Button has `aria-label` + `.sr-only` text; icons are `aria-hidden`.
- **Implementation:**
  ```astro
  <button data-theme-toggle aria-label="Toggle theme">
    <svg class="icon-sun">…</svg>
    <svg class="icon-moon">…</svg>
  </button>
  <style>
    .icon-moon { display: none; }
    :global([data-theme='dark']) .icon-sun  { display: none; }
    :global([data-theme='dark']) .icon-moon { display: inline-block; }
  </style>
  ```
- **Notes:** Driving visibility off an attribute set before paint avoids FOUC. For a
  cross-fade instead of a hard swap, animate `opacity` + `transition` on both icons.

#### `component/scale-tap`
- **Category:** Component · **Cost:** CSS-only, or Motion for spring feel
- **What:** Element scales down slightly on press for tactile feedback.
- **When:** Buttons, cards, tiles — anything tappable that benefits from feedback.
- **A11y:** Suppress under reduced motion (the global reset covers CSS; use
  `useReducedMotion()` in islands).
- **Implementation:**
  ```astro
  <!-- CSS -->
  <button class="transition-transform active:scale-[0.97]">Tap</button>
  ```
  ```tsx
  // Motion (spring overshoot)
  import { motion } from 'motion/react';
  import { springs } from '@/lib/animation/presets';
  <motion.button whileTap={{ scale: 0.97 }} whileHover={{ scale: 1.02 }} transition={springs.snappy}>
    Tap
  </motion.button>
  ```

### Layout & navigation

#### `layout/sticky-blur-header`
- **Category:** Layout · **Cost:** CSS-only
- **What:** A bar pinned to the top that blurs and translucently tints content
  scrolling beneath it.
- **When:** Site header, sticky toolbars, sticky section headers.
- **Source:** `src/components/layout/Header.astro`
- **A11y:** No motion concern; ensure contrast holds over blurred content.
- **Implementation:**
  ```astro
  <header class="sticky top-0 z-[var(--z-sticky)] border-b border-border bg-background/80 backdrop-blur">
    …
  </header>
  ```
- **Notes:** Uses the `--z-sticky` token from the z-index scale. To reveal the
  border/blur only after scrolling, toggle a class via a small IntersectionObserver
  sentinel at the top of the page.

#### `layout/scroll-progress`
- **Category:** Layout · **Cost:** small JS (or Motion `useScroll`)
- **What:** A bar (usually top-fixed) that fills proportionally to scroll position.
- **When:** Long-form articles, docs, legal pages.
- **A11y:** Decorative — `aria-hidden`; never the only signal of progress.
- **Implementation (Motion island):**
  ```tsx
  import { motion, useScroll } from 'motion/react';
  export function ScrollProgress() {
    const { scrollYProgress } = useScroll();
    return (
      <motion.div
        aria-hidden
        style={{ scaleX: scrollYProgress }}
        className="fixed inset-x-0 top-0 h-0.5 origin-left bg-accent z-[var(--z-sticky)]"
      />
    );
  }
  ```
- **Notes:** `scaleX` (transform) keeps it on the compositor — never animate `width`.

### Page & view transitions

#### `page/view-transition`
- **Category:** Page · **Cost:** Astro built-in (`<ClientRouter />`)
- **What:** Smooth cross-fade / morph between routes; shared elements can persist
  across navigation.
- **When:** Multi-page navigation; persisting a header/hero across pages.
- **Source:** `src/layouts/BaseLayout.astro` (`<ClientRouter fallback="swap" />`)
- **A11y:** Astro respects `prefers-reduced-motion` for the default cross-fade.
- **Implementation:**
  ```astro
  <!-- already wired globally in BaseLayout; to name a persistent element: -->
  <img src="/hero.png" transition:name="hero" transition:animate="fade" />
  ```
- **Notes:** Animation-bearing scripts must re-init on `astro:after-swap` (the
  `FadeIn` and `ThemeToggle` scripts already do this — follow that pattern).

---

## Best-Fit Decision Guide

When the user asks for "best fit", match the **element + intent** to an entry:

| The element is… | …and you want | Use |
|-----------------|---------------|-----|
| A static section / heading / image | It to appear on scroll | `reveal/fade-in` |
| A group of sibling cards / list items | A cascade as they enter | `reveal/stagger` |
| A single hero/feature block | A richer scale or spring entrance | `reveal/motion-reveal` (`scaleIn`) |
| A button or link | Hover/focus feedback | `component/hover-color` (+ `scale-tap`) |
| A toggle with two states | Icon to change with state | `component/icon-swap` |
| The site header / a toolbar | It pinned with blur | `layout/sticky-blur-header` |
| A long article | Reading progress | `layout/scroll-progress` |
| Navigation between pages | Seamless route change | `page/view-transition` |

**Tie-breakers:**
1. Can CSS do it? → don't ship a React island.
2. Is it one element? → `reveal/fade-in`. Many siblings? → `reveal/stagger`.
3. Needs gesture/layout/timeline? → Motion island; otherwise CSS.

State the pick and the *why* in one line before implementing.

---

## Implementation Workflow

When applying any entry:

1. **Identify** the target file/element and the chosen entry (Mode A or B).
2. **Check Foundations** — confirm the timing/easing you need exists as a token;
   if not, add it to `tokens.css` (+ `presets.ts` for islands) first.
3. **Apply the recipe**, adapting only the target/content — keep the entry's
   structure, class names, and a11y attributes.
4. **Wire hydration** correctly for islands: `client:visible` for scroll reveals,
   `client:idle`/`client:load` only when needed.
5. **Verify reduced motion**: confirm the element renders sensibly with motion off.
6. **Re-init on swap**: if it relies on a `<script>`, bind on load *and*
   `astro:after-swap`.
7. If you created something **not already in the catalog**, run the
   [Maintenance Protocol](#learning--maintenance-protocol).

---

## Learning & Maintenance Protocol

This skill is **living documentation**. Keep it in sync with the codebase.

**Trigger — update this file whenever you:**
- Add a new animation component/island/util to the repo, **or**
- Introduce a new reusable motion pattern in a component, **or**
- Add/change a motion token, preset, easing, duration, or spring, **or**
- Change how an existing cataloged animation behaves.

**Procedure:**
1. **Generalize, don't transcribe.** Distill the new animation into a reusable
   recipe (what/when/how), not a copy of one usage site.
2. **Pick its category** (Reveal · Component · Layout · Page · or add a new H3
   group if genuinely new) and assign an ID `category/short-name`.
3. **Add a row** to the [Catalog Index](#catalog-index).
4. **Add a full entry** under the right category using the
   [Entry Template](#entry-template) below.
5. **Update the [Best-Fit Decision Guide](#best-fit-decision-guide)** so the
   selector can route to it.
6. **Update Foundations** if you added a token/preset/spring.
7. **Log it** in the [Changelog](#changelog) with the date.

> Optional automation: a `PostToolUse` hook on `Edit|Write` matching
> `src/components/animations/**`, `src/lib/animation/**`, or
> `src/styles/tokens.css` can remind Claude to run this protocol. Configure via the
> `update-config` skill if desired — not required for the skill to work.

### Entry Template
Copy this when adding a new animation:

```md
#### `category/short-name`
- **Category:** … · **Cost:** CSS-only | React island | small JS
- **What:** One sentence on the visible effect.
- **When:** The situations it's the right choice for.
- **Source:** path/to/file (if it has a home in the repo)
- **Props / Options:** names + defaults (omit if none)
- **A11y:** Behavior under `prefers-reduced-motion` + any ARIA needs.
- **Implementation:**
  ```astro|tsx
  // minimal, copy-pasteable, token-driven example
  ```
- **Notes:** Gotchas, perf caveats, when NOT to use it.
```

---

## Changelog

- **2026-05-30** — Initial catalog seeded from the FlexiWires codebase: Foundations
  (tokens + Motion presets + reduced-motion helpers); Reveal (`fade-in`,
  `motion-reveal`, `stagger`); Component (`hover-color`, `icon-swap`, `scale-tap`);
  Layout (`sticky-blur-header`, `scroll-progress`); Page (`view-transition`).
