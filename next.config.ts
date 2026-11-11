import type { NextConfig } from "next";

/** Mirrored production pages (captured from the live build). */
const MIRROR_PAGES: Record<string, string> = {
  "/": "home",
  "/services": "services",
  "/products": "products",
  "/about": "about",
  "/projects": "projects",
  "/contact": "contact",
  "/projects/ai-fraud-detection": "ai-fraud-detection",
  "/projects/zurbez": "zurbez",
  "/projects/aws-devops-pipeline": "aws-devops-pipeline",
  "/projects/nouvelle-spaces": "nouvelle-spaces",
  "/projects/fabric-data-infrastructure": "fabric-data-infrastructure",
  "/projects/safar": "safar",
};

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: { unoptimized: true },
  async rewrites() {
    return {
      beforeFiles: [
        ...Object.entries(MIRROR_PAGES).map(([source, name]) => ({
          source,
          destination: `/mirror/pages/${name}.html`,
        })),
        { source: "/universe/index.html", destination: "/mirror/universe/index.html" },
      ],
      afterFiles: [],
      fallback: [],
    };
  },
};

export default nextConfig;
