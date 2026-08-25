"use client";

import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
  retryLabel?: string;
  className?: string;
  /** Compact inline banner (used above a grid) vs. full block (used for a whole page). */
  variant?: "block" | "banner";
}

export function ErrorState({
  title = "Bir şeyler ters gitti.",
  description,
  onRetry,
  retryLabel = "Tekrar Dene",
  className,
  variant = "block",
}: ErrorStateProps) {
  if (variant === "banner") {
    return (
      <div
        role="alert"
        className={cn(
          "flex flex-wrap items-center justify-between gap-3 rounded-sm border border-amber-500/30 bg-amber-500/5 px-4 py-3 text-sm text-amber-200",
          className,
        )}
      >
        <span className="flex items-center gap-2">
          <AlertTriangle className="size-4 shrink-0" aria-hidden="true" />
          {title}
        </span>
        {onRetry && (
          <Button variant="outline" size="sm" onClick={onRetry}>
            {retryLabel}
          </Button>
        )}
      </div>
    );
  }

  return (
    <div
      role="alert"
      className={cn(
        "flex flex-col items-center justify-center gap-3 rounded-sm border border-hairline px-6 py-16 text-center",
        className,
      )}
    >
      <AlertTriangle className="size-8 text-gold/80" aria-hidden="true" />
      <p className="font-display text-xl text-ivory">{title}</p>
      {description && <p className="max-w-sm text-sm text-muted">{description}</p>}
      {onRetry && (
        <Button variant="outline" size="sm" className="mt-2" onClick={onRetry}>
          {retryLabel}
        </Button>
      )}
    </div>
  );
}
