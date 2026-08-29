import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Container({
  as: As = "div",
  className,
  children,
}: {
  as?: ElementType;
  className?: string;
  children: ReactNode;
}) {
  return (
    <As className={cn("mx-auto w-full max-w-[1280px] px-5 sm:px-8 lg:px-16", className)}>
      {children}
    </As>
  );
}
