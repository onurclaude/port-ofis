import type { ReactNode } from "react";
import { Container } from "./Container";
import { cn } from "@/lib/utils";

export function Section({
  id,
  className,
  containerClassName,
  children,
  ariaLabel,
}: {
  id?: string;
  className?: string;
  containerClassName?: string;
  children: ReactNode;
  ariaLabel?: string;
}) {
  return (
    <section id={id} aria-label={ariaLabel} className={cn("py-24 sm:py-32", className)}>
      <Container className={containerClassName}>{children}</Container>
    </section>
  );
}
