"use client";

import Link from "next/link";
import { ArrowUp, ArrowUpRight } from "lucide-react";
import { legalNav, nav, site, socials } from "@/lib/site";
import { services } from "@/lib/services";
import { LogoMark, Wordmark } from "@/components/ui/Logo";
import { useSmoothScroll, useToast } from "./Providers";
import { copyText } from "@/lib/utils";

export function Footer() {
  const { scrollTo } = useSmoothScroll();
  const toast = useToast();
  const year = new Date().getFullYear();

  return (
    <footer className="relative mx-2 overflow-hidden rounded-t-[2.5rem] bg-night text-lav sm:mx-3" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">
        Footer
      </h2>
      <div className="grid-lines pointer-events-none absolute inset-0 opacity-[0.35] invert" />
      <div className="container-x relative pt-20 sm:pt-28">
        <div className="grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Link href="/" className="inline-flex items-center gap-3" aria-label={`${site.name} — home`}>
              <LogoMark className="size-10" mono />
              <Wordmark className="text-2xl" />
            </Link>
            <p className="mt-6 max-w-sm text-lav/60">
              An independent studio designing and building thoughtful, high-performance websites.
            </p>
            <button
              type="button"
              onClick={async () => toast((await copyText(site.email)) ? "Email copied to clipboard" : "Couldn't copy — please copy manually", "ok")}
              className="group mt-8 inline-flex items-center gap-3 font-display text-[clamp(1.4rem,2.6vw,2.2rem)] font-light tracking-[-0.03em] text-lav"
              aria-label={`Copy email address ${site.email}`}
            >
              <span className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_1px] bg-left-bottom bg-no-repeat pb-1 transition-[background-size] duration-700 ease-[var(--ease-out-expo)] group-hover:bg-[length:100%_1px]">
                {site.email}
              </span>
            </button>
            <p className="mt-2 text-xs text-lav/40">Click to copy</p>
          </div>

          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:col-span-7">
            <div>
              <p className="eyebrow mb-5 text-lav/40">Navigate</p>
              <ul className="space-y-3">
                {nav.map((n) => (
                  <li key={n.href}>
                    <Link href={n.href} className="text-lav/75 transition-colors hover:text-lav">
                      {n.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="eyebrow mb-5 text-lav/40">Services</p>
              <ul className="space-y-3">
                {services.map((s) => (
                  <li key={s.slug}>
                    <Link href={`/services#${s.slug}`} className="text-lav/75 transition-colors hover:text-lav">
                      {s.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <p className="eyebrow mb-5 text-lav/40">Connect</p>
              <ul className="space-y-3">
                {socials.map((s) => (
                  <li key={s.label}>
                    <a
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group inline-flex items-center gap-1.5 text-lav/75 transition-colors hover:text-lav"
                    >
                      {s.label}
                      <ArrowUpRight className="size-3.5 opacity-50 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
                    </a>
                  </li>
                ))}
                <li>
                  <Link href="/contact" className="text-lav/75 transition-colors hover:text-lav">
                    Contact form
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-20 flex flex-col gap-6 border-t border-lav/10 py-8 text-sm text-lav/50 md:flex-row md:items-center md:justify-between">
          <p>
            © {year} {site.name}. All rights reserved.
          </p>
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {legalNav.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="hover:text-lav">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
          <button
            type="button"
            onClick={() => scrollTo(0, { offset: 0 })}
            className="group inline-flex items-center gap-2 self-start text-lav/70 hover:text-lav md:self-auto"
          >
            Back to top
            <span className="grid size-8 place-items-center rounded-full border border-lav/20 transition-colors group-hover:border-lav/60">
              <ArrowUp className="size-3.5 transition-transform group-hover:-translate-y-0.5" aria-hidden />
            </span>
          </button>
        </div>
      </div>

      <div aria-hidden className="pointer-events-none relative -mb-[0.18em] select-none overflow-hidden">
        <p className="whitespace-nowrap text-center font-display text-[25vw] font-extralight leading-[0.8] tracking-[-0.08em] text-transparent [-webkit-text-stroke:1px_rgba(237,232,245,.16)]">
          {site.wordmark}
        </p>
      </div>
    </footer>
  );
}
