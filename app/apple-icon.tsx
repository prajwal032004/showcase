import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", background: "#EDE8F5", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <svg width="110" height="110" viewBox="0 0 48 48">
          <rect x="2" y="4" width="44" height="12" rx="1.5" fill="#3D52A0" />
          <rect x="2" y="18" width="30" height="12" rx="1.5" fill="#7091E6" />
          <rect x="2" y="32" width="16" height="12" rx="1.5" fill="#8697C4" />
          <circle cx="39" cy="38" r="6" fill="#3D52A0" />
        </svg>
      </div>
    ),
    size
  );
}
