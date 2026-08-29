import { Header } from "./sections/Header";
import { Hero } from "./sections/Hero";
import { Services } from "./sections/Services";
import { FeaturedCapabilities } from "./sections/FeaturedCapabilities";
import { WhyUs } from "./sections/WhyUs";
import { Showcase } from "./sections/Showcase";
import { TrustStats } from "./sections/TrustStats";
import { CTA } from "./sections/CTA";
import { Contact } from "./sections/Contact";
import { Footer } from "./sections/Footer";
import { demoConfig } from "./demo-config";

// Ported from company-template's "Modern & Balanced" homepage template
// (src/templates/balanced/HomeTemplate.tsx) — the live design example shown
// at /web-tasarimlari/standart-web-sitesi for the "Standart Web Sitesi"
// product. See demo-config.ts for the content and README-equivalent notes
// in the project plan for the porting rationale.
export function StandartWebSitesiDemo() {
  return (
    <>
      <Header config={demoConfig} />
      <main>
        <Hero config={demoConfig} />
        <Services config={demoConfig} />
        <FeaturedCapabilities config={demoConfig} />
        <WhyUs config={demoConfig} />
        <Showcase config={demoConfig} />
        <TrustStats config={demoConfig} />
        <CTA config={demoConfig} />
        <Contact config={demoConfig} />
      </main>
      <Footer config={demoConfig} />
    </>
  );
}
