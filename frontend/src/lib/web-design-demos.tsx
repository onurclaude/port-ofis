import type { ComponentType } from "react";
import { StandartWebSitesiDemo } from "@/components/web-design-demos/standart-web-sitesi";

/**
 * Registry of live design demos shown at /web-tasarimlari/[slug] for
 * products in the WEBSITE_DESIGN_CATEGORY_SLUG category (see
 * lib/constants.ts and components/shared/product-card.tsx). Each new site
 * design product gets a folder under components/web-design-demos/ and an
 * entry here, keyed by the product's slug.
 */
export const WEB_DESIGN_DEMOS: Record<string, ComponentType> = {
  "standart-web-sitesi": StandartWebSitesiDemo,
};
