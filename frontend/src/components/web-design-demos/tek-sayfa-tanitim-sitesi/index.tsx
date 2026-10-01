import { Container } from "../standart-web-sitesi/ui/Container";
import { demoConfig } from "../standart-web-sitesi/demo-config";
import { Header } from "./sections/Header";
import { Hero } from "./sections/Hero";
import { Services } from "./sections/Services";
import { Gallery } from "./sections/Gallery";
import { Contact } from "./sections/Contact";

// A compact, light-themed single-page variant of company-template's
// homepage: same content (demoConfig) and assets as "Standart Web Sitesi",
// but only Hero → Services → Gallery → Contact, laid out editorially on an
// ivory background. Shown at /web-tasarimlari/tek-sayfa-tanitim-sitesi.
export function TekSayfaTanitimSitesiDemo() {
  const year = new Date().getFullYear();

  return (
    <div className="min-h-screen bg-ivory text-ink [color-scheme:light]">
      <Header config={demoConfig} />
      <main>
        <Hero config={demoConfig} />
        <Services config={demoConfig} />
        <Gallery config={demoConfig} />
        <Contact config={demoConfig} />
      </main>
      <footer>
        <Container className="flex flex-col gap-2 py-8 text-sm text-ink/60 sm:flex-row sm:justify-between">
          <span>
            © {year} {demoConfig.meta.companyName}. Tüm hakları saklıdır.
          </span>
          <span>{demoConfig.meta.tagline}</span>
        </Container>
      </footer>
    </div>
  );
}
