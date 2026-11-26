"use client";

import Link from "next/link";
import { ArrowUpRight, Eye } from "lucide-react";
import type { Project } from "@/lib/projects";
import { DesktopMockup, MobileMockup } from "./SiteMockup";
import { openProjectPreview } from "./previewBus";
import { cn } from "@/lib/utils";

export function ProjectCard({ project, index, className, size = "md" }: { project: Project; index?: number; className?: string; size?: "md" | "lg" }) {
  return (
    <article data-project-slug={project.slug} className={cn("group relative flex flex-col", className)} aria-labelledby={`p-${project.slug}`}>
      <div
        className="relative overflow-hidden rounded-3xl p-[6%] pb-[8%] transition-[background-color] duration-700"
        style={{ background: `linear-gradient(150deg, ${project.theme.soft}55, #ADBDDA66 60%, #8697C455)` }}
      >
        <div className="pointer-events-none absolute inset-0 grid-lines opacity-40" />
        <button
          type="button"
          onClick={() => openProjectPreview(project.slug)}
          className="relative block w-full text-left"
          aria-label={`Quick preview of ${project.title}`}
        >
          <div className="transition-transform duration-[1200ms] ease-[var(--ease-out-expo)] group-hover:-translate-y-2 group-hover:scale-[1.015]">
            <DesktopMockup project={project} />
          </div>
          <div className="absolute -bottom-[4%] right-[2%] w-[19%] transition-transform duration-[1200ms] ease-[var(--ease-out-expo)] group-hover:-translate-y-5 group-hover:rotate-[-3deg]">
            <MobileMockup project={project} />
          </div>
        </button>
        <div className="absolute left-4 top-4 flex gap-2">
          <span className="rounded-full bg-paper/85 px-3 py-1 text-[0.72rem] font-medium text-ink/75 backdrop-blur">{project.category}</span>
          {project.concept && <span className="rounded-full bg-deep px-3 py-1 text-[0.72rem] font-medium text-lav">Concept</span>}
          {!project.concept && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#1f9d6b] px-3 py-1 text-[0.72rem] font-medium text-white">
              <span className="size-1.5 rounded-full bg-white" /> Live
            </span>
          )}
        </div>
        <span className="pointer-events-none absolute right-4 top-4 flex translate-y-2 items-center gap-1.5 rounded-full bg-ink px-3 py-1.5 text-[0.72rem] text-lav opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
          <Eye className="size-3.5" aria-hidden /> Quick preview
        </span>
      </div>

      <div className="mt-5 flex items-start justify-between gap-6">
        <div className="min-w-0">
          <p className="eyebrow text-ink/45">
            {typeof index === "number" && <span className="mr-3 text-deep">{String(index + 1).padStart(2, "0")}</span>}
            {project.industry} · {project.type}
          </p>
          <h3 id={`p-${project.slug}`} className={cn("mt-2 font-display font-normal tracking-[-0.035em]", size === "lg" ? "text-3xl sm:text-4xl" : "text-2xl sm:text-3xl")}>
            {project.title}
          </h3>
          <p className="mt-2 max-w-md text-[0.95rem] leading-relaxed text-ink/60">{project.summary}</p>
          <ul className="mt-3 flex flex-wrap gap-1.5" aria-label="Technologies">
            {project.technologies.slice(0, 3).map((t) => (
              <li key={t} className="rounded-full border border-ink/10 px-2.5 py-0.5 text-[0.72rem] text-ink/55">
                {t}
              </li>
            ))}
          </ul>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-2">
          <Link
            href={`/showcase/${project.slug}`}
            className="group/v inline-flex items-center gap-2 rounded-full bg-deep px-4 py-2.5 text-sm text-lav transition-colors hover:bg-ink"
          >
            View project
            <ArrowUpRight className="size-4 transition-transform group-hover/v:rotate-45" aria-hidden />
          </Link>
          <button
            type="button"
            onClick={() => openProjectPreview(project.slug)}
            className="rounded-full px-3 py-1.5 text-sm text-ink/60 underline-offset-4 hover:text-ink hover:underline"
          >
            Preview
          </button>
        </div>
      </div>
    </article>
  );
}
