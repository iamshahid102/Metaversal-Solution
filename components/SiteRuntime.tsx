"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import type * as ThreeTypes from "three";

/* ------------------------------------------------------------------ */
/* helpers                                                             */
/* ------------------------------------------------------------------ */

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));

function actProgress(el: HTMLElement | null): number {
  if (!el) return 0;
  const total = el.offsetHeight - window.innerHeight;
  const top = el.getBoundingClientRect().top;
  return clamp(-top / Math.max(1, total));
}

/** Runs `fn` on scroll/resize (rAF-throttled) and once immediately. */
function onScroll(fn: () => void): () => void {
  let raf = 0;
  const run = () => {
    raf = 0;
    fn();
  };
  const schedule = () => {
    if (!raf) raf = requestAnimationFrame(run);
  };
  window.addEventListener("scroll", schedule, { passive: true });
  window.addEventListener("resize", schedule);
  fn();
  return () => {
    window.removeEventListener("scroll", schedule);
    window.removeEventListener("resize", schedule);
    if (raf) cancelAnimationFrame(raf);
  };
}

/* ------------------------------------------------------------------ */
/* menu                                                                */
/* ------------------------------------------------------------------ */

function initMenu(): () => void {
  const toggle = document.querySelector<HTMLButtonElement>(".sm-toggle");
  const overlay = document.getElementById("site-menu");
  if (!toggle || !overlay) return () => {};

  const label = toggle.querySelector<HTMLElement>(".sm-toggle-label");

  const setOpen = (open: boolean) => {
    overlay.classList.toggle("is-open", open);
    toggle.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    overlay.setAttribute("aria-hidden", String(!open));
    if (open) overlay.removeAttribute("inert");
    else overlay.setAttribute("inert", "");
    document.body.classList.toggle("menu-open", open);
    if (label) label.textContent = open ? "Close" : "Menu";
  };

  const onClick = () => setOpen(!overlay.classList.contains("is-open"));
  toggle.addEventListener("click", onClick);

  const onKey = (e: KeyboardEvent) => {
    if (e.key === "Escape" && overlay.classList.contains("is-open")) {
      setOpen(false);
      toggle.focus();
    }
  };
  document.addEventListener("keydown", onKey);

  const links = overlay.querySelectorAll<HTMLAnchorElement>("a[href]");
  const close = () => setOpen(false);
  links.forEach((a) => a.addEventListener("click", close));

  return () => {
    toggle.removeEventListener("click", onClick);
    document.removeEventListener("keydown", onKey);
    links.forEach((a) => a.removeEventListener("click", close));
  };
}

/* ------------------------------------------------------------------ */
/* live Karachi clock                                                  */
/* ------------------------------------------------------------------ */

function initClock(): () => void {
  const fmt = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Karachi",
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  const tick = () => {
    const time = fmt.format(new Date());
    const roots = document.querySelectorAll<HTMLElement>(".ft, .ab-page, .fq-live");
    roots.forEach((root) => {
      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
      let node: Node | null;
      while ((node = walker.nextNode())) {
        if (node.nodeValue && node.nodeValue.includes("--:--:--")) {
          node.nodeValue = node.nodeValue.replace("--:--:--", time);
        }
      }
    });
  };

  tick();
  const id = window.setInterval(tick, 1000);
  return () => window.clearInterval(id);
}

/* ------------------------------------------------------------------ */
/* footer                                                              */
/* ------------------------------------------------------------------ */

function initFooter(): () => void {
  const footer = document.querySelector<HTMLElement>(".ft");
  if (!footer) return () => {};
  const mark = footer.querySelector<HTMLElement>(".ft-mark");
  const spans = footer.querySelectorAll<HTMLElement>(".ft-mark span");
  const cleanups: Array<() => void> = [];

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        footer.classList.add("in");
        mark?.classList.add("lit");
        spans.forEach((s) => {
          s.style.opacity = "1";
          s.style.transform = "none";
        });
        io.disconnect();
      });
    },
    { threshold: 0.15 },
  );
  io.observe(footer);
  cleanups.push(() => io.disconnect());

  const onMove = (e: PointerEvent) => {
    if (!mark) return;
    const r = mark.getBoundingClientRect();
    mark.style.setProperty("--mx", `${e.clientX - r.left}px`);
    mark.style.setProperty("--my", `${e.clientY - r.top}px`);
  };
  footer.addEventListener("pointermove", onMove);
  cleanups.push(() => footer.removeEventListener("pointermove", onMove));

  const toTop = footer.querySelectorAll<HTMLElement>("[data-back-to-top], .ft-back");
  const onTop = (e: Event) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  toTop.forEach((b) => b.addEventListener("click", onTop));
  cleanups.push(() => toTop.forEach((b) => b.removeEventListener("click", onTop)));

  return () => cleanups.forEach((fn) => fn());
}

/* ------------------------------------------------------------------ */
/* header palette over the light flight-plan act                      */
/* ------------------------------------------------------------------ */

function initHeaderTheme(): () => void {
  const flight = document.querySelector<HTMLElement>(".fp-section");
  if (!flight) return () => {};
  return onScroll(() => {
    const r = flight.getBoundingClientRect();
    const onLight = r.top < 70 && r.bottom > 70;
    document.body.classList.toggle("sm-on-light", onLight);
  });
}

/* ------------------------------------------------------------------ */
/* generic reveal                                                      */
/* ------------------------------------------------------------------ */

function initReveals(): () => void {
  const targets = document.querySelectorAll<HTMLElement>(".wk-card, .wk-more, .pa-card, .pd2-block, .pd2-stack, .ft-cta");
  if (!targets.length) return () => {};
  targets.forEach((el, i) => {
    if (getComputedStyle(el).opacity !== "0") return;
    el.style.opacity = "0";
    el.style.transform = "translateY(28px)";
    el.style.transition = `opacity 1.2s var(--jx-ease) ${i * 0.06}s, transform 1.2s var(--jx-ease) ${i * 0.06}s`;
  });

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target as HTMLElement;
        el.style.opacity = "1";
        el.style.transform = "none";
        io.unobserve(el);
      });
    },
    { rootMargin: "0px 0px -10% 0px", threshold: 0.08 },
  );
  targets.forEach((el) => io.observe(el));
  return () => io.disconnect();
}

/* ------------------------------------------------------------------ */
/* home · universe (Three.js scene + HUD scrub)                        */
/* ------------------------------------------------------------------ */

function initUniverse(reduced: boolean): () => void {
  const section = document.querySelector<HTMLElement>(".universe-section");
  const canvas = document.getElementById("universe-canvas") as HTMLCanvasElement | null;
  if (!section) return () => {};

  const cards = Array.from(document.querySelectorAll<HTMLElement>(".service-waypoint-card"));
  const hero = document.querySelector<HTMLElement>(".hero-overlay-root");
  const bar = document.querySelector<HTMLElement>(".hud-flight-bar");
  const fill = document.querySelector<HTMLElement>(".hud-bar-progress-fill");
  const stage = section.querySelector<HTMLElement>(".universe-stage");

  cards.forEach((c) => {
    c.style.transition =
      "opacity .55s cubic-bezier(.16,1,.3,1), transform .8s cubic-bezier(.16,1,.3,1), visibility .55s";
    c.style.willChange = "opacity, transform";
  });

  const baseTransform = (card: HTMLElement, scale: number) => {
    if (card.classList.contains("align-center")) return `translate(-50%, -50%) scale(${scale})`;
    return `translateY(-50%) scale(${scale})`;
  };

  let lastSector = -1;

  const update = () => {
    const p = actProgress(section);

    if (hero) {
      const o = 1 - clamp(p / 0.035);
      hero.style.opacity = String(o);
      hero.style.transform = `translateY(${-p * 220}px)`;
      hero.style.visibility = o < 0.02 ? "hidden" : "visible";
      hero.inert = o < 0.02;
    }

    // intro card 0 → nine sectors 1..9 → finale 10
    let active = -1;
    if (p > 0.045 && p < 0.105) active = 0;
    else if (p >= 0.105 && p <= 0.84) {
      active = 1 + Math.min(8, Math.floor(((p - 0.105) / 0.735) * 9));
    } else if (p > 0.84) active = cards.length - 1;

    cards.forEach((card, i) => {
      const on = i === active;
      card.style.opacity = on ? "1" : "0";
      card.style.visibility = on ? "visible" : "hidden";
      card.style.pointerEvents = on ? "auto" : "none";
      card.style.transform = baseTransform(card, on ? 1 : 0.94);
    });

    if (bar) {
      bar.style.opacity = p > 0.03 ? "1" : "0";
      bar.style.pointerEvents = "none";
    }
    if (fill) fill.style.width = `${(p * 100).toFixed(2)}%`;
    if (fill && active >= 1) {
      const label = section.querySelector<HTMLElement>(".hud-bar-label span:last-child");
      const name = cards[active]?.querySelector(".sector-badge")?.textContent?.trim();
      if (label && name && active !== lastSector) {
        label.textContent = name.replace(/\s+/g, " ");
        lastSector = active;
      }
    }
  };

  const stopScroll = onScroll(update);

  if (!canvas || reduced) return stopScroll;

  let disposed = false;
  let stopThree = () => {};

  (async () => {
    try {
      const THREE = await import("three");
      if (disposed) return;

      const renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.6));
      renderer.setClearColor(0x0c0704, 1);

      const scene = new THREE.Scene();
      scene.fog = new THREE.FogExp2(0x0c0704, 0.022);

      const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 200);
      camera.position.set(0, 1.4, 9);

      const resize = () => {
        const w = canvas.clientWidth || window.innerWidth;
        const h = canvas.clientHeight || window.innerHeight;
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
      };
      resize();
      window.addEventListener("resize", resize);

      // planet
      const planetGroup = new THREE.Group();
      const planet = new THREE.Mesh(
        new THREE.SphereGeometry(2.15, 64, 64),
        new THREE.MeshStandardMaterial({
          color: 0x2b1a0d,
          roughness: 0.82,
          metalness: 0.28,
          emissive: 0xf7a224,
          emissiveIntensity: 0.07,
        }),
      );
      planetGroup.add(planet);

      const atmosphere = new THREE.Mesh(
        new THREE.SphereGeometry(2.34, 48, 48),
        new THREE.MeshBasicMaterial({
          color: 0xf7a224,
          transparent: true,
          opacity: 0.13,
          side: THREE.BackSide,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        }),
      );
      planetGroup.add(atmosphere);

      const ring = new THREE.Mesh(
        new THREE.RingGeometry(3.05, 3.09, 160),
        new THREE.MeshBasicMaterial({
          color: 0xe0a864,
          transparent: true,
          opacity: 0.22,
          side: THREE.DoubleSide,
          depthWrite: false,
        }),
      );
      ring.rotation.x = Math.PI / 2.55;
      ring.rotation.z = 0.18;
      planetGroup.add(ring);

      const ring2 = ring.clone();
      ring2.scale.setScalar(1.35);
      (ring2.material as ThreeTypes.MeshBasicMaterial).opacity = 0.1;
      planetGroup.add(ring2);

      scene.add(planetGroup);

      // starfield: three depth layers
      const layers: ThreeTypes.Points[] = [];
      const makeStars = (count: number, radius: number, size: number, opacity: number) => {
        const pos = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
          const r = radius + Math.random() * radius * 0.7;
          const theta = Math.random() * Math.PI * 2;
          const phi = Math.acos(2 * Math.random() - 1);
          pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
          pos[i * 3 + 1] = r * Math.cos(phi) * 0.6;
          pos[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
        }
        const geo = new THREE.BufferGeometry();
        geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
        const mat = new THREE.PointsMaterial({
          color: Math.random() > 0.5 ? 0xfbf0c2 : 0xe0a864,
          size,
          transparent: true,
          opacity,
          depthWrite: false,
          sizeAttenuation: true,
        });
        const points = new THREE.Points(geo, mat);
        scene.add(points);
        layers.push(points);
        return points;
      };
      makeStars(1600, 26, 0.06, 0.75);
      makeStars(2600, 40, 0.09, 0.5);
      makeStars(3200, 58, 0.12, 0.32);

      const key = new THREE.DirectionalLight(0xffcf8a, 2.2);
      key.position.set(5, 6, 4);
      scene.add(key);
      const fillLight = new THREE.DirectionalLight(0x8a5a2a, 0.7);
      fillLight.position.set(-6, -2, -4);
      scene.add(fillLight);
      scene.add(new THREE.AmbientLight(0xffe6bf, 0.16));

      // pointer parallax
      let mx = 0;
      let my = 0;
      let tx = 0;
      let ty = 0;
      const onMove = (e: PointerEvent) => {
        tx = (e.clientX / window.innerWidth - 0.5) * 0.5;
        ty = (e.clientY / window.innerHeight - 0.5) * 0.3;
      };
      window.addEventListener("pointermove", onMove);

      let visible = true;
      const io = new IntersectionObserver((e) => (visible = e[0].isIntersecting), { threshold: 0 });
      io.observe(section);

      canvas.classList.add("is-ready");

      let frame = 0;
      let raf = 0;
      const start = performance.now();

      const loop = () => {
        raf = requestAnimationFrame(loop);
        if (!visible || document.hidden) return;
        frame++;
        mx += (tx - mx) * 0.05;
        my += (ty - my) * 0.05;

        const t = (performance.now() - start) / 1000;
        const p = actProgress(section);
        const angle = -0.4 + p * Math.PI * 2.1;
        const radius = 9.4 - Math.sin(p * Math.PI) * 1.8;
        camera.position.x = Math.sin(angle) * radius + mx * 1.4;
        camera.position.z = Math.cos(angle) * radius;
        camera.position.y = 1.3 + Math.sin(p * Math.PI) * 2.4 - my * 1.2;
        camera.lookAt(0, 0, 0);

        planet.rotation.y = t * 0.04 + p * 2.6;
        planet.rotation.x = Math.sin(t * 0.1) * 0.04;
        planetGroup.rotation.z = Math.sin(t * 0.22) * 0.02 + p * 0.08;
        planetGroup.scale.setScalar(0.94 + Math.sin(p * Math.PI) * 0.12);

        layers.forEach((l, i) => {
          l.rotation.y = t * (0.006 + i * 0.004) + p * 0.12;
          l.rotation.x = Math.sin(t * 0.05 + i) * 0.02;
        });

        renderer.render(scene, camera);
      };
      raf = requestAnimationFrame(loop);

      stopThree = () => {
        cancelAnimationFrame(raf);
        io.disconnect();
        window.removeEventListener("resize", resize);
        window.removeEventListener("pointermove", onMove);
        renderer.dispose();
        scene.traverse((obj) => {
          const mesh = obj as ThreeTypes.Mesh;
          if (mesh.geometry) mesh.geometry.dispose();
          const mat = mesh.material as ThreeTypes.Material | ThreeTypes.Material[] | undefined;
          if (Array.isArray(mat)) mat.forEach((m) => m.dispose());
          else mat?.dispose();
        });
      };
    } catch {
      canvas.classList.add("is-ready");
    }
  })();

  return () => {
    disposed = true;
    stopScroll();
    stopThree();
  };
}

/* ------------------------------------------------------------------ */
/* home · hands canvas                                                 */
/* ------------------------------------------------------------------ */

function initHands(): () => void {
  const section = document.querySelector<HTMLElement>(".hands-section");
  const canvas = document.getElementById("hands-canvas") as HTMLCanvasElement | null;
  const copy = document.getElementById("hands-copy");
  const hint = document.getElementById("hands-hint");
  const white = document.getElementById("hands-white");
  if (!section || !canvas) return () => {};

  const ctx = canvas.getContext("2d");
  if (!ctx) return () => {};

  const img = new Image();
  img.src = "/images/hands-creation-of-adam.png";

  let w = 0;
  let h = 0;
  const resize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = canvas.clientWidth || window.innerWidth;
    h = canvas.clientHeight || window.innerHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };
  resize();
  window.addEventListener("resize", resize);

  const draw = () => {
    const p = actProgress(section);
    const zoom = 1 + p * 0.14;
    const alpha = 0.32 + p * 0.6;
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = "#0d0805";
    ctx.fillRect(0, 0, w, h);

    if (img.complete && img.naturalWidth) {
      const scale = Math.max(w / img.naturalWidth, h / img.naturalHeight) * zoom;
      const dw = img.naturalWidth * scale;
      const dh = img.naturalHeight * scale;
      ctx.globalAlpha = clamp(alpha, 0, 1);
      ctx.drawImage(img, (w - dw) / 2, (h - dh) / 2, dw, dh);
      ctx.globalAlpha = 1;
    }

    const glow = ctx.createRadialGradient(w * 0.5, h * 0.5, 0, w * 0.5, h * 0.5, Math.max(w, h) * 0.55);
    glow.addColorStop(0, `rgba(247,162,36,${0.1 + p * 0.16})`);
    glow.addColorStop(0.55, "rgba(13,8,5,0)");
    glow.addColorStop(1, "rgba(13,8,5,0.92)");
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, w, h);

    if (copy) {
      copy.style.opacity = String(clamp((p - 0.02) / 0.12));
      copy.style.transform = `translateY(${(1 - clamp(p / 0.4)) * 18}px)`;
    }
    if (hint) hint.style.opacity = String(clamp(1 - p / 0.08));
    if (white) white.style.opacity = String(clamp((p - 0.72) / 0.28) * 0.55);
  };

  const stopScroll = onScroll(draw);
  img.addEventListener("load", draw);

  return () => {
    stopScroll();
    window.removeEventListener("resize", resize);
    img.removeEventListener("load", draw);
  };
}

/* ------------------------------------------------------------------ */
/* home · manifesto                                                    */
/* ------------------------------------------------------------------ */

function initManifesto(): () => void {
  const section = document.querySelector<HTMLElement>(".abl-section");
  if (!section) return () => {};
  const values = section.querySelectorAll<HTMLElement>(".abl-value");

  return onScroll(() => {
    const p = actProgress(section);
    const on = p > 0.18;
    section.classList.toggle("abl-show", on);
    values.forEach((v) => {
      v.style.opacity = on ? "1" : "0";
    });
  });
}

/* ------------------------------------------------------------------ */
/* home · zipper marquee box                                           */
/* ------------------------------------------------------------------ */

function initMarqueeBox(): () => void {
  const section = document.querySelector<HTMLElement>(".mb-section");
  if (!section) return () => {};
  const top = section.querySelector<HTMLElement>(".mb-cover--top");
  const bottom = section.querySelector<HTMLElement>(".mb-cover--bottom");
  const chain = section.querySelector<HTMLElement>(".mb-zip-chain");
  const slider = section.querySelector<HTMLElement>(".mb-zip-slider");
  const pull = section.querySelector<HTMLElement>(".mb-pull");
  const inside = section.querySelector<HTMLElement>(".mb-inside");
  const glow = section.querySelector<HTMLElement>(".mb-glow");

  return onScroll(() => {
    const p = actProgress(section);
    const open = clamp((p - 0.1) / 0.55);
    const eased = 1 - Math.pow(1 - open, 3);

    if (top) top.style.transform = `translateY(${-eased * 100}%)`;
    if (bottom) bottom.style.transform = `translateY(${eased * 100}%)`;
    if (chain) chain.style.clipPath = `inset(0 ${100 - eased * 100}% 0 0)`;
    const zip = section.querySelector<HTMLElement>(".mb-zip");
    const maxX = zip && slider ? Math.max(0, zip.clientWidth - slider.offsetWidth) : 0;
    if (slider) slider.style.transform = `translateX(${eased * maxX}px)`;
    if (pull) pull.style.opacity = String(clamp(1 - open * 2.2));
    if (inside) {
      const s = 0.94 + eased * 0.06;
      inside.style.transform = `scale(${s})`;
      inside.style.opacity = String(clamp((open - 0.35) / 0.4));
    }
    if (glow) glow.style.opacity = String(0.35 + eased * 0.65);
  });
}

/* ------------------------------------------------------------------ */
/* home · flight plan                                                  */
/* ------------------------------------------------------------------ */

function initFlightPlan(): () => void {
  const section = document.querySelector<HTMLElement>(".fp-section");
  if (!section) return () => {};
  const trail = section.querySelector<SVGPathElement>(".fp-route-trail");
  const base = section.querySelector<SVGPathElement>(".fp-route-base");
  const probe = section.querySelector<HTMLElement>(".fp-probe");
  const phases = Array.from(section.querySelectorAll<HTMLElement>(".fp-phase"));
  const nodes = Array.from(section.querySelectorAll<HTMLElement>(".fp-node"));
  const ticks = Array.from(section.querySelectorAll<HTMLElement>(".fp-tick"));

  let length = 0;
  if (trail) {
    length = trail.getTotalLength();
    trail.style.strokeDasharray = `${length}`;
    trail.style.strokeDashoffset = `${length}`;
  }
  if (base) base.style.opacity = "0.35";

  return onScroll(() => {
    const p = actProgress(section);
    if (trail && length) trail.style.strokeDashoffset = `${length * (1 - p)}`;
    if (probe && trail && length) {
      const pt = trail.getPointAtLength(length * p);
      probe.setAttribute("transform", `translate(${pt.x} ${pt.y})`);
    }

    const idx = clamp(Math.floor(p * phases.length), 0, phases.length - 1);
    phases.forEach((ph, i) => ph.classList.toggle("on", i === idx && p > 0.02));
    nodes.forEach((n, i) => {
      n.classList.toggle("on", i === idx);
      n.classList.toggle("done", i < idx);
    });
    ticks.forEach((t, i) => t.classList.toggle("on", i <= idx));
  });
}

/* ------------------------------------------------------------------ */
/* home · FAQ radio                                                    */
/* ------------------------------------------------------------------ */

const CHANNELS = [
  {
    freq: 88.4,
    q: "How fast can you start?",
    a: "Usually within a week. After a short discovery call we send a clear scope and timeline within 48 hours, and the first sprint starts as soon as you approve it.",
  },
  {
    freq: 92.7,
    q: "Do you only build with AI?",
    a: "No. AI is one discipline in a nine-part crew. We build cloud platforms, web and mobile products, identity systems and 3D work with the same care — intelligence is added where it genuinely makes the product better, not as a label.",
  },
  {
    freq: 97.1,
    q: "What if we already have a design?",
    a: "Great. We audit it, keep what works and turn it into a production design system. If anything needs tightening for real screens, motion or accessibility, we refine it with you before a line of code is written.",
  },
  {
    freq: 101.5,
    q: "Do you offer ongoing support after launch?",
    a: "Yes. Every launch can move into Orbit: monitoring, maintenance, new features and growth analytics, run by a dedicated pod that already knows your codebase.",
  },
  {
    freq: 106.9,
    q: "How do you price projects?",
    a: "Fixed scope, fixed quote. After a short discovery call we send a written scope, timeline and price within 48 hours. Ongoing work moves to a simple monthly retainer.",
  },
];

function initFaq(): () => void {
  const section = document.querySelector<HTMLElement>(".fq-section");
  if (!section) return () => {};
  const tabs = Array.from(section.querySelectorAll<HTMLButtonElement>(".fq-ch"));
  if (!tabs.length) return () => {};

  const qEl = section.querySelector<HTMLElement>(".fq-q");
  const aEl = section.querySelector<HTMLElement>(".fq-a");
  const live = section.querySelector<HTMLElement>(".fq-live");
  const needle = section.querySelector<HTMLElement>(".fq-needle");

  const select = (index: number) => {
    const ch = CHANNELS[index];
    if (!ch) return;
    tabs.forEach((tab, i) => {
      const on = i === index;
      tab.classList.toggle("on", on);
      tab.setAttribute("aria-selected", String(on));
      tab.tabIndex = on ? 0 : -1;
    });
    if (qEl) qEl.textContent = ch.q;
    const hidden = section.querySelector<HTMLElement>(".fq-msg .visually-hidden");
    if (hidden) hidden.textContent = ch.a;
    if (aEl) {
      const caret = aEl.querySelector(".fq-caret");
      aEl.textContent = ch.a;
      if (caret) aEl.appendChild(caret);
      aEl.style.opacity = "0";
      requestAnimationFrame(() => {
        aEl.style.transition = "opacity .45s var(--jx-ease)";
        aEl.style.opacity = "1";
      });
    }
    if (live) {
      live.innerHTML = `<span class="fq-dot" aria-hidden="true"></span> Incoming transmission · CH 0${index + 1} · ${ch.freq} MHz`;
    }
    if (needle) {
      const pct = ((ch.freq - 88) / (107 - 88)) * 100;
      needle.style.transition = "transform .6s var(--jx-ease)";
      needle.style.left = `${pct}%`;
    }
  };

  const handlers = tabs.map((tab, i) => {
    const fn = () => select(i);
    tab.addEventListener("click", fn);
    return () => tab.removeEventListener("click", fn);
  });

  const onKey = (e: KeyboardEvent) => {
    const current = tabs.findIndex((t) => t.classList.contains("on"));
    if (current < 0) return;
    if (e.key === "ArrowDown" || e.key === "ArrowRight") {
      e.preventDefault();
      const next = (current + 1) % tabs.length;
      tabs[next].focus();
      select(next);
    }
    if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
      e.preventDefault();
      const prev = (current - 1 + tabs.length) % tabs.length;
      tabs[prev].focus();
      select(prev);
    }
  };
  section.addEventListener("keydown", onKey);

  return () => {
    handlers.forEach((fn) => fn());
    section.removeEventListener("keydown", onKey);
  };
}

/* ------------------------------------------------------------------ */
/* home · closing starfield                                            */
/* ------------------------------------------------------------------ */

function initClosing(reduced: boolean): () => void {
  const section = document.querySelector<HTMLElement>(".cl-section");
  const canvas = section?.querySelector<HTMLCanvasElement>(".cl-canvas");
  const sticky = section?.querySelector<HTMLElement>(".cl-sticky");
  const to = section?.querySelector<HTMLElement>(".cl-to");
  const from = section?.querySelector<HTMLElement>(".cl-from");
  if (!section || !canvas) return () => {};

  const ctx = canvas.getContext("2d");
  if (!ctx) return () => {};

  let w = 0;
  let h = 0;
  let dpr = 1;
  const stars: Array<{ x: number; y: number; z: number; r: number }> = [];

  const resize = () => {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = canvas.clientWidth || window.innerWidth;
    h = canvas.clientHeight || window.innerHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (!stars.length) {
      for (let i = 0; i < 420; i++) {
        stars.push({ x: Math.random() * 2 - 1, y: Math.random() * 2 - 1, z: Math.random(), r: Math.random() * 1.4 });
      }
    }
  };
  resize();
  window.addEventListener("resize", resize);

  let px = 0;
  let py = 0;
  let tx = 0;
  let ty = 0;
  const onMove = (e: PointerEvent) => {
    tx = (e.clientX / window.innerWidth - 0.5) * 2;
    ty = (e.clientY / window.innerHeight - 0.5) * 2;
  };
  window.addEventListener("pointermove", onMove);

  let visible = true;
  const io = new IntersectionObserver((e) => (visible = e[0].isIntersecting));
  io.observe(section);

  let raf = 0;
  const draw = () => {
    raf = requestAnimationFrame(draw);
    if (!visible || reduced) return;
    px += (tx - px) * 0.06;
    py += (ty - py) * 0.06;
    const p = actProgress(section);

    ctx.fillStyle = "#0d0805";
    ctx.fillRect(0, 0, w, h);

    const cx = w / 2;
    const cy = h / 2;
    stars.forEach((s) => {
      const depth = 0.3 + s.z;
      const x = cx + (s.x * w * 0.5) / depth - px * 60 * s.z;
      const y = cy + (s.y * h * 0.5) / depth - py * 60 * s.z;
      const a = 0.15 + s.z * 0.65 * (0.6 + p * 0.4);
      ctx.fillStyle = s.z > 0.7 ? `rgba(247,162,36,${a})` : `rgba(251,240,194,${a})`;
      ctx.beginPath();
      ctx.arc(x, y, s.r * (0.5 + s.z), 0, Math.PI * 2);
      ctx.fill();
    });

    if (sticky) sticky.style.setProperty("--cl-m", String(p));
    if (to) to.style.opacity = String(clamp((p - 0.45) / 0.25));
    if (from) from.style.opacity = String(clamp(1 - p / 0.35));
  };
  raf = requestAnimationFrame(draw);

  return () => {
    cancelAnimationFrame(raf);
    io.disconnect();
    window.removeEventListener("resize", resize);
    window.removeEventListener("pointermove", onMove);
  };
}

/* ------------------------------------------------------------------ */
/* about · radar                                                       */
/* ------------------------------------------------------------------ */

function initAboutRadar(): () => void {
  const page = document.querySelector<HTMLElement>(".ab-page");
  if (!page) return () => {};

  const numbers = page.querySelector<HTMLElement>(".ab-numbers");
  const words = page.querySelectorAll<HTMLElement>(".ab-word");
  const cleanups: Array<() => void> = [];

  if (numbers) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          numbers.classList.add("in");
          page.querySelectorAll<HTMLElement>(".ab-num").forEach((el) => {
            const target = Number(el.dataset.value ?? el.textContent?.replace(/\D/g, "")) || 0;
            if (!target) return;
            const start = performance.now();
            const step = () => {
              const p = clamp((performance.now() - start) / 1200);
              el.textContent = String(Math.round(target * (1 - Math.pow(1 - p, 3)))).padStart(2, "0");
              if (p < 1) requestAnimationFrame(step);
            };
            requestAnimationFrame(step);
          });
          io.disconnect();
        });
      },
      { threshold: 0.3 },
    );
    io.observe(numbers);
    cleanups.push(() => io.disconnect());
  }

  const onScrollWords = onScroll(() => {
    const p = actProgress(page.querySelector<HTMLElement>(".ab-manifesto, .ab-words"));
    words.forEach((word, i) => {
      if (p > (i / Math.max(1, words.length)) * 0.7) word.classList.add("on");
    });
  });
  cleanups.push(onScrollWords);

  // hero radar field (the original painted it on the hero canvas)
  const canvas = page.querySelector<HTMLCanvasElement>(".ab-hero-canvas");
  const ctx = canvas?.getContext("2d");
  if (canvas && ctx) {
    let w = 0;
    let h = 0;
    let dpr = 1;
    const pings: Array<{ a: number; r: number; t: number }> = [];
    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth || window.innerWidth;
      h = canvas.clientHeight || window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    let visible = true;
    const vio = new IntersectionObserver((e) => (visible = e[0].isIntersecting));
    vio.observe(canvas);

    let raf = 0;
    let last = 0;
    const draw = (t: number) => {
      raf = requestAnimationFrame(draw);
      if (!visible || document.hidden) return;
      const cx = w * 0.66;
      const cy = h * 0.5;
      const outer = Math.min(w, h) * 0.4;
      ctx.clearRect(0, 0, w, h);

      // stars
      for (let i = 0; i < 70; i++) {
        const x = ((i * 137.5) % 100) / 100 * w;
        const y = ((i * 83.3) % 100) / 100 * h;
        ctx.fillStyle = i % 7 === 0 ? "rgba(247,162,36,.5)" : "rgba(251,240,194,.24)";
        ctx.fillRect(x, y, 1.4, 1.4);
      }

      // rings + crosshair
      for (let i = 1; i <= 3; i++) {
        ctx.beginPath();
        ctx.strokeStyle = `rgba(224,168,100,${0.1 + i * 0.02})`;
        ctx.lineWidth = 1;
        ctx.arc(cx, cy, (outer * i) / 3, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.strokeStyle = "rgba(224,168,100,.12)";
      ctx.beginPath();
      ctx.moveTo(cx - outer, cy);
      ctx.lineTo(cx + outer, cy);
      ctx.moveTo(cx, cy - outer);
      ctx.lineTo(cx, cy + outer);
      ctx.stroke();

      // sweep
      const ang = (t / 1000) * 0.5;
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(ang);
      const wedge = ctx.createLinearGradient(0, 0, outer, 0);
      wedge.addColorStop(0, "rgba(247,162,36,.22)");
      wedge.addColorStop(1, "rgba(247,162,36,0)");
      ctx.fillStyle = wedge;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, outer, -0.34, 0.02);
      ctx.closePath();
      ctx.fill();
      ctx.restore();

      // pings
      if (t - last > 900 + Math.random() * 700 && pings.length < 6) {
        pings.push({ a: Math.random() * Math.PI * 2, r: outer * (0.25 + Math.random() * 0.7), t: t });
        last = t;
      }
      for (let i = pings.length - 1; i >= 0; i--) {
        const ping = pings[i];
        const age = (t - ping.t) / 1600;
        if (age >= 1) {
          pings.splice(i, 1);
          continue;
        }
        const x = cx + Math.cos(ping.a) * ping.r;
        const y = cy + Math.sin(ping.a) * ping.r;
        ctx.beginPath();
        ctx.strokeStyle = `rgba(247,162,36,${(1 - age) * 0.5})`;
        ctx.arc(x, y, 2 + age * 20, 0, Math.PI * 2);
        ctx.stroke();
        ctx.fillStyle = "rgba(224,168,100,.9)";
        ctx.beginPath();
        ctx.arc(x, y, 2, 0, Math.PI * 2);
        ctx.fill();
      }
    };
    raf = requestAnimationFrame(draw);

    cleanups.push(() => {
      cancelAnimationFrame(raf);
      vio.disconnect();
      window.removeEventListener("resize", resize);
    });
  }

  return () => cleanups.forEach((fn) => fn());
}

/* ------------------------------------------------------------------ */
/* services · scroll spy                                               */
/* ------------------------------------------------------------------ */

function initServices(): () => void {
  const panels = Array.from(document.querySelectorAll<HTMLElement>(".sv-panel"));
  if (!panels.length) return () => {};
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => e.target.classList.toggle("is-on", e.isIntersecting));
    },
    { threshold: 0.35 },
  );
  panels.forEach((p) => io.observe(p));
  return () => io.disconnect();
}

/* ------------------------------------------------------------------ */
/* projects · filters                                                  */
/* ------------------------------------------------------------------ */

function initProjects(): () => void {
  const input = document.querySelector<HTMLInputElement>(".pa-search input, input[type='search']");
  const cards = Array.from(document.querySelectorAll<HTMLElement>(".pa-card"));
  if (!cards.length) return () => {};

  const tabs = Array.from(document.querySelectorAll<HTMLButtonElement>(".pa-filters button"));
  const count = document.querySelector<HTMLElement>(".pa-count");
  const cleanups: Array<() => void> = [];
  let group = "ALL";

  const groupOf = (card: HTMLElement): string => {
    const meta = (card.querySelector(".pa-meta")?.textContent ?? "").toLowerCase();
    if (/ai|ml|machine|fraud/.test(meta)) return "AI & ML";
    if (/devops|cloud/.test(meta)) return "CLOUD & DEVOPS";
    if (/commerce|portfolio|website|platform|cms/.test(meta)) return "WEBSITES";
    return "WEBSITES";
  };

  const apply = () => {
    const q = (input?.value ?? "").trim().toLowerCase();
    let shown = 0;
    cards.forEach((card) => {
      const inGroup = group === "ALL" || groupOf(card) === group;
      const inQuery = !q || (card.textContent ?? "").toLowerCase().includes(q);
      const match = inGroup && inQuery;
      card.style.display = match ? "" : "none";
      if (match) shown++;
    });
    if (count) count.textContent = `${String(shown).padStart(2, "0")} PROJECTS`;
  };

  const tabHandlers = tabs.map((tab, i) => {
    const fn = () => {
      group = tab.textContent?.trim().toUpperCase() ?? "ALL";
      tabs.forEach((t, j) => {
        t.classList.toggle("is-on", i === j);
        t.setAttribute("aria-pressed", String(i === j));
      });
      apply();
    };
    tab.addEventListener("click", fn);
    return () => tab.removeEventListener("click", fn);
  });
  cleanups.push(() => tabHandlers.forEach((fn) => fn()));

  if (input) {
    const fn = () => apply();
    input.addEventListener("input", fn);
    cleanups.push(() => input.removeEventListener("input", fn));
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        input.value = "";
        apply();
      }
    };
    input.addEventListener("keydown", onKey);
    cleanups.push(() => input.removeEventListener("keydown", onKey));
  }

  apply();
  return () => cleanups.forEach((fn) => fn());
}

/* ------------------------------------------------------------------ */
/* root                                                                */
/* ------------------------------------------------------------------ */

export default function SiteRuntime() {
  const pathname = usePathname();

  useEffect(() => {
    const cleanups: Array<() => void> = [];
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    cleanups.push(initMenu());
    cleanups.push(initClock());
    cleanups.push(initFooter());
    cleanups.push(initHeaderTheme());
    cleanups.push(initReveals());
    cleanups.push(initFaq());
    cleanups.push(initAboutRadar());
    cleanups.push(initServices());
    cleanups.push(initProjects());

    if (document.querySelector(".universe-section")) {
      cleanups.push(initUniverse(reduced));
      cleanups.push(initHands());
      cleanups.push(initManifesto());
      cleanups.push(initMarqueeBox());
      cleanups.push(initFlightPlan());
      cleanups.push(initClosing(reduced));
    }

    return () => cleanups.forEach((fn) => fn());
  }, [pathname]);

  return null;
}
