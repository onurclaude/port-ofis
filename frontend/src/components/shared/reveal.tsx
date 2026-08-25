"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { cn } from "@/lib/utils";

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  /** Reveal once when scrolled into view (default) vs. immediately on mount. */
  mode?: "inView" | "mount";
  /**
   * When false, opacity is not animated (content starts fully painted, only the
   * subtle `y` offset animates). Use this for above-the-fold content that could
   * be the page's Largest Contentful Paint element — an opacity 0 -> 1 fade,
   * combined with `motion`'s SSR'd initial "hidden" style, delays the browser's
   * LCP timing until hydration + the animation have run. Defaults to true to
   * preserve the existing scroll-reveal look everywhere else.
   */
  fade?: boolean;
}

export function Reveal({
  children,
  className,
  delay = 0,
  y = 16,
  mode = "inView",
  fade = true,
}: RevealProps) {
  const reduceMotion = useReducedMotion();

  const variants: Variants = {
    hidden: { opacity: fade ? 0 : 1, y: reduceMotion ? 0 : y },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] },
    },
  };

  return (
    <motion.div
      className={cn(className)}
      initial="hidden"
      variants={variants}
      {...(mode === "inView"
        ? { whileInView: "visible", viewport: { once: true, margin: "-80px" } }
        : { animate: "visible" })}
    >
      {children}
    </motion.div>
  );
}

interface StaggerProps {
  children: React.ReactNode;
  className?: string;
  stagger?: number;
}

export function StaggerGroup({ children, className, stagger = 0.08 }: StaggerProps) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.div
      className={cn(className)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={{
        hidden: {},
        visible: {
          transition: { staggerChildren: reduceMotion ? 0 : stagger },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

export const StaggerItemMotion = motion.div;
