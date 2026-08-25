import type { Metadata } from "next";
import { Hero } from "@/components/home/hero";
import { SelectedServices } from "@/components/home/selected-services";
import { PrintingCenterTeaser } from "@/components/home/printing-center-teaser";
import { ProductCategories } from "@/components/home/product-categories";
import { CorporateTeaser } from "@/components/home/corporate-teaser";
import { WhyPortOfis } from "@/components/home/why-port-ofis";
import { LocationContact } from "@/components/home/location-contact";
import { getCategories, getServices, getSiteSettings } from "@/lib/api";
import type { Category, Service, SiteSettings } from "@/lib/types";

export const metadata: Metadata = {
  title: "Ana Sayfa",
  description:
    "Kırtasiye, dijital baskı, kurumsal çözümler ve kişiye özel ürünler tek noktada. Eryaman Port AVM içinde Port Ofis Kırtasiye.",
  alternates: {
    canonical: "/",
  },
};

async function safeGetServices(): Promise<Service[] | null> {
  try {
    return await getServices();
  } catch {
    return null;
  }
}

async function safeGetCategories(): Promise<Category[] | null> {
  try {
    return await getCategories();
  } catch {
    return null;
  }
}

async function safeGetSettings(): Promise<SiteSettings | null> {
  try {
    return await getSiteSettings();
  } catch {
    return null;
  }
}

export default async function HomePage() {
  const [services, categories, settings] = await Promise.all([
    safeGetServices(),
    safeGetCategories(),
    safeGetSettings(),
  ]);

  return (
    <>
      <Hero />
      <SelectedServices services={services} />
      <PrintingCenterTeaser />
      <ProductCategories categories={categories} />
      <CorporateTeaser />
      <WhyPortOfis />
      <LocationContact settings={settings} />
    </>
  );
}
