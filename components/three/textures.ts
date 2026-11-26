import * as THREE from "three";

/** Canvas-painted UI screens used as textures for the floating mockups. */

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

function fontFamily() {
  if (typeof window === "undefined") return "sans-serif";
  const v = getComputedStyle(document.documentElement).getPropertyValue("--font-display").trim();
  return v ? `${v}, sans-serif` : "sans-serif";
}

function canvas(w: number, h: number) {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const ctx = c.getContext("2d")!;
  return { c, ctx };
}

function rr(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
}

function finish(c: HTMLCanvasElement, maxAniso = 4) {
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = maxAniso;
  tex.generateMipmaps = true;
  tex.minFilter = THREE.LinearMipmapLinearFilter;
  tex.needsUpdate = true;
  return tex;
}

/** Clip the whole canvas to a rounded rectangle so plane corners are transparent. */
function clipRounded(ctx: CanvasRenderingContext2D, w: number, h: number, r: number) {
  rr(ctx, 0, 0, w, h, r);
  ctx.clip();
}

export function browserTexture(brand: string) {
  const W = 1280,
    H = 820;
  const { c, ctx } = canvas(W, H);
  const f = fontFamily();
  clipRounded(ctx, W, H, 34);
  ctx.fillStyle = C.paper;
  ctx.fillRect(0, 0, W, H);
  // chrome
  ctx.fillStyle = "#ECE9F4";
  ctx.fillRect(0, 0, W, 64);
  ["#ff6159", "#ffbd2e", "#28c941"].forEach((col, i) => {
    ctx.fillStyle = col;
    ctx.globalAlpha = 0.7;
    ctx.beginPath();
    ctx.arc(40 + i * 30, 32, 9, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.globalAlpha = 1;
  ctx.fillStyle = "#fff";
  rr(ctx, 420, 16, 440, 32, 16);
  ctx.fill();
  ctx.fillStyle = C.muted;
  ctx.font = `500 17px ${f}`;
  ctx.textAlign = "center";
  ctx.fillText(`${brand.toLowerCase()}.studio`, 640, 38);
  ctx.textAlign = "left";
  // hero gradient
  const g = ctx.createLinearGradient(0, 64, W, H);
  g.addColorStop(0, "#E9E5F6");
  g.addColorStop(1, "#C9D3F1");
  ctx.fillStyle = g;
  ctx.fillRect(0, 64, W, H - 64);
  // nav
  ctx.fillStyle = C.ink;
  ctx.font = `600 22px ${f}`;
  ctx.fillText(brand.toUpperCase(), 60, 122);
  ctx.font = `400 18px ${f}`;
  ctx.globalAlpha = 0.6;
  ["Work", "Services", "Studio", "Contact"].forEach((t, i) => ctx.fillText(t, 760 + i * 110, 122));
  ctx.globalAlpha = 1;
  // headline
  ctx.fillStyle = C.ink;
  ctx.font = `300 112px ${f}`;
  ctx.fillText("Design that", 60, 300);
  ctx.fillText("performs.", 60, 410);
  ctx.font = `400 22px ${f}`;
  ctx.globalAlpha = 0.6;
  ctx.fillText("Websites crafted with intent — fast, accessible, unforgettable.", 62, 470);
  ctx.globalAlpha = 1;
  // buttons
  ctx.fillStyle = C.deep;
  rr(ctx, 60, 520, 210, 64, 32);
  ctx.fill();
  ctx.fillStyle = C.lav;
  ctx.font = `500 21px ${f}`;
  ctx.fillText("Start a project", 92, 559);
  ctx.strokeStyle = C.ink;
  ctx.globalAlpha = 0.25;
  ctx.lineWidth = 2;
  rr(ctx, 290, 520, 170, 64, 32);
  ctx.stroke();
  ctx.globalAlpha = 1;
  ctx.fillStyle = C.ink;
  ctx.fillText("Our work", 332, 559);
  // stacked blocks illustration
  const blocks = [
    [820, 520, 340, 70, C.deep],
    [880, 450, 280, 70, C.peri],
    [940, 380, 220, 70, C.muted],
    [1000, 310, 160, 70, C.mist],
  ] as const;
  blocks.forEach(([x, y, w, h, col]) => {
    ctx.fillStyle = col;
    rr(ctx, x, y, w, h, 10);
    ctx.fill();
  });
  ctx.fillStyle = C.deep;
  ctx.beginPath();
  ctx.arc(1080, 250, 40, 0, Math.PI * 2);
  ctx.fill();
  // cards row
  for (let i = 0; i < 3; i++) {
    ctx.fillStyle = "rgba(255,255,255,.7)";
    rr(ctx, 60 + i * 300, 650, 280, 130, 18);
    ctx.fill();
    ctx.fillStyle = [C.peri, C.deep, C.muted][i];
    rr(ctx, 82 + i * 300, 672, 48, 48, 12);
    ctx.fill();
    ctx.fillStyle = C.ink;
    ctx.globalAlpha = 0.18;
    rr(ctx, 82 + i * 300, 738, 180, 12, 6);
    ctx.fill();
    ctx.globalAlpha = 1;
  }
  return finish(c);
}

export function productTexture() {
  const W = 600,
    H = 820;
  const { c, ctx } = canvas(W, H);
  const f = fontFamily();
  clipRounded(ctx, W, H, 36);
  const g = ctx.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0, "#F4F2FA");
  g.addColorStop(1, "#DCE2F5");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);
  // product: glossy helmet-like dome
  const cx = 300,
    cy = 320;
  const rg = ctx.createRadialGradient(cx - 70, cy - 90, 20, cx, cy, 200);
  rg.addColorStop(0, "#C9D4FF");
  rg.addColorStop(0.45, C.peri);
  rg.addColorStop(1, C.deep);
  ctx.fillStyle = rg;
  ctx.beginPath();
  ctx.ellipse(cx, cy, 175, 165, 0, Math.PI, 0);
  ctx.lineTo(cx + 175, cy + 40);
  ctx.quadraticCurveTo(cx, cy + 110, cx - 175, cy + 40);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = "rgba(16,20,47,.85)";
  ctx.beginPath();
  ctx.ellipse(cx + 40, cy + 10, 120, 55, -0.08, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "rgba(255,255,255,.35)";
  ctx.beginPath();
  ctx.ellipse(cx - 60, cy - 100, 60, 22, -0.5, 0, Math.PI * 2);
  ctx.fill();
  // shadow
  ctx.fillStyle = "rgba(61,82,160,.18)";
  ctx.beginPath();
  ctx.ellipse(cx, cy + 150, 160, 18, 0, 0, Math.PI * 2);
  ctx.fill();
  // text
  ctx.fillStyle = C.ink;
  ctx.font = `600 30px ${f}`;
  ctx.fillText("Alpine Shell", 48, 620);
  ctx.globalAlpha = 0.55;
  ctx.font = `400 22px ${f}`;
  ctx.fillText("Ultralight · Iris Blue", 48, 658);
  ctx.globalAlpha = 1;
  ctx.fillStyle = C.deep;
  rr(ctx, 48, 700, 504, 72, 36);
  ctx.fill();
  ctx.fillStyle = C.lav;
  ctx.font = `500 24px ${f}`;
  ctx.fillText("Add to cart", 80, 745);
  ctx.textAlign = "right";
  ctx.fillText("₹4,900", 520, 745);
  return finish(c);
}

export function portraitTexture() {
  const W = 620,
    H = 760;
  const { c, ctx } = canvas(W, H);
  const f = fontFamily();
  clipRounded(ctx, W, H, 36);
  const g = ctx.createLinearGradient(0, 0, W, H);
  g.addColorStop(0, C.peri);
  g.addColorStop(1, C.deep);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);
  // abstract presenter silhouette
  ctx.fillStyle = "rgba(237,232,245,.22)";
  ctx.beginPath();
  ctx.arc(310, 300, 110, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(310, 690, 240, 260, 0, Math.PI, 0);
  ctx.fill();
  // play
  ctx.fillStyle = "rgba(237,232,245,.95)";
  ctx.beginPath();
  ctx.arc(310, 420, 54, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = C.deep;
  ctx.beginPath();
  ctx.moveTo(294, 394);
  ctx.lineTo(336, 420);
  ctx.lineTo(294, 446);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = C.lav;
  ctx.font = `500 26px ${f}`;
  ctx.fillText("Studio showreel", 44, 70);
  ctx.globalAlpha = 0.7;
  ctx.font = `400 20px ${f}`;
  ctx.fillText("2026 · 01:24", 44, 104);
  ctx.globalAlpha = 1;
  // progress bar
  ctx.fillStyle = "rgba(237,232,245,.25)";
  rr(ctx, 44, 700, 532, 6, 3);
  ctx.fill();
  ctx.fillStyle = C.lav;
  rr(ctx, 44, 700, 210, 6, 3);
  ctx.fill();
  return finish(c);
}

export function dashboardTexture() {
  const W = 1100,
    H = 720;
  const { c, ctx } = canvas(W, H);
  const f = fontFamily();
  clipRounded(ctx, W, H, 30);
  ctx.fillStyle = C.night;
  ctx.fillRect(0, 0, W, H);
  // sidebar
  ctx.fillStyle = "#171C3E";
  ctx.fillRect(0, 0, 220, H);
  ctx.fillStyle = C.peri;
  rr(ctx, 32, 36, 36, 36, 9);
  ctx.fill();
  for (let i = 0; i < 6; i++) {
    ctx.fillStyle = i === 1 ? "rgba(112,145,230,.35)" : "rgba(237,232,245,.1)";
    rr(ctx, 28, 120 + i * 58, 164, 36, 10);
    ctx.fill();
  }
  ctx.fillStyle = C.lav;
  ctx.font = `500 30px ${f}`;
  ctx.fillText("Overview", 260, 80);
  // stats
  const stats = [
    ["Visitors", "24.8k", "+12%"],
    ["Conversion", "4.6%", "+0.8"],
    ["Load time", "0.9s", "-32%"],
  ];
  stats.forEach(([l, v, d], i) => {
    const x = 260 + i * 270;
    ctx.fillStyle = "rgba(237,232,245,.06)";
    rr(ctx, x, 120, 250, 140, 18);
    ctx.fill();
    ctx.fillStyle = "rgba(237,232,245,.55)";
    ctx.font = `400 19px ${f}`;
    ctx.fillText(l, x + 24, 160);
    ctx.fillStyle = C.lav;
    ctx.font = `500 46px ${f}`;
    ctx.fillText(v, x + 24, 220);
    ctx.fillStyle = C.peri;
    ctx.font = `500 18px ${f}`;
    ctx.fillText(d, x + 170, 220);
  });
  // chart
  ctx.fillStyle = "rgba(237,232,245,.06)";
  rr(ctx, 260, 290, 790, 380, 18);
  ctx.fill();
  const pts = [0.3, 0.42, 0.38, 0.55, 0.5, 0.68, 0.62, 0.8, 0.74, 0.9];
  const gx = (i: number) => 300 + i * 78;
  const gy = (v: number) => 630 - v * 280;
  const grad = ctx.createLinearGradient(0, 330, 0, 640);
  grad.addColorStop(0, "rgba(112,145,230,.55)");
  grad.addColorStop(1, "rgba(112,145,230,0)");
  ctx.beginPath();
  ctx.moveTo(gx(0), gy(pts[0]));
  pts.forEach((p, i) => ctx.lineTo(gx(i), gy(p)));
  ctx.lineTo(gx(pts.length - 1), 640);
  ctx.lineTo(gx(0), 640);
  ctx.closePath();
  ctx.fillStyle = grad;
  ctx.fill();
  ctx.beginPath();
  pts.forEach((p, i) => (i ? ctx.lineTo(gx(i), gy(p)) : ctx.moveTo(gx(i), gy(p))));
  ctx.strokeStyle = C.peri;
  ctx.lineWidth = 5;
  ctx.lineJoin = "round";
  ctx.stroke();
  ctx.fillStyle = C.lav;
  ctx.beginPath();
  ctx.arc(gx(9), gy(pts[9]), 9, 0, Math.PI * 2);
  ctx.fill();
  return finish(c);
}

export function phoneTexture() {
  const W = 420,
    H = 860;
  const { c, ctx } = canvas(W, H);
  const f = fontFamily();
  clipRounded(ctx, W, H, 60);
  ctx.fillStyle = C.paper;
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = C.ink;
  rr(ctx, 150, 22, 120, 30, 15);
  ctx.fill();
  ctx.font = `300 64px ${f}`;
  ctx.fillText("Hello,", 36, 150);
  ctx.fillText("world.", 36, 216);
  const g = ctx.createLinearGradient(0, 260, 0, 620);
  g.addColorStop(0, C.mist);
  g.addColorStop(1, C.peri);
  ctx.fillStyle = g;
  rr(ctx, 36, 260, 348, 360, 28);
  ctx.fill();
  ctx.fillStyle = "rgba(255,255,255,.85)";
  rr(ctx, 60, 520, 200, 70, 18);
  ctx.fill();
  ctx.fillStyle = C.deep;
  ctx.font = `600 24px ${f}`;
  ctx.fillText("98", 80, 566);
  ctx.globalAlpha = 0.6;
  ctx.font = `400 16px ${f}`;
  ctx.fillText("Performance", 122, 563);
  ctx.globalAlpha = 1;
  ctx.fillStyle = C.deep;
  rr(ctx, 36, 660, 348, 76, 38);
  ctx.fill();
  ctx.fillStyle = C.lav;
  ctx.font = `500 24px ${f}`;
  ctx.textAlign = "center";
  ctx.fillText("Get started", 210, 706);
  ctx.fillStyle = C.ink;
  ctx.globalAlpha = 0.25;
  rr(ctx, 150, 820, 120, 8, 4);
  ctx.fill();
  return finish(c);
}

export function widgetTexture() {
  const W = 560,
    H = 360;
  const { c, ctx } = canvas(W, H);
  const f = fontFamily();
  clipRounded(ctx, W, H, 30);
  ctx.fillStyle = C.paper;
  ctx.fillRect(0, 0, W, H);
  const rows = ["Smooth motion", "Dark mode"];
  rows.forEach((r, i) => {
    const y = 70 + i * 90;
    ctx.fillStyle = C.ink;
    ctx.font = `500 26px ${f}`;
    ctx.fillText(r, 40, y + 10);
    ctx.fillStyle = i === 0 ? C.deep : C.mist;
    rr(ctx, 410, y - 22, 104, 50, 25);
    ctx.fill();
    ctx.fillStyle = "#fff";
    ctx.beginPath();
    ctx.arc(i === 0 ? 488 : 436, y + 3, 19, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.fillStyle = "rgba(22,27,63,.12)";
  rr(ctx, 40, 280, 474, 8, 4);
  ctx.fill();
  ctx.fillStyle = C.peri;
  rr(ctx, 40, 280, 300, 8, 4);
  ctx.fill();
  ctx.fillStyle = "#fff";
  ctx.strokeStyle = C.deep;
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(340, 284, 18, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  return finish(c);
}

export function codeTexture() {
  const W = 320,
    H = 240;
  const { c, ctx } = canvas(W, H);
  const f = fontFamily();
  clipRounded(ctx, W, H, 40);
  ctx.fillStyle = C.paper;
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = C.deep;
  ctx.font = `300 120px ${f}`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("</>", W / 2, H / 2 + 4);
  return finish(c);
}

export function markTexture() {
  const S = 512;
  const { c, ctx } = canvas(S, S);
  const g = ctx.createRadialGradient(S * 0.35, S * 0.3, 20, S / 2, S / 2, S * 0.6);
  g.addColorStop(0, "#F1F0F8");
  g.addColorStop(1, "#B9C2DE");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, S, S);
  // engraved logo mark
  ctx.save();
  ctx.translate(S / 2 - 120, S / 2 - 120);
  ctx.scale(5, 5);
  ctx.fillStyle = "rgba(61,82,160,.55)";
  rr(ctx, 2, 4, 44, 12, 1.5);
  ctx.fill();
  rr(ctx, 2, 18, 30, 12, 1.5);
  ctx.fill();
  rr(ctx, 2, 32, 16, 12, 1.5);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(39, 38, 6, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
  return finish(c);
}
