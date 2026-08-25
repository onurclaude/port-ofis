"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaginationProps {
  page: number; // 0-based
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export function Pagination({ page, totalPages, onPageChange, className }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i).filter(
    (p) => p === 0 || p === totalPages - 1 || Math.abs(p - page) <= 1,
  );

  return (
    <nav
      aria-label="Sayfalama"
      className={cn("flex items-center justify-center gap-1.5", className)}
    >
      <button
        type="button"
        onClick={() => onPageChange(page - 1)}
        disabled={page === 0}
        aria-label="Önceki sayfa"
        className="inline-flex size-9 items-center justify-center rounded-sm border border-hairline-soft text-ivory transition-colors hover:border-gold hover:text-gold disabled:pointer-events-none disabled:opacity-30"
      >
        <ChevronLeft className="size-4" />
      </button>

      {pages.map((p, i) => {
        const prev = pages[i - 1];
        const showEllipsis = prev !== undefined && p - prev > 1;
        return (
          <span key={p} className="flex items-center gap-1.5">
            {showEllipsis && <span className="px-1 text-sm text-muted">…</span>}
            <button
              type="button"
              onClick={() => onPageChange(p)}
              aria-current={p === page ? "page" : undefined}
              className={cn(
                "inline-flex size-9 items-center justify-center rounded-sm border text-sm transition-colors",
                p === page
                  ? "border-gold bg-gold text-ink font-medium"
                  : "border-hairline-soft text-ivory/80 hover:border-gold hover:text-gold",
              )}
            >
              {p + 1}
            </button>
          </span>
        );
      })}

      <button
        type="button"
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages - 1}
        aria-label="Sonraki sayfa"
        className="inline-flex size-9 items-center justify-center rounded-sm border border-hairline-soft text-ivory transition-colors hover:border-gold hover:text-gold disabled:pointer-events-none disabled:opacity-30"
      >
        <ChevronRight className="size-4" />
      </button>
    </nav>
  );
}
