import type { ReactNode } from "react";
import { Eyebrow } from "./Eyebrow";
import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className,
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: string | null;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div className={cn("max-w-2xl", align === "center" && "mx-auto text-center", className)}>
      {eyebrow ? <Eyebrow className="mb-4">{eyebrow}</Eyebrow> : null}
      <h2 className="text-display-2 font-display leading-[1.1] text-text">{title}</h2>
      {description ? <p className="text-body-lg mt-4 text-muted">{description}</p> : null}
    </div>
  );
}
