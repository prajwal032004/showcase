import { renderOg, ogSize, ogContentType } from "@/lib/og";

export const alt = "Forma Studio showcase — live projects and design concepts";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOg({
    "eyebrow": "Showcase",
    "title": [
      "Made to inspire.",
      "Designed to",
      "perform."
    ],
    "accent": 1,
    "subtitle": "Live client work and design concepts across business, SaaS, e-commerce and creative brands.",
    "variant": "showcase"
  });
}
