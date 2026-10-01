import Image from "next/image";
import { Container } from "../../standart-web-sitesi/ui/Container";
import { demoAsset } from "../../standart-web-sitesi/assets";
import type { DemoConfig } from "../../standart-web-sitesi/demo-config";
import { Reveal } from "@/components/shared/reveal";
import { eyebrow } from "../styles";

// Horizontally scrollable strip on narrow screens, a 5-up row on desktop.
export function Gallery({ config }: { config: DemoConfig }) {
  return (
    <section id="galeri" aria-label="Galeri" className="py-20 sm:py-28">
      <Container>
        <Reveal className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className={eyebrow}>Galeri</p>
            <h2 className="text-display-2 mt-4 font-display text-ink">Atölyemizden</h2>
          </div>
          <p className="max-w-sm text-ink/70">Son dönemde hazırladığımız işlerden bir seçki.</p>
        </Reveal>

        <ul className="-mx-5 mt-12 flex snap-x snap-mandatory scroll-px-5 gap-4 overflow-x-auto px-5 sm:scroll-px-8 pb-2 sm:-mx-8 sm:px-8 lg:mx-0 lg:grid lg:grid-cols-5 lg:overflow-visible lg:px-0">
          {config.images.gallery.map((item, index) => (
            <li key={item.src} className="w-[70%] shrink-0 snap-start sm:w-[42%] lg:w-auto">
              <Reveal delay={index * 0.06}>
                <figure>
                  <div className="relative aspect-[3/4] overflow-hidden rounded-[20px] bg-ink/5">
                    <Image
                      src={demoAsset(item.src)}
                      alt={item.alt}
                      fill
                      sizes="(min-width: 1024px) 20vw, (min-width: 640px) 42vw, 70vw"
                      className="object-cover transition-transform duration-500 ease-out hover:scale-105"
                    />
                  </div>
                  <figcaption className="mt-3 text-sm text-ink/70">{item.caption}</figcaption>
                </figure>
              </Reveal>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
