# 02 · Design System

> Source of truth: `reference/css/3invhwi746hi1.css` (117 KB) and `reference/css/369dnnv1i8chc.css`. `design/tokens.css` is the extracted, cleaned token layer.

## 1. Brand concept

**"Deep-space observatory, printed on cream paper."**

The site alternates between two worlds:

1. **The universe** — near-black brown (`#0c0704` / `#0d0805`), starfields, amber signal light, mono HUD telemetry. Used for the hero, services, projects, about, FAQ and footer.
2. **The document** — warm white (`#fff`) with dark brown ink (`#2b1a0d`), used only for the flight-plan process section. This hard light switch is a deliberate palate cleanser in the middle of a very long dark scroll.

Amber (`#f7a224`) is the single accent. Gold (`#e0a864`) is its quieter partner for gradients and hairline glows. Cream (`#fbf0c2`) is the text colour, never pure white.

## 2. Colour

### 2.1 Core palette

| Token | Hex | Role |
|---|---|---|
| `--c-space` | `#0c0704` | Deepest background (hero stage, page canvas) |
| `--c-ink` | `#0d0805` | Panel/overlay background, menu overlay |
| `--c-brown-900` | `#2b1a0d` | Dark ink on light sections, borders |
| `--c-amber` | `#f7a224` | Primary accent: signal, CTAs, active states, focus |
| `--c-gold` | `#e0a864` | Secondary accent: gradients, glows, hairlines |
| `--c-cream` | `#fbf0c2` | Primary text on dark |
| `--header-h` | `58px` | Fixed header height |

Supporting colours observed in the stylesheet: copper `#c47a1f`, muted `#a8692a`, success green `#7bd88f` (used sparingly for "live" status), pure white `#fff` for the light act, pure black for shadows.

### 2.2 Section token sets

Each page/section scopes its own local variables so it can be themed independently. The pattern is `--<prefix>-cream|soft|line|amber|gold` (plus `ink` on light sections).

| Prefix | Scope | Distinct values |
|---|---|---|
| `--jx-*` | Shared reel-card / section chrome | `--jx-acid: #c47a1f` (light) / `#f7a224` (dark); `--jx-ink: #0d0805` / `#fff`; `--jx-white: #fbf0c2` / `#2b1a0d`; `--jx-grey: #fbf0c28c` / `#4a2f1899`; `--jx-dim: #eadfce` / `#3a2a1c`; `--jx-ease: cubic-bezier(.16,1,.3,1)` |
| `--fp-*` | Flight plan (light) | `--fp-ink:#2b1a0d`, `--fp-soft:#2b1a0d99`, `--fp-line:#2b1a0d24`, `--fp-amber:#f7a224`, `--fp-copper:#c47a1f` |
| `--fq-*` | FAQ radio | cream `#fbf0c2`, soft `#fbf0c29e`, line `#fbf0c21f`, amber, gold `#e0a864` |
| `--ft-*` | Footer | cream, soft `#fbf0c299`, line `#fbf0c21f`, amber, gold |
| `--sv-*` | Services | cream, soft `#fbf0c29e`, line `#fbf0c21f`, amber, gold |
| `--ab-*` | About | cream, soft `#fbf0c29e`, line `#fbf0c21f`, amber, gold |
| `--pj-*` | Project detail | cream, soft `#fbf0c29e`, line `#fbf0c224`, amber, gold, `--pj-card:#140c06` |
| `--ct-*` | Contact | cream, soft `#fbf0c29e`, line `#fbf0c224`, amber |

### 2.3 Transparency ladder

On dark surfaces, hierarchy is built with cream at fixed alphas:

| Alpha | Hex suffix | Use |
|---|---|---|
| 100% | `#fbf0c2` | Headings, primary text |
| 62% | `9e` | Body paragraphs |
| 60% | `99` | Footer body |
| 55% | `8c` | Reel-card muted text |
| 12% | `1f` | Hairline borders, dividers |
| 14% | `24` | Slightly stronger borders (light-sensitive sections) |
| 10% | `1a` | Ambient radial glows |
| 4–8% | `0d`/`04` | Panel gradient fills |

### 2.4 Gradients and glows

- Accent text: `linear-gradient(90deg, #f7a224, #e0a864)` clipped to text.
- Section ambience: `radial-gradient(60% 50% at 85% 10%, #f7a2241a, transparent 70%)` plus a copper counter-glow bottom-left.
- Hero star dust: four 1px radial dots at 99%/80%/66%/40% cream alpha.
- Card glow: `0 0 0 1px #e0a8648c, 0 30px 80px #0009, 0 0 60px #f7a2242e`.
- Primary CTA glow: `0 0 24px -4px #f7a224cc`, hover `0 0 40px #f7a224e6`.

## 3. Typography

### 3.1 Families

| Variable | Family | Weights loaded | Role |
|---|---|---|---|
| `--font-display` | Anton | 400 | Uppercase section headlines, giant footer wordmark |
| `--font-jakarta` | Plus Jakarta Sans | 400–800 | Body, nav, UI, home hero title (800, `-0.04em`) |
| `--font-poppins` | Poppins | 300–700 | Secondary/legacy UI blocks |
| `--font-cormorant` | Cormorant Garamond | 300i, 400i | Italic editorial accents (quotes, captions) |
| `--font-mono` | JetBrains Mono | 700 | Eyebrows, counters, coordinates, clocks, HUD |

Fallback stacks always end in `sans-serif` / `monospace`; system stack for body is `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`.

### 3.2 Scale (verified from CSS)

| Element | Size | Line-height | Treatment |
|---|---|---|---|
| Home hero word | `clamp(70px, 9.2vw, 148px)` | `.95`, word box `1.28em` | Jakarta 800, `-0.04em`, centered, 3 masked lines |
| Page hero (services) | `clamp(56px, 7.4vw, 128px)` | `.92` | Anton 400, uppercase |
| Page hero (about) | `clamp(52px, 7vw, 120px)`, mobile `clamp(44px, 12vw, 64px)` | `.95` | Anton 400, uppercase |
| Footer wordmark | `clamp(64px, 19.5vw, 380px)` | `.8` | Anton 400, `-0.01em`, nowrap |
| Section H2 | `clamp(32px, 4.4vw, 64px)` (typical) | `1.02` | Anton or Jakarta 700 depending on act |
| Kicker / eyebrow | `12px` mono, `0.14em`–`0.2em` tracking | 1.4 | Uppercase, amber or soft cream |
| Body | `15–17px` | `1.65` | Jakarta 400, soft cream |
| Small / meta | `11–13px` mono | `1.5` | Uppercase, 0.12–0.18em |
| Stat number | `clamp(40px, 6vw, 88px)` | 1 | Anton, amber gradient optional |

Rules: display type is **always uppercase**; body never is. Numeric telemetry is mono with tabular figures (`font-variant-numeric: tabular-nums`). Never set cream text below 60% alpha for paragraphs.

### 3.3 Measure

Body copy columns cap at `52ch`–`64ch` (hero sub-copy ~`56ch`, project overview ~`72ch`). Section text blocks sit in `min(1180–1280px, 100% - 80px)` containers; on mobile the gutter collapses to 20–24px.

## 4. Layout and spacing

### 4.1 Containers

| Context | Width |
|---|---|
| Wide sections (services hero, footer) | `min(1280px, 100% - 80px)` |
| Editorial/footer inner | `min(1180px, 100% - 80px)` |
| Project detail body | `min(1080px, 100% - 48px)` |
| Narrow copy | `min(720px, 100% - 40px)` |

### 4.2 Vertical rhythm

- Section padding: `clamp(90px, 12vh, 140px)` top, `clamp(80px, 10vh, 120px)` bottom.
- Page top padding under the fixed header: `clamp(130px, 20vh, 190px)`.
- Grid gaps: 24 / 30 / 40 / 56 px steps; card padding 22–28px.
- Sticky panels: hero `100svh`; process `100vh`; hands/manifesto sticky offsets tuned per act.

### 4.3 Radii and borders

| Element | Radius | Border |
|---|---|---|
| Cards / panels | 16–20px | `1px solid` cream @ 12–14% |
| Chips / pills | 999px | `1px solid` cream @ 12% |
| Reel cards | 18px | `0 0 0 1px` gold @ 55% + glow |
| Buttons | 999px | 1px amber/cream; filled variant uses amber background with `#0d0805` text |
| Images | 12–18px | optional 1px hairline |

Shadows are rare and always warm-black (`#0009`), never grey.

## 5. Texture and atmosphere

1. **Star dust** — 1px radial-gradient dots scattered in hero/section pseudo-elements.
2. **Ambient glows** — two large radial gradients per dark section (amber top-right, copper bottom-left) at 8–10% alpha.
3. **Grain** — subtle noise overlay on the universe stage and footer (SVG `feTurbulence` data-URI, `opacity ≤ .06`, `pointer-events:none`).
4. **Scanlines / HUD frame** — 1px rules, corner ticks, `//` separators and mono labels frame the 3D viewport.
5. **Hairline dividers** — every section boundary is 1px cream at 12%; no heavy rules.
6. **Image treatment** — page imagery is warm-toned; project thumbs sit in dark `#140c06` cards with a 1px gold ring.

## 6. Theming model

Use **local custom properties on a wrapper**, mirroring the original:

```css
.sv-page {
  --cream:#fbf0c2; --soft:#fbf0c29e; --line:#fbf0c21f;
  --amber:#f7a224; --gold:#e0a864;
  color: var(--cream); background:#0d0805;
}
```

Implementation options, in order of preference:

1. **Global `tokens.css`** with `:root` core tokens + per-section classes that re-declare their local set (closest to original, least tooling).
2. CSS Modules per section that `@import` the token file and declare local vars on the module root.
3. Tailwind v4 `@theme` mapping the same variables if the team prefers utilities — keep the bespoke motion CSS separate.

**Light act:** `.fp-section` declares `--fp-ink:#2b1a0d` and sets `background:#fff`. All descendants use `var(--fp-ink)` / `var(--fp-soft)`, never hard-coded dark colours, so the inversion is contained.

## 7. Iconography

- Line icons only, 1.5px stroke, `currentColor`, 20/24px box.
- Arrow glyphs are typographic: `→` `↗` `←` `↑` `↓` (never emoji).
- Status dot: 6–8px circle, amber, with `box-shadow` pulse (`kickerPulse`).
- Logo mark: `public/brand/logo-mark.svg` (77 KB vector). Render at 28–32px in the header, full-bleed in the footer wordmark only if performance allows (prefer text wordmark).

## 8. Accessibility rules

| Rule | Implementation |
|---|---|
| Contrast | Cream `#fbf0c2` on `#0d0805` ≈ 15:1; body at 62% alpha still ≥ 7:1. Amber on ink ≈ 8:1. Never amber text below 14px on dark without weight ≥ 600 |
| Focus | `:focus-visible { outline:2px solid #f7a224; outline-offset:3px; border-radius:4px }` — must survive on dark and light acts |
| Motion | `@media (prefers-reduced-motion: reduce)` disables smooth scroll, parallax, pinning and idle loops; reveals become instant opacity-1. 9 such blocks exist in the original |
| Keyboard | Menu overlay traps focus and closes on `Esc`; FAQ stations are a roving-tabindex radio group (`←/→`, `Home/End`); planets are buttons |
| Semantics | One `h1` per page; section `h2`; card `h3`; `<nav aria-label>` for header/footer columns |
| Media | Decorative canvases `aria-hidden="true"`; project images get descriptive alt from the project title |
| Text scaling | Layout must survive 200% zoom at 1440px (acts stack, no clipping) |

## 9. Do / don't

| Do | Don't |
|---|---|
| Keep cream as the text colour, amber as signal | Use pure white text or a second accent hue |
| Let motion be scroll-scrubbed and slow (`1.4s` reveals, `--jx-ease`) | Add bouncy, springy or fast UI motion |
| Use mono for anything numeric or label-like | Set body copy in mono |
| Keep borders at 1px / 12% alpha | Use thick borders or heavy drop shadows |
| Invert to white only for the flight-plan act | Invert other sections |
| Repeat the `//` and `Sector 0X` HUD language | Invent new decorative labels that break the system |
