"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { ScrollTrigger } from "@/lib/gsap";
import * as TX from "./textures";

type Props = {
  ready: boolean;
  triggerRef: React.RefObject<HTMLElement | null>;
  onFail?: () => void;
  brand: string;
};

const COLORS = {
  lav: 0xede8f5,
  deep: 0x3d52a0,
  peri: 0x7091e6,
  muted: 0x8697c4,
  mist: 0xadbdda,
};

// Deterministic pseudo-random so the composition is identical every visit.
const hash = (x: number, y: number) => {
  const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
  return s - Math.floor(s);
};
const easeOut = (t: number) => 1 - Math.pow(1 - Math.min(1, Math.max(0, t)), 4);
const easeBack = (t: number) => {
  t = Math.min(1, Math.max(0, t));
  const c1 = 1.4,
    c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
};

/**
 * A miniature architectural world: stepped lavender platforms with floating
 * website, product and dashboard mockups — inspired by editorial 3D product
 * compositions. Pure three.js, one instanced draw call for the city.
 */
export default function HeroScene({ ready, triggerRef, onFail, brand }: Props) {
  const mountRef = useRef<HTMLDivElement>(null);
  const readyRef = useRef(ready);
  const startIntro = useRef<(() => void) | null>(null);

  useEffect(() => {
    readyRef.current = ready;
    if (ready) startIntro.current?.();
  }, [ready]);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    let disposed = false;
    let cleanup = () => {};

    const init = async () => {
      try {
        await Promise.race([document.fonts?.ready, new Promise((r) => setTimeout(r, 1200))]);
      } catch {}
      if (disposed) return;

      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const coarse = window.matchMedia("(pointer: coarse)").matches;
      let W = mount.clientWidth;
      let H = mount.clientHeight;
      const small = W < 768;

      let renderer: THREE.WebGLRenderer;
      try {
        renderer = new THREE.WebGLRenderer({ antialias: window.devicePixelRatio < 2, alpha: true, powerPreference: "high-performance" });
      } catch {
        onFail?.();
        return;
      }
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, small ? 1.4 : 1.5));
      renderer.setSize(W, H);
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.05;
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFShadowMap;
      renderer.shadowMap.autoUpdate = false;
      renderer.shadowMap.needsUpdate = true;
      renderer.domElement.style.width = "100%";
      renderer.domElement.style.height = "100%";
      renderer.domElement.setAttribute("aria-hidden", "true");
      mount.appendChild(renderer.domElement);
      const maxAniso = renderer.capabilities.getMaxAnisotropy();

      const scene = new THREE.Scene();
      scene.fog = new THREE.Fog(COLORS.lav, 40, 78);

      const pmrem = new THREE.PMREMGenerator(renderer);
      const envTex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
      scene.environment = envTex;
      scene.environmentIntensity = 0.5;

      const camera = new THREE.PerspectiveCamera(26, W / H, 0.1, 200);
      const target = new THREE.Vector3(0, 2.4, -0.5);

      /* ── Lights ── */
      scene.add(new THREE.HemisphereLight(0xffffff, 0xc5cbe8, 1.15));
      const sun = new THREE.DirectionalLight(0xffffff, 2.4);
      sun.position.set(9, 18, 12);
      sun.castShadow = true;
      sun.shadow.mapSize.set(small ? 768 : 1536, small ? 768 : 1536);
      sun.shadow.camera.left = -16;
      sun.shadow.camera.right = 16;
      sun.shadow.camera.top = 16;
      sun.shadow.camera.bottom = -16;
      sun.shadow.camera.far = 60;
      sun.shadow.bias = -0.0005;
      sun.shadow.normalBias = 0.03;
      scene.add(sun);
      const rim = new THREE.DirectionalLight(0x9fb2ff, 0.9);
      rim.position.set(-12, 7, -6);
      scene.add(rim);

      /* ── Ground (shadow catcher) ── */
      const ground = new THREE.Mesh(
        new THREE.PlaneGeometry(220, 220).rotateX(-Math.PI / 2),
        new THREE.ShadowMaterial({ color: COLORS.deep, opacity: 0.12 })
      );
      ground.receiveShadow = true;
      scene.add(ground);

      const world = new THREE.Group();
      scene.add(world);

      /* ── Stepped platforms (instanced) ── */
      const CELL = 1.7;
      const SIZE = 1.6;
      const xr = small ? 4 : 6;
      const zMin = -5,
        zMax = 3;
      type Cell = { ix: number; iz: number; h: number; x: number; z: number; delay: number };
      const cells: Cell[] = [];
      const heights = new Map<string, number>();
      for (let ix = -xr; ix <= xr; ix++) {
        for (let iz = zMin; iz <= zMax; iz++) {
          const n = hash(ix, iz);
          if (n < 0.07 && Math.abs(ix) > 1) continue;
          // Keep the city an "island" so the lavender sky breathes around it
          const radius = Math.hypot((ix - 0.5) * 0.95, (iz + 0.5) * 1.05);
          if (radius > (small ? 4.2 : 4.7) + n * 1.2) continue;
          const back = (zMax - iz) * 0.55;
          const side = -Math.abs(ix - 0.5) * 0.16;
          const raw = 0.35 + back + side + n * 0.95;
          const h = Math.max(0.45, Math.round(raw / 0.45) * 0.45);
          const x = ix * CELL;
          const z = iz * CELL;
          const d = Math.hypot(ix, iz);
          cells.push({ ix, iz, h, x, z, delay: d * 0.045 + n * 0.18 });
          heights.set(`${ix},${iz}`, h);
        }
      }
      const topAt = (ix: number, iz: number) => heights.get(`${ix},${iz}`) ?? 0.45;

      const boxGeo = new RoundedBoxGeometry(1, 1, 1, 3, 0.045);
      const boxMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.82, metalness: 0 });
      const city = new THREE.InstancedMesh(boxGeo, boxMat, cells.length);
      city.castShadow = true;
      city.receiveShadow = true;
      const palette = [0xf4f2fb, 0xeceaf7, 0xe3e6f6, 0xd9dff4];
      const col = new THREE.Color();
      cells.forEach((c, i) => {
        const n = hash(c.ix + 11, c.iz - 7);
        let hex = palette[Math.floor(n * palette.length)];
        if (n > 0.955) hex = COLORS.peri;
        else if (n > 0.93) hex = COLORS.mist;
        else if (n < 0.025) hex = COLORS.deep;
        col.setHex(hex);
        city.setColorAt(i, col);
      });
      world.add(city);

      const m4 = new THREE.Matrix4();
      const q = new THREE.Quaternion();
      const v = new THREE.Vector3();
      const s = new THREE.Vector3();
      const setCity = (t: number) => {
        cells.forEach((c, i) => {
          const k = reduce ? 1 : easeOut((t - c.delay) / 1.3);
          const h = Math.max(0.0001, c.h * k);
          v.set(c.x, h / 2 - (1 - k) * 0.6, c.z);
          s.set(SIZE, h, SIZE);
          m4.compose(v, q, s);
          city.setMatrixAt(i, m4);
        });
        city.instanceMatrix.needsUpdate = true;
      };
      setCity(0);

      /* ── Floating mockups ── */
      type Floater = {
        obj: THREE.Object3D;
        base: THREE.Vector3;
        amp: number;
        speed: number;
        phase: number;
        delay: number;
        depth: number;
        spin?: number;
        size: number;
      };
      const floaters: Floater[] = [];
      const frameMat = new THREE.MeshStandardMaterial({ color: 0xf8f6fc, roughness: 0.35, metalness: 0.05 });

      const makeCard = (tex: THREE.Texture, w: number, h: number) => {
        tex.anisotropy = maxAniso;
        const g = new THREE.Group();
        const frame = new THREE.Mesh(new RoundedBoxGeometry(w + 0.1, h + 0.1, 0.08, 4, 0.05), frameMat);
        frame.castShadow = true;
        const screen = new THREE.Mesh(
          new THREE.PlaneGeometry(w, h),
          new THREE.MeshBasicMaterial({ map: tex, transparent: true, toneMapped: false })
        );
        screen.position.z = 0.042;
        g.add(frame, screen);
        return g;
      };

      const camHome = new THREE.Vector3(21, 16, 30);
      const facing = (x: number, z: number, extra = 0) => Math.atan2(camHome.x - x, camHome.z - z) * 0.8 + extra;

      const place = (
        obj: THREE.Object3D,
        ix: number,
        iz: number,
        lift: number,
        opts: Partial<Omit<Floater, "obj" | "base">> & { yaw?: number } = {}
      ) => {
        const size = opts.size ?? 1.35;
        const x = ix * CELL;
        const z = iz * CELL;
        const y = topAt(ix, iz) + lift * size;
        obj.position.set(x, y, z);
        obj.rotation.y = facing(x, z, opts.yaw ?? 0);
        obj.scale.setScalar(0.0001);
        world.add(obj);
        floaters.push({
          obj,
          base: new THREE.Vector3(x, y, z),
          amp: opts.amp ?? 0.12,
          speed: opts.speed ?? 0.6,
          phase: opts.phase ?? Math.random() * Math.PI * 2,
          delay: opts.delay ?? 1,
          depth: opts.depth ?? 1,
          spin: opts.spin,
          size,
        });
      };

      place(makeCard(TX.browserTexture(brand), 4.3, 2.75), 1, -3, 1.85, { delay: 0.9, amp: 0.1, depth: 0.6 });
      place(makeCard(TX.portraitTexture(), 1.55, 1.9), -1, -1, 1.25, { delay: 1.05, yaw: 0.08, depth: 1.1 });
      place(makeCard(TX.productTexture(), 1.32, 1.8), -1, 2, 1.15, { delay: 1.15, yaw: 0.1, depth: 1.4 });
      if (!small) place(makeCard(TX.phoneTexture(), 0.82, 1.68), 3, 2, 1.1, { delay: 1.25, yaw: -0.15, depth: 1.5 });
      place(makeCard(TX.widgetTexture(), 1.6, 1.03), 2, 0, 1.0, { delay: 1.3, yaw: -0.05, amp: 0.16, depth: 1.2 });
      place(makeCard(TX.codeTexture(), 0.86, 0.64), -4, 0, 1.4, { delay: 1.4, amp: 0.2, speed: 0.8, depth: 1.3 });

      // Tablet on a stand
      {
        const g = new THREE.Group();
        const tablet = makeCard(TX.dashboardTexture(), 2.2, 1.44);
        tablet.rotation.x = -0.32;
        tablet.position.y = 1.05;
        const metal = new THREE.MeshStandardMaterial({ color: 0xc9cfe6, metalness: 0.85, roughness: 0.28 });
        const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.8, 24), metal);
        pole.position.y = 0.4;
        const base = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.48, 0.08, 48), metal);
        base.position.y = 0.04;
        pole.castShadow = base.castShadow = true;
        g.add(tablet, pole, base);
        place(g, small ? 3 : 4, -1, 0, { delay: 1.2, amp: 0, depth: 0.9, yaw: -0.25 });
      }

      // Crystals + sparkle (left)
      const crystalMat = new THREE.MeshPhysicalMaterial({
        color: COLORS.peri,
        metalness: 0.15,
        roughness: 0.08,
        clearcoat: 1,
        clearcoatRoughness: 0.05,
        iridescence: 0.55,
        iridescenceIOR: 1.4,
        envMapIntensity: 1.4,
      });
      const crystal = (scale: number) => {
        const m = new THREE.Mesh(new THREE.OctahedronGeometry(0.45, 0), crystalMat);
        m.scale.set(0.62 * scale, 1.25 * scale, 0.62 * scale);
        m.castShadow = true;
        return m;
      };
      place(crystal(1), small ? -3 : -5, -2, 3.0, { delay: 1.35, amp: 0.25, speed: 0.5, spin: 0.35, depth: 1.6 });
      place(crystal(0.7), small ? -2 : -4, 1, 2.6, { delay: 1.45, amp: 0.2, speed: 0.7, spin: -0.5, depth: 1.8 });
      {
        const star = new THREE.Group();
        const starMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3, metalness: 0.2, envMapIntensity: 1.5 });
        const a = new THREE.Mesh(new THREE.OctahedronGeometry(0.4, 0), starMat);
        a.scale.set(0.22, 1, 0.12);
        const b = a.clone();
        b.rotation.z = Math.PI / 2;
        star.add(a, b);
        place(star, small ? -1 : -3, -4, 2.4, { delay: 1.5, amp: 0.18, speed: 0.9, spin: 0.6, depth: 1.2 });
      }

      // Coin stack with engraved mark (right)
      {
        const g = new THREE.Group();
        const metal = new THREE.MeshStandardMaterial({ color: 0xdfe3f3, metalness: 0.9, roughness: 0.22, envMapIntensity: 1.3 });
        for (let i = 0; i < 6; i++) {
          const c = new THREE.Mesh(new THREE.CylinderGeometry(0.46, 0.46, 0.09, 48), metal);
          c.position.set(Math.sin(i * 2.1) * 0.03, 0.05 + i * 0.095, Math.cos(i * 1.7) * 0.03);
          c.castShadow = true;
          g.add(c);
        }
        const face = TX.markTexture();
        const capMat = new THREE.MeshStandardMaterial({ map: face, metalness: 0.75, roughness: 0.3 });
        const big = new THREE.Mesh(new THREE.CylinderGeometry(0.72, 0.72, 0.12, 64), [metal, capMat, capMat]);
        big.rotation.x = Math.PI / 2;
        big.position.y = 1.55;
        big.castShadow = true;
        big.name = "coin";
        g.add(big);
        place(g, small ? 2 : 3, -4, 0, { delay: 1.3, amp: 0, depth: 0.8 });
      }

      // Spheres echoing the logo mark
      {
        const sphereMat = new THREE.MeshPhysicalMaterial({ color: COLORS.deep, roughness: 0.18, clearcoat: 1, clearcoatRoughness: 0.1 });
        const s1 = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), sphereMat);
        s1.castShadow = true;
        place(s1, 0, 3, 0.5, { delay: 1.55, amp: 0, depth: 1, size: 1.2 });
        const s2 = new THREE.Mesh(
          new THREE.SphereGeometry(0.28, 32, 32),
          new THREE.MeshPhysicalMaterial({ color: COLORS.peri, roughness: 0.2, clearcoat: 1 })
        );
        s2.castShadow = true;
        place(s2, -3, 3, 1.2, { delay: 1.6, amp: 0.15, speed: 0.8, depth: 1.5 });
      }

      /* ── Camera framing (responsive) ── */
      const frame = () => {
        W = mount.clientWidth;
        H = mount.clientHeight;
        const aspect = W / H;
        camera.aspect = aspect;
        const portrait = aspect < 1;
        const dist = portrait ? 1.12 + Math.max(0, aspect - 0.7) * 0.4 : aspect < 1.4 ? 1.2 : 1;
        camHomeScaled.copy(camHome).multiplyScalar(dist);
        const fog = scene.fog as THREE.Fog;
        const d = camHomeScaled.length();
        fog.near = d * 1.0;
        fog.far = d * 1.95;
        if (portrait) camera.setViewOffset(W, H, W * 0.02, 0, W, H);
        else camera.setViewOffset(W, H, -W * (aspect < 1.4 ? 0.14 : 0.24), -H * 0.04, W, H);
        camera.updateProjectionMatrix();
        renderer.setSize(W, H, false);
      };
      const camHomeScaled = new THREE.Vector3();
      frame();

      /* ── Interaction state ── */
      const pointer = { x: 0, y: 0, sx: 0, sy: 0 };
      const onPointer = (e: PointerEvent) => {
        if (e.pointerType !== "mouse") return;
        pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
        pointer.y = (e.clientY / window.innerHeight) * 2 - 1;
      };
      if (!coarse && !reduce) window.addEventListener("pointermove", onPointer, { passive: true });

      let scrollP = 0;
      let scrollS = 0;
      const st =
        !reduce && triggerRef.current
          ? ScrollTrigger.create({
              trigger: triggerRef.current,
              start: "top top",
              end: "bottom top",
              onUpdate: (self) => (scrollP = self.progress),
            })
          : null;

      /* ── Loop ── */
      const timer = new THREE.Timer();
      timer.connect(document);
      const now = () => (timer.update(), timer.getElapsed());
      let introAt = -1;
      let visible = true;
      let raf = 0;
      let needsRender = true;
      startIntro.current = () => {
        if (introAt < 0) introAt = now();
        needsRender = true;
        if (reduce) renderOnce();
      };
      const io = new IntersectionObserver(([e]) => {
        visible = e.isIntersecting;
        if (visible && !raf && !reduce) raf = requestAnimationFrame(tick);
      });
      io.observe(mount);
      const onVis = () => {
        if (!document.hidden && visible && !raf && !reduce) raf = requestAnimationFrame(tick);
      };
      document.addEventListener("visibilitychange", onVis);

      const tmp = new THREE.Vector3();
      let cityDone = false;
      let frameNo = 0;
      const update = (time: number) => {
        const it = introAt < 0 ? 0 : reduce ? 99 : time - introAt;
        if (it < 4) setCity(it);
        else if (!cityDone) {
          setCity(99);
          cityDone = true;
        }

        pointer.sx += (pointer.x - pointer.sx) * 0.045;
        pointer.sy += (pointer.y - pointer.sy) * 0.045;
        scrollS += (scrollP - scrollS) * 0.08;

        // Camera: gentle orbit with pointer, dolly + descend with scroll
        tmp.copy(camHomeScaled);
        const orbit = pointer.sx * 0.06 + scrollS * 0.28;
        const r = Math.hypot(tmp.x, tmp.z);
        const ang = Math.atan2(tmp.x, tmp.z) + orbit;
        const zoom = 1 - scrollS * 0.28;
        camera.position.set(Math.sin(ang) * r * zoom, tmp.y * zoom - pointer.sy * 0.6 - scrollS * 2.2, Math.cos(ang) * r * zoom);
        // Intro: camera eases in from slightly further out
        const ci = reduce ? 1 : easeOut((it - 0.1) / 2.2);
        camera.position.multiplyScalar(1 + (1 - ci) * 0.18);
        camera.lookAt(target.x, target.y + scrollS * 1.2, target.z);

        floaters.forEach((f) => {
          const k = reduce ? 1 : easeBack((it - f.delay) / 1.1);
          f.obj.scale.setScalar(Math.max(0.0001, k * f.size));
          const bob = reduce ? 0 : Math.sin(time * f.speed + f.phase) * f.amp;
          f.obj.position.y = f.base.y + bob + (1 - k) * -0.8 + scrollS * f.depth * 2.4;
          if (f.spin && !reduce) f.obj.rotation.y += f.spin * 0.01;
          const coin = f.obj.getObjectByName("coin");
          if (coin && !reduce) coin.rotation.z = time * 0.6;
        });
      };

      const renderOnce = () => {
        update(now());
        renderer.shadowMap.needsUpdate = true;
        renderer.render(scene, camera);
      };

      const tick = () => {
        raf = 0;
        if (disposed) return;
        if (!visible || document.hidden) return;
        update(now());
        // Shadows only need refreshing at ~30fps once the intro has settled
        frameNo++;
        renderer.shadowMap.needsUpdate = !cityDone || frameNo % 2 === 0;
        renderer.render(scene, camera);
        if (needsRender) {
          needsRender = false;
          mount.dataset.rendered = "true";
        }
        raf = requestAnimationFrame(tick);
      };

      if (reduce) {
        introAt = 0;
        renderOnce();
        mount.dataset.rendered = "true";
      } else {
        raf = requestAnimationFrame(tick);
      }
      if (readyRef.current) startIntro.current();

      const ro = new ResizeObserver(() => {
        frame();
        if (reduce) renderOnce();
      });
      ro.observe(mount);

      cleanup = () => {
        cancelAnimationFrame(raf);
        ro.disconnect();
        io.disconnect();
        st?.kill();
        window.removeEventListener("pointermove", onPointer);
        document.removeEventListener("visibilitychange", onVis);
        scene.traverse((o) => {
          const mesh = o as THREE.Mesh;
          if (mesh.geometry) mesh.geometry.dispose();
          const mats = Array.isArray(mesh.material) ? mesh.material : mesh.material ? [mesh.material] : [];
          mats.forEach((m) => {
            const mm = m as THREE.MeshStandardMaterial;
            mm.map?.dispose();
            m.dispose();
          });
        });
        envTex.dispose();
        pmrem.dispose();
        timer.dispose();
        renderer.dispose();
        renderer.domElement.remove();
      };
    };

    init().catch((e) => {
      console.error("[HeroScene]", e);
      onFail?.();
    });
    return () => {
      disposed = true;
      cleanup();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      ref={mountRef}
      className="absolute inset-0 opacity-0 transition-opacity duration-1000 data-[rendered=true]:opacity-100"
    />
  );
}
