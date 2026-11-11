# 05 · Motion & 3D

Motion is the product here. The site is a sequence of **scroll-scrubbed acts** with **one global easing curve** and **no bouncy UI animation**. Match the choreography, not just the look.

## 1. Principles

1. **Scroll is the timeline.** Almost everything is a pure function of scroll position, not a time-based entrance. Time-based animation is reserved for idle loops (pulses, marquees, typed text) and hover.
2. **One curve.** `--jx-ease: cubic-bezier(.16,1,.3,1)` (ease-out-expo-ish). Menu uses its own `cubic-bezier(.7,0,.2,1)`.
3. **Slow and heavy.** Section reveals ~1.2–1.4s; no 200ms fades on large elements.
4. **Masked type.** Headlines rise inside `overflow:hidden` boxes (`translateY(100%) → 0`), never simple opacity alone.
5. **Discrete HUD steps.** Counters, sector labels and phase numbers snap in sequence; never interpolate text.
6. **Interruptible.** Every scroll-driven transform must settle to the correct state on resize, refresh mid-page and fast scroll (no one-way triggers that leave content hidden).

## 2. Timing tokens

| Token | Value | Use |
|---|---|---|
| `--jx-ease` | `cubic-bezier(.16,1,.3,1)` | Reveals, transforms, hovers |
| `--menu-ease` | `cubic-bezier(.7,0,.2,1)` | Menu clip-path only |
| `--dur-fast` | `180ms` | Chips, arrows, links |
| `--dur-base` | `320ms` | Buttons, cards |
| `--dur-reveal` | `1.2s` | Section copy/image reveals |
| `--dur-wordmark` | `1.4s` transform / `1.2s` opacity | Footer wordmark rise |
| `--word-cycle` | `7s` | Hero word-cycle loop |
| Marquee | `40s` linear | Discipline marquee (pause on hover) |
| Clock tick | `1000ms` | Karachi clock |

Verified from the original stylesheet: menu `0.8s` closed / `0.9s` open; footer wordmark `1.4s` transform + `1.2s` opacity with `translateY(40%)` start; `dotndev-word-cycle` `7s`; `--word-cycle` default `7s`.

## 3. Scroll infrastructure

```
ScrollProvider
├─ Lenis (smooth wheel, lerp ~0.1, no syncTouch)
├─ rAF loop → publishes global progress + per-act progress
└─ useActProgress(ref) → 0..1 within [start, end] of element vs viewport
```

- **Per-act progress:** `p = clamp((scrollY - top) / (height - viewportH), 0, 1)` for pinned acts; for normal sections use `element.top` vs `innerHeight` with `IntersectionObserver` to gate work.
- **Sticky pattern:** wrapper height = `N × 100vh`; child `position: sticky; top: 0; height: 100svh`. Progress maps to the act timeline. This is exactly how the original does it (`2800vh`, `520vh`, `200vh`, `250vh`, `520vh`).
- **Write to the DOM, not state:** in `rAF`, set CSS custom properties / transforms on refs. Only call `setState` on discrete changes (sector index, active phase, station).
- **Lenis + anchors:** route hash links must use `lenis.scrollTo(target, { offset: -58 })`.
- **Cleanup:** cancel rAF, destroy Lenis/observer/Three renderer on unmount; pause canvases when `document.hidden` or off-screen.

**GSAP alternative:** ScrollTrigger with `scrub: true`, `pin: true`, `anticipatePin: 1` can replace the hand-rolled loop. If used, keep the same act heights and easing so timing matches.

## 4. Act-by-act choreography

### 4.1 Universe (2800vh)

| Progress | Camera / scene | HTML |
|---|---|---|
| 0 → 0.03 | Planet centred low, stars still | Hero fully visible |
| 0.03 → 0.08 | Slow push-in, stars begin drift | Hero copy lifts + fades; HUD intro fades in |
| 0.08 → 0.72 | Nine equal jumps: camera arcs around planet; star streaks between sectors | Sector panels cross-fade (each ≈ 0.071 of range); counter snaps |
| 0.72 → 0.86 | Planet recedes, camera pulls back to wide starfield | Terminal panel fades/rises in |
| 0.86 → 1 | Terminal holds; faint drift | Buttons active; flight bar full |

Sector transition detail (per panel): outgoing `opacity 1→0`, `translateY(0→-60px)`, `filter blur(0→6px)` over the first 25% of its slot; incoming reverses from `+60px`. Planet scales `0.9→1.15→0.95`.

Camera path: define 9 anchor points on an arc around the planet (radius ~6–9 units, y varying −1…+2), interpolate with Catmull-Rom, `lookAt(planet)`. Add subtle mouse parallax (±0.15 rad) lerped at 0.05.

**Starfield:** 3 layers of `Points` (2k / 4k / 8k stars), sizes attenuated, slow rotation; a warp effect via `LineSegments` or stretched sprite trails during sector changes. Cap DPR at `min(devicePixelRatio, 1.5)`; disable trails on low-end.

### 4.2 Hands (520vh)

| Progress | Effect |
|---|---|
| 0 → 0.15 | Section enters, image `scale(1.0)`, `brightness(.5)` |
| 0.15 → 0.55 | Image scales to 1.08, brightness → 1, warm overlay peaks at 0.35 |
| 0.55 → 0.8 | Headline words rise in two lines (stagger 90ms) |
| 0.8 → 1 | Copy lifts, image dims to 0.55 and scales 1.12 as the manifesto overlaps |

The hands PNG is 1:1 with transparency; use `object-fit: contain`, height ~`78vh`, drop-shadow amber at 8%.

### 4.3 Manifesto (200vh, `margin-top:-140vh`)

- Word spans: `opacity: .12`; word `i` reaches 1 when `p > (i / n) * 0.7 + 0.1`. Colour shifts to cream as it activates; the final 3 words may take the amber gradient.
- Principle cards: stagger in at `p > .72`; stats count up once (`09`, `01`, `24h`, `∞` — the last is static).
- Background flips to `#fff` when the act is ≥ 30% through (`abl-show`), with a 0.4s cross-fade. Text switches to `#2b1a0d`.

### 4.4 Marquee box (250vh)

- 0 → 0.35: curtains part (`translateY ±100%`), zipper handle descends.
- 0.35 → 0.7: zipper opens along the seam (clip-path/scaleY), inside content scales `0.94 → 1` and fades in.
- 0.7 → 1: box and ghost marquee drift up; next section peeks.
- Zipper teeth: repeating-linear-gradient strip; the slider is a small amber rounded rect with a 6px ring. Keep it cheap (transform only).

### 4.5 Flight plan (520vh, light)

- Route: SVG `pathLength=1`, trail `stroke-dasharray: 1; stroke-dashoffset: 1-p`.
- Probe position: `path.getPointAtLength(p * totalLength)` (cache length on resize) + a pulsing halo (`fp-pulse`).
- Five phase cards: active when `p ∈ [i/5, (i+1)/5)`; active card `opacity 1, y 0`, others `opacity .35, y 20px`. Counter `T-04 → T+∞`.
- Ticks at the bottom highlight progressively.
- Enter/exit: stage pins for the full 520vh; on exit the white section slides away to reveal the next dark act.

### 4.6 Selected work

- Standard `Reveal` per card (`y: 32px`, `1.2s`, stagger 80ms), thumbnails parallax `translateY(-6%) → 6%` inside their frame.
- Hover: card ring `#e0a864` at 55% → 100%, glow 60px, image `scale(1.04)`, arrow `+4px`.

### 4.7 FAQ radio

- Tuning: on select, needle translates to the station frequency over `0.6s var(--jx-ease)` with a 2-frame static burst (`fq-bars` scaleY .45 loop, 120ms) and a soft click (no audio file — visual only, or a tiny WebAudio tick if desired; keep muted by default).
- Transcript: question fades in; answer types at ~18ms/char with blinking caret (`fq-blink` 1s step-end). Skip typing on reduced motion.
- Idle: signal bars animate at 1.4s; `fq-dot` pulses.

### 4.8 Transition strip + footer

- Marquee rows scroll opposite directions, 40s linear, pause on hover, masked edges.
- Starfield reacts to pointer (radius 120px displacement, lerp 0.08).
- Footer wordmark: on enter, two aligned spans `translateY(40%) → 0` over 1.4s; the lit span is revealed by `radial-gradient(circle 220px at var(--mx) var(--my), …)` following the cursor. On touch, reveal the full lit span at 40% opacity instead.

## 5. Keyframe catalogue (24)

Extracted names and behaviour. Exact definitions live in `reference/css/3invhwi746hi1.css`; re-implement with the same names where convenient.

| Keyframe | Behaviour / use |
|---|---|
| `ab-drop` | About element drop-in (translateY + fade) |
| `ab-fade` | About simple fade |
| `ab-ping` | Radar ping: `scale(1) → scale(14)`, opacity fade |
| `ab-rise` | About copy rise |
| `ab-scroll` | About scroll-cue travel |
| `ab-spin` | Radar sweep rotation (linear, long) |
| `dotndev-word-cycle` | Vertical word carousel: `translateY(-1.28em)` at each 25% step, 7s |
| `fp-pulse` | Process probe halo pulse |
| `fq-bars` | Signal bars scaleY to `.45` |
| `fq-blink` | Caret blink, step-end |
| `ft-blink` | Footer live-dot blink |
| `ft-nudge` | Footer arrow nudge |
| `jx-hook` | Reel card text hook: opacity 0→1 (0–25%), hold, 1→0 (75–100%) |
| `jx-hookbg` | Inverse of `jx-hook` for the background |
| `kickerPulse` | Amber kicker dot pulse (scale + shadow) |
| `mbPulse` | Marquee box breathing |
| `pulseGlow` | CTA/planet glow pulse |
| `scrollBounce` | Scroll cue dot bounce |
| `subtleBounce` | `translateY(6px)` gentle float |
| `sv-counter` | Services counter rotation (full 360°) |
| `sv-counter-rev` | Reverse rotation |
| `sv-fade` | Services fade |
| `sv-rise` | Services rise |
| `sv-spin` | Orbit ring rotation |

Idle loops must be `animation-play-state: paused` when off-screen (IntersectionObserver) to keep CPU/battery sane.

## 6. Micro-interactions

| Element | Hover | Active / focus |
|---|---|---|
| Primary button | amber fill brightens, glow 40px, arrow +4px | scale .98, amber ring |
| Ghost button | border amber, text amber, subtle bg 6% | ring |
| Nav link | label +8px, amber, index dot appears | focus-visible outline |
| Planet | scale 1.18, glow 40px | ring, label tooltip |
| Project card | ring/glow, image 1.04, arrow shift | outline |
| Contact row | bg 6% amber, arrow slide, value cream→amber | outline |
| Chip | border amber, text amber | outline |
| Station | bars animate, label amber | roving focus |
| Filter tab | text amber | active: amber pill with ink text |

No transform on text blocks > 8px; no `transition: all`.

## 7. Reduced motion

`@media (prefers-reduced-motion: reduce)`:

- Disable Lenis smooth scroll (native).
- Collapse pinned wrappers: `.universe-section { height: auto }`, stage `position: relative`, panels stacked with static art; hands/manifesto/process render as normal stacked sections.
- Reveals: `opacity: 1; transform: none` immediately.
- Marquees: static wrapped rows (no animation).
- Radar/universe canvases: render one static frame, no rAF loop.
- Typewriter: render the full answer immediately.
- Zipper: box shown open.
- Preserve all information and links.

Also honour `navigator.connection.saveData` and `prefers-reduced-data`: skip the WebGL canvas and use a CSS poster.

## 8. Performance budget

| Metric | Target |
|---|---|
| JS transferred (route `/`) | ≤ 260 KB gzip (Three.js tree-shaken; no GLTF unless needed) |
| CSS | ≤ 60 KB gzip for the global sheet |
| Fonts | Preload only the 4 critical faces (Jakarta 400/800, Anton 400, JetBrains 700 latin); `font-display: swap`; total ≤ 220 KB |
| LCP | ≤ 2.5s mobile 4G (hero H1 is text — keep it unblocked) |
| CLS | < 0.02 (reserve canvas and image dimensions) |
| Frame | 60fps desktop / ≥ 45fps mid mobile during universe; DPR cap 1.5; pause off-screen |

Techniques: dynamic-import the Three.js scene (`ssr:false`) after first paint; render the static star gradient immediately; avoid layout reads in rAF (cache rects on resize); use `will-change` sparingly and remove after transitions; `content-visibility: auto` on below-fold acts where safe.

## 9. 3D scene specs

### 9.1 Universe

- **Planet:** sphere radius ~2.2, `MeshStandardMaterial` with a dark brown base (`#2b1a0d`), amber emissive rim via a fresnel shader or a slightly larger back-side sphere with additive blending. Optional subtle noise/bump texture (generate procedurally; no asset supplied).
- **Atmosphere:** additive shell `scale 1.06`, opacity 0.25, amber.
- **Rings:** 2–3 thin `RingGeometry` or line circles, tilted, low opacity.
- **Stars:** 3 `Points` layers, `sizeAttenuation`, cream/amber tint, slow rotation.
- **Lighting:** one directional amber key from upper-right, a dim cream fill, ambient 0.15 — no shadows (cost).
- **Camera:** PerspectiveCamera fov 45, positions per sector, `lookAt` planet, mouse parallax lerp.
- **Post:** none required (bloom optional, expensive — prefer additive sprites).
- **Fallback:** if WebGL unavailable, render a CSS radial gradient + 1px stars + the planet as a blurred amber circle.

### 9.2 About radar (2D canvas)

- 3 concentric rings + cross-hairs on `#0d0805`, amber at low alpha.
- Sweep: conic gradient wedge rotating 8s linear.
- Pings: random points inside the outer ring spawn `ab-ping` ripples every 1.2–2.4s (max 6 concurrent).
- Stars: 60 static dots with occasional twinkle.
- DPR-aware, resize observer, pause when off-screen.

### 9.3 Process route (SVG, no canvas)

- One `<path>` drawn as a smooth cubic across the stage, with a dashed base and an amber trail.
- Nodes absolutely positioned at percentage coordinates (T-04 8%/65%, T-03 27%/38%, T-02 48%/62%, T-01 68%/32%, T+∞ 88%/55% — tune to the reference screenshot).
- Probe = `<circle>` + two pulsing halos; move with `getPointAtLength`.
- Cheaper than canvas and crisper on retina; keep it.

## 10. Motion QA

- Scroll to 50%, refresh: all acts must render the correct mid-state, not blank.
- Resize 1440 → 390 mid-scroll: no stuck pins, no clipped text.
- Toggle reduced motion while on the page: loops stop, pinned sections unpin.
- Tab through with the universe visible: focus must not be trapped behind canvases; canvases `aria-hidden`.
- 30 minutes idle on `/`: no memory growth (check `performance.memory` / DevTools), canvases paused when scrolled away.
