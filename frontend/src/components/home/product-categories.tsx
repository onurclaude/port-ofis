import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/layout/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { CategoryItem } from "@/components/shared/category-item";
import { Reveal } from "@/components/shared/reveal";
import { Button } from "@/components/ui/button";
import type { Category } from "@/lib/types";

export function ProductCategories({ categories }: { categories: Category[] | null }) {
  return (
    <section className="bg-ink py-24 sm:py-28">
      <Container>
        <div className="flex flex-col items-start justify-between gap-8 sm:flex-row sm:items-end">
          <SectionHeading
            eyebrow="Ürün Dünyamız"
            title="Kategorilerimizi Keşfedin"
            description="Kırtasiye ürünlerinden kişiye özel baskı ürünlerine, ihtiyacınıza göre gruplanmış katalogumuza göz atın."
          />
          <Button asChild variant="link" className="hidden shrink-0 sm:inline-flex">
            <Link href="/urunler">
              Tüm Ürünler <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </Button>
        </div>

        <div className="mt-14">
          {categories === null && (
            <p className="py-10 text-center text-sm text-muted">Kategorilerimizi şu anda görüntüleyemiyoruz.</p>
          )}
          {categories !== null && categories.length === 0 && (
            <p className="py-10 text-center text-sm text-muted">Yakında burada.</p>
          )}
          {categories !== null && categories.length > 0 && (
            <div className="-mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-2 sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-6 sm:overflow-visible sm:px-0 lg:grid-cols-4">
              {categories.map((category, i) => (
                <Reveal
                  key={category.id}
                  delay={i * 0.05}
                  className="w-[72vw] shrink-0 snap-start sm:w-auto sm:shrink"
                >
                  <CategoryItem category={category} />
                </Reveal>
              ))}
            </div>
          )}
        </div>

        <Button asChild variant="outline" className="mt-10 w-full sm:hidden">
          <Link href="/urunler">
            Tüm Ürünler <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </Button>
      </Container>
    </section>
  );
}
