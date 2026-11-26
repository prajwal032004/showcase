import Image from "next/image";
import type { Project } from "@/lib/projects";
import { cn } from "@/lib/utils";

/**
 * Renders a generated, resolution-independent website mockup for a project.
 * Uses container-query units so it scales perfectly at any size.
 * If the project has real media (screenshot / GIF), that is shown instead.
 */
export function DesktopMockup({ project, className, chrome = true }: { project: Project; className?: string; chrome?: boolean }) {
  const t = project.theme;
  const media = project.media?.gif || project.media?.desktop;
  return (
    <div
      className={cn("@container relative overflow-hidden rounded-2xl bg-paper shadow-[0_30px_80px_-30px_rgba(22,27,63,.45)] ring-1 ring-ink/[0.06]", className)}
      data-ctx-image
      role="img"
      aria-label={`${project.title} — desktop preview (${project.concept ? "concept" : "project"})`}
    >
      {chrome && (
        <div className="flex h-[4.2cqw] min-h-5 items-center gap-[0.8cqw] border-b border-ink/[0.06] bg-paper px-[1.6cqw]">
          <span className="size-[1cqw] min-h-1.5 min-w-1.5 rounded-full bg-[#ff6159]/70" />
          <span className="size-[1cqw] min-h-1.5 min-w-1.5 rounded-full bg-[#ffbd2e]/70" />
          <span className="size-[1cqw] min-h-1.5 min-w-1.5 rounded-full bg-[#28c941]/70" />
          <span className="mx-auto h-[2.2cqw] min-h-3 w-2/5 rounded-full bg-ink/[0.05] text-center font-mono text-[1.3cqw] leading-[2.2cqw] text-ink/35">
            {project.slug}.com
          </span>
        </div>
      )}
      <div className="relative aspect-[16/10] w-full" style={{ background: t.bg, color: t.ink }}>
        {media ? (
          <Image src={media} alt="" fill loading="eager" sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover object-top" unoptimized={!!project.media?.gif} />
        ) : (
          <Layout project={project} />
        )}
      </div>
    </div>
  );
}

export function MobileMockup({ project, className }: { project: Project; className?: string }) {
  const t = project.theme;
  const media = project.media?.mobile;
  return (
    <div className={cn("@container", className)} data-ctx-image role="img" aria-label={`${project.title} — mobile preview`}>
      <div className="relative overflow-hidden rounded-[14cqw] bg-ink p-[3.5cqw] shadow-[0_30px_60px_-20px_rgba(22,27,63,.55)]">
        <div className="relative aspect-[9/19] overflow-hidden rounded-[11cqw]" style={{ background: t.bg, color: t.ink }}>
          <span className="absolute left-1/2 top-[2.5cqw] z-10 h-[5cqw] w-[30cqw] -translate-x-1/2 rounded-full bg-ink" />
          {media ? <Image src={media} alt="" fill sizes="200px" className="object-cover" /> : <MobileLayout project={project} />}
        </div>
      </div>
    </div>
  );
}

/* ───────────── generated desktop layouts ───────────── */

function Nav({ t, center = false }: { t: Project["theme"]; center?: boolean }) {
  return (
    <div className={cn("absolute inset-x-[4cqw] top-[2.6cqw] flex items-center text-[1.35cqw]", center ? "justify-between" : "justify-between")}>
      <span className="font-semibold tracking-[0.12em]" style={{ letterSpacing: center ? "0.3em" : undefined }}>
        {t.brand}
      </span>
      <span className="flex gap-[2.4cqw] opacity-60">
        <span>Shop</span>
        <span>About</span>
        <span>Journal</span>
      </span>
      <span className="rounded-full px-[1.6cqw] py-[0.6cqw]" style={{ background: t.accent, color: t.bg }}>
        Contact
      </span>
    </div>
  );
}

function Layout({ project }: { project: Project }) {
  const t = project.theme;
  switch (t.layout) {
    case "fashion":
      return (
        <div className="absolute inset-0">
          <Nav t={t} center />
          <div className="absolute left-[4cqw] top-[14cqw] w-[44cqw]">
            <p className="text-[1.2cqw] uppercase tracking-[0.3em] opacity-50">Collection 04</p>
            <p className="mt-[1.5cqw] font-serif text-[7.4cqw] leading-[0.9] tracking-[-0.03em]">{t.headline}</p>
            <p className="mt-[2cqw] w-[30cqw] text-[1.3cqw] leading-relaxed opacity-60">Considered pieces, crafted to outlast the season.</p>
            <span className="mt-[2.6cqw] inline-block border-b pb-[0.4cqw] text-[1.3cqw] uppercase tracking-[0.2em]" style={{ borderColor: t.ink }}>
              Explore
            </span>
          </div>
          <div className="absolute right-[4cqw] top-[9cqw] h-[44cqw] w-[38cqw] overflow-hidden rounded-t-full" style={{ background: `linear-gradient(160deg, ${t.soft}, ${t.accent})` }}>
            <div className="absolute bottom-0 left-1/2 h-[30cqw] w-[18cqw] -translate-x-1/2 rounded-t-full opacity-80" style={{ background: t.ink }} />
            <div className="absolute bottom-[29cqw] left-1/2 size-[7cqw] -translate-x-1/2 rounded-full" style={{ background: t.ink }} />
          </div>
          <div className="absolute bottom-[3cqw] left-[4cqw] flex gap-[1.6cqw]">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-[7cqw] w-[10cqw] rounded-[0.6cqw]" style={{ background: i === 1 ? t.accent : t.soft, opacity: 0.85 }} />
            ))}
          </div>
        </div>
      );
    case "saas":
      return (
        <div className="absolute inset-0">
          <div className="absolute inset-0 opacity-70" style={{ background: `radial-gradient(ellipse at 50% -10%, ${t.accent}66, transparent 60%)` }} />
          <Nav t={t} />
          <div className="absolute inset-x-0 top-[11cqw] text-center">
            <span className="rounded-full border px-[1.4cqw] py-[0.4cqw] text-[1.1cqw] opacity-70" style={{ borderColor: `${t.ink}33` }}>
              New · Automations 2.0
            </span>
            <p className="mt-[1.8cqw] text-[5.6cqw] font-medium leading-none tracking-[-0.04em]">{t.headline}</p>
            <div className="mt-[2cqw] flex justify-center gap-[1cqw] text-[1.2cqw]">
              <span className="rounded-full px-[1.8cqw] py-[0.7cqw]" style={{ background: t.accent, color: "#fff" }}>
                Start free trial
              </span>
              <span className="rounded-full border px-[1.8cqw] py-[0.7cqw]" style={{ borderColor: `${t.ink}33` }}>
                Book demo
              </span>
            </div>
          </div>
          <div className="absolute inset-x-[10cqw] bottom-[-4cqw] top-[33cqw] rounded-t-[1.4cqw] border p-[1.4cqw]" style={{ background: t.soft, borderColor: `${t.ink}22` }}>
            <div className="flex h-full gap-[1.4cqw]">
              <div className="w-[12cqw] space-y-[0.9cqw]">
                {[70, 50, 60, 40, 55].map((w, i) => (
                  <div key={i} className="h-[1.2cqw] rounded-full" style={{ width: `${w}%`, background: i === 0 ? t.accent : `${t.ink}22` }} />
                ))}
              </div>
              <div className="grid flex-1 grid-cols-3 gap-[1cqw]">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="rounded-[0.8cqw] p-[1cqw]" style={{ background: `${t.ink}0d` }}>
                    <div className="h-[1cqw] w-1/2 rounded-full" style={{ background: `${t.ink}33` }} />
                    <div className="mt-[0.8cqw] text-[2.2cqw] font-semibold">{["128", "94%", "3.2k"][i]}</div>
                  </div>
                ))}
                <div className="col-span-3 flex items-end gap-[0.8cqw] rounded-[0.8cqw] p-[1.2cqw]" style={{ background: `${t.ink}0d` }}>
                  {[40, 65, 45, 80, 55, 90, 70, 100, 75, 85].map((h, i) => (
                    <div key={i} className="flex-1 rounded-t-[0.4cqw]" style={{ height: `${h * 0.12}cqw`, background: i === 7 ? t.accent : `${t.accent}66` }} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    case "coffee":
      return (
        <div className="absolute inset-0">
          <Nav t={t} />
          <div className="absolute left-[4cqw] top-[15cqw] w-[48cqw]">
            <p className="text-[1.2cqw] uppercase tracking-[0.3em]" style={{ color: t.accent }}>
              Small batch · Single origin
            </p>
            <p className="mt-[1.5cqw] text-[8cqw] font-semibold leading-[0.88] tracking-[-0.05em]">{t.headline}</p>
            <div className="mt-[3cqw] flex gap-[1cqw] text-[1.2cqw]">
              <span className="rounded-full px-[1.8cqw] py-[0.8cqw]" style={{ background: t.accent, color: t.bg }}>
                Shop beans
              </span>
              <span className="rounded-full border px-[1.8cqw] py-[0.8cqw]" style={{ borderColor: `${t.ink}44` }}>
                Subscriptions
              </span>
            </div>
          </div>
          <div className="absolute right-[6cqw] top-[10cqw] size-[38cqw] rounded-full" style={{ background: `radial-gradient(circle at 40% 35%, ${t.accent}, ${t.soft} 70%)` }}>
            <div className="absolute inset-[7cqw] rounded-full" style={{ background: t.bg, boxShadow: `inset 0 0 0 1.4cqw ${t.ink}22` }} />
            <div className="absolute inset-[11cqw] rounded-full" style={{ background: `radial-gradient(circle at 45% 40%, #8a5432, ${t.bg})` }} />
          </div>
          <div className="absolute bottom-[3cqw] left-[4cqw] flex gap-[3cqw] text-[1.2cqw] opacity-60">
            <span>Ethiopia</span>
            <span>Colombia</span>
            <span>Karnataka</span>
          </div>
        </div>
      );
    case "estate":
      return (
        <div className="absolute inset-0">
          <div className="absolute inset-[2cqw] overflow-hidden rounded-[1cqw]" style={{ background: `linear-gradient(180deg, ${t.soft}, ${t.bg})` }}>
            <svg viewBox="0 0 100 60" className="absolute bottom-0 right-[6%] h-[90%]" aria-hidden>
              <rect x="30" y="8" width="26" height="52" fill={t.ink} opacity=".85" />
              <rect x="56" y="20" width="18" height="40" fill={t.accent} />
              <rect x="14" y="26" width="16" height="34" fill={t.accent} opacity=".6" />
              {Array.from({ length: 10 }).map((_, r) =>
                [0, 1, 2].map((c) => <rect key={`${r}-${c}`} x={33 + c * 7.5} y={11 + r * 4.8} width="5" height="2.6" fill={t.bg} opacity=".55" />)
              )}
            </svg>
          </div>
          <div className="absolute left-[6cqw] top-[5cqw] text-[1.35cqw] font-semibold tracking-[0.3em]">{t.brand}</div>
          <div className="absolute left-[6cqw] top-[16cqw] w-[44cqw]">
            <p className="text-[7.6cqw] font-light leading-[0.9] tracking-[-0.05em]">{t.headline}</p>
            <p className="mt-[1.8cqw] w-[30cqw] text-[1.3cqw] leading-relaxed opacity-60">Thirty-two residences shaped by light, stone and quiet.</p>
          </div>
          <div className="absolute bottom-[5cqw] left-[6cqw] flex gap-[1.2cqw] rounded-[1cqw] p-[1.4cqw] text-[1.15cqw]" style={{ background: t.bg }}>
            {["3 & 4 BHK", "Rooftop", "2027"].map((s) => (
              <span key={s} className="px-[1cqw]">
                {s}
              </span>
            ))}
            <span className="rounded-full px-[1.4cqw] py-[0.4cqw]" style={{ background: t.ink, color: t.bg }}>
              Book a visit
            </span>
          </div>
        </div>
      );
    case "portfolio":
      return (
        <div className="absolute inset-0 p-[3.5cqw]">
          <div className="flex justify-between text-[1.3cqw]">
            <span className="font-semibold tracking-[0.3em]">{t.brand}</span>
            <span className="opacity-50">Index — Work — Contact</span>
          </div>
          <p className="mt-[3cqw] text-[10cqw] font-semibold leading-[0.85] tracking-[-0.06em]" style={{ color: t.accent }}>
            {t.headline}
          </p>
          <div className="mt-[3cqw] grid grid-cols-6 gap-[1cqw]">
            {["#3a3a3a", "#5e5e5e", "#2b2b2b", "#7a7a7a", "#444", "#666"].map((c, i) => (
              <div key={i} className="relative aspect-[3/4] overflow-hidden rounded-[0.4cqw]" style={{ background: `linear-gradient(${120 + i * 30}deg, ${c}, #1a1a1a)` }}>
                <span className="absolute bottom-[0.6cqw] left-[0.6cqw] font-mono text-[0.9cqw] opacity-60">0{i + 1}</span>
              </div>
            ))}
          </div>
        </div>
      );
    default:
      return (
        <div className="absolute inset-0">
          <div className="absolute -right-[10cqw] -top-[16cqw] size-[60cqw] rounded-full blur-[4cqw]" style={{ background: `radial-gradient(circle, ${t.accent}, #7091E6 45%, transparent 70%)`, opacity: 0.55 }} />
          <div className="absolute -bottom-[20cqw] left-[10cqw] size-[40cqw] rounded-full blur-[5cqw]" style={{ background: t.soft, opacity: 0.9 }} />
          <Nav t={t} />
          <div className="absolute left-[4cqw] top-[15cqw] w-[60cqw]">
            <p className="text-[7cqw] font-medium leading-[0.9] tracking-[-0.05em]">{t.headline}</p>
            <p className="mt-[2cqw] w-[36cqw] text-[1.35cqw] leading-relaxed opacity-60">Infrastructure for the next generation of intelligent hardware.</p>
            <div className="mt-[2.4cqw] flex gap-[1cqw] text-[1.2cqw]">
              <span className="rounded-full px-[1.8cqw] py-[0.8cqw] text-white" style={{ background: t.accent }}>
                Get early access
              </span>
              <span className="rounded-full border px-[1.8cqw] py-[0.8cqw]" style={{ borderColor: `${t.ink}33` }}>
                Read the paper
              </span>
            </div>
          </div>
          <div className="absolute bottom-[3cqw] left-[4cqw] right-[4cqw] flex justify-between text-[1.4cqw] font-semibold opacity-30">
            {["NOVA", "Lumen", "ORBIT", "helix", "Quanta"].map((l) => (
              <span key={l}>{l}</span>
            ))}
          </div>
        </div>
      );
  }
}

/* ───────────── generated mobile layouts ───────────── */
function MobileLayout({ project }: { project: Project }) {
  const t = project.theme;
  const dark = ["saas", "coffee", "portfolio"].includes(t.layout);
  return (
    <div className="absolute inset-0 flex flex-col px-[7cqw] pb-[8cqw] pt-[14cqw]">
      <div className="flex items-center justify-between text-[4.5cqw]">
        <span className="font-semibold tracking-[0.18em]">{t.brand}</span>
        <span className="flex flex-col gap-[1.4cqw]">
          <span className="h-[0.8cqw] w-[6cqw]" style={{ background: t.ink }} />
          <span className="h-[0.8cqw] w-[6cqw]" style={{ background: t.ink }} />
        </span>
      </div>
      <p
        className={cn("mt-[10cqw] leading-[0.9] tracking-[-0.04em]", t.layout === "fashion" ? "font-serif text-[15cqw]" : "text-[14cqw] font-semibold")}
        style={{ color: t.layout === "portfolio" ? t.accent : undefined }}
      >
        {t.headline}
      </p>
      <div
        className="mt-[7cqw] flex-1 rounded-[5cqw]"
        style={{
          background:
            t.layout === "coffee"
              ? `radial-gradient(circle at 50% 45%, #8a5432 0 22%, ${t.bg} 23% 30%, ${t.accent} 31% 45%, ${t.soft} 70%)`
              : `linear-gradient(160deg, ${t.soft}, ${t.accent})`,
          opacity: dark ? 0.9 : 1,
        }}
      />
      <span className="mt-[6cqw] block rounded-full py-[3.5cqw] text-center text-[4.4cqw]" style={{ background: t.accent, color: t.layout === "portfolio" ? t.bg : "#fff" }}>
        {t.layout === "estate" ? "Book a visit" : t.layout === "saas" ? "Start free trial" : "Explore"}
      </span>
    </div>
  );
}
