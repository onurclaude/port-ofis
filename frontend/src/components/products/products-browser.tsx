"use client";

import { useEffect, useState } from "react";
import { PackageSearch } from "lucide-react";
import { ProductCard } from "@/components/shared/product-card";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { SkeletonGrid } from "@/components/shared/loading-state";
import { Pagination } from "@/components/shared/pagination";
import { getProducts } from "@/lib/api";
import type { Category, Product } from "@/lib/types";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 12;

export function ProductsBrowser({
  categories,
  initialCategorySlug,
}: {
  categories: Category[] | null;
  initialCategorySlug?: string;
}) {
  const [activeSlug, setActiveSlug] = useState<string | undefined>(initialCategorySlug);
  const [page, setPage] = useState(0);
  const [products, setProducts] = useState<Product[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [reloadKey, setReloadKey] = useState(0);

  // Flip into the loading state as soon as the request key changes, during
  // render (not inside the effect below) so the skeleton shows immediately.
  const requestKey = `${activeSlug ?? ""}|${page}|${reloadKey}`;
  const [lastRequestKey, setLastRequestKey] = useState(requestKey);
  if (requestKey !== lastRequestKey) {
    setLastRequestKey(requestKey);
    setStatus("loading");
  }

  useEffect(() => {
    let cancelled = false;

    getProducts({ categorySlug: activeSlug, page, size: PAGE_SIZE })
      .then((res) => {
        if (cancelled) return;
        setProducts(res.content);
        setTotalPages(res.totalPages);
        setStatus("success");
      })
      .catch(() => {
        if (cancelled) return;
        setStatus("error");
      });

    return () => {
      cancelled = true;
    };
  }, [activeSlug, page, reloadKey]);

  function selectCategory(slug: string | undefined) {
    setActiveSlug(slug);
    setPage(0);
  }

  return (
    <div>
      <div className="-mx-5 flex gap-2.5 overflow-x-auto px-5 pb-2 sm:mx-0 sm:flex-wrap sm:px-0">
        <CategoryPill active={activeSlug === undefined} label="Tümü" onClick={() => selectCategory(undefined)} />
        {categories?.map((c) => (
          <CategoryPill
            key={c.slug}
            active={activeSlug === c.slug}
            label={c.name}
            onClick={() => selectCategory(c.slug)}
          />
        ))}
      </div>

      <div className="mt-10">
        {status === "error" && (
          <ErrorState
            variant="banner"
            title="Ürünler yüklenemedi."
            onRetry={() => setReloadKey((k) => k + 1)}
            className="mb-6"
          />
        )}

        {status === "loading" && <SkeletonGrid count={PAGE_SIZE} className="sm:grid-cols-3 lg:grid-cols-4" itemClassName="h-72" />}

        {status !== "loading" && status !== "error" && products.length === 0 && (
          <EmptyState
            icon={PackageSearch}
            title="Bu kategoride henüz ürün bulunmuyor."
            description="Farklı bir kategori seçerek diğer ürünlerimize göz atabilirsiniz."
          />
        )}

        {status === "success" && products.length > 0 && (
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {status === "success" && totalPages > 1 && (
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} className="mt-12" />
        )}
      </div>
    </div>
  );
}

function CategoryPill({ active, label, onClick }: { active: boolean; label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition-colors",
        active
          ? "border-gold bg-gold text-ink"
          : "border-hairline-soft text-ivory/80 hover:border-gold hover:text-gold",
      )}
    >
      {label}
    </button>
  );
}
