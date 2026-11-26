"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Ban, ChevronDown, Globe, Mail, ServerOff } from "lucide-react";
import { pricing } from "@/lib/site";
import { SectionLabel } from "@/components/ui/Section";
import { SplitReveal } from "@/components/motion/Reveal";
import { cn } from "@/lib/utils";

const EASE = [0.16, 1, 0.3, 1] as const;
const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;

/** Transparent, line-by-line breakdown of the starting price (values live in lib/site.ts). */
export function PriceBreakdown() {
  const items = pricing.breakdown;
  const total = items.reduce((s, i) => s + i.amount, 0);
  const [open, setOpen] = useState<string | null>("domain");
  const [hover, setHover] = useState<string | null>(null);
  const focus = hover ?? open;

  return (
    <section id="breakdown" aria-labelledby="breakdown-title" className="scroll-mt-24 bg-lav py-24 sm:py-32">
      <div className="container-x">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionLabel index="02b">Cost breakdown</SectionLabel>
            <SplitReveal id="breakdown-title" as="h2" text={`Where your ${pricing.startingPriceLabel} goes.`} className="display-md mt-6" />
            <p className="mt-6 max-w-md leading-relaxed text-ink/65">
              No mystery pricing. Here&apos;s exactly what the starting package covers, line by line. Third-party costs like your domain are paid directly by you —
              never marked up.
            </p>
          </div>

          <div className="lg:col-span-7">
            {/* Stacked bar */}
            <div className="flex h-14 overflow-hidden rounded-2xl ring-1 ring-ink/[0.06]" role="img" aria-label="Cost breakdown chart">
              {items.map((it, i) => (
                <motion.button
                  key={it.id}
                  type="button"
                  onMouseEnter={() => setHover(it.id)}
                  onMouseLeave={() => setHover(null)}
                  onClick={() => setOpen(it.id)}
                  aria-label={`${it.label}: ${inr(it.amount)}`}
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.9, ease: EASE, delay: i * 0.06 }}
                  className="relative h-full origin-left transition-opacity duration-300"
                  style={{ width: `${(it.amount / total) * 100}%`, background: it.color, opacity: focus && focus !== it.id ? 0.35 : 1 }}
                >
                  <span className="absolute inset-0 grid place-items-center font-mono text-[0.65rem] font-medium text-white [text-shadow:0_1px_2px_rgba(16,20,47,.6)]">
                    {Math.round((it.amount / total) * 100)}%
                  </span>
                </motion.button>
              ))}
            </div>
            <div className="mt-3 flex justify-between text-sm text-ink/55">
              <span>{items.length} line items</span>
              <span>
                Total <strong className="font-display text-xl font-normal text-deep">{inr(total)}</strong>
              </span>
            </div>

            {/* Line items */}
            <ul className="mt-8 divide-y divide-ink/[0.08] overflow-hidden rounded-3xl bg-paper ring-1 ring-ink/[0.06]">
              {items.map((it) => {
                const isOpen = open === it.id;
                return (
                  <li key={it.id} onMouseEnter={() => setHover(it.id)} onMouseLeave={() => setHover(null)}>
                    <button
                      type="button"
                      onClick={() => setOpen(isOpen ? null : it.id)}
                      aria-expanded={isOpen}
                      className="flex w-full items-center gap-4 px-5 py-4 text-left transition-colors hover:bg-lav/60 sm:px-6"
                    >
                      <span className="size-3 shrink-0 rounded-full" style={{ background: it.color }} aria-hidden />
                      <span className="flex-1">
                        <span className="font-medium text-ink">{it.label}</span>
                        {"provider" in it && it.provider && (
                          <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-[#1BDBDB]/15 px-2 py-0.5 align-middle text-[0.7rem] font-semibold text-[#0b6f6f]">
                            <Globe className="size-3" aria-hidden /> via {it.provider}
                          </span>
                        )}
                      </span>
                      <span className="font-display text-lg tabular-nums text-deep">{inr(it.amount)}</span>
                      <ChevronDown className={cn("size-4 text-ink/40 transition-transform duration-300", isOpen && "rotate-180")} aria-hidden />
                    </button>
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.45, ease: EASE }}
                          className="overflow-hidden"
                        >
                          <div className="px-5 pb-6 pl-12 sm:px-6 sm:pl-[3.25rem]">
                            <ul className="space-y-1.5 text-[0.95rem] text-ink/65">
                              {it.details.map((d) => (
                                <li key={d} className="flex gap-2">
                                  <span className="text-peri">—</span>
                                  {d}
                                </li>
                              ))}
                            </ul>
                            {it.id === "domain" && <DomainGuide />}
                            {it.id === "email" && (
                              <p className="mt-4 flex items-start gap-2 rounded-2xl bg-lav p-4 text-sm text-ink/70">
                                <Mail className="mt-0.5 size-4 shrink-0 text-deep" aria-hidden />
                                We set up and hand over your mailbox. If you choose a paid mailbox plan, the subscription is paid directly to the provider.
                              </p>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </li>
                );
              })}
            </ul>

            {/* Third-party + no backend */}
            <div className="mt-8 grid gap-4 md:grid-cols-2">
              <div className="rounded-3xl bg-paper p-6 ring-1 ring-ink/[0.06]">
                <p className="eyebrow text-ink/45">Paid directly by you</p>
                <ul className="mt-4 space-y-3 text-sm">
                  {pricing.thirdParty.map((t) => (
                    <li key={t.label}>
                      <p className="font-medium text-ink">{t.label}</p>
                      <p className="text-ink/60">{t.note}</p>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-3xl bg-night p-6 text-lav">
                <p className="eyebrow flex items-center gap-2 text-lav/60">
                  <ServerOff className="size-3.5" aria-hidden /> We don&apos;t provide backend services
                </p>
                <p className="mt-4 text-sm leading-relaxed text-lav/75">{pricing.noBackend}</p>
                <ul className="mt-4 flex flex-wrap gap-1.5 text-xs">
                  {["Custom servers", "Databases", "User logins", "Admin dashboards", "APIs"].map((x) => (
                    <li key={x} className="inline-flex items-center gap-1 rounded-full bg-lav/10 px-2.5 py-1 text-lav/70">
                      <Ban className="size-3" aria-hidden /> {x}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <p className="mt-6 text-xs leading-relaxed text-ink/45">
              Amounts shown are an illustrative breakdown of the starting package and may be adjusted to your scope. Final pricing is confirmed in writing before work
              begins.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function DomainGuide() {
  return (
    <div className="mt-5 rounded-2xl bg-lav p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="flex items-center gap-2 font-medium text-ink">
          <span className="grid size-8 place-items-center rounded-full bg-[#1BDBDB]/20 text-[#0b6f6f]">
            <Globe className="size-4" aria-hidden />
          </span>
          How to buy your domain on GoDaddy
        </p>
        <a
          href="https://www.godaddy.com/domains"
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full bg-ink px-4 py-2 text-xs font-medium text-lav hover:bg-deep"
        >
          Open GoDaddy domain search ↗
        </a>
      </div>
      <ol className="mt-5 grid gap-3 sm:grid-cols-2">
        {pricing.domainGuide.map((s, i) => (
          <li key={s.title} className="flex gap-3 rounded-xl bg-paper p-3.5">
            <span className="grid size-7 shrink-0 place-items-center rounded-full bg-deep font-mono text-[0.7rem] text-lav">{i + 1}</span>
            <span>
              <span className="block text-sm font-medium text-ink">{s.title}</span>
              <span className="block text-[0.82rem] leading-relaxed text-ink/60">{s.text}</span>
            </span>
          </li>
        ))}
      </ol>
      <p className="mt-4 text-[0.72rem] text-ink/45">GoDaddy is a trademark of its respective owner. We are not affiliated with GoDaddy; domain fees are paid directly to them.</p>
    </div>
  );
}
