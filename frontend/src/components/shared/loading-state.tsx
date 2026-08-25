import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function LoadingState({ label = "Yükleniyor...", className }: { label?: string; className?: string }) {
  return (
    <div className={cn("flex flex-col items-center justify-center gap-3 py-16 text-muted", className)}>
      <Loader2 className="size-6 animate-spin text-gold" aria-hidden="true" />
      <p className="text-sm">{label}</p>
    </div>
  );
}

/** Grid of pulsing placeholder blocks for card-shaped content while data is in flight. */
export function SkeletonGrid({
  count = 6,
  className,
  itemClassName,
}: {
  count?: number;
  className?: string;
  itemClassName?: string;
}) {
  return (
    <div className={cn("grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3", className)} aria-hidden="true">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={cn(
            "h-56 animate-pulse rounded-sm border border-hairline-soft bg-surface",
            itemClassName,
          )}
        />
      ))}
    </div>
  );
}
