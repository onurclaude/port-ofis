import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { Container } from "@/components/layout/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { Reveal } from "@/components/shared/reveal";
import { Button } from "@/components/ui/button";
import { PRINTING_OFFERINGS } from "@/lib/constants";

export function PrintingCenterTeaser() {
  const preview = PRINTING_OFFERINGS.slice(0, 6);

  return (
    <section className="border-y border-hairline-soft bg-ink-soft py-24 sm:py-28">
      <Container>
        <SectionHeading
          eyebrow="Baskı Merkezi"
          title="Profesyonel Dijital Baskı Merkezi"
          description="Renkli ve siyah-beyaz çıktıdan kartvizite, fotoğraf baskısından kişiye özel tasarıma kadar tüm baskı ihtiyaçlarınız için modern ekipman ve deneyimli ekibimizle yanınızdayız."
        />

        <Reveal>
          <ul className="mx-auto mt-14 grid max-w-4xl grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {preview.map((item) => (
              <li
                key={item.title}
                className="flex items-center gap-3 rounded-lg border border-hairline-soft px-5 py-4 text-base font-medium tracking-[-0.02em] text-ivory"
              >
                <Check className="size-4 shrink-0 text-gold" aria-hidden="true" />
                {item.title}
              </li>
            ))}
          </ul>
          <p className="mt-5 text-center text-sm text-muted">
            +{PRINTING_OFFERINGS.length - preview.length} hizmet daha
          </p>
        </Reveal>

        <div className="mt-10 flex justify-center">
          <Button asChild>
            <Link href="/baski-merkezi">
              Baskı Merkezini Keşfet <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </Container>
    </section>
  );
}
