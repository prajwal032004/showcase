import type { Metadata } from "next";
import { Hero } from "@/components/home/Hero";
import { Statement } from "@/components/home/Statement";
import { ServicesPreview } from "@/components/home/ServicesPreview";
import { SelectedWork } from "@/components/home/SelectedWork";
import { Process } from "@/components/home/Process";
import { WhyUs } from "@/components/home/WhyUs";
import { PricingPreview } from "@/components/home/PricingPreview";
import { FinalCTA } from "@/components/home/FinalCTA";
import { pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  ...pageMetadata({
    title: `${site.name} — Website Design & Development Studio`,
    description:
      "Independent web design and development studio crafting custom, responsive, high-performance websites, landing pages and e-commerce experiences. Websites from ₹15,000.",
    path: "/",
  }),
  title: { absolute: `${site.name} — Website Design & Development Studio` },
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <Statement />
      <ServicesPreview />
      <SelectedWork />
      <Process />
      <WhyUs />
      <PricingPreview />
      <FinalCTA />
    </>
  );
}
