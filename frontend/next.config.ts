import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Product/category images are admin-managed and can live on any host
    // (uploaded media, CDN, etc.) — the API contract only guarantees a URL.
    remotePatterns: [
      { protocol: "https", hostname: "**" },
      { protocol: "http", hostname: "**" },
    ],
  },
};

export default nextConfig;
