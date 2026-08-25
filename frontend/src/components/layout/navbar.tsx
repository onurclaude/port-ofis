"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { NAV_LINKS } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the mobile menu on route change. Adjusted during render (not in an
  // effect) so it takes effect before paint, per the "adjusting state when a
  // prop changes" pattern.
  const [menuOpenForPathname, setMenuOpenForPathname] = useState(pathname);
  if (pathname !== menuOpenForPathname) {
    setMenuOpenForPathname(pathname);
    setMenuOpen(false);
  }

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled || menuOpen
          ? "border-b border-hairline-soft bg-ink/90 backdrop-blur-md"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <Container className="flex h-20 items-center justify-between">
        <Link href="/" aria-label="Port Ofis Kırtasiye — Ana Sayfa" className="z-10">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-9 lg:flex" aria-label="Ana menü">
          {NAV_LINKS.map((link) => {
            const isActive = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative py-1 text-sm font-medium tracking-wide text-ivory/85 transition-colors hover:text-gold",
                  isActive && "text-gold",
                )}
                aria-current={isActive ? "page" : undefined}
              >
                {link.label}
                {isActive && (
                  <motion.span
                    layoutId="nav-underline"
                    className="absolute -bottom-1.5 left-0 h-px w-full bg-gold"
                  />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="hidden lg:block">
          <Button asChild size="default">
            <Link href="/iletisim">Bize Ulaşın</Link>
          </Button>
        </div>

        <button
          type="button"
          className="z-10 inline-flex items-center justify-center rounded-sm p-2 text-ivory lg:hidden"
          aria-label={menuOpen ? "Menüyü kapat" : "Menüyü aç"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((v) => !v)}
        >
          {menuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </Container>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-t border-hairline-soft bg-ink lg:hidden"
          >
            <Container className="flex flex-col gap-1 py-6">
              {NAV_LINKS.map((link, i) => {
                const isActive = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
                return (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05, duration: 0.3 }}
                  >
                    <Link
                      href={link.href}
                      className={cn(
                        "block border-b border-hairline-soft py-3.5 text-base font-medium text-ivory/90",
                        isActive && "text-gold",
                      )}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                );
              })}
              <Button asChild className="mt-5 w-full">
                <Link href="/iletisim">Bize Ulaşın</Link>
              </Button>
            </Container>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
