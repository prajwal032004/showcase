import type { Metadata } from "next";
import { Suspense } from "react";
import { pageMetadata } from "@/lib/seo";
import { site, socials, pricing } from "@/lib/site";
import { PageHero } from "@/components/ui/PageHero";
import { ContactForm } from "@/components/contact/ContactForm";
import { CopyEmail } from "@/components/contact/CopyEmail";
import { ProjectPlanner } from "@/components/ai/ProjectPlanner";

export const metadata: Metadata = pageMetadata({
  title: "Contact — Start Your Website Project",
  description:
    `Describe your idea, get an instant AI estimate and send a ready-made project inquiry in minutes. Websites from ${pricing.startingPriceLabel}, replies within a couple of working days.`,
  path: "/contact",
});

const next = [
  ["We read your inquiry", "Every message is read by the founders — not a bot or a sales team."],
  ["We reply to arrange a call", "A short conversation to understand your goals and answer questions."],
  ["You receive a clear proposal", "Scope, timeline and quote in writing. Nothing starts until you're happy."],
];

export default function ContactPage() {
  return (
    <>
      <PageHero
        label="Contact"
        title={["Let's talk about", "your next project."]}
        accent={1}
        intro="Tell us what you're building, what you need and where you'd like to go. We'll take it from there."
        className="pb-12 sm:pb-16"
      />
      <section aria-label="Contact form and details" className="bg-lav pb-28 sm:pb-36">
        <div className="container-x grid gap-16 lg:grid-cols-12">
          <div className="lg:col-span-7 xl:col-span-8">
            <ProjectPlanner />
            <Suspense fallback={<div className="min-h-[60vh]" />}>
              <ContactForm />
            </Suspense>
          </div>
          <aside className="lg:col-span-5 xl:col-span-4" aria-label="Other ways to reach us">
            <div className="space-y-6 lg:sticky lg:top-28">
              <div className="rounded-[2rem] bg-deep p-8 text-lav">
                <p className="eyebrow text-lav/55">Email us directly</p>
                <CopyEmail />
                <p className="mt-6 text-sm leading-relaxed text-lav/65">{site.location}</p>
                <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 border-t border-lav/15 pt-5 text-sm">
                  {socials.map((s) => (
                    <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" className="text-lav/70 hover:text-lav">
                      {s.label}
                    </a>
                  ))}
                </div>
              </div>
              <div className="rounded-[2rem] bg-paper p-8 ring-1 ring-ink/[0.06]">
                <p className="eyebrow text-ink/50">What happens next</p>
                <ol className="mt-6 space-y-6">
                  {next.map(([t, d], i) => (
                    <li key={t} className="grid grid-cols-[2rem_1fr] gap-3">
                      <span className="font-mono text-xs text-deep">0{i + 1}</span>
                      <div>
                        <p className="font-medium">{t}</p>
                        <p className="mt-1 text-sm leading-relaxed text-ink/60">{d}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
              <p className="px-2 text-xs leading-relaxed text-ink/50">
                This form doesn&apos;t send or store your details on a server. It prepares an email that you send yourself from Gmail or your mail app. See our{" "}
                <a href="/privacy-policy" className="underline underline-offset-2 hover:text-deep">
                  Privacy Policy
                </a>
                .
              </p>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
