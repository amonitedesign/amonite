import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Portable build: `next start` serves from .next/standalone on any host
  // (VPS, container, PaaS). No vendor adapter required; harmless if the
  // final host uses its own adapter instead.
  output: "standalone",
  cacheComponents: true,
  partialPrefetching: true,
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
