/**
 * Motion presets — single source of truth for animation feel.
 * Components consume these so timing/easing changes are made in one place.
 */
import type { Transition, Variants } from 'motion';

export const easings = {
  outQuad: [0.5, 1, 0.89, 1] as const,
  outCubic: [0.33, 1, 0.68, 1] as const,
  outExpo: [0.16, 1, 0.3, 1] as const,
  inOutExpo: [0.87, 0, 0.13, 1] as const,
} as const;

export const durations = {
  instant: 0.1,
  fast: 0.18,
  default: 0.26,
  slow: 0.42,
  slower: 0.64,
} as const;

export const springs = {
  soft: { type: 'spring', stiffness: 180, damping: 26 } satisfies Transition,
  default: { type: 'spring', stiffness: 240, damping: 24 } satisfies Transition,
  snappy: { type: 'spring', stiffness: 380, damping: 28 } satisfies Transition,
} as const;

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: durations.default, ease: easings.outCubic } },
};

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: durations.slow, ease: easings.outExpo },
  },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  show: { opacity: 1, scale: 1, transition: springs.default },
};

export const staggerChildren = (stagger = 0.06, delayChildren = 0): Variants => ({
  hidden: {},
  show: {
    transition: { staggerChildren: stagger, delayChildren },
  },
});
