import { site } from "@/lib/site";

export function LegalLayout({
  title,
  intro,
  sections,
}: {
  title: string;
  intro: React.ReactNode;
  sections: { id: string; title: string; body: React.ReactNode }[];
}) {
  return (
    <div className="bg-lav pb-28 pt-36 sm:pt-44">
      <div className="container-x">
        <p className="eyebrow text-ink/50">Legal</p>
        <h1 className="display-lg mt-6">{title}</h1>
        <p className="mt-6 text-sm text-ink/55">
          Effective date: {site.legal.effectiveDate} · Last updated: {site.legal.effectiveDate}
        </p>
        <div role="note" className="mt-8 max-w-3xl rounded-3xl border border-deep/20 bg-deep/[0.05] p-5 text-sm leading-relaxed text-ink/75">
          <strong className="font-semibold text-deep">Draft notice:</strong> This document is a practical draft provided for convenience. Bracketed
          placeholders must be completed, and the document should be reviewed by a qualified legal professional before publication.
        </div>

        <div className="mt-16 grid gap-14 lg:grid-cols-12">
          <nav aria-label="On this page" className="lg:col-span-3">
            <div className="lg:sticky lg:top-28">
              <p className="eyebrow mb-4 text-ink/45">On this page</p>
              <ol className="space-y-2 text-sm">
                {sections.map((s, i) => (
                  <li key={s.id}>
                    <a href={`#${s.id}`} className="flex gap-3 text-ink/60 transition-colors hover:text-deep">
                      <span className="font-mono text-xs text-ink/35">{String(i + 1).padStart(2, "0")}</span>
                      {s.title}
                    </a>
                  </li>
                ))}
              </ol>
            </div>
          </nav>
          <div className="prose-legal max-w-3xl lg:col-span-8 lg:col-start-5">
            <div className="text-lg leading-relaxed text-ink/75">{intro}</div>
            {sections.map((s, i) => (
              <section key={s.id} aria-labelledby={s.id}>
                <h2 id={s.id}>
                  <span className="mr-3 font-mono text-sm text-deep">{String(i + 1).padStart(2, "0")}</span>
                  {s.title}
                </h2>
                {s.body}
              </section>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
