"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Container } from "../ui/Container";
import { InkLine } from "../ui/InkLine";
import { Logo } from "../ui/Logo";
import { Button } from "../ui/Button";
import { cn } from "@/lib/utils";
import type { DemoConfig } from "../demo-config";

const NAV_LINKS = [
  { href: "#hizmetler", label: "Hizmetler" },
  { href: "#neden-biz", label: "Neden Biz" },
  { href: "#vitrin", label: "Vitrin" },
  { href: "#iletisim", label: "İletişim" },
];

// top-11 leaves room for the "canlı örnek" preview bar rendered above this
// demo by app/web-tasarimlari/[slug]/page.tsx.
export function Header({ config }: { config: DemoConfig }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-11 z-50 transition-colors duration-300",
        scrolled || menuOpen ? "bg-ink/90 backdrop-blur border-b border-hairline" : "bg-transparent"
      )}
    >
      <Container className="flex h-20 items-center justify-between gap-6">
        <a href="#top" className="flex items-center gap-4" aria-label={`${config.meta.companyName} anasayfa`}>
          <Logo src={config.images.logo} alt={config.meta.companyName} priority className="h-9 w-auto sm:h-10" />
        </a>

        <InkLine orientation="vertical" className="hidden h-8 md:block" />

        <nav aria-label="Ana menü" className="hidden flex-1 items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <a key={link.href} href={link.href} className="text-sm text-muted transition-colors hover:text-gold">
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden md:block">
          <Button href={`tel:${config.contact.phone.replace(/\s+/g, "")}`} variant="secondary">
            {config.contact.phone}
          </Button>
        </div>

        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-hairline text-text md:hidden"
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          aria-label={menuOpen ? "Menüyü kapat" : "Menüyü aç"}
          onClick={() => setMenuOpen((v) => !v)}
        >
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" aria-hidden="true">
            {menuOpen ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
        </button>
      </Container>

      <AnimatePresence>
        {menuOpen ? (
          <motion.div
            id="mobile-menu"
            initial={reduceMotion ? undefined : { height: 0, opacity: 0 }}
            animate={reduceMotion ? undefined : { height: "auto", opacity: 1 }}
            exit={reduceMotion ? undefined : { height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="overflow-hidden border-t border-hairline bg-ink md:hidden"
          >
            <Container className="flex flex-col gap-1 py-4">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="rounded-lg px-2 py-3 text-base text-text transition-colors hover:text-gold"
                >
                  {link.label}
                </a>
              ))}
              <Button href={`tel:${config.contact.phone.replace(/\s+/g, "")}`} variant="primary" className="mt-2 w-full">
                {config.contact.phone}
              </Button>
            </Container>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
