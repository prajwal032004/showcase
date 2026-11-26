import { renderOg, ogSize, ogContentType } from "@/lib/og";

export const alt = "About Forma Studio — meet the founders";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOg({
    "eyebrow": "About the studio",
    "title": [
      "Small team.",
      "Big ideas.",
      "Thoughtful websites."
    ],
    "accent": 1,
    "subtitle": "An independent studio where you work directly with the founders who design and build your site.",
    "variant": "about"
  });
}
