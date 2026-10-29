import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/layout/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { ServiceCard } from "@/components/shared/service-card";
import { Reveal } from "@/components/shared/reveal";
import { Button } from "@/components/ui/button";
import type { Service } from "@/lib/types";

const FEATURED_COUNT = 6;

export function SelectedServices({ services }: { services: Service[] | null }) {
  return (
    <section className="border-y border-hairline-soft bg-ink-soft py-24 sm:py-28">
      <Container>
        <SectionHeading
          eyebrow="Neler Yapıyoruz"
          title="Seçkin Hizmetlerimiz"
          description="Kırtasiyeden kurumsal çözümlere, ihtiyacınıza göre şekillenen hizmet yelpazemizden bir kesit."
        />

        <div className="mt-14">
          {services === null && (
            <p className="py-10 text-center text-sm text-muted">Hizmetlerimizi şu anda görüntüleyemiyoruz.</p>
          )}
          {services !== null && services.length === 0 && (
            <p className="py-10 text-center text-sm text-muted">Yakında burada.</p>
          )}
          {services !== null && services.length > 0 && (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {services.slice(0, FEATURED_COUNT).map((service, i) => (
                <Reveal key={service.id} delay={i * 0.05}>
                  <ServiceCard service={service} />
                </Reveal>
              ))}
            </div>
          )}
        </div>

        <div className="mt-12 flex justify-center">
          <Button asChild>
            <Link href="/hizmetler">
              Tüm Hizmetleri Gör <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </Container>
    </section>
  );
}
