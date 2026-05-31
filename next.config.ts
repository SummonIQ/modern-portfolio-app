import type { NextConfig } from "next";

const config: NextConfig = {
  reactStrictMode: true,
  transpilePackages: [
    "platejs",
    "@platejs/basic-nodes",
    "@platejs/link",
    "@platejs/list",
    "@platejs/markdown",
    "@platejs/dnd",
    "@platejs/selection",
    "@platejs/core",
    "@platejs/utils",
    "jotai",
    "jotai-x",
    "jotai-optics",
  ],
  typedRoutes: false,
  serverExternalPackages: ["@prisma/client", "@prisma/adapter-pg"],
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "*.public.blob.vercel-storage.com" },
      { protocol: "https", hostname: "*.blob.vercel-storage.com" },
    ],
  },
};

export default config;
