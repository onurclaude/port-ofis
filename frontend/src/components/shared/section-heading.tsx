import { cn } from "@/lib/utils";
import { GoldDivider } from "@/components/brand/gold-divider";

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
  titleClassName?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className,
  titleClassName,
}: SectionHeadingProps) {
  return (
    <div className={cn("max-w-2xl", align === "center" && "mx-auto text-center", className)}>
      {eyebrow && (
        <p className="mb-3 text-xs font-medium uppercase tracking-[0.28em] text-gold">{eyebrow}</p>
      )}
      <h2 className={cn("font-display text-3xl font-semibold text-ivory sm:text-4xl", titleClassName)}>
        {title}
      </h2>
      <GoldDivider className="mt-5" align={align} />
      {description && <p className="mt-5 text-base leading-relaxed text-muted">{description}</p>}
    </div>
  );
}
