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
        <SectionHeading
          eyebrow="Ürünler"
          title="Ürün Dünyamız"
          description="Kırtasiye ürünlerinden kişiye özel baskı ürünlerine, ihtiyacınıza göre gruplanmış katalogumuza göz atın."
        />

        <div className="mt-14">
          {categories === null && (
            <p className="py-10 text-center text-sm text-muted">Kategorilerimizi şu anda görüntüleyemiyoruz.</p>
          )}
          {categories !== null && categories.length === 0 && (
            <p className="py-10 text-center text-sm text-muted">Yakında burada.</p>
          )}
          {categories !== null && categories.length > 0 && (
            <div className="grid grid-cols-2 gap-x-5 gap-y-10 lg:grid-cols-4">
              {categories.map((category, i) => (
                <Reveal key={category.id} delay={i * 0.04}>
                  <CategoryItem category={category} />
                </Reveal>
              ))}
            </div>
          )}
        </div>

        <div className="mt-14 flex justify-center">
          <Button asChild>
            <Link href="/urunler">
              Tüm Ürünler <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </Container>
    </section>
  );
}
