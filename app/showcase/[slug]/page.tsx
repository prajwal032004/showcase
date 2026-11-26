import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { getProject, projects } from "@/lib/projects";
import { pageMetadata } from "@/lib/seo";
import { DesktopMockup, MobileMockup } from "@/components/showcase/SiteMockup";
import { SectionLabel } from "@/components/ui/Section";
import { Reveal } from "@/components/motion/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { FinalCTA } from "@/components/home/FinalCTA";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) return {};
  return pageMetadata({
    title: `${p.title} — ${p.concept ? "Concept" : "Case Study"}`,
    description: `${p.summary} ${p.concept ? "A design concept" : "A live project"} by Forma Studio: ${p.features.slice(0, 3).join(", ").toLowerCase()}.`.slice(0, 160),
    path: `/showcase/${p.slug}`,
  });
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) notFound();
  const idx = projects.indexOf(p);
  const next = projects[(idx + 1) % projects.length];
  const prev = projects[(idx - 1 + projects.length) % projects.length];

  return (
    <article data-project-slug={p.slug}>
      <header className="relative overflow-hidden bg-lav pb-16 pt-32 sm:pt-40">
        <div className="container-x">
          <Link href="/showcase" className="group inline-flex items-center gap-2 text-sm text-ink/60 hover:text-deep">
            <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-1" aria-hidden /> Back to showcase
          </Link>
          <div className="mt-10 flex flex-wrap items-end justify-between gap-8">
            <div>
              <SectionLabel>
                {p.category} · {p.industry}
              </SectionLabel>
              <h1 className="display-xl mt-6">{p.title}</h1>
              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink/70">{p.summary}</p>
            </div>
            <dl className="grid grid-cols-3 gap-8 text-sm">
              {[
                ["Type", p.type],
                ["Year", p.year],
                ["Status", p.concept ? "Concept" : "Live"],
              ].map(([k, v]) => (
                <div key={k}>
                  <dt className="eyebrow text-ink/45">{k}</dt>
                  <dd className="mt-2 text-ink/80">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </header>

      <section aria-label="Desktop and mobile preview" className="bg-lav pb-24">
        <div className="container-x">
          <div className="relative overflow-hidden rounded-[2rem] p-5 sm:p-12 lg:p-20" style={{ background: `linear-gradient(150deg, ${p.theme.soft}, #ADBDDA 55%, #8697C4)` }}>
            <div className="grid-lines absolute inset-0 opacity-40" aria-hidden />
            <div className="relative">
              <DesktopMockup project={p} />
              <div className="absolute -bottom-6 right-2 w-[22%] max-w-[220px] sm:-bottom-10 sm:right-6">
                <MobileMockup project={p} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {p.media?.gallery?.length ? (
        <section aria-label="More screens" className="bg-lav pb-24">
          <div className="container-x grid gap-6 md:grid-cols-2">
            {p.media.gallery.map((src, i) => (
              <div key={src} className="relative aspect-[16/10] overflow-hidden rounded-3xl ring-1 ring-ink/[0.06]" data-ctx-image>
                <Image src={src} alt={`${p.title} — screen ${i + 2}`} fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover object-top" />
              </div>
            ))}
          </div>
        </section>
      ) : null}

      <section aria-labelledby="overview" className="bg-paper py-24 sm:py-32">
        <div className="container-x grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionLabel index="01">Overview</SectionLabel>
            <h2 id="overview" className="display-md mt-6">
              The idea
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-ink/70">{p.description}</p>
            {p.concept && (
              <p className="mt-6 rounded-3xl border border-deep/20 bg-deep/[0.05] p-4 text-sm text-ink/70">
                This is a concept project created to demonstrate our design approach. It does not represent a real client engagement.
              </p>
            )}
            <div className="mt-8 flex flex-wrap gap-3">
              {p.liveUrl ? (
                <ButtonLink href={p.liveUrl} external icon>
                  Visit live site
                </ButtonLink>
              ) : (
                <ButtonLink href="/contact" icon>
                  Build something similar
                </ButtonLink>
              )}
            </div>
          </div>
          <div className="grid gap-10 sm:grid-cols-2 lg:col-span-7">
            <div>
              <h3 className="eyebrow text-ink/45">Design details</h3>
              <Reveal as="ul" className="mt-5 space-y-4" stagger={0.06}>
                {p.designNotes.map((d) => (
                  <li key={d} className="border-t hairline pt-4 leading-relaxed text-ink/75">
                    {d}
                  </li>
                ))}
              </Reveal>
            </div>
            <div>
              <h3 className="eyebrow text-ink/45">Key features</h3>
              <Reveal as="ul" className="mt-5 space-y-4" stagger={0.06}>
                {p.features.map((f) => (
                  <li key={f} className="flex gap-3 border-t hairline pt-4 text-ink/75">
                    <Check className="mt-1 size-4 shrink-0 text-deep" aria-hidden />
                    {f}
                  </li>
                ))}
              </Reveal>
              <h3 className="eyebrow mt-10 text-ink/45">Technologies</h3>
              <ul className="mt-4 flex flex-wrap gap-2">
                {p.technologies.map((t) => (
                  <li key={t} className="rounded-full border border-ink/10 px-3 py-1 text-sm text-ink/65">
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <nav aria-label="More projects" className="grid border-t hairline bg-lav sm:grid-cols-2">
        {[
          ["Previous", prev, ArrowLeft],
          ["Next", next, ArrowRight],
        ].map(([label, proj, Icon]) => {
          const pr = proj as typeof p;
          const I = Icon as typeof ArrowLeft;
          return (
            <Link
              key={label as string}
              href={`/showcase/${pr.slug}`}
              className="group flex items-center justify-between gap-6 border-ink/10 p-8 transition-colors hover:bg-paper sm:p-12 sm:[&:first-child]:border-r"
            >
              <span>
                <span className="eyebrow text-ink/45">{label as string} project</span>
                <span className="mt-3 block font-display text-3xl font-light tracking-[-0.04em] sm:text-4xl">{pr.title}</span>
              </span>
              <I className="size-6 text-deep transition-transform group-hover:translate-x-1" aria-hidden />
            </Link>
          );
        })}
      </nav>

      <FinalCTA />
    </article>
  );
}
