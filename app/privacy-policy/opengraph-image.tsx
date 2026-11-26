import { renderOg, ogSize, ogContentType } from "@/lib/og";

export const alt = "Forma Studio privacy policy";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOg({
    "eyebrow": "Privacy policy",
    "title": [
      "Your privacy,",
      "in plain",
      "language."
    ],
    "accent": 0,
    "subtitle": "No tracking, no stored form submissions — here's exactly how we handle information.",
    "variant": "legal"
  });
}
