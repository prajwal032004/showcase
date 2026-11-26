import { cn } from "@/lib/utils";

export function SectionLabel({ index, children, className, light = false }: { index?: string; children: React.ReactNode; className?: string; light?: boolean }) {
  return (
    <p className={cn("eyebrow flex items-center gap-3", light ? "text-lav/60" : "text-ink/55", className)}>
      {index && <span className={cn("tabular-nums", light ? "text-peri" : "text-deep")}>{index}</span>}
      <span className={cn("h-px w-8", light ? "bg-lav/30" : "bg-ink/20")} />
      {children}
    </p>
  );
}

export function Marquee({ items, className, duration = 38, reverse = false }: { items: string[]; className?: string; duration?: number; reverse?: boolean }) {
  const row = (
    <div className="flex shrink-0 items-center gap-10 pr-10">
      {items.map((t, i) => (
        <span key={i} className="flex items-center gap-10">
          {t}
          <svg viewBox="0 0 48 48" className="size-[0.5em] opacity-60" aria-hidden>
            <rect x="2" y="4" width="44" height="12" rx="1.5" fill="currentColor" />
            <rect x="2" y="18" width="30" height="12" rx="1.5" fill="currentColor" />
            <rect x="2" y="32" width="16" height="12" rx="1.5" fill="currentColor" />
          </svg>
        </span>
      ))}
    </div>
  );
  return (
    <div className={cn("flex overflow-hidden whitespace-nowrap", className)} aria-hidden>
      <div
        className="animate-marquee flex w-max hover:[animation-play-state:paused]"
        style={{ ["--marquee-duration" as string]: `${duration}s`, animationDirection: reverse ? "reverse" : undefined }}
      >
        {row}
        {row}
      </div>
    </div>
  );
}
