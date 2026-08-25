import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { getSiteSettings } from "@/lib/api";
import { FALLBACK_PHONE } from "@/lib/constants";
import type { SiteSettings } from "@/lib/types";

async function loadSiteSettings(): Promise<SiteSettings | null> {
  try {
    return await getSiteSettings();
  } catch {
    return null;
  }
}

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const settings = await loadSiteSettings();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Store",
    name: settings?.siteName || "Port Ofis Kırtasiye",
    image: "https://portofiskirtasiye.com.tr/logo.png",
    telephone: settings?.phone || FALLBACK_PHONE,
    address: {
      "@type": "PostalAddress",
      streetAddress: "Eryaman Port AVM",
      addressLocality: "Etimesgut",
      addressRegion: "Ankara",
      addressCountry: "TR",
    },
    url: settings?.websiteUrl || "https://portofiskirtasiye.com.tr",
    description:
      "Eryaman Port AVM içinde kırtasiye, dijital baskı, fotokopi, kurumsal ofis çözümleri ve kişiye özel ürünler.",
    ...(settings?.workingHours ? { openingHours: settings.workingHours } : {}),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer settings={settings} />
    </>
  );
}
