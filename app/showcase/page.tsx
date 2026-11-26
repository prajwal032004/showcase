import type { Metadata } from "next";
import { Suspense } from "react";
import { pageMetadata } from "@/lib/seo";
import { PageHero } from "@/components/ui/PageHero";
import { ShowcaseGrid } from "@/components/showcase/ShowcaseGrid";
import { FinalCTA } from "@/components/home/FinalCTA";

export const metadata: Metadata = pageMetadata({
  title: "Showcase — Live Websites & Design Concepts",
  description:
    "Browse live client websites and design concepts across business, SaaS, e-commerce, portfolio and landing pages. See desktop and mobile previews of each project.",
  path: "/showcase",
});

export default function ShowcasePage() {
  return (
    <>
      <PageHero
        label="Showcase"
        title={["Made to inspire.", "Designed to perform."]}
        accent={1}
        intro="Explore the digital experiences, concepts and designs that define our approach."
      >
        <p className="mt-6 inline-flex items-center gap-2 rounded-full border border-ink/10 bg-paper/70 px-4 py-2 text-sm text-ink/65">
          <span className="size-1.5 rounded-full bg-peri" />
          The projects below are design concepts. Client work will be added as it launches.
        </p>
      </PageHero>
      <Suspense fallback={<div className="min-h-[60vh] bg-lav" />}>
        <ShowcaseGrid />
      </Suspense>
      <FinalCTA title="Want your project to be the next one here?" cta="Start a project" />
    </>
  );
}
