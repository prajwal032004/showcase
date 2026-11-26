import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

export const alt = `${site.name} — Website design & development studio`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** 1200×630 social preview: lavender sky, stepped indigo platforms, studio name. */
export default function OgImage() {
  const blocks = [
    { x: 640, y: 400, w: 520, h: 230, c: "#3D52A0" },
    { x: 740, y: 300, w: 420, h: 96, c: "#7091E6" },
    { x: 840, y: 210, w: 320, h: 86, c: "#8697C4" },
    { x: 940, y: 130, w: 220, h: 76, c: "#ADBDDA" },
  ];
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          background: "linear-gradient(160deg, #F4F1FA 0%, #EDE8F5 45%, #D9E0F4 100%)",
          fontFamily: "sans-serif",
        }}
      >
        {blocks.map((b, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: b.x,
              top: b.y,
              width: b.w,
              height: b.h,
              background: b.c,
              borderRadius: 10,
              boxShadow: "0 40px 80px -30px rgba(61,82,160,.55)",
              display: "flex",
            }}
          />
        ))}
        <div style={{ position: "absolute", left: 1040, top: 50, width: 64, height: 64, borderRadius: 999, background: "#3D52A0", display: "flex" }} />
        <div
          style={{
            position: "absolute",
            left: 690,
            top: 190,
            width: 230,
            height: 150,
            borderRadius: 14,
            background: "#F8F6FC",
            boxShadow: "0 30px 60px -20px rgba(22,27,63,.4)",
            display: "flex",
            flexDirection: "column",
            padding: 16,
          }}
        >
          <div style={{ display: "flex", gap: 6 }}>
            <div style={{ width: 8, height: 8, borderRadius: 9, background: "#ADBDDA" }} />
            <div style={{ width: 8, height: 8, borderRadius: 9, background: "#ADBDDA" }} />
            <div style={{ width: 8, height: 8, borderRadius: 9, background: "#ADBDDA" }} />
          </div>
          <div style={{ marginTop: 16, width: 140, height: 12, borderRadius: 9, background: "#161B3F", display: "flex" }} />
          <div style={{ marginTop: 8, width: 100, height: 12, borderRadius: 9, background: "#161B3F", display: "flex" }} />
          <div style={{ marginTop: 16, width: 70, height: 20, borderRadius: 20, background: "#3D52A0", display: "flex" }} />
        </div>
        <div style={{ position: "absolute", left: 72, top: 72, display: "flex", alignItems: "center", gap: 14 }}>
          <svg width="44" height="44" viewBox="0 0 48 48">
            <rect x="2" y="4" width="44" height="12" rx="1.5" fill="#3D52A0" />
            <rect x="2" y="18" width="30" height="12" rx="1.5" fill="#7091E6" />
            <rect x="2" y="32" width="16" height="12" rx="1.5" fill="#8697C4" />
            <circle cx="39" cy="38" r="6" fill="#3D52A0" />
          </svg>
          <div style={{ fontSize: 30, fontWeight: 600, color: "#161B3F", letterSpacing: -1 }}>{site.wordmark}</div>
          <div style={{ fontSize: 14, color: "#161B3F", opacity: 0.55, letterSpacing: 4 }}>{site.wordmarkSuffix}</div>
        </div>
        <div
          style={{
            position: "absolute",
            left: 72,
            top: 210,
            display: "flex",
            flexDirection: "column",
            color: "#161B3F",
            fontSize: 74,
            lineHeight: 1,
            letterSpacing: -3,
            fontWeight: 300,
          }}
        >
          <div style={{ display: "flex" }}>Websites that</div>
          <div style={{ display: "flex" }}>make brands</div>
          <div style={{ display: "flex", color: "#3D52A0" }}>impossible</div>
          <div style={{ display: "flex", color: "#3D52A0" }}>to ignore.</div>
        </div>
        <div style={{ position: "absolute", left: 72, bottom: 56, display: "flex", fontSize: 22, color: "#161B3F", opacity: 0.6 }}>
          Web design &amp; development studio · From ₹15,000
        </div>
      </div>
    ),
    size
  );
}
