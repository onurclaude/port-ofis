"use client";

import Image from "next/image";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { Container } from "../ui/Container";
import { Eyebrow } from "../ui/Eyebrow";
import { InkLine } from "../ui/InkLine";
import { Button } from "../ui/Button";
import { PlaceholderMedia } from "../ui/PlaceholderMedia";
import { demoAsset } from "../assets";
import type { DemoConfig } from "../demo-config";

export function Hero({ config }: { config: DemoConfig }) {
  const reduceMotion = useReducedMotion();

  const eyebrowText = config.services
    .filter((s) => s.featured)
    .slice(0, 3)
    .map((s) => s.title.toLocaleUpperCase("tr-TR"))
    .join("  ·  ");

  const [beforeAccent, accent, afterAccent] = splitAccent(config.meta.tagline);

  const stagger: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: reduceMotion ? 0 : 0.12 } },
  };
  const item: Variants = {
    hidden: reduceMotion ? {} : { opacity: 0, y: 18 },
    show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
  };

  return (
    <section id="top" className="relative overflow-hidden pt-36 pb-24 sm:pt-44 sm:pb-32">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[560px] opacity-40"
        style={{
          background: "radial-gradient(60% 60% at 80% 0%, rgba(201,162,74,0.25), transparent 70%)",
        }}
      />

      <Container>
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="relative grid grid-cols-1 gap-12 lg:grid-cols-[1fr_auto_1fr] lg:items-center lg:gap-10"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute right-full top-1/2 mr-6 hidden -translate-y-1/2 min-[1880px]:block"
          >
            {config.images.heroSideLogo ? (
              <div className="relative h-[700px] w-[304px]">
                <Image
                  src={demoAsset(config.images.heroSideLogo)}
                  alt={config.meta.companyName}
                  width={700}
                  height={304}
                  className="absolute top-1/2 left-1/2 opacity-90"
                  style={{
                    width: "700px",
                    height: "304px",
                    maxWidth: "none",
                    transform: "translate(-50%, -50%) rotate(-90deg)",
                  }}
                />
              </div>
            ) : (
              <span
                className="block whitespace-nowrap font-display text-sm uppercase tracking-[0.4em] text-muted/50"
                style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
              >
                {config.meta.companyName}
              </span>
            )}
          </div>

          <div className="max-w-xl">
            <motion.div variants={item}>
              <Eyebrow>{eyebrowText || config.meta.sector.toLocaleUpperCase("tr-TR")}</Eyebrow>
            </motion.div>

            <motion.h1 variants={item} className="text-display-1 mt-6 font-display text-text">
              {beforeAccent}
              {accent ? <em className="font-display text-gold">{accent}</em> : null}
              {afterAccent}
            </motion.h1>

            <motion.p variants={item} className="text-body-lg mt-6 max-w-md text-muted">
              {config.meta.description}
            </motion.p>

            <motion.div variants={item} className="mt-10 flex flex-wrap items-center gap-4">
              <Button href="#hizmetler" variant="primary">
                Hizmetleri Keşfet
              </Button>
              <Button href={`tel:${config.contact.phone.replace(/\s+/g, "")}`} variant="ghost">
                {config.contact.phone} →
              </Button>
            </motion.div>
          </div>

          <InkLine orientation="vertical" className="hidden h-full min-h-[360px] lg:block" />

          <motion.div variants={item} className="relative">
            {config.images.hero ? (
              <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[20px] border border-hairline sm:mr-[-24px] lg:mr-[-48px]">
                <Image
                  src={demoAsset(config.images.hero)}
                  alt={`${config.meta.companyName} Ürünleri`}
                  fill
                  priority
                  sizes="(min-width: 1024px) 40vw, 100vw"
                  className="object-cover"
                />
              </div>
            ) : (
              <PlaceholderMedia
                label={`${config.meta.companyName} Ürünleri`}
                variant={1}
                className="aspect-[4/5] w-full sm:mr-[-24px] lg:mr-[-48px]"
              />
            )}

            <div className="absolute -bottom-6 -left-4 max-w-[220px] rounded-[20px] border border-hairline bg-surface-hover p-5 shadow-elevated sm:-left-10">
              <p className="text-display-3 font-display text-gold">{config.services.length}</p>
              <p className="mt-1 text-sm text-muted">
                kategoride tek noktadan üretim
                {config.contact.address.district ? ` · ${config.contact.address.district}` : ""}
              </p>
            </div>
          </motion.div>
        </motion.div>
      </Container>
    </section>
  );
}

function splitAccent(tagline: string): [string, string, string] {
  const words = tagline.trim().split(" ");
  if (words.length < 2) return [tagline, "", ""];
  const accent = words.slice(-2).join(" ");
  const before = words.slice(0, -2).join(" ");
  return [before ? `${before} ` : "", accent, ""];
}
