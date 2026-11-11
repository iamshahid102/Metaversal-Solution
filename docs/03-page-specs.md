# 03 · Page Specs (UI/UX)

Every route, in DOM order, with layout, content, interaction, states and responsive behaviour. Copy below is abbreviated; the full verbatim deck is `09-content-copy.md`.

## 0. Route map

| Route | Template | File | Primary intent |
|---|---|---|---|
| `/` | Home (7 acts) | `app/page.tsx` | Prove range, route to services/projects/contact |
| `/services` | Services explorer | `app/services/page.tsx` | Nine disciplines → service CTA |
| `/about` | Studio story | `app/about/page.tsx` | Trust: crew, principles, location |
| `/projects` | Work index | `app/projects/page.tsx` | Filterable proof of work |
| `/projects/[slug]` | Case study | `app/projects/[slug]/page.tsx` | Depth: overview, features, stack, result |
| `/products` | Coming soon | `app/products/page.tsx` | Capture interest |
| `/contact` | Contact | `app/contact/page.tsx` | Convert to email/call |
| `/universe/` | Hidden 3D experience | not rebuilt | Easter egg (robots-disallowed) |

**Navigation numbering is fixed:** 01 Home, 02 Services, 03 Products, 04 About, 05 Projects, 06 Contact. Note Products sits third in the menu but last in sitemap order.

---

## 1. Global shell

### 1.1 Fixed header (`.nav`, `.nav-brand`, `.nav-menu`)

- **Position:** fixed, full width, height `--header-h: 58px`, no background by default; on scroll > 24px add `background: rgba(12,7,4,.72)` + `backdrop-filter: blur(14px)` + bottom hairline.
- **Left:** logo mark (`logo-mark.svg`, 28px) + wordmark "Metaversal Solutions" (Jakarta 700, 1.35rem, `-0.02em`, cream).
- **Right (desktop):** inline nav links 01–06 (mono 11px index above label, or `01 / Home` inline), then a pill "Start a project" (amber text on transparent, 1px amber border, hover fills amber with ink text). `.nav-menu { display:none }` at the mobile breakpoint.
- **Right (mobile ≤900px):** "Menu" button — mono label + two 18px rules that rotate into an X when open. This is the circle-reveal origin.
- **Scroll behaviour:** hide on scroll down past 400px, reveal on scroll up (transform `translateY(-100%)`, `.35s var(--jx-ease)`).

### 1.2 Menu overlay (`.sm-overlay`)

- Full-screen `#0d0805`, `z-index:1000`, `position:fixed`, `inset:0`.
- **Reveal:** `clip-path: circle(0 at calc(100% - clamp(18px,4vw,56px) - 30px) 48px)` → `circle(150vmax at …)`; `0.9s cubic-bezier(.7,0,.2,1)`; closing `0.8s` with `visibility` delayed.
- **Layout:** two columns (desktop): primary nav (`sm-primary`) 60%, side rail (`sm-side`) 40%.
- **Primary nav:** six numbered rows — `01` mono amber, label in Jakarta/display at `clamp(34px,5vw,64px)`; hover shifts the label 8px and turns amber; active route gets a filled amber dot.
- **Side rail:** "How we work" (→ `/#process`), "FAQ" (→ `/#faq`), then a contact block: "Start a project" (mailto), email, phone, "Karachi, Pakistan".
- **Behaviour:** body scroll locks (`overflow:hidden` on `<html>`), `Esc` closes, focus trapped, `aria-expanded` on the trigger, links close the overlay before navigating. Items stagger in via `opacity/translateY` after the clip completes (delay ~0.35s + 60ms per row).
- **Reduced motion:** no clip animation — instant show/hide, no stagger.

### 1.3 Footer (`.ft`)

Order top → bottom:

1. **CTA row** (`.ft-cta`): left — kicker `{ Contact }`, headline "Have an idea? / Let's launch it together." (display, `clamp(40px,6vw,84px)`); right — a circular/round-rect button "click on it" / email pill `metaversalsolution@gmail.com`, plus an amber arrow disc.
2. **Brand row** (`.ft-brand`): logo mark + "Metaversal Solutions", blurb "An AI-first software and digital innovation studio. One crew, from first sketch to production and beyond.", live line "Karachi · --:--:-- PKT" with a pulsing dot.
3. **Link columns** (`.ft-cols`, 4 columns): Services (9 links), Studio (Services, About, Products, How we work, Projects, Contact, FAQ), Contact (email, phone, Karachi, "We reply within 24h"), and the social/legal slot.
4. **Giant wordmark** (`.ft-mark`): "METAVERSAL" at `clamp(64px,19.5vw,380px)` Anton, cream at low alpha with a lit copy revealed by a radial mask following the cursor (`--mx`, `--my`). On scroll into view the wordmark rises (`translateY(40%)` → 0, `1.4s var(--jx-ease)`). Two spans (`ft-mark-base`, `ft-mark-lit`) must be perfectly aligned.
5. **Bottom bar** (`.ft-bar`): `© 2026 Metaversal Solutions . All rights reserved.` left, `Crafted in Karachi, launched worldwide.` centre, `Back to orbit ↑` right (smooth-scrolls to top).

- Background: `radial-gradient(70% 60% at 50% 110%, #f7a22429, transparent 65%), #0a0603`; top hairline.
- **Clock:** client component; `Intl.DateTimeFormat('en-GB',{timeZone:'Asia/Karachi',hour12:false,hour:'2-digit',minute:'2-digit',second:'2-digit'})`; render `--:--:-- PKT` until mounted to avoid hydration mismatch; update every 1s.
- **Responsive:** columns 4→2→1; CTA stacks left-aligned; wordmark remains one line (`white-space:nowrap`) and shrinks with vw.

---

## 2. Home (`/`)

The page is a sequence of scroll acts. Total scroll length ≈ 2800vh + 520vh + 200vh + 250vh + 520vh + content.

### Act 1 — Universe (`.universe-section`, `.universe-stage`)

- **Wrapper:** `height: var(--universe-scroll, 2800vh)`, `background: #0c0704`.
- **Stage:** `position: sticky; top:0; height:100svh; overflow:hidden`, contains a full-bleed `<canvas>` (Three.js) plus two HTML overlay layers.
- **Visual:** a dark planet (amber-lit limb) low-centre, layered starfield with parallax, faint orbital rings and HUD reticles. Camera flies forward/down between nine "sectors" as the user scrolls; stars streak during transitions.
- **HUD frame:** fixed corner labels — top-left `METAVERSAL SOLUTIONS // CAPABILITIES`, top-right live scroll percentage, bottom flight bar (`hud-flight-bar`) with `METAVERSAL SOLUTIONS // CAPABILITIES` and a progress track whose amber fill tracks scroll.

#### 1a. Hero overlay (`hero-overlay-root`)

- Kicker (mono, 0.14em, amber): `WE TAKE YOUR BUSINESS FROM CONCEPT TO DEVELOPED.`
- H1, three masked lines, word-by-word rise: `We build` / `for ambitious` / `businesses.` — Jakarta 800, `clamp(70px,9.2vw,148px)`, `-0.04em`, `line-height:.95`, centered. Each `.hero-word` is an overflow-hidden `1.28em` box.
- Sub-copy (max 56ch, soft cream): "An AI-first software and digital innovation powerhouse. Designed, engineered and shipped by the people who own the outcome end to end — from the first wireframe to the last deploy."
- CTAs: **Book a call** (filled amber pill, ink text) and **Explore services** (ghost pill, cream border → amber on hover).
- Bottom-centre scroll cue: `SCROLL` mono + animated vertical line/dot (`scrollBounce`).
- Exit: overlay fades and lifts (`opacity 0`, `translateY(-40px)`) over the first ~8% of scroll.

#### 1b. Services HUD (`services-hud-root`)

- Header block: mono `Metaversal Solutions // Capabilities`, kicker `WHAT WE DO`, H2 "The Services We Provide" (display, `clamp(36px,5vw,72px)`), sub-copy "Architecting planetary-scale digital ecosystems across cloud infrastructure, intelligent data platforms, and autonomous AI.", hint "Scroll to Explore Sectors".
- **Nine sector panels**, one per scroll segment (target ≈ 8.5% each). Each panel:
  - eyebrow `Sector 0X // <discipline family>`
  - counter `0X / 09` (mono, right)
  - two-line display headline, e.g. `Cloud Data` / `Engineering`
  - description (≤ 2 lines, soft cream)
  - six technology chips (pill, 1px cream hairline, mono 11px)
  - text link `Explore Capabilities →` → `/services#sector-0X`
  - side art: a planet/orbit diagram that rotates subtly; active sector brightens its planet and shifts the accent to amber.
- Sector data (see `09-content-copy.md` for descriptions): 01 Cloud Data Engineering, 02 DevOps Engineering, 03 Web Development, 04 App Development, 05 UI/UX Designing, 06 Graphic Designing, 07 Blender Engineering, 08 AI Data Science, 09 Machine Learning.
- Transition: panels cross-fade + slide 60px; the planet scales up on entry and recedes on exit; starfield speeds up between sectors.

#### 1c. Terminal / outro panel

- Mono header `Metaversal Terminal // Deep Space`.
- H2 "Transform Your / Digital Reality" (display, amber gradient on second line).
- Copy: "From imagination to innovation — Metaversal Solutions engineers the digital ecosystems and AI backbones of tomorrow."
- Buttons: **Initiate Project** (amber fill → `/contact`), ghost link **Enter Next Chapter ↓** (scrolls to hands act), text link **Back to Orbit** (top).
- A faux terminal readout (mono, typewriter lines) may sit behind/below; keep decorative and `aria-hidden`.

**Responsive:** on ≤900px reduce `--universe-scroll` to ~1400vh via CSS/JS, drop the side art, stack HUD text bottom-left, show chips in 2 rows of 3, keep the canvas at `100svh` (devicePixelRatio capped at 1.5). On low-power/reduced-motion, replace the canvas with a static poster gradient + star field.

### Act 2 — Hands (`.hands-section`, 520vh)

- Sticky stage, `hands-sticky`; background `#0d0805`.
- Centre: `public/images/hands-creation-of-adam.png` (the Creation-of-Adam hands), scaled to viewport height, with a soft amber rim light and slow zoom (1 → 1.08) through the act.
- Copy: kicker `{ Metaversal Solutions }`; H2 "Where human ideas / meet intelligence." (display, two lines); hint "Keep scrolling".
- Motion: image starts desaturated/dim (filter `brightness(.5) saturate(.6)`), warms to full as it enters centre; headline words fade in from 40% offset; on exit the image splits/scales behind the next act.

### Act 3 — Manifesto (`.abl-section`, 200vh, `margin-top:-140vh`)

- Overlaps the hands act; starts transparent, then `abl-show` adds a **white** background so the manifesto reads as a printed page.
- The manifesto is a single paragraph revealed **word by word** on scroll (each word wrapped in a span; opacity 0.12 → 1 as progress passes it). Text: "We turn bold ideas into intelligent digital products. Metaversal Solutions is an AI-first software and digital innovation studio from Karachi, Pakistan. Strategists, designers, engineers and 3D artists work as one team to design, build and scale what you need — from cloud data platforms and mobile apps to immersive 3D worlds and machine learning systems. We own the outcome end to end, from the first wireframe to the last deploy."
- Then a 3-card row: **Design-led**, **AI-first**, **End-to-end** (number + title + one line), and a stat row: `09 Core Services`, `01 Team, End to End`, `24h Inquiry Response`, `∞ Ideas Explored`.
- CTA line: "We build ideas into reality." + `Start a project · We reply within 24h`.
- Responsive: word reveal becomes a simple fade-up block on mobile (too many spans to scrub comfortably); cards stack.

### Act 4 — Marquee box (`.mb-section`, 250vh)

- Sticky, centred "box" that assembles as you scroll: lid/curtains (`mb-curtain--top/bottom`) part to reveal a **zipper** (`mb-zip`, `mb-zip-chain`, `mb-zip-slider`) which unzips with scroll progress.
- Inside: eyebrow "AI-First Software Studio · Karachi", H2 "Imagine boldly. / Build intelligently." (display, amber on second line), ticker of stats.
- A repeating marquee band (`mb-ghost`) scrolls giant outlined words behind the box.
- Exit: box scales past the viewport, revealing the next act.
- Reduced motion: show the box fully open with static content, no zipper.

### Act 5 — Flight plan / process (`.fp-section`, 520vh, **light**)

- Background `#fff`, ink `#2b1a0d`, z-index 3. Sticky `fp-sticky` viewport.
- Header: mono eyebrow `03 // How we work`; H2 "Every product gets / a flight plan."; sub-copy "Five mission phases, one crew from first call to orbit. Scroll to fly the route."; small tag "T-04 · Metaversal · Flight plan".
- **Route visual:** an SVG path (`fp-route-base` dashed hairline, `fp-route-trail` amber progress stroke) across the stage with five nodes (`fp-node`) labelled T-04, T-03, T-02, T-01, T+∞. A probe (`fp-probe` + halo) travels the path tied to scroll; the active node pulses and its card highlights.
- **Phase cards** (`fp-phases`), one per phase, stacked/offset; only the active one is prominent. Each card: index `Phase 0X / 05`, title, description, meta rows (Duration, Crew), deliverable list with tick marks.
  1. **Discover** — 1–2 weeks · Strategist · Lead engineer — Product brief; User & market research; Scope and roadmap.
  2. **Design** — 2–3 weeks · UI/UX designer · Strategist — Clickable prototype; Design system; Final screens.
  3. **Build** — 4–10 weeks · Engineers · QA — Weekly live demos; Tested codebase; Cloud infrastructure.
  4. **Launch** — 1 week · DevOps · Whole crew — Security & load checks; Production release; Team handover.
  5. **Orbit** — Ongoing · Dedicated support pod — Uptime monitoring; Monthly improvements; Growth analytics.
- **HUD corners:** top-left route label `T-04`, top-right phase counter, bottom progress ticks with phase names.
- Responsive ≤900px: unpin; render as a vertical timeline with a left rail and stacked cards; probe becomes a dot on the rail.

### Act 6 — Selected work

- Header: mono eyebrow `05`, kicker "Selected work · 05 projects", H2 "Recent projects", link "View all projects →" (`/projects`).
- Display line: "Our Projects" with a deliberate split ("Our Pr" / "ojects") used as a kinetic type moment — if the split is font-dependent, keep the plain "Our Projects" and animate the two halves.
- Intro copy: "Every project is a coded drop from our studio — designed, engineered and shipped by one team that owns the outcome end to end." plus the second paragraph.
- **Five project cards** (reel-card style, 18px radius, gold ring + glow), each: index + category · year, two-line display title, summary, one metric, `View project →`, thumbnail (`projects/thumbs/*.webp`, 4 available) with amber hover zoom.
  1. AI Fraud Surveillance — ML Engineering · 2026 — 0.982 ROC-AUC
  2. Zurbez Storefront — E-commerce Platform · 2026 — 08 Product collections
  3. AWS DevOps Pipeline — DevOps Engineering · 2026 — Multi-AZ database
  4. Nouvelle Spaces — Portfolio & CMS · 2026 — 22 Projects
  5. Fabric Data Platform — Cloud Data Engineering · 2026 — 66 Architecture components
- Footer line: "05 selected projects · more on the projects page" + "View all projects →".
- Layout: 2-column asymmetric grid (cards alternate offset), `aspect-ratio: 4/3` thumb; ≤900px one column.

### Act 7 — FAQ radio (`.fq-section`)

- Background: dark with two ambient glows.
- Header: mono `05`, kicker "Questions, answered", H2 "Don't wait to decide — / start now, or your competitor gets there first.", hint "Tune into a channel".
- **Receiver card** (`fq-receiver`, sticky at 90px desktop): frequency scale `88 – 108`, tick marks, a needle (`fq-needle`) that slides to the active station, station list:
  - CH 01 · 88.4 — How fast can you start?
  - CH 02 · 92.7 — Do you only build with AI?
  - CH 03 · 97.1 — What if we already have a design?
  - CH 04 · 101.5 — Do you offer ongoing support after launch?
  - CH 05 · 106.9 — How do you price projects?
- **Transcript panel:** mono header `Incoming transmission · CH 0X · XX.X MHz`, question, then answer typed out (`fq-caret` blinking). Answer text in `09-content-copy.md` (only CH 01's answer is captured verbatim; the remaining four must be written to match tone, or shipped as the question + short answer).
- Interaction: clicking a station tunes (needle animates, static flicker `fq-bars`, then transcript types); `←/→` moves stations; active channel gets amber bars. Auto-selects CH 01 on first view.
- CTA under transcript: `Start your project →` + "We reply within 24h".
- Responsive: receiver becomes a horizontal dial above the transcript; sticky removed; station list scrolls horizontally.

### Act 8 — Transition strip ("From Imagination to Innovation")

- Full-bleed band with two counter-scrolling marquees of the phrase (`From` / `To`, or "From Imagination to Innovation"), amber outline type.
- Sub-line: "Every idea that reaches us leaves as a product that ships, scales and keeps getting smarter."; hint "Scroll to transform · move to disturb the stars".
- Cursor-reactive starfield/distortion behind (canvas or CSS parallax), `aria-hidden`.
- Ends at the footer.

---

## 3. Services (`/services`)

Root `.sv-page` scopes `--sv-*`.

### 3.1 Hero (`sv-hero`) — two columns, min-height 100vh, padding 120px top

- Left: kicker `Services`; H1 "Nine disciplines. / One crew." (Anton, `clamp(56px,7.4vw,128px)`, `.92`, uppercase, second line in amber gradient); copy "Strategy, design, engineering and AI under one roof. Pick one service or bring the whole crew, from the first sketch to production and beyond."; hint "Tap a planet or scroll to explore".
- Right: **interactive orbit** — a central core mark (`sv-core`, `sv-core-mark`) with 3 concentric rings (`sv-ring`, `sv-ring-2`, `sv-ring-3`, slow counter-rotation) and nine planet buttons (`sv-planet`, 34–46px amber discs numbered 01–09). Hover scales 1.18 + glow; clicking scrolls to that sector panel; the active planet gets an amber halo. Orbit is decorative-but-interactive; each planet has an accessible name ("Cloud Data Engineering").
- Background: amber radial + four star dots, inset `-20vw`.

### 3.2 Explorer (`sv-explorer`) — nine panels

Each `.sv-panel` is `min-height:92vh`, two columns (art 0.9fr / copy 1.1fr), top hairline, `padding:60px 0`:

- **Left art:** a unique orbital diagram per discipline — planet + rings + satellite nodes (pure CSS/SVG, not images) with a ghost numeral (`sv-ghost`, outlined type) behind.
- **Right copy:** index `01` mono, eyebrow `Sector 01 // Data Architecture`, H2 two-line title, description, then a 3-column mini-grid:
  - **What you get** — 3 bullets with tick/arrow
  - **Tech stack** — 6 chips
  - **Built by us / Case study** — link to the matching project or "Coming soon"
  - CTA: `Start a <discipline> project ↗` → `/contact?service=<slug>`
- Panel becomes active (`is-on`) when centred: art scales, ghost stroke turns amber, title lit.
- Section anchors: `#sector-01` … `#sector-09` (used by home's "Explore Capabilities").
- Responsive ≤1050px: single column, art above copy, art max-width 380px; ≤900px art 260px.

### 3.3 Models (`sv-models`)

- Header: kicker "Three ways", H2 "Three ways / to work with us."
- Three cards:
  1. tag "Best for a clear idea" — **Fixed-scope project** — "A fixed quote per phase after discovery. You approve every milestone before we move on." — Scope & timeline in 48h / Fixed price per phase / Weekly live demos — `Ask about this ↗`
  2. tag "Best for growing products" — **Dedicated crew** — monthly team rate, designers + engineers as an extension of the company — Monthly team rate / Flexible roadmap / One team, end to end — `Ask about this ↗`
  3. tag "Best after launch" — **Orbit support** — monitoring, fixes, updates, new features monthly — Uptime monitoring / Monthly improvements / Growth analytics — `Ask about this ↗`
- Middle card is emphasised (amber ring / "Most popular" style accent). Hover lifts 4px.

### 3.4 Toolbox (`sv-toolbox`)

- Header: kicker "The toolbox", H2 "The technologies our crew works with every day."
- ~60 chips grouped by discipline (see copy deck), wrapped rows, mono 11px, hairline borders, amber on hover. Optional: filter by discipline.
- Responsive: chips wrap; no horizontal scroll.

### 3.5 CTA (`sv-cta`)

- H2 "Not sure where / to start?" + "Tell us your idea and we'll map the right crew and services for it." + button `Talk to the crew ↗` (mailto/contact).

---

## 4. About (`/about`)

Root `.ab-page` scopes `--ab-*`.

### 4.1 Hero (`ab-hero`) — `height:100vh; min-height:600px`

- Full-bleed `<canvas>` (`ab-hero-canvas`): a radar/constellation field — slow rotating sweep, concentric rings, pings on random nodes (`ab-ping` scale 14 + fade), drifting stars. Amber on ink. Pauses off-screen and under reduced motion (static frame).
- Copy block absolute left (`clamp(18px,6vw,96px)`, width `min(560px,46vw)`, vertically centred): kicker "About Metaversal", H1 "We are the crew / behind the code." (Anton `clamp(52px,7vw,120px)`), paragraph "An AI-first software and digital innovation studio from Karachi, Pakistan, turning bold ideas into intelligent digital products.", hint "Scroll to meet us".
- HUD details: coordinate readout, `KHI` tag, radar labels with small ping dots.
- Responsive ≤900px: canvas dimmed behind, copy full width, H1 `clamp(44px,12vw,64px)`.

### 4.2 Manifesto (`ab-manifesto`, sticky)

- Same word-by-word reveal as home act 3 (cream on ink), kicker `{ Manifesto }`, then the paragraph at display-ish size (`clamp(24px,3.2vw,44px)`, Jakarta 500, line-height 1.25). Words at 15% opacity until passed.
- Ends with the stat row: 09 Core services / 01 Team, end to end / 24h Inquiry response / ∞ Ideas explored.

### 4.3 Principles (`ab-principles`)

- Header: kicker "What drives", H2 "What drives / the crew."
- Four numbered cards (2×2 desktop): 01 Design-led, 02 AI-first, 03 End-to-end, 04 Transparent — each with the one-line definition from the copy deck. Hairline top border, number in mono amber, hover raises and reveals an amber underline.

### 4.4 Disciplines (`ab-disciplines`)

- H2 "One crew. Every discipline." + the nine names as a comma list for SEO/accessibility.
- Two marquee rows scrolling in opposite directions (`ab-marquee`, `ab-marquee-track`), each item `Cloud Data Engineering ✦` with the ✦ in amber; duration ~40s, pause on hover, duplicated track for seamless loop. Edge fade masks.

### 4.5 Base (`ab-base`)

- Two-column: left copy "From Karachi / to everywhere." + "Our studio is in Karachi, Pakistan. Our products run for people all over the world."; right a "base card" with coordinates `24.8607° N · 67.0011° E`, live `Karachi · --:--:-- PKT`, big `KHI` code, radar rings, and a subtle map-grid background.
- Coordinates and clock in mono; clock uses the same Asia/Karachi component as the footer.

### 4.6 CTA (`ab-cta`)

- H2 "Your idea. / Our crew." + `Start a project →`.

---

## 5. Projects index (`/projects`)

Root `.pa-*`, `.pj-*` tokens.

### 5.1 Hero (`pa-hero`)

- Eyebrow mono `PROJECT WORK / 01– 06`.
- H1 "Projects ." (the space before the period is intentional in the original).
- Copy: "From an idea to a working product. Explore what we built, the technology behind it and the results of each project."
- Right/top-right: `BACK HOME ↗` link.
- Meta row: `06 PROJECTS`, a **search input** (`Search projects` with a `⌕` glyph), and filter tabs: **ALL**, **WEBSITES**, **CLOUD & DEVOPS**, **AI & ML**.
- Search behaviour: client-side, case-insensitive across title + summary + tech; debounce 120ms; empty state "No projects match — try another term."; result count updates (`03 PROJECTS`); `Esc` clears.

### 5.2 List (`pa-body`)

Six rows/cards, numbered `01`–`06`, each with:

| # | Category | Title | Chips | Filter group |
|---|---|---|---|---|
| 01 | ML Engineering | AI Fraud Surveillance | Python, XGBoost, Isolation Forest, Autoencoder | AI & ML |
| 02 | E-commerce Platform | Zurbez Storefront | Node.js, JavaScript, Vercel Blob, Admin CMS | Websites |
| 03 | DevOps Engineering | AWS DevOps Pipeline | AWS, Terraform, Packer, GitHub Actions | Cloud & DevOps |
| 04 | Portfolio & CMS | Nouvelle Spaces | HTML, JavaScript, Node.js, Vercel | Websites |
| 05 | Cloud Data Engineering | Fabric Data Platform | Azure, Microsoft Fabric, Bicep, Python | Cloud & DevOps |
| 06 | Travel Website | Safar Journeys | HTML, CSS, JavaScript, Vercel | Websites |

- Card anatomy: category + index, title (display), summary, tech chips, `EXPLORE PROJECT →`, external arrow `↗` top-right, thumbnail (where available: thumbs for 01/02/04/06) or a generated gradient/architecture image for 03/05.
- Layout: alternating two-column editorial rows on desktop (image left/right), stacked on mobile.
- Hover: image zooms 1.04, gold ring brightens, title shifts 4px, arrow translates.
- Filtering animates with a short fade/height transition; focus stays on the active tab.

---

## 6. Project detail (`/projects/[slug]`)

Template driven by data (`content/projects.ts`). Root `.pj-page`, `--pj-card:#140c06`.

### 6.1 Crumbs (`pd2-crumbs`)

`← ALL PROJECTS` left; `0X / 06` right (mono).

### 6.2 Head (`pd2-head`)

- Eyebrow: `ML ENGINEERING · 2026` (category · year).
- H1 project title (display, `clamp(48px,8vw,120px)`).
- Summary paragraph (max 72ch).
- Action links: `VIEW CODE ON GITHUB ↗` and/or `VISIT LIVE SITE ↗` (amber text underline on hover). Links come from data; render only when present.
- **Three stats** in a row (mono number + label): e.g. `43 Real-time features`, `3 Model AI ensemble`, `<2ms Scoring target`.
- Hero image: `projects/<slug>.webp` where present (01, 02, 04, 06). For 03 and 05 use the architecture diagram (`projects/architecture/*.webp`) as the preview instead.

### 6.3 Overview (`pd2-overview`)

H2 "Overview" + two paragraphs (problem → solution → what was built). One project (Fabric) includes a callout note: "This repository is a blueprint with working offline samples. It has not been deployed to a live tenant."

### 6.4 What it does

H2 + six numbered cards (`01`–`06`) in a 3×2 grid (2×3 tablet, 1 column mobile): title + one/two-line description. Copy per project is in `09-content-copy.md`.

### 6.5 How it works

H2 + four steps in a horizontal rail (desktop) with connecting hairline and numbered nodes: step name (H3) + one-line description. On mobile, vertical timeline.

### 6.6 Preview (only 03, 05)

H2 "Preview" + full-width architecture diagram (`projects/architecture/aws-devops-pipeline.webp`, `fabric-data-infrastructure.webp`, `ai-fraud-detection.webp`), 1px hairline, rounded 18px, caption optional. Click opens a lightbox (optional; not required for parity).

### 6.7 Tech stack

H2 "Tech stack" + grouped columns, each an H3 + 3–12 chips:

- AI Fraud: Machine learning (XGBoost, Isolation Forest, PyTorch autoencoder, TreeSHAP, MLflow) / Data & cloud (Azure Event Hubs, Azure Databricks, Delta Lake, Spark, Terraform) / Interfaces (Three.js / WebGL, Chart.js, Power BI, Vercel edge functions).
- Zurbez: Application / Platform / Admin.
- AWS DevOps: CI/CD / AWS / Application.
- Nouvelle: Website / CMS & server / Platform.
- Fabric: Azure & Fabric / Infrastructure / Languages.
- Safar: Website / Build & hosting.

Full chip lists in the copy deck.

### 6.8 Next project

Full-width card: `NEXT PROJECT →` + next title + category; chains 01→02→03→04→05→06→01. Hover: arrow slides, background glows.

### 6.9 SEO

- Title pattern `<Project> — <Category> | Metaversal Solutions` (em dash, HTML-escaped `&` in the raw source; use "&" in JSX).
- Description = the summary sentence.
- Canonical `https://metaversalsolution.com/projects/<slug>`.
- JSON-LD `CreativeWork` with `name`, `description`, `creator`, `datePublished` (2026), `keywords` from tech.

---

## 7. Products (`/products`)

- Root `.pd-soon`, centred, min-height ~100svh, dark with an amber core glow / slowly rotating ring.
- Kicker "Products"; H1 "Coming soon" (display, huge); copy "Our own products are in the lab right now. Want to be the first to know when they launch?".
- **Notify form:** email input + `Notify me →` button. Client-side validation (required, type=email), success state "You're on the list." / error "Enter a valid email." No backend in the original capture — wire to a `mailto:` fallback or a server action that logs; document the choice.
- Optional: a locked/lab visual (blurred product silhouettes) — must remain decorative.

---

## 8. Contact (`/contact`)

Root `.ct-page`.

### 8.1 Head (`ct-head`)

- Kicker "Contact"; H1 "Let's talk." (display, `clamp(56px,9vw,140px)`); copy "Pick whichever is easiest for you. We reply within 24 hours."
- **Contact list** (`ct-list`), five rows + location:
  | Label | Value | Link |
  |---|---|---|
  | Phone | +92 314 2316721 | `tel:+923142316721` |
  | Email | metaversalsolution@gmail.com | `mailto:` |
  | LinkedIn | Metaversal Solutions | external |
  | Instagram | @metaversalsolution | external |
  | Facebook | Metaversal Solutions | external |
  | Location | ● Karachi, Pakistan | map link (optional) |
- Each row: mono label left, value in large Jakarta right, `↗` on hover; 1px top border; hover fills with amber at 6% and slides the arrow.
- Sticky left column with the H1, scrolling right column with the rows (desktop). Mobile: stacked.

### 8.2 Page directory (`wk-section ct-pages`)

- Header: mono "Explore the website"; 5 cards, numbered `01 Page · 05`…`05 Page · 05`:
  1. Home — "Universe" — "Fly through our universe of services, see how we work and our latest projects." → `/`
  2. Our Services — "Nine disciplines, one crew: cloud, DevOps, web, apps, design, 3D and AI." → `/services`
  3. About Us — "Meet the crew behind the code, what drives us and where we are based." → `/about`
  4. Our Projects — "Websites, cloud platforms and machine learning systems we have built." → `/projects`
  5. Our Products — "Our own products, in the lab right now and launching soon." → `/products`
- Card: two-line title split ("Our" / "Services"), description, `Open page →`, big index watermark. Hover: amber border + background lift.
- Note: the directory excludes `/contact` itself (5 pages, not 6).

### 8.3 FAQ / how-we-work anchors

Header menu links `How we work` → `/#process` and `FAQ` → `/#faq`. On the home page these ids must exist on the flight-plan and radio sections respectively.

---

## 9. Responsive rules

| Breakpoint | What changes |
|---|---|
| `≤1100px` | Wide container gutters shrink; footer columns 4→2; project card type steps down |
| `≤1050px` | Services hero stacks (orbit below copy); about hero copy width grows |
| `≤900px` | **Primary mobile breakpoint.** Header inline nav → Menu button; all two-column grids → one; sticky acts unpin or reduce height; universe scroll length halved; footer stacks; process becomes vertical timeline; radio receiver unsticks; page hero type clamps to mobile sizes |
| `≤781px` | Container gutter 24px; chips wrap tighter; stat rows 2×2; project detail stats stack 1×3 |
| `≤700px` | Display type downshift; CTAs full width; cards lose offset/alternating layout; menu overlay single column |
| `max-height:760px and min-width:901px` | Compress hero paddings, hide scroll hints, reduce stat spacing (short laptop viewports) |

Touch targets ≥44×44px. No hover-only information. `100svh` (not `100vh`) for sticky stages to survive mobile browser chrome.

## 10. Metadata table

| Route | Title | Description (verbatim) |
|---|---|---|
| `/` | Metaversal Solutions \| AI-First Software & Innovation Studio in Karachi | Metaversal Solutions builds web and mobile apps, cloud data platforms, DevOps, UI/UX, 3D and AI/ML systems for ambitious businesses. One crew from idea to launch, based in Karachi, Pakistan. |
| `/services` | Services \| Metaversal Solutions | Strategy, design, engineering and AI under one roof. Pick one service or bring the whole crew, from the first sketch to production and beyond. |
| `/about` | About \| Metaversal Solutions | An AI-first software and digital innovation studio from Karachi, Pakistan, turning bold ideas into intelligent digital products. |
| `/projects` | Projects \| Metaversal Solutions | From an idea to a working product. Explore what we built, the technology behind it and the results of each project. |
| `/products` | Products \| Metaversal Solutions | Our own products are in the lab right now. Want to be the first to know when they launch? |
| `/contact` | Contact \| Metaversal Solutions | Contact Metaversal Solutions: phone +92 314 2316721, email metaversalsolution@gmail.com, LinkedIn, Instagram and Facebook. Karachi, Pakistan. |
| `/projects/ai-fraud-detection` | AI Fraud Surveillance — ML Engineering \| Metaversal Solutions | A real-time market surveillance platform that flags wash trading, spoofing and quote stuffing with a three-model AI ensemble on an Azure Delta lakehouse, with live dashboards for analysts. |
| `/projects/zurbez` | Zurbez Storefront — E-commerce Platform \| Metaversal Solutions | A full-stack fashion store with its own admin portal: product collections and videos, cart and wishlist, cash-on-delivery checkout, stock management, reviews and editable site settings. |
| `/projects/aws-devops-pipeline` | AWS DevOps Pipeline — DevOps Engineering \| Metaversal Solutions | Production-grade CI/CD that tests, builds and deploys a Next.js app to AWS: GitHub Actions, Packer machine images and Terraform, behind a load balancer with auto scaling and Multi-AZ PostgreSQL. |
| `/projects/nouvelle-spaces` | Nouvelle Spaces — Portfolio & CMS \| Metaversal Solutions | An architecture and 3D visualisation portfolio with cinematic films, a filterable gallery of 22 projects and a private content manager with drafts, publishing and version restore. |
| `/projects/fabric-data-infrastructure` | Fabric Data Platform — Cloud Data Engineering \| Metaversal Solutions | An end-to-end Azure and Microsoft Fabric analytics blueprint: Bicep infrastructure, streaming ingestion, SQL, KQL and M transformations, ML and governance, with tested offline samples. |
| `/projects/safar` | Safar Journeys — Travel Website \| Metaversal Solutions | A responsive travel site for Hajj, Umrah and UAE journeys, with a cinematic Makkah video hero, packages, a guided journey timeline and a validated booking enquiry. |

Shared: `theme-color #0c0704`, OG image `/brand/logo-512.png`, canonical `https://metaversalsolution.com<path>`, `robots.txt` disallows `/universe/`. See `docs/07-build-plan.md` for sitemap + robots implementation.
