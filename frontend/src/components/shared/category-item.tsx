import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, LayoutGrid } from "lucide-react";
import type { Category } from "@/lib/types";
import { cn } from "@/lib/utils";

/** Flat tile: image on a quiet ground, name underneath — no overlay, no shadow. */
export function CategoryItem({ category, className }: { category: Category; className?: string }) {
  return (
    <Link href={`/urunler?category=${category.slug}`} className={cn("group block", className)}>
      <div className="relative aspect-[4/3] overflow-hidden rounded-lg border border-hairline-soft bg-surface">
        {category.imageUrl ? (
          <Image
            src={category.imageUrl}
            alt={category.name}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 40vw, 50vw"
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <LayoutGrid className="size-9 text-muted/40" aria-hidden="true" />
          </div>
        )}
      </div>
      <div className="mt-4 flex items-start justify-between gap-3">
        <span className="text-lg font-bold leading-snug tracking-[-0.03em] text-ivory">{category.name}</span>
        <ArrowUpRight
          className="mt-1 size-4 shrink-0 text-muted transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-ivory"
          aria-hidden="true"
        />
      </div>
    </Link>
  );
}
