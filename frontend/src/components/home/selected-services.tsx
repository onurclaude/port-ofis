import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/layout/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { ServiceItem } from "@/components/shared/service-item";
import { Reveal } from "@/components/shared/reveal";
import { Button } from "@/components/ui/button";
import type { Service } from "@/lib/types";

const FEATURED_COUNT = 6;

export function SelectedServices({ services }: { services: Service[] | null }) {
  return (
    <section className="bg-ink py-24 sm:py-28">
      <Container>
        <div className="flex flex-col items-start justify-between gap-8 sm:flex-row sm:items-end">
          <SectionHeading
            eyebrow="Neler Yapıyoruz"
            title="Seçkin Hizmetlerimiz"
            description="Kırtasiyeden kurumsal çözümlere, ihtiyacınıza göre şekillenen hizmet yelpazemizden bir kesit."
          />
          <Button asChild variant="link" className="hidden shrink-0 sm:inline-flex">
            <Link href="/hizmetler">
              Tüm Hizmetleri Gör <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </Button>
        </div>

        <div className="mt-14">
          {services === null && (
            <p className="border-t border-hairline-soft py-10 text-center text-sm text-muted">
              Hizmetlerimizi şu anda görüntüleyemiyoruz.
            </p>
          )}
          {services !== null && services.length === 0 && (
            <p className="border-t border-hairline-soft py-10 text-center text-sm text-muted">Yakında burada.</p>
          )}
          {services !== null && services.length > 0 && (
            <div className="border-t border-hairline-soft">
              {services.slice(0, FEATURED_COUNT).map((service, i) => (
                <Reveal key={service.id} delay={i * 0.05}>
                  <ServiceItem service={service} index={i} />
                </Reveal>
              ))}
            </div>
          )}
        </div>

        <Button asChild variant="outline" className="mt-10 w-full sm:hidden">
          <Link href="/hizmetler">
            Tüm Hizmetleri Gör <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </Button>
      </Container>
    </section>
  );
}
