import { cn } from "@/lib/utils";

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
  align = "center",
  className,
  titleClassName,
}: SectionHeadingProps) {
  return (
    <div className={cn("max-w-2xl", align === "center" && "mx-auto text-center", className)}>
      {eyebrow && <p className="text-xs font-bold uppercase tracking-[0.2em] text-muted">{eyebrow}</p>}
      <h2
        className={cn(
          "mt-4 font-display text-4xl font-black leading-[1.02] tracking-[-0.045em] text-ivory sm:text-5xl",
          titleClassName,
        )}
      >
        {title}
      </h2>
      {description && <p className="mt-5 text-lg leading-snug tracking-[-0.02em] text-muted">{description}</p>}
    </div>
  );
}
