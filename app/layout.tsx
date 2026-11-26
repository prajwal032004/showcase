import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Inter_Tight, Geist_Mono } from "next/font/google";
import "./globals.css";
import { site, absoluteUrl } from "@/lib/site";
import { keywords, organizationJsonLd } from "@/lib/seo";
import { Providers } from "@/components/layout/Providers";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Loader } from "@/components/layout/Loader";
import { ContextMenu } from "@/components/layout/ContextMenu";
import { ScrollToTop } from "@/components/layout/ScrollToTop";
import { JsonLd } from "@/components/ui/JsonLd";
import { PreviewModal } from "@/components/showcase/PreviewModal";
import { ChatLauncher } from "@/components/ai/ChatLauncher";
import { RouteTransition } from "@/components/layout/RouteTransition";

const display = Inter_Tight({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600"],
  variable: "--font-display",
  display: "swap",
});
const body = Inter_Tight({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-body",
  display: "swap",
});
const mono = Geist_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-mono", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — Web Design & Development Studio`,
    template: `%s — ${site.name}`,
  },
  description: site.description,
  keywords,
  applicationName: site.name,
  authors: [{ name: site.name, url: site.url }],
  creator: site.name,
  alternates: { canonical: absoluteUrl("/") },
  openGraph: {
    type: "website",
    siteName: site.name,
    locale: site.locale,
    url: site.url,
    title: `${site.name} — Web Design & Development Studio`,
    description: site.description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — Web Design & Development Studio`,
    description: site.description,
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large" } },
  formatDetection: { telephone: false, email: false, address: false },
};

export const viewport: Viewport = {
  themeColor: site.themeColor,
  width: "device-width",
  initialScale: 1,
};

/** Runs before paint: skip the intro loader on repeat visits / reduced motion. */
const introScript = `try{var d=document.documentElement;if(sessionStorage.getItem('forma-intro')||matchMedia('(prefers-reduced-motion: reduce)').matches){d.dataset.intro='seen'}}catch(e){document.documentElement.dataset.intro='seen'}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${mono.variable}`} suppressHydrationWarning>
      <head>
        <Script id="intro-gate" strategy="beforeInteractive">
          {introScript}
        </Script>
        <noscript>
          <style>{`[data-loader]{display:none!important}body{overflow:visible!important}[data-part]{translate:none!important}main>div{opacity:1!important}`}</style>
        </noscript>
        <JsonLd data={organizationJsonLd()} />
      </head>
      <body className="bg-lav text-ink">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:bg-deep focus:px-4 focus:py-2 focus:text-lav"
        >
          Skip to content
        </a>
        <Providers>
          <Loader />
          <Navbar />
          <main id="main">{children}</main>
          <Footer />
          <ContextMenu />
          <ScrollToTop />
          <PreviewModal />
          <ChatLauncher />
          <RouteTransition />
        </Providers>
      </body>
    </html>
  );
}
