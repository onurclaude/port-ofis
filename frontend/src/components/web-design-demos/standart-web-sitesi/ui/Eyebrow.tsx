import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span className={cn("text-eyebrow inline-flex items-center gap-3 font-sans uppercase text-gold", className)}>
      {children}
    </span>
  );
}
