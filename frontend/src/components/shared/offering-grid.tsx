"use client";

import { motion } from "framer-motion";
import { StaggerGroup, staggerItem } from "@/components/shared/reveal";

interface Offering {
  title: string;
  description: string;
}

export function OfferingGrid({ offerings }: { offerings: readonly Offering[] }) {
  return (
    <StaggerGroup className="grid grid-cols-1 gap-px overflow-hidden rounded-sm border border-hairline-soft bg-hairline-soft sm:grid-cols-2 lg:grid-cols-3">
      {offerings.map((item, i) => (
        <motion.div
          key={item.title}
          variants={staggerItem}
          className="group relative bg-ink p-8 transition-colors duration-300 hover:bg-surface"
        >
          <span className="font-display text-2xl text-gold/50 tabular-nums">{String(i + 1).padStart(2, "0")}</span>
          <h3 className="mt-4 font-display text-xl font-medium text-ivory">{item.title}</h3>
          <p className="mt-2.5 text-sm leading-relaxed text-muted">{item.description}</p>
        </motion.div>
      ))}
    </StaggerGroup>
  );
}
