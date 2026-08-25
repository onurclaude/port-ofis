import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/layout/container";
import { PageHero } from "@/components/layout/page-hero";
import { ServiceItem } from "@/components/shared/service-item";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { Reveal } from "@/components/shared/reveal";
import { Button } from "@/components/ui/button";
import { getServices } from "@/lib/api";
import type { Service } from "@/lib/types";

export const metadata: Metadata = {
  title: "Hizmetlerimiz",
  description:
    "Port Ofis Kırtasiye hizmetleri: dijital baskı, fotokopi, kurumsal kırtasiye tedariği ve kişiye özel baskı çözümleri Eryaman'da.",
  alternates: {
    canonical: "/hizmetler",
  },
};

async function loadServices(): Promise<{ services: Service[] | null }> {
  try {
    return { services: await getServices() };
  } catch {
    return { services: null };
  }
}

export default async function HizmetlerPage() {
  const { services } = await loadServices();

  return (
    <>
      <PageHero
        eyebrow="Hizmetlerimiz"
        title="İhtiyacınız Ne Olursa Olsun, Yanınızdayız"
        description="Kırtasiyeden dijital baskıya, kurumsal tedarikten kişiye özel üretime kadar sunduğumuz hizmetlerin tamamı."
      />

      <section className="py-20 sm:py-24">
        <Container>
          {services === null && (
            <ErrorState
              title="Hizmetler yüklenemedi, tekrar deneyin."
              description="Hizmet listesine şu anda ulaşılamıyor. Sayfayı yenileyerek tekrar deneyebilirsiniz."
            />
          )}
          {services !== null && services.length === 0 && (
            <EmptyState title="Şu anda listelenecek hizmet bulunmuyor." />
          )}
          {services !== null && services.length > 0 && (
            <div className="border-t border-hairline-soft">
              {services.map((service, i) => (
                <Reveal key={service.id} delay={Math.min(i * 0.04, 0.3)}>
                  <ServiceItem service={service} index={i} href={`#${service.slug}`} />
                </Reveal>
              ))}
            </div>
          )}
        </Container>
      </section>

      <section className="border-t border-hairline-soft bg-ink-soft py-20 sm:py-24">
        <Container className="flex flex-col items-center gap-6 text-center">
          <h2 className="font-display text-2xl font-semibold text-ivory sm:text-3xl">
            Aklınıza takılan bir şey mi var?
          </h2>
          <p className="max-w-md text-sm text-muted">
            Hizmetlerimiz hakkında sorularınız için bize ulaşın, size en kısa sürede dönelim.
          </p>
          <Button asChild size="lg">
            <Link href="/iletisim">
              İletişime Geç <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </Button>
        </Container>
      </section>
    </>
  );
}
