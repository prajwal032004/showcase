"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Link as LinkIcon, Monitor, Smartphone } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { getProject } from "@/lib/projects";
import { DesktopMockup, MobileMockup } from "./SiteMockup";
import { PREVIEW_EVENT } from "./previewBus";
import { useToast } from "@/components/layout/Providers";
import { copyText, cn } from "@/lib/utils";

/** Global quick-preview dialog, opened from cards or the context menu. */
export function PreviewModal() {
  const [slug, setSlug] = useState<string | null>(null);
  const [device, setDevice] = useState<"desktop" | "mobile">("desktop");
  const toast = useToast();
  const project = slug ? getProject(slug) : undefined;

  useEffect(() => {
    const on = (e: Event) => {
      setDevice("desktop");
      setSlug((e as CustomEvent<string>).detail);
    };
    window.addEventListener(PREVIEW_EVENT, on);
    return () => window.removeEventListener(PREVIEW_EVENT, on);
  }, []);

  const close = useCallback(() => setSlug(null), []);

  return (
    <Modal open={!!project} onClose={close} label={project ? `${project.title} preview` : "Project preview"}>
      {project && (
        <div className="p-5 pt-8 sm:p-10">
          <div className="flex flex-wrap items-end justify-between gap-6 pr-14">
            <div>
              <p className="eyebrow text-ink/50">
                {project.category} · {project.industry} {project.concept && <span className="ml-2 rounded-full bg-deep px-2 py-0.5 text-lav">Concept</span>}
              </p>
              <h2 className="mt-3 font-display text-4xl font-light tracking-[-0.04em] sm:text-5xl">{project.title}</h2>
            </div>
            <div role="tablist" aria-label="Preview device" className="flex rounded-full bg-paper p-1 ring-1 ring-ink/[0.06]">
              {(
                [
                  ["desktop", Monitor],
                  ["mobile", Smartphone],
                ] as const
              ).map(([d, Icon]) => (
                <button
                  key={d}
                  role="tab"
                  type="button"
                  aria-selected={device === d}
                  onClick={() => setDevice(d)}
                  className={cn("relative flex items-center gap-2 rounded-full px-4 py-2 text-sm capitalize", device === d ? "text-lav" : "text-ink/60 hover:text-ink")}
                >
                  {device === d && <motion.span layoutId="device-pill" className="absolute inset-0 rounded-full bg-deep" transition={{ type: "spring", stiffness: 400, damping: 34 }} />}
                  <Icon className="relative size-4" aria-hidden />
                  <span className="relative">{d}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="relative mt-8 grid min-h-[min(60vh,560px)] place-items-center overflow-hidden rounded-xl bg-[linear-gradient(150deg,#ADBDDA55,#EDE8F5)] p-4 sm:p-10">
            <div className="grid-lines absolute inset-0 opacity-50" />
            <AnimatePresence mode="wait">
              <motion.div
                key={device}
                className={cn("relative w-full", device === "mobile" ? "max-w-[260px]" : "max-w-4xl")}
                initial={{ opacity: 0, y: 30, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.98 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              >
                {device === "desktop" ? <DesktopMockup project={project} /> : <MobileMockup project={project} />}
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="mt-8 grid gap-8 md:grid-cols-[1.4fr_1fr]">
            <div>
              <p className="leading-relaxed text-ink/70">{project.description}</p>
              <ul className="mt-5 flex flex-wrap gap-2">
                {project.technologies.map((t) => (
                  <li key={t} className="rounded-full border border-ink/10 px-3 py-1 text-xs text-ink/60">
                    {t}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex flex-col gap-3 md:items-end">
              <Link
                href={`/showcase/${project.slug}`}
                onClick={close}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-deep px-6 py-3.5 text-lav transition-colors hover:bg-ink"
              >
                View full case study <ArrowUpRight className="size-4" aria-hidden />
              </Link>
              <button
                type="button"
                onClick={async () => toast((await copyText(`${window.location.origin}/showcase/${project.slug}`)) ? "Project link copied" : "Couldn't copy link")}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-ink/15 px-6 py-3.5 text-ink/80 transition-colors hover:border-deep hover:text-deep"
              >
                <LinkIcon className="size-4" aria-hidden /> Copy link
              </button>
              {project.liveUrl ? (
                <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-deep underline underline-offset-4">
                  Open live site
                </a>
              ) : (
                <p className="text-xs text-ink/45">Live demo link will appear here for real projects.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
}
