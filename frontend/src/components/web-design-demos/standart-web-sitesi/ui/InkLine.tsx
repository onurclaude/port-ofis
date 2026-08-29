import { cn } from "@/lib/utils";

export function InkLine({
  orientation = "vertical",
  className,
}: {
  orientation?: "vertical" | "horizontal" | "diagonal";
  className?: string;
}) {
  if (orientation === "horizontal") {
    return (
      <span
        aria-hidden="true"
        className={cn("block h-px w-16 bg-gradient-to-r from-gold to-transparent", className)}
      />
    );
  }

  if (orientation === "diagonal") {
    return (
      <span
        aria-hidden="true"
        className={cn(
          "block h-16 w-px origin-top -rotate-[24deg] bg-gradient-to-b from-gold via-gold/60 to-transparent",
          className
        )}
      />
    );
  }

  return (
    <span
      aria-hidden="true"
      className={cn("block w-px self-stretch bg-gradient-to-b from-transparent via-gold to-transparent", className)}
    />
  );
}
