import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/shared/reveal";

export function Hero() {
  return (
    <section className="bg-ink pb-6 pt-36 sm:pt-44">
      <Container>
        <div className="mx-auto max-w-4xl text-center">
          <Reveal mode="mount" fade={false}>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-muted">
              Eryaman Port AVM · Kırtasiye &amp; Dijital Baskı
            </p>
          </Reveal>
          {/*
            This heading is the homepage's Largest Contentful Paint element. It uses
            mode="mount" + fade={false} so it paints fully opaque immediately (only a
            subtle upward slide animates in) instead of being gated behind an
            IntersectionObserver callback and an opacity fade — see Reveal's `fade` doc.
          */}
          <Reveal delay={0.06} mode="mount" fade={false}>
            <h1 className="mt-5 font-display text-[clamp(3rem,9vw,5.2rem)] font-black leading-none tracking-[-0.045em] text-ivory">
              Kırtasiyeden <span className="text-gold">daha fazlası.</span>
            </h1>
          </Reveal>
          <Reveal delay={0.12} mode="mount" fade={false}>
            <p className="mx-auto mt-7 max-w-xl text-xl leading-snug tracking-[-0.03em] text-muted">
              Kırtasiye, dijital baskı, kurumsal çözümler ve kişiye özel ürünler tek noktada.
            </p>
            <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
              <Button asChild size="lg">
                <Link href="/hizmetler">
                  Hizmetleri İncele
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/iletisim">Bize Ulaşın</Link>
              </Button>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
