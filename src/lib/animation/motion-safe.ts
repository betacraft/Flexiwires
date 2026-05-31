/**
 * Helpers that respect `prefers-reduced-motion`. Use these instead of reading the media
 * query directly in components — keeps the policy in one place.
 */

export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function withMotionSafe<T>(animated: T, reduced: T): T {
  return prefersReducedMotion() ? reduced : animated;
}
