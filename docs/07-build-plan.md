# 07 · Build Plan

## 1. Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 15 (App Router) + TypeScript strict |
| Rendering | Server components for all content; client components only for scroll/3D/forms |
| Styling | Global token sheet + CSS Modules per section (no Tailwind unless the team insists) |
| Animation | CSS keyframes, IntersectionObserver, rAF scroll progress, Lenis |
| 3D | `three` (tree-shaken), dynamic import, client-only |
| Images | `next/image`, explicit dimensions, `sizes` per layout |
| Forms | Server Action (or `mailto:` fallback) — no third-party service required |
| Deploy | Vercel (Node runtime) |
| Quality | ESLint, `tsc --noEmit`, Playwright smoke tests (optional), Lighthouse CI |

## 2. File structure

```
app/
├─ layout.tsx                 # fonts, metadata, header/footer, smooth scroll
├─ page.tsx                   # home
├─ globals.css                # reset + base + utilities
├─ tokens.css                 # copy of design/tokens.css
├─ services/page.tsx
├─ about/page.tsx
├─ projects/page.tsx
├─ projects/[slug]/page.tsx
├─ products/page.tsx
├─ contact/page.tsx
├─ not-found.tsx
├─ sitemap.ts
└─ robots.ts

components/
├─ ui/            Button, Chip, Kicker, SectionHeading, Stat, ArrowLink, Reveal, Marquee
├─ shell/         SiteHeader, MenuOverlay, SiteFooter, KarachiClock, ScrollProvider, GrainOverlay
├─ home/          UniverseSection, UniverseCanvas, HeroOverlay, ServicesHUD, SectorPanel,
│                 TerminalPanel, HandsAct, ManifestoAct, MarqueeBox, ProcessFlightPlan,
│                 SelectedWork, FAQRadio, TransitionStrip
├─ services/      ServicesHero, OrbitSelector, SectorExplorer, ModelsGrid, Toolbox
├─ about/         AboutHero, RadarCanvas, NumbersRow, PrincipleGrid, DisciplineMarquee, BaseCard
├─ projects/      ProjectsHero, ProjectSearch, FilterTabs, ProjectRow, NextProject
├─ project/       ProjectHead, OverviewBlock, FeatureGrid, ProcessSteps, PreviewFigure, TechStackGroups
├─ contact/       ContactHead, ContactList, PageDirectory
├─ products/      ComingSoon, NotifyForm
└─ icons/         Arrow, Search, Menu, social glyphs

content/
├─ site.ts        # name, contact, nav, footer, socials
├─ services.ts    # 9 sectors (home + services share this)
├─ projects.ts    # 6 projects, full case-study data
├─ process.ts     # 5 phases
├─ faq.ts         # 5 channels
├─ about.ts       # stats, principles, disciplines
└─ pages.ts       # contact directory, products copy

lib/
├─ seo.ts         # metadata factory, JSON-LD
├─ hooks/         useActProgress, useReducedMotion, useInView, useMounted
├─ clock.ts       # Asia/Karachi formatter
└─ scroll.ts      # Lenis init + progress bus

styles/           # section CSS modules co-located in components instead, if preferred
public/           # assets from this kit
```

## 3. Data model

```ts
// content/services.ts
export type Service = {
  index: number;                 // 1..9
  slug: string;                  // "cloud-data-engineering"
  family: string;                // "Data Architecture"
  title: [string, string];       // ["Cloud Data", "Engineering"]
  short: string;                 // description used on home HUD
  deliverables: string[];        // 3
  tech: string[];                // 6
  caseStudy?: { title: string; href: string };
  ctaLabel: string;              // "Start a Cloud Data Engineering project"
};

// content/projects.ts
export type Project = {
  index: number;                 // 1..6
  slug: string;
  title: string;
  category: string;              // "ML Engineering"
  year: number;                  // 2026
  group: "websites" | "cloud-devops" | "ai-ml";
  summary: string;
  stat: { value: string; label: string }[];   // exactly 3
  links: { label: string; href: string }[];   // GitHub / live site
  hero?: string;                 // /projects/<slug>.webp
  thumb?: string;                // /projects/thumbs/<slug>.webp
  preview?: string;              // /projects/architecture/<slug>.webp
  overview: string[];            // 1–2 paragraphs
  callout?: string;
  features: { title: string; body: string }[]; // 6
  steps: { title: string; body: string }[];    // 4
  stack: { group: string; items: string[] }[]; // 2–3
  metaTitle: string;
  metaDescription: string;
};

// content/faq.ts
export type Channel = {
  id: number;          // 1..5
  frequency: string;   // "88.4"
  question: string;
  answer: string;
};

// content/process.ts
export type Phase = {
  code: string;        // "T-04" … "T+∞"
  index: number;       // 1..5
  title: string;       // "Discover"
  body: string;
  duration: string;
  crew: string;
  deliverables: string[]; // 3
};
```

Content is the single source of truth: home HUD, services explorer and footer service links all read `services.ts`; the FAQ and process are shared. This prevents the drift seen in hand-copied sites.

## 4. Build phases

| Phase | Work | Est. |
|---|---|---|
| 0 · Setup | Scaffold, tokens, fonts, base reset, layout shell placeholders, CI (`tsc`, lint) | 0.5 day |
| 1 · Shell | Header + menu overlay + footer + clock + smooth scroll + grain + focus/reduced-motion plumbing | 1.5 days |
| 2 · Home A | Universe section: sticky 2800vh, hero overlay, HUD frame, 9 sector panels, terminal, progress bar (static art first) | 2.5 days |
| 3 · Home A (3D) | Three.js planet/starfield/camera path, DPR caps, fallbacks, mouse parallax | 2 days |
| 4 · Home B | Hands act, manifesto (white overlap), marquee box, flight-plan SVG process (light act) | 2.5 days |
| 5 · Home C | Selected work cards, FAQ radio (dial + typing), transition strip | 2 days |
| 6 · Services | Hero orbit, 9 panels, models, toolbox, CTA, anchors | 2 days |
| 7 · Projects | Index + search/filters + cards; case-study template + 6 content entries + next-project chaining | 2 days |
| 8 · About | Radar canvas, manifesto, numbers, principles, marquees, base card | 1.5 days |
| 9 · Contact/Products | Contact rows, page directory, coming soon + notify form | 1 day |
| 10 · SEO/a11y | Metadata, JSON-LD, sitemap, robots, headings, keyboard, contrast, reduced motion pass | 1 day |
| 11 · QA/perf | Responsive sweep 320→2560, Lighthouse, asset optimisation, cross-browser | 1.5 days |

Sequential ≈ **20 working days** for one senior engineer; parallelise 3D and content entry to compress to ~14.

## 5. Implementation notes per phase

### 5.1 Shell
- `layout.tsx` is a server component; wrap children in `<ScrollProvider>` (client) and `<SiteHeader/>`, `<SiteFooter/>`.
- `ScrollProvider` creates Lenis once, exposes a subscription API (no context re-render per frame).
- Body scroll lock when the menu is open: `document.documentElement.style.overflow='hidden'` + restore on close; preserve scrollbar width via `padding-right`.
- Clock: mount guard (`useEffect`) so SSR prints `--:--:-- PKT`.

### 5.2 Universe
- Keep the canvas mounted once; drive it from a mutable progress ref, not props, to avoid React renders at 60fps.
- Render the hero overlay as real DOM (text LCP), not canvas.
- Sector panels: all in DOM for SEO; visibility via CSS classes driven by the active index. `aria-hidden` on inactive panels, but keep them readable in the HTML source (use `hidden` only if SEO is not a concern — prefer `opacity` + `inert`).
- Scroll length: `2800vh` desktop, `1400vh` ≤900px, `auto` under reduced motion.
- Provide `noscript` styling so the hero and the nine sectors render as a normal stacked page.

### 5.3 Flight plan
- Do the route as SVG; compute `getTotalLength()` after fonts load and on resize.
- Phase cards in a horizontal track with `transform: translateX` (desktop) or a vertical stack (mobile).
- Light section: set `background:#fff` and all text via `--fp-*` tokens; verify the transition in/out doesn't flash.

### 5.4 FAQ
- Data: 5 channels. Only CH 01's answer exists in the capture; write the other four in the same voice (short, concrete, first-person plural), or ship the question with a one-line answer. Do not invent pricing numbers — the original answer for pricing was not captured.
- Typing: `setInterval` 18ms, clear on channel change/unmount; render full text immediately under reduced motion.
- Receiver is a radio group: `role="radiogroup"`, buttons `role="radio" aria-checked`, arrow keys move selection.

### 5.5 Projects
- Index filtering is client-side over a small list; use `useMemo` and `startTransition` for the tab change.
- Search matches `title + summary + tech.join(' ')`, lowercased, diacritic-insensitive.
- Detail pages: `generateStaticParams()` from `content/projects.ts`; `generateMetadata()` from `metaTitle/metaDescription`; JSON-LD `CreativeWork`.
- Guard `notFound()` for unknown slugs.

### 5.6 Forms
- **Notify (Products):** Server Action validating `z.string().email()`; on success return `{ok:true}` and show "You're on the list." No database required — log the address server-side, or forward to the studio inbox if SMTP is configured. Fallback: `mailto:metaversalsolution@gmail.com?subject=Notify%20me`.
- **Start a project / Ask about this:** build a `mailto:` with a prefilled subject (`Project enquiry — <service>`) and body template. Prefill service from `?service=` where present.
- Never expose an API key in the client; never add a third-party form service without the owner's consent.

### 5.7 SEO
- `metadataBase = https://metaversalsolution.com`.
- Per-route `title`, `description`, `alternates.canonical`, `openGraph.images = ['/brand/logo-512.png']`.
- `app/sitemap.ts`: 12 URLs with `lastModified`, priorities (`/` 1.0, services/projects 0.9, about/contact 0.8, products 0.5, case studies 0.7).
- `app/robots.ts`: allow all, `disallow: ['/universe/']`, sitemap URL.
- JSON-LD: `Organization` (name, url, logo, email, telephone, address Karachi, sameAs socials) site-wide; `BreadcrumbList` on case studies; `CreativeWork` per project.
- Do not add `noindex` to `/products`; the live site indexes it.

### 5.8 Performance
- Dynamic import the universe canvas: `const UniverseCanvas = dynamic(() => import('./UniverseCanvas'), { ssr:false })`.
- Preload 4 font faces max; `font-display: swap`.
- `next/image` with `sizes` — thumbs `(max-width:900px) 100vw, 45vw`; case-study hero `100vw`.
- Prefetch `/services` and `/projects` on hover of nav links.
- Set `export const dynamic = 'force-static'` where possible; the site is fully static.
- Budget check in CI: `@next/bundle-analyzer` once, then track the route JS size.

### 5.9 Browser support
Evergreen Chrome/Edge/Firefox/Safari 16+. `clip-path: circle()` and `100svh` are required; provide `@supports not (height:100svh)` fallback to `100vh`. WebGL fallback for the universe. Test iOS Safari specifically for sticky + `backdrop-filter` + `svh` interactions.

### 5.10 Accessibility implementation
- Skip link at the top: "Skip to content".
- Landmarks: `<header>`, `<nav aria-label="Primary">`, `<main id="main">`, `<footer>`.
- Menu overlay: `role="dialog" aria-modal="true" aria-label="Menu"`, focus trap, restore focus to the trigger on close.
- Canvases: `aria-hidden="true"`, `role="presentation"`.
- Word-by-word manifesto: keep a visually hidden full-text paragraph and mark the animated spans `aria-hidden="true"` to avoid a screen reader reading word fragments.
- Decorative numerals/eyebrows: `aria-hidden` where they duplicate semantic headings.
- Reduce motion: CSS media query + a `useReducedMotion` hook for JS-driven scenes.

## 6. Definition of done per phase

- `tsc --noEmit` and ESLint clean.
- No hydration warnings in dev console.
- Route renders with JS disabled (content readable, links work).
- 1440 and 390 widths reviewed; no horizontal scroll; no clipped display type.
- Keyboard-only pass for any new interactive element.
- Lighthouse ≥ 90 accessibility for the route.
