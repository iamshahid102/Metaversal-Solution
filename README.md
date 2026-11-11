# Metaversal Solutions — Clone Kit

A complete, build-ready reconstruction plan for **https://metaversalsolution.com**, plus every asset the site uses (fonts, logo, page imagery, project imagery), the original markup/CSS/JS for reference, and a verbatim copy deck.

It now serves the site's **current production build** from inside a Next.js app, so its typography, palette, menu, scroll animations and WebGL universe are the original code rather than a reimplementation.

---

## 1. What the site is

| | |
|---|---|
| Brand | Metaversal Solutions — "AI-first software & digital innovation studio" |
| Location | Karachi, Pakistan (24.8607° N · 67.0011° E) |
| Positioning | One crew, end to end: strategy → design → engineering → launch → support |
| Services | 9 disciplines (cloud data, DevOps, web, app, UI/UX, graphic, Blender, data science, ML) |
| Tone | Deep-space observatory meets editorial print: near-black brown canvas, cream type, amber/gold signal colour, mono HUD labels, oversized display type |
| Stack (original) | Next.js App Router, self-hosted `next/font`, one 117 KB global stylesheet, scroll-driven Three.js/WebGL scenes |
| Pages | 12 public routes + one hidden `/universe/` experience (disallowed in robots.txt) |
| Year in copy | 2026 |

**Design signature in one line:** a 2800vh scroll-driven 3D "universe" hero that flies the visitor through nine service sectors, followed by sticky editorial acts (hands, manifesto, process flight-plan, radio-dial FAQ) on a `#0c0704` / `#fbf0c2` / `#f7a224` palette with Anton display type.

---

## 2. Folder map

```
Metaversal-Solution/
├── README.md                     ← you are here
├── app/                          Next.js App Router routes + ported stylesheet
├── components/SiteRuntime.tsx    menu, clock, scroll acts, FAQ, Three.js universe
├── content/pages/                captured DOM per route (injected at build)
├── lib/page.ts                   page-markup loader
├── docs/
│   ├── 01-project-brief.md        scope, goals, constraints, definition of done
│   ├── 02-design-system.md        colour, type, spacing, tokens, texture, theming
│   ├── 03-page-specs.md           every route, section by section, with copy and states
│   ├── 04-components.md           component inventory, props, variants, class map
│   ├── 05-motion-and-3d.md        scroll choreography, keyframes, easing, WebGL scenes
│   ├── 06-asset-inventory.md      every downloaded file, source URL, usage
│   ├── 07-build-plan.md           Next.js structure, phases, data model, SEO, forms
│   ├── 08-qa-launch-checklist.md  breakpoints, a11y, performance, acceptance tests
│   └── 09-content-copy.md         verbatim visible copy for all 12 pages
├── design/
│   ├── tokens.css                 the design tokens, ready to import
│   └── fonts.css                  @font-face map using /fonts/*.woff2 (absolute paths)
├── public/                        ← drop-in Next.js public directory
│   ├── brand/                     logo-512.png, logo-mark.svg, favicon, icons
│   ├── fonts/                     54 woff2 files + fonts.css + fonts-manifest.json
│   ├── images/                    hands image + 5 page images
│   ├── projects/                  4 hero images, 4 thumbs, 3 architecture diagrams
│   └── assets-manifest.json       download log (status, MIME, bytes)
└── reference/                     ← source of truth, do not ship
    ├── html/                      12 captured pages (rendered DOM)
    ├── css/                       the 2 production stylesheets
    ├── js/                        8 JS chunks (behaviour reference)
    ├── text/                      extracted visible text per page
    ├── css-key-rules.txt          key selector measurements
    └── screenshots/               (optional capture attempts — see §6)
```

---

## 3. Asset totals

| Group | Count | Notes |
|---|---:|---|
| Fonts (woff2) | **54** | 5 families, 21 family/weight/style faces across latin + latin-ext + other subsets |
| Brand | 5 | `logo-512.png` (253 KB), `logo-mark.svg` (77 KB), `favicon.ico`, `icon.png`, `apple-icon.png` |
| Page imagery | 6 | `hands-creation-of-adam.png` + 5 `pages/*.webp` |
| Project imagery | 11 | 4 heroes, 4 thumbs, 3 architecture diagrams |
| Reference files | 36 | 12 HTML, 2 CSS, 8 JS, 12 text, 1 extract, 1 note |

Every file was fetched from `https://metaversalsolution.com` with a real browser User-Agent and verified by MIME type and byte size (`public/assets-manifest.json`, `public/fonts/fonts-manifest.json`).

### Font families

| CSS variable | Family | Weights present | Primary use |
|---|---|---|---|
| `--font-display` | **Anton** | 400 | Oversized uppercase section headlines, footer wordmark |
| `--font-jakarta` | **Plus Jakarta Sans** | 400/500/600/700/800 | Body, UI, hero headline (800) |
| `--font-poppins` | **Poppins** | 300/400/500/600/700 | Secondary UI / legacy sections |
| `--font-cormorant` | **Cormorant Garamond** | 300 italic, 400 italic | Editorial italic accents |
| `--font-mono` | **JetBrains Mono** | 700 | HUD labels, counters, coordinates, timestamps |

---

## 4. How the clone is assembled

The public routes serve a **mirror of the current production build**, captured from the live site. Typography, colours, menu, scroll choreography and the WebGL universe are therefore the site's own code.

| Layer | Location |
|---|---|
| Pages | `public/mirror/pages/*.html` — home, services, products, about, projects, contact and the six project pages |
| Next build assets | `public/mirror/_next/**` — the two production stylesheets, JS chunks and woff2 faces |
| Universe | `public/mirror/universe/index.html` + `public/mirror/_nuxt/**` — the self-contained Nuxt/WebGL app used by the hero iframe |
| Routing | `next.config.ts` rewrites `/`, `/services`, `/projects/<slug>`, … to the mirrored pages and `/universe/index.html` to the Nuxt app |
| Icons | `/favicon.ico`, `/icon.png`, `/apple-icon.png` at the public root |

Asset URLs inside the mirror are rewritten from `/_next/` and `/_nuxt/` to `/mirror/...` (including the escaped `\/_next\/` forms in Next's inline flight payload), and an early capture-phase click handler forces full-page navigation so the mirrored client never asks this host for RSC payloads it cannot serve.

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build
npm start

# refresh the mirror from the live site
python scripts/mirror.py
python scripts/fix_mirror_urls.py
```

The earlier hand-built React implementation (`app/**/page.tsx`, `components/SiteRuntime.tsx`) is still in the repository for reference, but the rewrites bypass it. Remove the `beforeFiles` rewrites in `next.config.ts` to use that implementation instead.

## 5. Reading order

1. `docs/01-project-brief.md` — what "done" means.
2. `docs/02-design-system.md` — tokens and type scale; import `design/tokens.css`.
3. `docs/03-page-specs.md` — build each section against this.
4. `docs/05-motion-and-3d.md` — the scroll choreography; the site lives or dies here.
5. `docs/06-asset-inventory.md` + manifests — asset-to-section mapping.
6. `docs/08-qa-launch-checklist.md` — acceptance gates.

---

## 6. Known limitations / notes

- **Screenshots:** headless Chrome stalls while rendering the scroll-driven WebGL in this environment, so no screenshots were captured and the clone was verified through its served HTML, compiled CSS, route responses and type-safe build rather than pixel screenshots. `reference/screenshots/` is empty.
- **`/universe/`** is disallowed by `robots.txt` and was intentionally not scraped. The clone mounts its own Three.js scene in the universe stage instead.
- **WebGL source:** the original 3D scenes are minified in `reference/js/`; the clone rebuilds them from `docs/05-motion-and-3d.md` (planet, three star layers, camera arc, pointer parallax) and falls back to a static background if WebGL is unavailable.
- **FAQ channels 02–05** were never present in the captured DOM; the clone supplies answers in the site's voice (see `docs/09-content-copy.md`).
- **Legal:** all copy, imagery, logo and fonts belong to Metaversal Solutions / their respective licensors (Anton, Poppins, Plus Jakarta Sans, Cormorant Garamond and JetBrains Mono are open-source fonts). This kit is for a clone the requester is authorised to build; do not republish the brand assets as your own.
- **No analytics, cookies or tracking** were present in the captured pages; the clone does not need a consent banner.

---

## 7. Contact details used across the site

- Email: `metaversalsolution@gmail.com`
- Phone: `+92 314 2316721`
- Location: Karachi, Pakistan
- Response promise: "We reply within 24h"
