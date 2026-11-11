# 01 · Project Brief

## 1. Objective

Rebuild **metaversalsolution.com** as a production-quality Next.js application that is indistinguishable from the original in layout, colour, typography, motion and content, while remaining maintainable (typed content model, componentised sections, tokenised styling).

The site is a studio portfolio and lead-generation surface. Its job is to make an ambitious buyer think *"this team can build anything"* within the first three seconds, then convert them to a call or email.

## 2. Success criteria

| # | Criterion | Measure |
|---|---|---|
| 1 | Visual fidelity | Side-by-side at 1440×900 and 390×844: no visible layout, colour or type differences in any section |
| 2 | Motion fidelity | Same scroll lengths, same easing curve, same reveal order, same idle loops (see `05-motion-and-3d.md`) |
| 3 | Content fidelity | All 12 routes carry the copy in `09-content-copy.md`, including counters, frequencies and project stats |
| 4 | Responsive | No horizontal scroll from 320px to 2560px; layouts collapse at the original breakpoints |
| 5 | Accessibility | Keyboard reachable, focus visible, `prefers-reduced-motion` honoured, AA contrast for body copy, semantic headings |
| 6 | Performance | Lighthouse mobile ≥ 85 performance, ≥ 95 accessibility/SEO; LCP ≤ 2.5 s on 4G; no CLS on hero |
| 7 | SEO | Per-page title/description/canonical, OG image, JSON-LD organisation + breadcrumbs, sitemap + robots matching the original |

## 3. In scope

- All 12 public routes: `/`, `/services`, `/about`, `/projects`, `/projects/{ai-fraud-detection,zurbez,aws-devops-pipeline,nouvelle-spaces,fabric-data-infrastructure,safar}`, `/products`, `/contact`.
- Global shell: fixed header, full-screen circular-reveal menu, footer with live Karachi clock and oversized wordmark.
- Eight home acts: universe hero (scroll-driven 3D + services HUD), hands, manifesto, marquee box, flight-plan process, selected work, radio FAQ, transition strip — then the shared footer.
- Services explorer (9 sectors), engagement models, toolbox.
- About (canvas hero, manifesto, numbers, principles, discipline marquee, Karachi base, CTA).
- Projects index with search + category filters; project detail template; next-project chaining.
- Products "coming soon" with notify capture.
- Contact cards and page directory.
- Asset pipeline, token system, copy deck, QA checklist.

## 4. Out of scope

- The hidden `/universe/` 3D experience (robots-disallowed; not captured).
- A CMS/admin. Content ships as typed TypeScript data; swapping in a CMS later is a data-source change only.
- Real form backend for "Notify me" (mailto/`fetch` stub is acceptable; see `07-build-plan.md`).
- Payments, auth, dashboards, localisation.
- Re-hosting the original brand assets for public redistribution.

## 5. Constraints and decisions

| Area | Decision | Reason |
|---|---|---|
| Framework | **Next.js 15 App Router + TypeScript** | Matches the original; server components for content, client components only for interactive acts |
| Styling | **Global CSS with custom properties** (`design/tokens.css` + per-section CSS modules) | The original is one hand-written stylesheet built on CSS variables; utility frameworks would fight the bespoke motion CSS |
| Fonts | **Self-hosted woff2** from `public/fonts`, declared via `fonts.css` | Matches original `next/font` self-hosting and avoids a third-party request |
| Animation | **CSS keyframes + IntersectionObserver + `requestAnimationFrame` scroll progress**; Lenis for smooth scroll | Original uses the same primitives; GSAP is optional and not required |
| 3D | **Three.js** for the universe starfield/planet flight; 2D canvas for the About radar | Preserves the signature moment without porting minified chunk code |
| Content | Typed TS modules in `content/` | Single source of truth, easy to diff against `09-content-copy.md` |
| Images | `next/image` with explicit dimensions; WebP where supplied | Layout stability and LCP |
| Icons | Inline SVG | No icon dependency; keeps the hairline aesthetic |
| Deployment | Vercel (or any Node host) | Original is Vercel-hosted |

## 6. Audience and design intent

- **Primary:** founders/CTOs at 10–200 person companies in Pakistan, the Gulf and the UK/US, buying a build or a dedicated crew.
- **Secondary:** marketing leads sourcing a 3D/AI-flavoured studio site.
- **Intent:** signal range (9 disciplines) and seniority (one crew, end to end) through craft, not claims. Every section is proof-of-craft: a scroll-scrubbed 3D flight, a physically modelled process route, a radio-tuned FAQ.
- **Conversion path:** sticky "Start a project" in the menu → contact page → `mailto:`/call. Secondary: per-service CTA, project detail CTA, footer email.

## 7. Non-negotiable details (easy to miss)

1. `--universe-scroll: 2800vh` on the hero wrapper; the stage is `position: sticky; height: 100svh`.
2. Header height token `--header-h: 58px`; hero content offsets account for it.
3. Menu reveal is a **`clip-path: circle()`** expanding from the menu button at top-right, `.8s` closed / `.9s` open, `cubic-bezier(.7,0,.2,1)`.
4. Home process section flips to a **light theme** (`#fff` background, `--fp-ink: #2b1a0d`).
5. FAQ is a **radio receiver**: 5 stations at 88.4 / 92.7 / 97.1 / 101.5 / 106.9 MHz, CH 01–05.
6. Footer clock shows **Asia/Karachi** time in `--:--:-- PKT` format, seeded with placeholders server-side to avoid hydration mismatch.
7. Project detail indexes are `01 / 06` … `06 / 06`; the "next project" chains 1→2→3→4→5→6→1.
8. Home shows **5** selected projects; `/projects` shows **6**.
9. Services "Built by us" links: Cloud Data → Fabric Data Platform, DevOps → AWS DevOps Pipeline, Web → Zurbez Storefront, AI Data Science / ML → AI Fraud Surveillance; App, UI/UX, Graphic, Blender say "Case study — Coming soon".
10. Copy case: "Let's" uses a typographic apostrophe in headings; counters pad to two digits.

## 8. Deliverables in this kit

- [x] This brief and seven further documents.
- [x] `design/tokens.css` and `design/fonts.css`.
- [x] All 54 font files + 22 image/brand files under `public/`.
- [x] Download manifests with source URLs.
- [x] Original HTML/CSS/JS/text under `reference/` for diffing.
- [ ] The coded application (next phase; `07-build-plan.md` sequences it).

## 9. Definition of done (build phase)

A route is done when: it matches the live site at both reference widths; all copy is present; all links resolve (no `href="#"` except intentional stubs); keyboard and reduced-motion paths work; Lighthouse budgets pass; and it has no console errors or hydration warnings.
