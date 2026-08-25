import { cn } from "@/lib/utils";

interface GoldDividerProps {
  className?: string;
  /** Centers a small diamond ornament on the line. */
  ornament?: boolean;
  align?: "left" | "center";
}

export function GoldDivider({ className, ornament = false, align = "left" }: GoldDividerProps) {
  if (!ornament) {
    return (
      <div
        className={cn(
          "h-px w-16 bg-gradient-to-r from-gold to-transparent",
          align === "center" && "mx-auto from-gold via-gold to-transparent bg-gradient-to-r",
          className,
        )}
        role="presentation"
      />
    );
  }

  return (
    <div
      className={cn("flex items-center gap-3", align === "center" && "justify-center", className)}
      role="presentation"
    >
      <span className="h-px w-10 bg-gradient-to-r from-transparent to-gold" />
      <span className="h-1.5 w-1.5 rotate-45 border border-gold" />
      <span className="h-px w-10 bg-gradient-to-l from-transparent to-gold" />
    </div>
  );
}
