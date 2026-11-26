import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site";
import { projects } from "@/lib/projects";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const pages: [string, number, MetadataRoute.Sitemap[number]["changeFrequency"]][] = [
    ["/", 1, "monthly"],
    ["/services", 0.9, "monthly"],
    ["/showcase", 0.8, "weekly"],
    ["/about", 0.7, "monthly"],
    ["/contact", 0.8, "yearly"],
    ["/privacy-policy", 0.2, "yearly"],
    ["/terms-and-conditions", 0.2, "yearly"],
  ];
  return [
    ...pages.map(([path, priority, changeFrequency]) => ({ url: absoluteUrl(path), lastModified: now, changeFrequency, priority })),
    ...projects.map((p) => ({ url: absoluteUrl(`/showcase/${p.slug}`), lastModified: now, changeFrequency: "monthly" as const, priority: 0.5 })),
  ];
}
