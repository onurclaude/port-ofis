import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { Container } from "@/components/layout/container";
import { PageHero } from "@/components/layout/page-hero";
import { GoldDivider } from "@/components/brand/gold-divider";
import { OfferingGrid } from "@/components/shared/offering-grid";
import { RelatedServices } from "@/components/shared/related-services";
import { Reveal } from "@/components/shared/reveal";
import { Button } from "@/components/ui/button";
import { CORPORATE_OFFERINGS } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Kurumsal Çözümler",
  description:
    "İşletmeniz için tek noktadan ofis çözümleri: kurumsal kırtasiye tedariği ve kurumsal baskı çözümleri Eryaman ve Etimesgut çevresinde.",
  alternates: {
    canonical: "/kurumsal",
  },
};

const TRUST_POINTS = [
  "Düzenli tedarik anlaşmaları ve planlı teslimat",
  "Hacme dayalı, şeffaf fiyatlandırma",
  "Tek yetkili ile hızlı iletişim ve takip",
  "Kırtasiyeden baskıya tek fatura, tek tedarikçi",
];

export default function KurumsalPage() {
  const ctaHref = `/iletisim?subject=${encodeURIComponent("Kurumsal Teklif Talebi")}`;

  return (
    <>
      <PageHero
        eyebrow="Kurumsal"
        title="İşletmeniz İçin Tek Noktadan Ofis Çözümleri"
        description="Kurumsal kırtasiye tedariğinden toplu baskı işlerine kadar, işletmenizin ihtiyaçlarını güvenilir bir ortaklıkla karşılıyoruz."
      >
        <Button asChild size="lg" className="mt-9">
          <Link href={ctaHref}>
            Kurumsal Teklif Al <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </Button>
      </PageHero>

      <section className="py-20 sm:py-24">
        <OfferingGrid offerings={CORPORATE_OFFERINGS} />
      </section>

      <section className="border-y border-hairline-soft bg-ink-soft py-20 sm:py-24">
        <Container className="grid grid-cols-1 items-center gap-14 lg:grid-cols-2 lg:gap-20">
          <Reveal>
            <p className="mb-3 text-xs font-medium uppercase tracking-[0.28em] text-gold">Neden Port Ofis</p>
            <h2 className="font-display text-3xl font-semibold text-ivory sm:text-4xl">
              Kurumsal Müşterilerimiz Neden Bizi Tercih Ediyor
            </h2>
            <GoldDivider className="mt-5" />
            <p className="mt-6 max-w-lg text-base leading-relaxed text-muted">
              Küçük ofislerden çok şubeli işletmelere kadar, düzenli çalıştığımız kurumsal müşterilerimize zamanında
              teslimat ve şeffaf iletişimle hizmet veriyoruz.
            </p>
          </Reveal>
          <Reveal delay={0.1} className="rounded-sm border border-hairline bg-ink p-8 sm:p-10">
            <ShieldCheck className="mb-6 size-7 text-gold" aria-hidden="true" />
            <ul className="space-y-4">
              {TRUST_POINTS.map((point) => (
                <li key={point} className="flex items-start gap-3 text-sm text-ivory/85">
                  <span className="mt-1.5 size-1 shrink-0 rounded-full bg-gold" aria-hidden="true" />
                  {point}
                </li>
              ))}
            </ul>
          </Reveal>
        </Container>
      </section>

      <RelatedServices
        slugs={["kurumsal-kirtasiye-tedarigi", "kurumsal-baski-cozumleri", "dijital-baski"]}
        heading="İlgili Hizmetlerimiz"
      />

      <section className="border-t border-hairline-soft py-20 sm:py-24">
        <Container className="flex flex-col items-center gap-6 text-center">
          <h2 className="font-display text-2xl font-semibold text-ivory sm:text-3xl">
            İşletmeniz için özel teklif alın
          </h2>
          <p className="max-w-md text-sm text-muted">
            İhtiyaçlarınızı bize iletin, size özel kurumsal teklifimizi en kısa sürede hazırlayalım.
          </p>
          <Button asChild size="lg">
            <Link href={ctaHref}>
              Kurumsal Teklif Al <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </Button>
        </Container>
      </section>
    </>
  );
}
