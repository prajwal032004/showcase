"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { categories, projects, type Category } from "@/lib/projects";
import { ProjectCard } from "./ProjectCard";
import { ScrollTrigger } from "@/lib/gsap";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

export function ShowcaseGrid() {
  const params = useSearchParams();
  const router = useRouter();
  const initial = (params.get("category") as Category) || "All";
  const [active, setActive] = useState<Category>(categories.includes(initial) ? initial : "All");

  const counts = useMemo(() => {
    const c: Record<string, number> = { All: projects.length };
    projects.forEach((p) => (c[p.category] = (c[p.category] ?? 0) + 1));
    return c;
  }, []);

  const [query, setQuery] = useState("");
  const q = query.trim().toLowerCase();
  const list = (active === "All" ? projects : projects.filter((p) => p.category === active)).filter(
    (p) => !q || [p.title, p.industry, p.type, p.category, p.summary, ...p.technologies].join(" ").toLowerCase().includes(q)
  );

  useEffect(() => {
    const t = setTimeout(() => ScrollTrigger.refresh(), 700);
    return () => clearTimeout(t);
  }, [active, query]);

  const choose = (c: Category) => {
    setActive(c);
    const url = c === "All" ? "/showcase" : `/showcase?category=${encodeURIComponent(c)}`;
    router.replace(url, { scroll: false });
  };

  return (
    <section aria-labelledby="grid-title" className="bg-lav pb-28 sm:pb-36">
      <h2 id="grid-title" className="sr-only">
        Projects
      </h2>
      <div className="container-x">
        <div className="sticky top-20 z-20 mb-12 sm:top-24">
          <div className="flex flex-col gap-3 rounded-[1.75rem] bg-paper/90 p-2 shadow-[0_18px_50px_-28px_rgba(22,27,63,.5)] ring-1 ring-ink/[0.06] backdrop-blur-md lg:flex-row lg:items-center lg:justify-between">
            <div role="toolbar" aria-label="Filter projects by category" className="no-scrollbar flex gap-1 overflow-x-auto">
              {categories.map((c) => {
                const on = active === c;
                return (
                  <button
                    key={c}
                    type="button"
                    onClick={() => choose(c)}
                    aria-pressed={on}
                    disabled={!counts[c]}
                    className={cn(
                      "relative flex shrink-0 items-center gap-2 rounded-full py-2 pl-4 pr-2 text-sm transition-colors disabled:opacity-35",
                      on ? "text-lav" : "text-ink/70 hover:bg-ink/[0.04] hover:text-ink"
                    )}
                  >
                    {on && <motion.span layoutId="filter-pill" className="absolute inset-0 rounded-full bg-deep" transition={{ type: "spring", stiffness: 420, damping: 36 }} />}
                    <span className="relative">{c}</span>
                    <span
                      className={cn(
                        "relative grid h-5 min-w-5 place-items-center rounded-full px-1.5 font-mono text-[0.65rem] tabular-nums",
                        on ? "bg-lav/20 text-lav" : "bg-ink/[0.06] text-ink/55"
                      )}
                    >
                      {counts[c] ?? 0}
                    </span>
                  </button>
                );
              })}
            </div>
            <div className="flex items-center gap-3 px-2 lg:px-0">
              <label className="relative flex-1 lg:w-64 lg:flex-none">
                <span className="sr-only">Search projects</span>
                <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-ink/40" aria-hidden />
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search projects, industries, tech…"
                  className="h-10 w-full rounded-full bg-lav/70 pl-10 pr-4 text-sm text-ink outline-none ring-1 ring-ink/[0.06] placeholder:text-ink/40 focus:ring-2 focus:ring-peri"
                />
              </label>
              <span className="hidden shrink-0 pr-2 text-sm text-ink/50 sm:block">
                <span className="font-medium text-ink">{list.length}</span> {list.length === 1 ? "project" : "projects"}
              </span>
            </div>
          </div>
        </div>

        <p className="sr-only" aria-live="polite">
          Showing {list.length} {list.length === 1 ? "project" : "projects"} in {active}
        </p>

        <motion.div layout className="grid gap-x-8 gap-y-20 md:grid-cols-2">
          <AnimatePresence mode="popLayout">
            {list.map((p, i) => (
              <motion.div
                key={p.slug}
                layout
                initial={{ opacity: 0, y: 40, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.25 } }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: i * 0.05 }}
                className={cn(i % 2 === 1 && "md:mt-24")}
              >
                <ProjectCard project={p} index={projects.indexOf(p)} size="lg" />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {list.length === 0 && <p className="py-20 text-center text-ink/60">No projects match{q ? ` “${query}”` : " this category"} yet — try another filter.</p>}
      </div>
    </section>
  );
}
