import type { ServiceVisual as V } from "@/lib/services";
import { cn } from "@/lib/utils";

const T = "transition-all duration-700 ease-[var(--ease-out-expo)]";

/** Minimal, CSS-only illustrations. Animate on parent `.group` hover. */
export function ServiceVisual({ kind, className, dark = false }: { kind: V; className?: string; dark?: boolean }) {
  const line = dark ? "bg-lav/20" : "bg-ink/10";
  const card = dark ? "bg-lav/10 ring-1 ring-lav/15" : "bg-paper ring-1 ring-ink/[0.06] shadow-[0_18px_40px_-24px_rgba(22,27,63,.45)]";
  return (
    <div aria-hidden className={cn("relative aspect-[4/3] w-full overflow-hidden", className)}>
      {kind === "design" && (
        <>
          <div className={cn("absolute left-[12%] top-[16%] h-[58%] w-[52%] rounded-md", card, T, "group-hover:-translate-x-2 group-hover:-rotate-3")}>
            <div className={cn("m-3 h-2 w-1/2 rounded-full", line)} />
            <div className={cn("mx-3 h-2 w-1/3 rounded-full", line)} />
            <div className="mx-3 mt-4 h-[45%] rounded bg-gradient-to-br from-mist to-peri" />
          </div>
          <div className={cn("absolute right-[12%] top-[30%] h-[52%] w-[40%] rounded-md", card, T, "group-hover:translate-x-2 group-hover:rotate-3")}>
            <div className="m-3 grid grid-cols-3 gap-1.5">
              {["bg-deep", "bg-peri", "bg-muted", "bg-mist", "bg-lav", "bg-ink"].map((c) => (
                <span key={c} className={cn("aspect-square rounded-sm", c)} />
              ))}
            </div>
            <div className={cn("mx-3 h-2 w-2/3 rounded-full", line)} />
          </div>
          <svg viewBox="0 0 24 24" className={cn("absolute left-[54%] top-[58%] size-6 text-deep", T, "group-hover:translate-x-6 group-hover:-translate-y-4")}>
            <path d="M4 3l14 7-6 2-2 6z" fill="currentColor" />
          </svg>
        </>
      )}
      {kind === "develop" && (
        <div className={cn("absolute inset-[14%] rounded-md p-4 font-mono text-[0.7rem]", dark ? "bg-night/60 ring-1 ring-lav/15" : "bg-ink text-lav")}>
          <div className="mb-3 flex gap-1.5">
            <span className="size-2 rounded-full bg-lav/30" />
            <span className="size-2 rounded-full bg-lav/30" />
            <span className="size-2 rounded-full bg-lav/30" />
          </div>
          {[
            ["w-[40%]", "bg-peri"],
            ["w-[65%]", "bg-lav/30", "ml-4"],
            ["w-[50%]", "bg-mist/60", "ml-4"],
            ["w-[30%]", "bg-peri/70", "ml-8"],
            ["w-[55%]", "bg-lav/30", "ml-4"],
            ["w-[20%]", "bg-peri"],
          ].map(([w, c, ml], i) => (
            <div
              key={i}
              className={cn("mb-2 h-1.5 rounded-full", w, c, ml, T, "origin-left group-hover:scale-x-125")}
              style={{ transitionDelay: `${i * 40}ms` }}
            />
          ))}
          <span className="absolute bottom-3 right-4 text-peri opacity-0 transition-opacity duration-500 group-hover:opacity-100">✓ build passed</span>
        </div>
      )}
      {kind === "commerce" && (
        <>
          <div className={cn("absolute left-[16%] top-[14%] h-[70%] w-[38%] rounded-md p-2.5", card, T, "group-hover:-translate-y-2")}>
            <div className="h-[62%] rounded bg-[radial-gradient(circle_at_40%_35%,#c9d4ff,#7091E6_45%,#3D52A0)]" />
            <div className={cn("mt-2 h-2 w-2/3 rounded-full", line)} />
            <div className="mt-2 h-4 w-full rounded-full bg-deep" />
          </div>
          <div className={cn("absolute right-[14%] top-[24%] h-[56%] w-[34%] rounded-md p-2.5", card, T, "group-hover:translate-y-2 group-hover:rotate-2")}>
            <div className="h-[60%] rounded bg-gradient-to-br from-lav to-mist" />
            <div className={cn("mt-2 h-2 w-1/2 rounded-full", line)} />
          </div>
          <div className={cn("absolute right-[10%] top-[16%] grid size-9 place-items-center rounded-full bg-peri text-[0.7rem] font-medium text-white", T, "group-hover:scale-110")}>2</div>
        </>
      )}
      {kind === "landing" && (
        <div className={cn("absolute inset-x-[18%] inset-y-[10%] rounded-md p-4", card)}>
          <div className={cn("mx-auto h-2 w-1/3 rounded-full", line)} />
          <div className={cn("mx-auto mt-4 h-4 w-4/5 rounded-full", dark ? "bg-lav/50" : "bg-ink/80")} />
          <div className={cn("mx-auto mt-2 h-4 w-3/5 rounded-full", dark ? "bg-lav/50" : "bg-ink/80")} />
          <div className={cn("mx-auto mt-5 h-6 w-1/3 rounded-full bg-deep", T, "group-hover:w-1/2 group-hover:bg-peri")} />
          <div className="mt-5 grid grid-cols-3 gap-2">
            {[0, 1, 2].map((i) => (
              <div key={i} className={cn("h-8 rounded", dark ? "bg-lav/10" : "bg-lav", T)} style={{ transitionDelay: `${i * 60}ms` }} />
            ))}
          </div>
        </div>
      )}
      {kind === "business" && (
        <div className="absolute inset-0 flex flex-col items-start justify-center gap-2 pl-[18%]">
          {[
            ["w-[70%]", "bg-deep", "group-hover:w-[64%]"],
            ["w-[48%]", "bg-peri", "group-hover:w-[58%]"],
            ["w-[26%]", "bg-muted", "group-hover:w-[44%]"],
          ].map(([w, c, h], i) => (
            <div key={i} className={cn("h-[16%] rounded-sm", w, c, h, T)} style={{ transitionDelay: `${i * 60}ms` }} />
          ))}
        </div>
      )}
      {kind === "revamp" && (
        <div className={cn("absolute inset-[12%] overflow-hidden rounded-md", card)}>
          <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,#d8d4e3_0_6px,#e8e4f0_6px_12px)]" />
          <div className="absolute inset-y-0 left-0 w-[55%] bg-gradient-to-br from-lav to-mist transition-[width] duration-700 ease-[var(--ease-out-expo)] group-hover:w-[92%]">
            <div className="m-3 h-2 w-1/2 rounded-full bg-ink/20" />
            <div className="mx-3 h-6 w-3/4 rounded bg-deep/80" />
          </div>
          <div className="absolute inset-y-0 left-[55%] w-0.5 bg-deep transition-[left] duration-700 ease-[var(--ease-out-expo)] group-hover:left-[92%]" />
        </div>
      )}
    </div>
  );
}
