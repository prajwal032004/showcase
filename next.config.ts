import type { NextConfig } from "next";

/**
 * Canonical site URL used for metadata, Open Graph images, sitemap and JSON-LD.
 * Priority: NEXT_PUBLIC_SITE_URL → Vercel production domain → Vercel deployment URL → localhost.
 * Inlined at build time so server and client always agree.
 */
const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL && `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`) ||
  (process.env.VERCEL_URL && `https://${process.env.VERCEL_URL}`) ||
  "http://localhost:3000"
).replace(/\/$/, "");

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  turbopack: { root: process.cwd() },
  images: { formats: ["image/avif", "image/webp"] },
  env: { SITE_URL_RESOLVED: siteUrl },
};

export default nextConfig;
