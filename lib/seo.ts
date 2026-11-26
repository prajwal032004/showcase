import type { Metadata } from "next";
import { absoluteUrl, site } from "./site";

export const keywords = [
  "website design",
  "website development",
  "freelance web developer",
  "web design studio",
  "business website development",
  "custom website design",
  "landing page design",
  "e-commerce website development",
  "responsive website",
  "website redesign",
  "modern website design",
  "professional website development",
];

type PageSeo = { title: string; description: string; path: string; keywords?: string[]; noIndex?: boolean };

/** Trim to a word boundary so previews never cut mid-word. */
function clamp(text: string, max: number) {
  if (text.length <= max) return text;
  const firstSentence = text.split(/(?<=[.!?])\s/)[0];
  if (firstSentence.length <= max) return firstSentence;
  return text.slice(0, max - 1).replace(/\s+\S*$/, "") + "…";
}

/** Social title: add the brand only when it still fits the ~60-character sweet spot. */
function socialTitle(title: string) {
  if (title.includes(site.name)) return clamp(title, 60);
  const branded = `${title} | ${site.name}`;
  return branded.length <= 60 ? branded : clamp(title, 60);
}

export function pageMetadata({ title, description, path, keywords: kw, noIndex }: PageSeo): Metadata {
  const url = absoluteUrl(path);
  const metaDescription = clamp(description, 155); // Google ≈ 150–160
  const shareDescription = clamp(description, 125); // social cards ≈ 125
  const shareTitle = socialTitle(title);
  return {
    title,
    description: metaDescription,
    keywords: kw ?? keywords,
    alternates: { canonical: url },
    openGraph: {
      title: shareTitle,
      description: shareDescription,
      url,
      siteName: site.name,
      locale: site.locale,
      type: "website",
    },
    twitter: { card: "summary_large_image", title: shareTitle, description: shareDescription },
    robots: noIndex ? { index: false, follow: true } : undefined,
  };
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${site.url}/#organization`,
        name: site.name,
        url: site.url,
        email: site.email,
        logo: absoluteUrl("/icon.svg"),
        description: site.description,
        founder: [{ "@type": "Person", name: "Prajwal A Bhandagi" }, { "@type": "Person", name: "Pratik P Gaonkar" }],
      },
      {
        "@type": "WebSite",
        "@id": `${site.url}/#website`,
        url: site.url,
        name: site.name,
        publisher: { "@id": `${site.url}/#organization` },
        inLanguage: "en",
      },
    ],
  };
}
