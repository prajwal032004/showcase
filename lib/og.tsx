import { ImageResponse } from "next/og";
import { site, pricing } from "@/lib/site";
import { projects, type Project } from "@/lib/projects";
import { founders } from "@/lib/founders";

/**
 * ─────────────────────────────────────────────────────────────
 *  Social preview (Open Graph) images — 1200 × 630.
 *  One shared layout, a unique illustration per page.
 * ─────────────────────────────────────────────────────────────
 */
export const ogSize = { width: 1200, height: 630 };
export const ogContentType = "image/png";

const C = {
  deep: "#3D52A0",
  peri: "#7091E6",
  muted: "#8697C4",
  mist: "#ADBDDA",
  lav: "#EDE8F5",
  paper: "#F8F6FC",
  ink: "#161B3F",
  night: "#10142F",
};

export type OgVariant = "home" | "about" | "services" | "showcase" | "contact" | "legal" | "project";

type OgProps = {
  eyebrow: string;
  title: string[];
  /** index of the title line rendered in indigo */
  accent?: number;
  subtitle: string;
  variant: OgVariant;
  project?: Project;
  dark?: boolean;
};

const domain = site.url.replace(/^https?:\/\//, "").replace(/^www\./, "");

function Mark({ size = 40, light = false }: { size?: number; light?: boolean }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48">
      <rect x="2" y="4" width="44" height="12" rx="2" fill={light ? C.lav : C.deep} />
      <rect x="2" y="18" width="30" height="12" rx="2" fill={light ? C.mist : C.peri} />
      <rect x="2" y="32" width="16" height="12" rx="2" fill={C.muted} />
      <circle cx="39" cy="38" r="6" fill={light ? C.lav : C.deep} />
    </svg>
  );
}

function Browser({ w, h, bg, ink, accent, soft, headline, brand }: { w: number; h: number; bg: string; ink: string; accent: string; soft: string; headline: string; brand: string }) {
  return (
    <div
      style={{
        width: w,
        height: h,
        display: "flex",
        flexDirection: "column",
        borderRadius: 18,
        overflow: "hidden",
        background: C.paper,
        boxShadow: "0 40px 80px -30px rgba(22,27,63,.55)",
      }}
    >
      <div style={{ height: 26, display: "flex", alignItems: "center", gap: 6, padding: "0 12px", background: "#ECE9F4" }}>
        <div style={{ width: 8, height: 8, borderRadius: 9, background: "#ff6159", opacity: 0.7 }} />
        <div style={{ width: 8, height: 8, borderRadius: 9, background: "#ffbd2e", opacity: 0.7 }} />
        <div style={{ width: 8, height: 8, borderRadius: 9, background: "#28c941", opacity: 0.7 }} />
      </div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", background: bg, color: ink, padding: w * 0.06, position: "relative" }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: w * 0.03, letterSpacing: 2, fontWeight: 600 }}>
          <span>{brand}</span>
          <div style={{ display: "flex", padding: "3px 10px", borderRadius: 20, background: accent, color: bg, fontSize: w * 0.025 }}>Contact</div>
        </div>
        <div style={{ display: "flex", marginTop: h * 0.12, fontSize: w * 0.085, lineHeight: 1, letterSpacing: -2, maxWidth: w * 0.55 }}>{headline}</div>
        <div style={{ display: "flex", marginTop: 14, width: w * 0.18, height: h * 0.07, borderRadius: 20, background: accent }} />
        <div
          style={{
            position: "absolute",
            right: w * 0.06,
            bottom: 0,
            width: w * 0.34,
            height: h * 0.62,
            borderTopLeftRadius: w * 0.17,
            borderTopRightRadius: w * 0.17,
            background: `linear-gradient(160deg, ${soft}, ${accent})`,
            display: "flex",
          }}
        />
      </div>
    </div>
  );
}

function Art({ variant, project }: { variant: OgVariant; project?: Project }) {
  if (variant === "home") {
    const blocks = [
      { x: 40, y: 300, w: 470, h: 200, c: C.deep },
      { x: 130, y: 210, w: 380, h: 84, c: C.peri },
      { x: 220, y: 130, w: 290, h: 74, c: C.muted },
      { x: 310, y: 60, w: 200, h: 64, c: C.mist },
    ];
    return (
      <div style={{ position: "relative", width: 520, height: 520, display: "flex" }}>
        {blocks.map((b, i) => (
          <div key={i} style={{ position: "absolute", left: b.x, top: b.y, width: b.w, height: b.h, background: b.c, borderRadius: 12, boxShadow: "0 40px 80px -30px rgba(61,82,160,.55)", display: "flex" }} />
        ))}
        <div style={{ position: "absolute", left: 400, top: 0, width: 56, height: 56, borderRadius: 99, background: C.deep, display: "flex" }} />
        <div style={{ position: "absolute", left: 0, top: 150, display: "flex" }}>
          <Browser w={250} h={170} bg="#E9E5F6" ink={C.ink} accent={C.deep} soft={C.mist} headline="Design that performs." brand="FORMA" />
        </div>
      </div>
    );
  }
  if (variant === "about") {
    return (
      <div style={{ width: 500, height: 470, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", position: "relative" }}>
        <div style={{ position: "absolute", width: 440, height: 440, borderRadius: 999, background: "radial-gradient(circle, rgba(112,145,230,.35), rgba(112,145,230,0) 70%)", display: "flex" }} />
        <div style={{ display: "flex" }}>
          {founders.map((f, i) => (
            <div
              key={f.name}
              style={{
                width: 190,
                height: 190,
                borderRadius: 999,
                marginLeft: i ? -36 : 0,
                border: `8px solid ${C.lav}`,
                background: i ? `linear-gradient(150deg, ${C.peri}, ${C.deep})` : `linear-gradient(150deg, ${C.mist}, ${C.peri})`,
                color: C.lav,
                fontSize: 70,
                fontWeight: 300,
                letterSpacing: -3,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 30px 60px -20px rgba(22,27,63,.45)",
              }}
            >
              {f.initials}
            </div>
          ))}
        </div>
        <div style={{ marginTop: 28, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
          {founders.map((f) => (
            <div key={f.name} style={{ display: "flex", fontSize: 26, color: C.ink }}>
              {f.name}
            </div>
          ))}
          <div style={{ display: "flex", marginTop: 6, fontSize: 18, color: C.deep, letterSpacing: 3 }}>CO-FOUNDERS</div>
        </div>
      </div>
    );
  }
  if (variant === "services") {
    const total = pricing.breakdown.reduce((s, b) => s + b.amount, 0);
    return (
      <div style={{ width: 470, display: "flex", flexDirection: "column", borderRadius: 28, background: C.deep, color: C.lav, padding: 36, boxShadow: "0 40px 90px -30px rgba(61,82,160,.7)" }}>
        <div style={{ display: "flex", fontSize: 18, letterSpacing: 3, opacity: 0.7 }}>WEBSITES FROM</div>
        <div style={{ display: "flex", fontSize: 96, fontWeight: 200, letterSpacing: -5, lineHeight: 1.05 }}>{pricing.startingPriceLabel}</div>
        <div style={{ display: "flex", marginTop: 18, height: 22, borderRadius: 12, overflow: "hidden" }}>
          {pricing.breakdown.map((b) => (
            <div key={b.id} style={{ display: "flex", width: `${(b.amount / total) * 100}%`, height: "100%", background: b.id === "launch" ? C.lav : b.color }} />
          ))}
        </div>
        <div style={{ display: "flex", flexDirection: "column", marginTop: 22, gap: 10 }}>
          {pricing.breakdown.slice(1, 5).map((b) => (
            <div key={b.id} style={{ display: "flex", justifyContent: "space-between", fontSize: 21, opacity: 0.9 }}>
              <span>{b.label.replace(" & GoDaddy guidance", "").replace(" (up to ~5 pages)", "")}</span>
              <span>₹{b.amount.toLocaleString("en-IN")}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  if (variant === "showcase") {
    const list = projects.slice(0, 4);
    return (
      <div style={{ width: 520, display: "flex", flexWrap: "wrap", gap: 18 }}>
        {list.map((p, i) => (
          <div key={p.slug} style={{ display: "flex", flexDirection: "column", marginTop: i % 2 ? 36 : 0 }}>
            <Browser w={250} h={170} bg={p.theme.bg} ink={p.theme.ink} accent={p.theme.accent} soft={p.theme.soft} headline={p.theme.headline} brand={p.theme.brand} />
            <div style={{ display: "flex", marginTop: 8, fontSize: 18, color: C.ink }}>
              {p.title}
              {!p.concept ? <span style={{ marginLeft: 8, color: "#1f9d6b" }}>● Live</span> : null}
            </div>
          </div>
        ))}
      </div>
    );
  }
  if (variant === "contact") {
    return (
      <div style={{ width: 480, display: "flex", flexDirection: "column", gap: 16 }}>
        <div style={{ display: "flex", alignSelf: "flex-end", maxWidth: 380, padding: "18px 22px", borderRadius: 24, borderBottomRightRadius: 6, background: C.deep, color: C.lav, fontSize: 24 }}>
          We need a website for our café with a menu and bookings.
        </div>
        <div style={{ display: "flex", flexDirection: "column", maxWidth: 420, padding: "18px 22px", borderRadius: 24, borderBottomLeftRadius: 6, background: C.paper, color: C.ink, fontSize: 22, boxShadow: "0 20px 50px -25px rgba(22,27,63,.4)" }}>
          <span style={{ display: "flex" }}>Here&apos;s your instant estimate</span>
          <span style={{ display: "flex", marginTop: 8, fontSize: 34, color: C.deep }}>₹23,000 – ₹34,000</span>
          <span style={{ display: "flex", marginTop: 4, fontSize: 18, color: C.muted }}>3–4 weeks · 7 pages</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 8 }}>
          <div style={{ display: "flex", padding: "16px 28px", borderRadius: 40, background: C.lav, color: C.deep, fontSize: 22, whiteSpace: "nowrap" }}>Start a project</div>
          <div style={{ display: "flex", fontSize: 19, color: C.lav, opacity: 0.75 }}>{site.email}</div>
        </div>
      </div>
    );
  }
  if (variant === "legal") {
    return (
      <div style={{ width: 400, height: 470, display: "flex", flexDirection: "column", borderRadius: 26, background: C.paper, padding: 40, boxShadow: "0 40px 90px -30px rgba(22,27,63,.45)" }}>
        <Mark size={44} />
        {[90, 70, 84, 60, 78, 50, 88, 66].map((w, i) => (
          <div key={i} style={{ display: "flex", marginTop: i === 0 ? 34 : 16, width: `${w}%`, height: i % 4 === 0 ? 16 : 10, borderRadius: 8, background: i % 4 === 0 ? C.ink : C.mist }} />
        ))}
        <div style={{ display: "flex", marginTop: "auto", alignSelf: "flex-start", padding: "8px 16px", borderRadius: 20, background: "rgba(61,82,160,.1)", color: C.deep, fontSize: 18 }}>Plain-language draft</div>
      </div>
    );
  }
  // project
  const p = project!;
  return (
    <div style={{ display: "flex", position: "relative", width: 560, height: 470 }}>
      <div style={{ position: "absolute", top: 30, left: 0, display: "flex" }}>
        <Browser w={520} h={340} bg={p.theme.bg} ink={p.theme.ink} accent={p.theme.accent} soft={p.theme.soft} headline={p.theme.headline} brand={p.theme.brand} />
      </div>
      <div
        style={{
          position: "absolute",
          right: 0,
          bottom: 0,
          width: 130,
          height: 270,
          borderRadius: 26,
          background: C.ink,
          padding: 7,
          display: "flex",
          boxShadow: "0 30px 60px -20px rgba(22,27,63,.6)",
        }}
      >
        <div style={{ flex: 1, borderRadius: 20, background: `linear-gradient(170deg, ${p.theme.bg} 40%, ${p.theme.accent})`, display: "flex" }} />
      </div>
    </div>
  );
}

export function renderOg({ eyebrow, title, accent, subtitle, variant, project, dark = false }: OgProps) {
  const fg = dark ? C.lav : C.ink;
  const titleSize = Math.max(...title.map((t) => t.length)) > 16 ? 62 : 74;
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          background: dark
            ? `linear-gradient(150deg, ${C.night} 0%, #1B2457 60%, ${C.deep} 100%)`
            : "linear-gradient(160deg, #F6F3FB 0%, #EDE8F5 45%, #D9E0F4 100%)",
          fontFamily: "sans-serif",
          color: fg,
        }}
      >
        {/* soft grid + glow */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            backgroundImage: `linear-gradient(to right, rgba(61,82,160,${dark ? 0.12 : 0.06}) 1px, transparent 1px), linear-gradient(to bottom, rgba(61,82,160,${dark ? 0.12 : 0.06}) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />
        <div style={{ position: "absolute", right: -120, top: -160, width: 620, height: 620, borderRadius: 999, background: "radial-gradient(circle, rgba(112,145,230,.35), rgba(112,145,230,0) 70%)", display: "flex" }} />

        {/* Left: copy */}
        <div style={{ position: "relative", display: "flex", flexDirection: "column", width: 640, padding: "60px 0 56px 72px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <Mark size={40} light={dark} />
            <div style={{ display: "flex", fontSize: 28, fontWeight: 600, letterSpacing: -1 }}>{site.wordmark}</div>
            <div style={{ display: "flex", fontSize: 13, letterSpacing: 4, opacity: 0.55 }}>{site.wordmarkSuffix}</div>
          </div>

          <div
            style={{
              display: "flex",
              alignSelf: "flex-start",
              marginTop: 44,
              padding: "8px 18px",
              borderRadius: 30,
              fontSize: 17,
              letterSpacing: 3,
              color: dark ? C.lav : C.deep,
              background: dark ? "rgba(237,232,245,.12)" : "rgba(61,82,160,.09)",
            }}
          >
            {eyebrow.toUpperCase()}
          </div>

          <div style={{ display: "flex", flexDirection: "column", marginTop: 22, fontSize: titleSize, lineHeight: 1.02, letterSpacing: -3, fontWeight: 300 }}>
            {title.map((l, i) => (
              <div key={i} style={{ display: "flex", color: i === accent ? (dark ? C.peri : C.deep) : fg }}>
                {l}
              </div>
            ))}
          </div>

          <div style={{ display: "flex", marginTop: 22, fontSize: 23, lineHeight: 1.4, opacity: 0.68, maxWidth: 540 }}>{subtitle}</div>

          <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: "auto", fontSize: 19, opacity: 0.75 }}>
            <span style={{ display: "flex" }}>{domain}</span>
            <span style={{ display: "flex", width: 6, height: 6, borderRadius: 9, background: dark ? C.peri : C.deep }} />
            <span style={{ display: "flex" }}>Websites from {pricing.startingPriceLabel}</span>
          </div>
        </div>

        {/* Right: illustration */}
        <div style={{ position: "relative", flex: 1, display: "flex", alignItems: "center", justifyContent: "center", paddingRight: 40 }}>
          <Art variant={variant} project={project} />
        </div>
      </div>
    ),
    ogSize
  );
}
