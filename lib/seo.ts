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

export function pageMetadata({ title, description, path, keywords: kw, noIndex }: PageSeo): Metadata {
  const url = absoluteUrl(path);
  return {
    title,
    description,
    keywords: kw ?? keywords,
    alternates: { canonical: url },
    openGraph: {
      title: `${title} — ${site.name}`,
      description,
      url,
      siteName: site.name,
      locale: site.locale,
      type: "website",
    },
    twitter: { card: "summary_large_image", title: `${title} — ${site.name}`, description },
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
