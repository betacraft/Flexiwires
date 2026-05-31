import { motion, useReducedMotion, type Variants } from 'motion/react';
import type { PropsWithChildren } from 'react';
import { fadeUp } from '@/lib/animation/presets';

interface Props {
  variants?: Variants;
  /** Threshold for triggering. 0.1 = 10% of element visible. */
  amount?: number;
  /** Only animate once — recommended for entrances. */
  once?: boolean;
  className?: string;
}

/**
 * React island for orchestrated entrance animations. Reach for this when:
 *  - You need stagger + variants
 *  - You need gestures or layout animations
 *  - You need to coordinate multiple elements
 *
 * For simple fades, prefer `<FadeIn />` (CSS-only, zero JS).
 */
export function MotionReveal({
  children,
  variants = fadeUp,
  amount = 0.2,
  once = true,
  className,
}: PropsWithChildren<Props>) {
  const reduced = useReducedMotion();

  if (reduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial="hidden"
      variants={variants}
      viewport={{ once, amount }}
      whileInView="show"
    >
      {children}
    </motion.div>
  );
}
