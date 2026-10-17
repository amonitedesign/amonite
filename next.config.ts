import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Portable build: `next start` serves from .next/standalone on any host
  // (VPS, container, PaaS). Harmless under the Cloudflare/OpenNext adapter,
  // which reads .next directly.
  output: "standalone",
  // All imagery is local static SVG/PNG, so skip Next's optimizer — avoids the
  // Cloudflare Images binding/cost and works on every host.
  images: { unoptimized: true },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;

import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
initOpenNextCloudflareForDev();
