import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, LayoutGrid } from "lucide-react";
import type { Category } from "@/lib/types";
import { cn } from "@/lib/utils";

export function CategoryItem({ category, className }: { category: Category; className?: string }) {
  return (
    <Link
      href={`/urunler?category=${category.slug}`}
      className={cn(
        "group relative flex aspect-[4/5] flex-col justify-end overflow-hidden rounded-sm border border-hairline-soft bg-surface transition-colors duration-300 hover:border-gold/60",
        className,
      )}
    >
      {category.imageUrl ? (
        <Image
          src={category.imageUrl}
          alt={category.name}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 40vw, 80vw"
          className="object-cover opacity-70 transition-transform duration-700 ease-out group-hover:scale-105 group-hover:opacity-85"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-surface">
          <LayoutGrid className="size-10 text-gold/30" aria-hidden="true" />
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-transparent" aria-hidden="true" />

      <div className="relative flex items-end justify-between gap-3 p-5 sm:p-6">
        <span className="font-display text-lg font-medium leading-snug text-ivory sm:text-xl">
          {category.name}
        </span>
        <ArrowUpRight
          className="size-5 shrink-0 text-gold transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
          aria-hidden="true"
        />
      </div>
    </Link>
  );
}
