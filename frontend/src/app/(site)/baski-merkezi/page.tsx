import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/layout/container";
import { PageHero } from "@/components/layout/page-hero";
import { OfferingGrid } from "@/components/shared/offering-grid";
import { RelatedServices } from "@/components/shared/related-services";
import { Button } from "@/components/ui/button";
import { PRINTING_OFFERINGS } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Baskı Merkezi",
  description:
    "Eryaman dijital baskı ve Eryaman çıktı merkezi: renkli/siyah-beyaz çıktı, fotokopi, tarama, kartvizit, broşür, etiket, kaşe ve kişiye özel tasarım.",
  alternates: {
    canonical: "/baski-merkezi",
  },
};

export default function BaskiMerkeziPage() {
  return (
    <>
      <PageHero
        eyebrow="Baskı Merkezi"
        title="Profesyonel Dijital Baskı Merkezi"
        description="Renkli ve siyah-beyaz çıktıdan kişiye özel tasarıma kadar, ihtiyacınız olan her baskı hizmeti modern ekipmanlarımızla Eryaman'da."
      />

      <section className="py-20 sm:py-24">
        <OfferingGrid offerings={PRINTING_OFFERINGS} />
      </section>

      <RelatedServices slugs={["dijital-baski", "kisiye-ozel-baski"]} />

      <section className="border-t border-hairline-soft py-20 sm:py-24">
        <Container className="flex flex-col items-center gap-6 text-center">
          <h2 className="font-display text-2xl font-semibold text-ivory sm:text-3xl">
            Baskı işiniz için hemen bize ulaşın
          </h2>
          <p className="max-w-md text-sm text-muted">
            Projenizin detaylarını paylaşın, size en uygun baskı çözümünü birlikte belirleyelim.
          </p>
          <Button asChild size="lg">
            <Link href="/iletisim">
              Baskı için Bize Ulaşın <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </Button>
        </Container>
      </section>
    </>
  );
}
