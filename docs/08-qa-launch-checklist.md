# 08 · QA & Launch Checklist

## 1. Visual fidelity

- [ ] Side-by-side with the live site at **1440×900** for every route.
- [ ] Side-by-side at **390×844** for every route.
- [ ] Hero headline line breaks match (`We build` / `for ambitious` / `businesses.`).
- [ ] Display type is Anton uppercase with the same tracking; body is Plus Jakarta Sans.
- [ ] Amber is `#f7a224`, gold `#e0a864`, cream `#fbf0c2`, ink `#0d0805` — sample with a colour picker, not by eye.
- [ ] Flight-plan act is the only white section; its text is `#2b1a0d`.
- [ ] Hairlines are 1px at 12–14% cream alpha; no heavy borders anywhere.
- [ ] Footer wordmark is one line, edge-to-edge, and its lit copy aligns pixel-perfect with the base copy.
- [ ] Project cards use a 4:3 thumb with 18px radius and a gold ring.
- [ ] No pure `#fff` text and no pure `#000` backgrounds (except the light act's `#fff`).

## 2. Responsive

| Width | Check |
|---|---|
| 320 | No horizontal scroll; menu opens; hero type never clips; chips wrap |
| 390 / 430 | iPhone Safari: `svh` sticky works; canvas is not taller than the screen; footer clock visible |
| 768 | Two-column grids collapse cleanly; process is vertical |
| 900 | The exact switch point: inline nav hidden, menu button visible, layouts stack |
| 1024 | Tablet landscape: no orphaned cards |
| 1280 / 1440 | Reference desktop; containers cap at 1280 |
| 1920 / 2560 | Content centres; canvases fill; wordmark scales without overflow |
| 1440×720 (short) | `max-height:760px` rules apply: hints hidden, no clipped hero |
| 200% zoom @1440 | All copy reachable, no overlap |

- [ ] Resize mid-scroll at 50% of the universe: no stuck pin, correct panel.
- [ ] Rotate a phone while in a sticky act: no blank stage.
- [ ] Touch targets ≥ 44px; hover-only content duplicated on tap.

## 3. Motion

- [ ] Universe scroll length feels the same as the original (2800vh desktop; ~9 sectors evenly spaced).
- [ ] Hero copy fades/lifts before sector 01 arrives.
- [ ] Sector transitions cross-fade (no blank frame); counter snaps 01→09.
- [ ] Flight-plan probe follows the SVG path and never overshoots; active card changes at the same points as the live site.
- [ ] FAQ needle lands on the clicked frequency; answer types; caret blinks.
- [ ] Menu opens as a circle from the trigger, not a fade.
- [ ] Footer wordmark rises once on entry.
- [ ] Marquees loop seamlessly (no jump at the seam) and pause on hover.
- [ ] No animation continues off-screen (check CPU in DevTools performance monitor).

## 4. Reduced motion and preferences

- [ ] `prefers-reduced-motion: reduce`: no pinning, no marquees, no typing, no canvas loops.
- [ ] All content still visible and navigable (acts render stacked).
- [ ] `prefers-contrast: more` (optional): hairlines bump to 24% and body alpha to 80%.
- [ ] `prefers-reduced-data` / `saveData`: WebGL skipped, poster shown.
- [ ] Windows "Show animations" off behaves the same as reduced motion.

## 5. Accessibility

- [ ] One `h1` per page; headings descend without skipping.
- [ ] Skip link works and is visible on focus.
- [ ] All interactive elements reachable by Tab in a logical order; focus ring visible on dark **and** light acts.
- [ ] Menu: focus trapped, `Esc` closes, focus returns to the trigger.
- [ ] FAQ: arrow keys move channels; `aria-checked` correct; transcript announced politely (`aria-live="polite"`).
- [ ] Planets have accessible names and are buttons (not divs with click).
- [ ] Project filters are tabs or buttons with correct state; result count announced.
- [ ] Contact links use `tel:`/`mailto:`; external links `rel="noopener noreferrer"`.
- [ ] Images have alt (decorative ones `alt=""`); canvases `aria-hidden`.
- [ ] Contrast: body ≥ 4.5:1, large display ≥ 3:1; amber-on-ink verified at small sizes.
- [ ] Page usable with JS disabled: nav links, copy, project list and contact details present.
- [ ] Screen reader pass (NVDA or VoiceOver) on `/`, `/services`, one case study, `/contact`.
- [ ] Zoom 200% and text-spacing overrides don't clip.

## 6. Content

- [ ] All 12 routes carry the verbatim copy from `docs/09-content-copy.md`.
- [ ] Phone `+92 314 2316721` and email `metaversalsolution@gmail.com` correct everywhere.
- [ ] Project indexes `01/06`…`06/06`; next-project wraps 06→01.
- [ ] Home shows 5 projects, `/projects` shows 6.
- [ ] Counters: 09 services, 06 projects, 22 Nouvelle projects, 66 Fabric components, 43 AI features, 0.982 ROC-AUC, frequencies 88.4/92.7/97.1/101.5/106.9.
- [ ] Footer `© 2026` and "Crafted in Karachi, launched worldwide."
- [ ] Clock shows Asia/Karachi time and updates every second, with no hydration error.
- [ ] No lorem ipsum, no placeholder URLs, no `href="#"` except intentional stubs (documented).

## 7. SEO

- [ ] Unique title + description per route (see `03-page-specs.md §10`).
- [ ] Canonical URLs absolute and correct.
- [ ] OG/Twitter image `/brand/logo-512.png` resolves (absolute URL in metadata).
- [ ] `sitemap.xml` contains 12 URLs; `robots.txt` disallows `/universe/` and references the sitemap.
- [ ] JSON-LD validates (Rich Results Test): Organization, BreadcrumbList, CreativeWork.
- [ ] Semantic HTML: `main`, `section`, `nav`, `footer`; images with alt.
- [ ] 404 page styled (dark, links home) — `not-found.tsx`.
- [ ] No duplicate content between home and services sector descriptions (they intentionally overlap; keep titles distinct).
- [ ] Lighthouse SEO ≥ 95.

## 8. Performance

- [ ] Lighthouse mobile: performance ≥ 85, accessibility ≥ 95, best practices ≥ 95.
- [ ] LCP ≤ 2.5s (hero H1 text, not canvas).
- [ ] CLS < 0.02 (canvas and images have reserved space).
- [ ] INP < 200ms (no heavy work on menu open / filter click).
- [ ] Route JS ≤ 260 KB gzip on `/`; Three.js loaded after first paint.
- [ ] Fonts: ≤ 4 preloaded; no FOIT; total font bytes ≤ 220 KB on first load.
- [ ] Images served as WebP with `srcset`; Nouvelle hero lazy-loaded.
- [ ] No unused CSS > 20 KB; no `transition: all`.
- [ ] 60fps during universe on a mid-tier laptop; ≥ 45fps on a mid-range Android.
- [ ] Memory stable after 10 minutes of scrolling (no leaked rAF/listeners).

## 9. Cross-browser

| Browser | Focus |
|---|---|
| Chrome / Edge (Win) | Reference |
| Safari 17 (macOS/iOS) | `clip-path`, `backdrop-filter`, `svh`, sticky inside transforms, font rendering (Anton tracking) |
| Firefox | `scrollbar-width`, canvas performance, `mix-blend-mode` |
| Samsung Internet | WebGL fallback, sticky |
| iOS 16 | `100svh`, elastic overscroll at page top/bottom |

## 10. Functional

- [ ] All nav links resolve; active states match the current route.
- [ ] "How we work" → `/#process`, "FAQ" → `/#faq` land on the right sections with header offset.
- [ ] `Explore Capabilities` → `/services#sector-0X`, scrolled with `-58px` offset.
- [ ] Every service CTA → `/contact?service=<slug>` (or mailto) with the service named.
- [ ] Project cards → correct slug; external project links open in a new tab.
- [ ] Notify form: invalid email shows an inline error; valid email shows success; no console error; double submit guarded.
- [ ] "Back to orbit" scrolls to top smoothly (instant under reduced motion).
- [ ] 404 for unknown project slug.
- [ ] No console errors/warnings; no hydration mismatch.
- [ ] Print stylesheet (optional): dark backgrounds removed, text black.

## 11. Launch

- [ ] `npm run build` passes; `next start` smoke test.
- [ ] Environment variables documented (only needed if the notify action sends mail).
- [ ] `robots.txt` allows indexing (remove any staging `noindex`).
- [ ] Domain + HTTPS + `www` redirect decided; canonical host consistent.
- [ ] OG image absolute and cache-busted if replaced.
- [ ] Analytics/consent decision recorded (the original had none).
- [ ] Backups/ownership: assets and copy belong to Metaversal Solutions.
- [ ] Post-launch: submit sitemap, verify in Search Console, monitor 404s and Core Web Vitals.

## 12. Sign-off

| Area | Owner | Date | Result |
|---|---|---|---|
| Visual | | | |
| Motion/3D | | | |
| Responsive | | | |
| Accessibility | | | |
| Performance | | | |
| SEO | | | |
| Content | | | |
