import type { Metadata } from "next";
import { Container } from "@/components/layout/container";
import { PageHero } from "@/components/layout/page-hero";
import { ProductsBrowser } from "@/components/products/products-browser";
import { getCategories } from "@/lib/api";
import type { Category } from "@/lib/types";

export const metadata: Metadata = {
  title: "Ürünlerimiz",
  description:
    "Port Ofis Kırtasiye ürün kataloğu: kırtasiye ürünleri, hediyelik eşya, kişiye özel baskı ürünleri ve daha fazlası.",
  alternates: {
    canonical: "/urunler",
  },
};

async function loadCategories(): Promise<Category[] | null> {
  try {
    return await getCategories();
  } catch {
    return null;
  }
}

export default async function UrunlerPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const [categories, params] = await Promise.all([loadCategories(), searchParams]);

  return (
    <>
      <PageHero
        eyebrow="Ürünlerimiz"
        title="Katalogumuzu Keşfedin"
        description="Kırtasiye ürünlerinden kişiye özel baskı ürünlerine kadar geniş ürün yelpazemize göz atın."
      />
      <section className="py-20 sm:py-24">
        <Container>
          <ProductsBrowser categories={categories} initialCategorySlug={params.category} />
        </Container>
      </section>
    </>
  );
}
