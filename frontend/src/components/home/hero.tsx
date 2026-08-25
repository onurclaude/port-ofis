import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { GoldDivider } from "@/components/brand/gold-divider";
import { Reveal } from "@/components/shared/reveal";

export function Hero() {
  return (
    <section className="relative flex min-h-[92vh] items-center overflow-hidden border-b border-hairline-soft bg-ink pt-20">
      <div className="bg-noise pointer-events-none absolute inset-0 opacity-50" aria-hidden="true" />
      <div
        className="pointer-events-none absolute right-[-15%] top-1/4 h-[32rem] w-[32rem] rounded-full bg-gold/10 blur-[120px]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute left-[-10%] bottom-0 h-72 w-72 rounded-full bg-gold/5 blur-[100px]"
        aria-hidden="true"
      />

      {/* Oversized decorative nib mark, faint, right side — brand texture without being literal wallpaper. */}
      <svg
        viewBox="0 0 32 40"
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 top-1/2 hidden h-[46rem] w-[46rem] -translate-y-1/2 opacity-[0.04] lg:block"
      >
        <path d="M4 16 H28 L16 38 Z" fill="var(--color-ivory)" />
        <rect x="10" y="2" width="12" height="15" fill="var(--color-gold)" />
        <line x1="16" y1="17" x2="16" y2="32" stroke="var(--color-ink)" strokeWidth="1.4" />
      </svg>

      <Container className="relative">
        <div className="max-w-3xl">
          <Reveal>
            <p className="mb-5 text-xs font-medium uppercase tracking-[0.32em] text-gold">
              Eryaman Port AVM · Kırtasiye &amp; Dijital Baskı
            </p>
          </Reveal>
          {/*
            This heading is the homepage's Largest Contentful Paint element. It uses
            mode="mount" + fade={false} so it paints fully opaque immediately (only a
            subtle upward slide animates in) instead of being gated behind an
            IntersectionObserver callback and an opacity fade — see Reveal's `fade` doc.
          */}
          <Reveal delay={0.08} mode="mount" fade={false}>
            <h1 className="font-display text-5xl font-semibold leading-[1.05] text-ivory sm:text-6xl lg:text-7xl">
              Kırtasiyeden <span className="gold-text-gradient italic">Daha Fazlası.</span>
            </h1>
          </Reveal>
          <Reveal delay={0.16}>
            <GoldDivider className="mt-8" />
          </Reveal>
          <Reveal delay={0.22}>
            <p className="mt-8 max-w-xl text-lg leading-relaxed text-muted sm:text-xl">
              Kırtasiye, dijital baskı, kurumsal çözümler ve kişiye özel ürünler tek noktada.
            </p>
          </Reveal>
          <Reveal delay={0.3}>
            <div className="mt-11 flex flex-wrap items-center gap-4">
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
