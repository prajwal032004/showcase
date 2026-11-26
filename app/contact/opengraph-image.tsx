import { renderOg, ogSize, ogContentType } from "@/lib/og";

export const alt = "Contact Forma Studio — start your website project";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOg({
    "eyebrow": "Start a project",
    "title": [
      "Let's talk about",
      "your next",
      "website."
    ],
    "accent": 2,
    "subtitle": "Describe your idea, get an instant AI estimate, and send a ready-made inquiry in minutes.",
    "variant": "contact",
    "dark": true
  });
}
