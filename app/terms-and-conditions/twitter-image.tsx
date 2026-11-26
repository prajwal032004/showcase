import { renderOg, ogSize, ogContentType } from "@/lib/og";

export const alt = "Forma Studio terms and conditions";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOg({
    "eyebrow": "Terms & conditions",
    "title": [
      "Clear terms.",
      "Good",
      "collaboration."
    ],
    "accent": 0,
    "subtitle": "Scope, pricing, payments, revisions and ownership — how we work together, explained simply.",
    "variant": "legal"
  });
}
