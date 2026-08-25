import type { MetadataRoute } from "next";

const STATIC_PATHS = ["/", "/hizmetler", "/urunler", "/baski-merkezi", "/kurumsal", "/iletisim"];

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://portofiskirtasiye.com.tr";
  return STATIC_PATHS.map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: path === "/" ? 1 : 0.7,
  }));
}
