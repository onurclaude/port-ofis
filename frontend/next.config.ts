import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Allowlist only: a wildcard turns /_next/image into an open SSRF/proxy endpoint.
    // Add a host here before using its images in the admin panel.
    remotePatterns: [
      { protocol: "https", hostname: "encrypted-tbn0.gstatic.com" },
      { protocol: "https", hostname: "images.migrosone.com" },
      { protocol: "https", hostname: "imgscdn.stargazete.com" },
      { protocol: "https", hostname: "www.sahinambalaj.com.tr" },
    ],
  },
};

export default nextConfig;
