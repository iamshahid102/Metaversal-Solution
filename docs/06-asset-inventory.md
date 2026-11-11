# 06 · Asset Inventory

Everything the live site references was downloaded into `public/` with a browser User-Agent and verified by MIME type and byte size. Machine-readable logs: `public/assets-manifest.json` and `public/fonts/fonts-manifest.json`.

**Totals:** 54 woff2 fonts · 5 brand files · 6 editorial images · 11 project images · **≈ 3.7 MB**.

---

## 1. Brand (`public/brand/`)

| File | Bytes | Type | Source | Use |
|---|---:|---|---|---|
| `logo-512.png` | 253,680 | PNG | `/brand/logo-512.png` | OG image, app icon fallback, footer/menu brand |
| `logo-mark.svg` | 76,897 | SVG | `/brand/logo-mark.svg` | Header mark, favicon source, menu overlay |
| `favicon.ico` | 8,956 | ICO | `/favicon.ico` | Browser tab |
| `icon.png` | 79,531 | PNG | `/icon.png` | Next.js `icon` convention |
| `apple-icon.png` | 35,640 | PNG | `/apple-icon.png` | iOS home screen |

> The SVG is large for a mark (77 KB). Inline it once as a React component and reuse; do not fetch it twice. Consider running `svgo` on a **copy** if payload matters, keeping the original for fidelity.

---

## 2. Editorial imagery (`public/images/`)

| File | Bytes | Dimensions* | Source | Use |
|---|---:|---|---|---|
| `hands-creation-of-adam.png` | 33,735 | square, transparent | `/images/hands-creation-of-adam.png` | Home act 2 (sticky hands) |
| `pages/home.webp` | 126,444 | 16:9-ish | `/pages/home.webp` | Home OG/social card, menu preview |
| `pages/services.webp` | 37,140 | 16:9-ish | `/pages/services.webp` | Services page card/preview |
| `pages/about.webp` | 70,846 | 16:9-ish | `/pages/about.webp` | About page card/preview |
| `pages/projects.webp` | 48,826 | 16:9-ish | `/pages/projects.webp` | Projects page card/preview |
| `pages/products.webp` | 24,274 | 16:9-ish | `/pages/products.webp` | Products page card/preview |

\* The captured markup declares explicit `width`/`height`; read them from `reference/html/*.html` when wiring `next/image`. Do not guess aspect ratios — the OG cards are cropped by CSS anyway.

---

## 3. Project imagery (`public/projects/`)

| File | Bytes | Source | Use |
|---|---:|---|---|
| `ai-fraud-detection.webp` | 91,740 | `/projects/ai-fraud-detection.webp` | Case study hero (01) |
| `zurbez.webp` | 31,558 | `/projects/zurbez.webp` | Case study hero (02) |
| `nouvelle-spaces.webp` | 371,552 | `/projects/nouvelle-spaces.webp` | Case study hero (04) — largest image, lazy-load |
| `safar.webp` | 79,508 | `/projects/safar.webp` | Case study hero (06) |
| `thumbs/ai-fraud-detection.webp` | 146,470 | `/projects/thumbs/ai-fraud-detection.webp` | Home + index card (01) |
| `thumbs/zurbez.webp` | 98,226 | `/projects/thumbs/zurbez.webp` | Card (02) |
| `thumbs/nouvelle-spaces.webp` | 152,764 | `/projects/thumbs/nouvelle-spaces.webp` | Card (04) |
| `thumbs/safar.webp` | 180,016 | `/projects/thumbs/safar.webp` | Card (06) |
| `architecture/ai-fraud-detection.webp` | 80,988 | `/projects/architecture/ai-fraud-detection.webp` | Case study preview (01) |
| `architecture/aws-devops-pipeline.webp` | 80,176 | `/projects/architecture/aws-devops-pipeline.webp` | Case study preview (03) |
| `architecture/fabric-data-infrastructure.webp` | 153,112 | `/projects/architecture/fabric-data-infrastructure.webp` | Case study preview (05) |

**Missing by design:** projects 03 (AWS) and 05 (Fabric) have no hero image on the live site; they use the architecture diagram in the preview block. There are no thumbnails for 03/05 — render a generated gradient/blueprint card (see `03-page-specs.md §5.2`).

**Not present on the site:** no video files, no audio files, no 3D models (GLTF/GLB), no textures, no PDF deck. The 3D scenes are procedural. If you add assets, keep them out of `reference/`.

---

## 4. Fonts (`public/fonts/`)

54 woff2 files covering 5 families. Filename pattern: `<family>-<weight>-<style>-<hash>.woff2`; each hash is a unicode subset (latin, latin-ext, etc.). `public/fonts/fonts.css` declares all 54 `@font-face` rules with relative URLs, subsets and `font-display: swap`.

| Family | Faces | Weights / styles | Files |
|---|---|---:|---:|
| Anton | 1 | 400 normal | 3 |
| Plus Jakarta Sans | 5 | 400, 500, 600, 700, 800 normal | 20 |
| Poppins | 5 | 300, 400, 500, 600, 700 normal | 15 |
| Cormorant Garamond | 2 | 300 italic, 400 italic | 10 |
| JetBrains Mono | 1 | 700 normal | 6 |

### Usage map

| Where | Family / weight |
|---|---|
| Body, nav, buttons, home hero | Plus Jakarta Sans 400 / 500 / 700 / 800 |
| Section display headlines, footer wordmark | Anton 400 (uppercase) |
| HUD labels, counters, eyebrows, clock, chips | JetBrains Mono 700 (uppercase, tracking 0.12–0.2em) |
| Italic editorial accents ("don't just launch") | Cormorant Garamond 300i/400i |
| Legacy/secondary blocks | Poppins 300–700 |

### Loading strategy

1. `<link rel="stylesheet" href="/fonts/fonts.css">` in the root layout (works with `public/fonts/fonts.css` relative URLs).
2. Preload only the critical latin faces:
   - `plus-jakarta-sans-800-normal-*` (hero)
   - `plus-jakarta-sans-400-normal-*` (body)
   - `anton-400-normal-*`
   - `jetbrains-mono-700-normal-*`
3. Keep `font-display: swap`; match fallback metrics or accept a brief swap. Do **not** preload all 54.
4. Alternative: move files to `app/fonts/` and use `next/font/local` with explicit `src` arrays, `weight`, `style`, `display:'swap'`. The generated `design/fonts.css` uses absolute `/fonts/…` paths if you prefer a plain stylesheet.

---

## 5. Source reference (`reference/`)

| Folder | Contents | Use |
|---|---|---|
| `html/` | 13 files: home + 12 routes (rendered DOM) | Compare structure, aria attributes, image dimensions, link targets |
| `css/` | `3invhwi746hi1.css` (117 KB), `369dnnv1i8chc.css` (6.5 KB) | Ground truth for every value; grep selectors before inventing |
| `js/` | 8 chunks (largest 230 KB / 179 KB) | Behaviour reference: scroll wiring, timings, asset paths |
| `text/` | 12 `.txt` visible-copy extracts | Copy deck source (see `09-content-copy.md`) |
| `css-key-rules.txt` | Curated selector blocks | Quick measurements without reading 117 KB |
| `screenshots/` | empty | Headless Chrome could not capture the WebGL site in this environment |

**Do not ship `reference/`.** Add it to `.gitignore` or keep it outside `app/`. It is for reconstruction only.

---

## 6. Integrity and provenance

- All 23 binary fetches returned HTTP 200 with expected MIME types; zero failures.
- Fonts were downloaded by parsing every `@font-face` `url()` in the production CSS (not by guessing filenames).
- Assets were resolved from markup and from `/projects/...` paths found in the page HTML; a follow-up scan of CSS/JS found no additional non-`_next` asset references.
- Original CDN/immutable paths are preserved in the manifests for audit and re-download.

Re-verify at any time:

```bash
python - <<'PY'
import json,os
for m in ('public/assets-manifest.json',):
    for a in json.load(open(m)):
        ok = os.path.exists(a['path']) and os.path.getsize(a['path'])==a['bytes']
        print('OK ' if ok else 'BAD', a['path'])
PY
```

---

## 7. Adding assets later

| Need | Convention |
|---|---|
| New project | `/public/projects/thumbs/<slug>.webp` (4:3, ≤160 KB) + `/public/projects/<slug>.webp` (16:10, ≤250 KB) + optional `/public/projects/architecture/<slug>.webp` |
| Page OG card | `/public/images/pages/<route>.webp` (1200×630 recommended) |
| Icons | Inline React SVG in `components/icons/`; only brand marks live in `public/brand` |
| Fonts | Add to `public/fonts` + declare in `design/fonts.css`; prefer woff2 only |
| Video | Not currently used; if added, `preload="none"`, `muted`, `playsinline`, poster image, and never autoplay under reduced motion |
