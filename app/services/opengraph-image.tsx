import { renderOg, ogSize, ogContentType } from "@/lib/og";

export const alt = "Forma Studio services and pricing — websites from ₹15,000";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOg({
    "eyebrow": "Services & pricing",
    "title": [
      "Everything you need",
      "to launch a website",
      "worth remembering."
    ],
    "accent": 2,
    "subtitle": "Design, development, landing pages, e-commerce and revamps — with an itemised ₹15,000 starter package.",
    "variant": "services"
  });
}
