import Link from "next/link";
import { ArrowRight, Building2 } from "lucide-react";
import { Container } from "@/components/layout/container";
import { GoldDivider } from "@/components/brand/gold-divider";
import { Reveal } from "@/components/shared/reveal";
import { Button } from "@/components/ui/button";
import { CORPORATE_OFFERINGS } from "@/lib/constants";

export function CorporateTeaser() {
  return (
    <section className="border-y border-hairline-soft bg-ink-soft py-24 sm:py-28">
      <Container className="grid grid-cols-1 items-center gap-14 lg:grid-cols-2 lg:gap-20">
        <Reveal className="order-2 lg:order-1">
          <div className="rounded-sm border border-hairline bg-ink p-8 sm:p-10">
            <Building2 className="mb-6 size-7 text-gold" aria-hidden="true" />
            <dl className="space-y-6">
              {CORPORATE_OFFERINGS.slice(0, 2).map((item) => (
                <div key={item.title}>
                  <dt className="font-display text-lg text-ivory">{item.title}</dt>
                  <dd className="mt-1.5 text-sm leading-relaxed text-muted">{item.description}</dd>
                </div>
              ))}
            </dl>
          </div>
        </Reveal>

        <Reveal delay={0.1} className="order-1 lg:order-2">
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.28em] text-gold">Kurumsal</p>
          <h2 className="font-display text-3xl font-semibold text-ivory sm:text-4xl">
            İşletmeniz İçin Tek Noktadan Ofis Çözümleri
          </h2>
          <GoldDivider className="mt-5" />
          <p className="mt-6 max-w-lg text-base leading-relaxed text-muted">
            Kurumsal kırtasiye tedariğinden toplu baskı işlerine kadar, işletmenizin düzenli ihtiyaçlarını planlı ve
            güvenilir bir ortaklıkla karşılıyoruz.
          </p>
          <Button asChild className="mt-9">
            <Link href="/kurumsal">
              Kurumsal Teklif Al <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </Button>
        </Reveal>
      </Container>
    </section>
  );
}
