import { renderOg, ogSize, ogContentType } from "@/lib/og";

export const alt = "Forma Studio — web design & development studio";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOg({
    "eyebrow": "Independent web design studio",
    "title": [
      "Websites that make",
      "brands impossible",
      "to ignore."
    ],
    "accent": 1,
    "subtitle": "Custom, high-performance websites designed and built to turn visitors into customers.",
    "variant": "home"
  });
}
