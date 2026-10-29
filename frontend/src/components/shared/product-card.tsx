"use client";

import Image from "next/image";
import Link from "next/link";
import { ImageOff } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { WEBSITE_DESIGN_CATEGORY_SLUG } from "@/lib/constants";
import type { Product, StockStatus } from "@/lib/types";
import { formatPrice } from "@/lib/utils";

const STOCK_LABEL: Record<StockStatus, { label: string; className: string }> = {
  IN_STOCK: { label: "Stokta", className: "text-emerald-700 border-emerald-700/25 bg-white" },
  OUT_OF_STOCK: { label: "Stok Dışı", className: "text-red-700 border-red-700/25 bg-white" },
  ON_ORDER: { label: "Siparişe Özel", className: "text-gold border-gold/30 bg-white" },
};

function ProductCardVisual({ product, stock, price }: { product: Product; stock: { label: string; className: string }; price: string | null }) {
  return (
    <>
      <div className="relative aspect-square overflow-hidden bg-ink-soft">
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            sizes="(min-width: 1024px) 22vw, (min-width: 640px) 40vw, 90vw"
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <ImageOff className="size-8 text-muted/40" aria-hidden="true" />
          </div>
        )}
        <span
          className={`absolute right-2.5 top-2.5 rounded-lg border px-2 py-1 text-[10px] font-bold uppercase tracking-wide ${stock.className}`}
        >
          {stock.label}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-1.5 p-4">
        <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-muted">
          {product.category.name}
        </span>
        <span className="text-lg font-bold leading-snug tracking-[-0.03em] text-ivory">{product.name}</span>
        {price && <span className="mt-auto pt-1 text-base font-bold tracking-[-0.02em] text-gold">{price}</span>}
      </div>
    </>
  );
}

export function ProductCard({ product }: { product: Product }) {
  const stock = STOCK_LABEL[product.stockStatus];
  const price = formatPrice(product.price);

  if (product.category.slug === WEBSITE_DESIGN_CATEGORY_SLUG) {
    return (
      <Link
        href={`/web-tasarimlari/${product.slug}`}
        className="group flex flex-col overflow-hidden rounded-lg border border-hairline-soft bg-ink text-left transition-colors duration-300 hover:border-hairline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
      >
        <ProductCardVisual product={product} stock={stock} price={price} />
      </Link>
    );
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          type="button"
          className="group flex flex-col overflow-hidden rounded-lg border border-hairline-soft bg-ink text-left transition-colors duration-300 hover:border-hairline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
        >
          <ProductCardVisual product={product} stock={stock} price={price} />
        </button>
      </DialogTrigger>

      <DialogContent>
        <div className="relative -mx-6 -mt-6 mb-5 aspect-video overflow-hidden bg-ink-soft sm:-mx-8 sm:-mt-8">
          {product.imageUrl ? (
            <Image src={product.imageUrl} alt={product.name} fill sizes="600px" className="object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center">
              <ImageOff className="size-10 text-muted/40" aria-hidden="true" />
            </div>
          )}
        </div>
        <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-muted">
          {product.category.name}
        </span>
        <DialogTitle className="mt-1">{product.name}</DialogTitle>
        <DialogDescription className="mt-3 whitespace-pre-line leading-relaxed">
          {product.description || "Bu ürün için henüz açıklama eklenmemiş."}
        </DialogDescription>
        <div className="mt-5 flex items-center gap-3">
          <span className={`rounded-lg border px-2.5 py-1 text-xs font-bold uppercase tracking-wide ${stock.className}`}>
            {stock.label}
          </span>
          {price && <span className="text-lg font-bold text-gold">{price}</span>}
        </div>
      </DialogContent>
    </Dialog>
  );
}
