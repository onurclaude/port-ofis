"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

export function HoverLift({ children, className }: { children: ReactNode; className?: string }) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      whileHover={reduceMotion ? undefined : { y: -4, transition: { duration: 0.25, ease: "easeOut" } }}
    >
      {children}
    </motion.div>
  );
}
