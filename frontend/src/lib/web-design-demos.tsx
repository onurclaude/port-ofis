import type { ComponentType } from "react";
import { StandartWebSitesiDemo } from "@/components/web-design-demos/standart-web-sitesi";
import { TekSayfaTanitimSitesiDemo } from "@/components/web-design-demos/tek-sayfa-tanitim-sitesi";

export interface WebDesignDemo {
  /** Package name shown in the preview bar and page metadata. */
  title: string;
  Component: ComponentType;
}

/**
 * Registry of live design demos shown at /web-tasarimlari/[slug] for
 * products in the WEBSITE_DESIGN_CATEGORY_SLUG category (see
 * lib/constants.ts and components/shared/product-card.tsx). Each new site
 * design product gets a folder under components/web-design-demos/ and an
 * entry here, keyed by the product's slug.
 */
export const WEB_DESIGN_DEMOS: Record<string, WebDesignDemo> = {
  "standart-web-sitesi": { title: "Standart Web Sitesi", Component: StandartWebSitesiDemo },
  "tek-sayfa-tanitim-sitesi": { title: "Tek Sayfa Tanıtım Sitesi", Component: TekSayfaTanitimSitesiDemo },
};
