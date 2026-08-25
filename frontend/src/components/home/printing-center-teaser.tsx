import Link from "next/link";
import { ArrowRight, Printer } from "lucide-react";
import { Container } from "@/components/layout/container";
import { GoldDivider } from "@/components/brand/gold-divider";
import { Reveal } from "@/components/shared/reveal";
import { Button } from "@/components/ui/button";
import { PRINTING_OFFERINGS } from "@/lib/constants";

export function PrintingCenterTeaser() {
  const preview = PRINTING_OFFERINGS.slice(0, 6);

  return (
    <section className="border-y border-hairline-soft bg-ink-soft py-24 sm:py-28">
      <Container className="grid grid-cols-1 items-center gap-14 lg:grid-cols-2 lg:gap-20">
        <Reveal>
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.28em] text-gold">Baskı Merkezi</p>
          <h2 className="font-display text-3xl font-semibold text-ivory sm:text-4xl">
            Profesyonel Dijital Baskı Merkezi
          </h2>
          <GoldDivider className="mt-5" />
          <p className="mt-6 max-w-lg text-base leading-relaxed text-muted">
            Renkli ve siyah-beyaz çıktıdan kartvizite, fotoğraf baskısından kişiye özel tasarıma kadar tüm baskı
            ihtiyaçlarınız için modern ekipman ve deneyimli ekibimizle yanınızdayız.
          </p>
          <Button asChild className="mt-9">
            <Link href="/baski-merkezi">
              Baskı Merkezini Keşfet <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </Button>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="relative rounded-sm border border-hairline bg-ink p-8 sm:p-10">
            <Printer className="mb-6 size-7 text-gold" aria-hidden="true" />
            <ul className="grid grid-cols-2 gap-x-6 gap-y-4">
              {preview.map((item) => (
                <li key={item.title} className="flex items-center gap-2.5 text-sm text-ivory/85">
                  <span className="size-1 shrink-0 rounded-full bg-gold" aria-hidden="true" />
                  {item.title}
                </li>
              ))}
            </ul>
            <p className="mt-6 border-t border-hairline-soft pt-5 text-xs text-muted">
              +{PRINTING_OFFERINGS.length - preview.length} hizmet daha
            </p>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
