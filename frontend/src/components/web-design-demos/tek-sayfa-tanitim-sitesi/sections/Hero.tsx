import Image from "next/image";
import { Container } from "../../standart-web-sitesi/ui/Container";
import { demoAsset } from "../../standart-web-sitesi/assets";
import type { DemoConfig } from "../../standart-web-sitesi/demo-config";
import { Reveal } from "@/components/shared/reveal";
import { eyebrow, primaryButton, secondaryButton, telHref } from "../styles";

// Above the fold: Reveal runs with fade={false} mode="mount" so the heading
// and hero image paint immediately (see the LCP note in reveal.tsx).
export function Hero({ config }: { config: DemoConfig }) {
  const { meta, contact, images } = config;

  return (
    <section id="top" className="pt-40 pb-16 sm:pt-48 sm:pb-24">
      <Container>
        <Reveal mode="mount" fade={false} className="mx-auto max-w-3xl text-center">
          <p className={eyebrow}>{meta.sector}</p>
          <h1 className="text-display-1 mt-6 font-display text-ink">
            {meta.companyName}
            <span className="block italic text-gold">{meta.tagline}</span>
          </h1>
          <p className="text-body-lg mx-auto mt-6 max-w-xl text-ink/70">{meta.description}</p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <a href="#iletisim" className={primaryButton}>
              Bize Ulaşın
            </a>
            <a href={telHref(contact.phone)} className={secondaryButton}>
              {contact.phone}
            </a>
          </div>
        </Reveal>

        <Reveal mode="mount" fade={false} delay={0.1} className="mt-16 sm:mt-20">
          <div className="relative aspect-[16/9] w-full overflow-hidden rounded-t-[999px] rounded-b-[28px] sm:aspect-[21/9]">
            <Image
              src={demoAsset(images.hero)}
              alt={`${meta.companyName} mağazası`}
              fill
              priority
              sizes="(min-width: 1280px) 1150px, 100vw"
              className="object-cover"
            />
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
