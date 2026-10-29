import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/shared/reveal";
import { Button } from "@/components/ui/button";
import { CORPORATE_OFFERINGS } from "@/lib/constants";

export function CorporateTeaser() {
  return (
    <section className="bg-ink py-24 sm:py-28">
      <Container>
        <Reveal>
          <div className="theme-dark grid grid-cols-1 gap-12 rounded-lg p-8 sm:p-12 lg:grid-cols-2 lg:gap-16 lg:p-16">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-muted">Kurumsal</p>
              <h2 className="mt-4 font-display text-4xl font-black leading-[1.02] tracking-[-0.045em] text-ivory sm:text-5xl">
                İşletmeniz için tek noktadan ofis çözümleri.
              </h2>
              <p className="mt-5 max-w-md text-lg leading-snug tracking-[-0.02em] text-muted">
                Kurumsal kırtasiye tedariğinden toplu baskı işlerine kadar, işletmenizin düzenli ihtiyaçlarını planlı
                ve güvenilir bir ortaklıkla karşılıyoruz.
              </p>
              <Button asChild className="mt-9">
                <Link href="/kurumsal">
                  Kurumsal Teklif Al <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              </Button>
            </div>

            <dl className="flex flex-col justify-center gap-4">
              {CORPORATE_OFFERINGS.slice(0, 2).map((item) => (
                <div key={item.title} className="rounded-lg border border-hairline-soft p-[30px]">
                  <dt className="text-2xl font-bold tracking-[-0.04em] text-ivory">{item.title}</dt>
                  <dd className="mt-2.5 text-base leading-snug tracking-[-0.02em] text-muted">{item.description}</dd>
                </div>
              ))}
            </dl>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
