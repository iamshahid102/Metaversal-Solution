# 04 · Component Inventory

Build the shell first, then acts. Each component below lists its responsibility, props, states and the original CSS class it maps to. All styling comes from tokens (`02-design-system.md`).

## 1. Primitives (`components/ui/`)

| Component | Props | Variants / states | Notes |
|---|---|---|---|
| `Button` | `href?`, `variant`, `size`, `icon?`, `children` | `primary` (amber fill, ink text), `ghost` (1px cream border), `link` (underline on hover), `icon` (round arrow disc) | Renders `<a>` when `href`, else `<button>`. Hover: fill/glow + arrow translate 4px. Disabled: 40% opacity |
| `Pill` | `active?`, `as` | default / active (amber bg, ink text) | Used for filters, chips, menu CTA |
| `Chip` | `children`, `tone` | `tech` (hairline), `meta` (mono uppercase) | 11px mono, 999px radius |
| `Kicker` | `children`, `dot?`, `tone` | default / amber | Mono 12px, 0.14em tracking; `dot` adds pulsing amber dot |
| `SectionHeading` | `level`, `eyebrow?`, `lines: string[]`, `gradientLine?`, `align?` | h1/h2, left/center | Anton uppercase; supports amber-gradient second line |
| `Stat` | `value`, `label`, `suffix?` | default / large | Mono/display number + small label; tabular figures |
| `Hairline` | `inset?` | — | 1px cream 12% rule |
| `ArrowLink` | `href`, `children`, `dir?` | right / up-right / left / down | Typographic arrow, animated on hover |
| `Reveal` | `as`, `delay?`, `y?`, `once?` | — | IntersectionObserver fade+rise wrapper (respects reduced motion) |
| `Marquee` | `items`, `speed`, `direction`, `pausedOnHover` | — | Duplicated track, `aria-hidden` duplicate |

## 2. Global shell

| Component | Responsibility | Key details |
|---|---|---|
| `SiteHeader` | Fixed header, logo, desktop nav, menu trigger | Hides on scroll-down >400px, reveals on scroll-up; adds blur background after 24px; `--header-h:58px` |
| `MenuOverlay` | Full-screen circular-reveal navigation | `clip-path: circle()` from top-right trigger; body scroll lock; focus trap; `Esc`; staggered rows; `aria-expanded`/`aria-controls` |
| `NavLink` | Numbered nav item | index mono amber + label; active dot; hover translate |
| `SiteFooter` | CTA, brand, link columns, giant wordmark, legal bar | Cursor-tracked `--mx/--my` mask on wordmark; scroll-rise spans; `Back to orbit` |
| `KarachiClock` | Live PKT clock | `Intl.DateTimeFormat` with `Asia/Karachi`; placeholder `--:--:-- PKT` pre-mount; 1s interval; cleans up on unmount |
| `ScrollProgress` | Global 0–1 scroll progress via context | `requestAnimationFrame` + passive listener; consumers: HUD bar, acts |
| `SmoothScroll` | Lenis instance | Disabled under reduced motion and on touch? (keep on touch but with `syncTouch:false`) |
| `Cursor` (optional) | Custom cursor ring on desktop | Only if the original's cursor is confirmed; must not block clicks (`pointer-events:none`) |
| `GrainOverlay` | SVG noise layer | `opacity .05`, fixed, `pointer-events:none`, `aria-hidden` |
| `BackToTop` | `Back to orbit ↑` | Smooth scroll; honours reduced motion |

## 3. Home acts

### 3.1 `UniverseStage` (`components/home/universe/`)

| Component | Responsibility | Props |
|---|---|---|
| `UniverseSection` | 2800vh scroll wrapper + sticky stage + progress context | — |
| `UniverseCanvas` | Three.js starfield, planet, camera path | `progress`, `reducedMotion`, `quality` |
| `HeroOverlay` | Kicker, 3-line masked H1, sub-copy, CTAs, scroll cue | `progress` (fade 0–0.08) |
| `ServicesHUD` | Intro block + nine `SectorPanel`s + HUD frame | `progress` |
| `SectorPanel` | Eyebrow, counter, two-line title, description, 6 chips, explore link, planet art | `sector: Sector`, `index`, `active`, `progress` |
| `SectorPlanet` | CSS/SVG orbit diagram per sector | `index`, `active` |
| `TerminalPanel` | Outro headline, copy, Initiate Project, Enter Next Chapter, Back to Orbit | `visible` |
| `FlightBar` | Bottom HUD label + amber progress track | `progress` |

**Sector type**

```ts
type Sector = {
  index: number;           // 1..9
  family: string;          // "Data Architecture"
  title: [string, string]; // ["Cloud Data","Engineering"]
  description: string;
  tech: string[];          // exactly 6
  slug: string;            // "cloud-data-engineering"
};
```

### 3.2 Editorial acts

| Component | Responsibility | Notes |
|---|---|---|
| `HandsAct` | 520vh sticky hands image + headline | Image `images/hands-creation-of-adam.png`; zoom 1→1.08; brightness ramp |
| `ManifestoAct` | 200vh overlapping white manifesto with word-by-word reveal | Splits text into spans; `aria-label` full text for screen readers |
| `PrincipleCards` | 3 cards (Design-led, AI-first, End-to-end) | Also used on About with 4 items |
| `StatStrip` | 4 stats | 09 / 01 / 24h / ∞ |
| `MarqueeBox` | 250vh zipper/box reveal with marquee | `mb-*` classes; static fallback |
| `ProcessFlightPlan` | 520vh light section: SVG route, 5 nodes, travelling probe, phase cards | `fp-*`; sticky; see `05-motion-and-3d.md` |
| `PhaseCard` | Phase index/title/description/duration/crew/deliverables | `active` state |
| `RouteMap` | SVG path + nodes + probe | `progress`, `activePhase` |
| `SelectedWork` | 5 project cards | Uses `ProjectCard` with `compact` |
| `FAQRadio` | Receiver + stations + transcript | `fq-*`; roving tabindex; typed answer |
| `FrequencyDial` | Scale, ticks, needle | `activeFrequency` |
| `StationList` | 5 station buttons | `active`, keyboard support |
| `TransmissionPanel` | Question/answer transcript with caret | `channel`, `typedAnswer` |
| `TransitionStrip` | Counter-scrolling marquees + cursor starfield | `aria-hidden` decorative |

### 3.3 `ProjectCard`

```ts
type ProjectCardProps = {
  index: number;            // 1..6
  slug: string;
  category: string;
  year: number;
  title: string;
  summary: string;
  tech: string[];
  metric?: string;
  thumb?: string;           // /projects/thumbs/*.webp
  variant?: "reel" | "row";
};
```

States: default, hover (ring glow, image zoom 1.04, arrow shift), focus-visible (amber outline). `variant="reel"` = home 4:3 card; `variant="row"` = projects index editorial row.

## 4. Services page

| Component | Responsibility | Details |
|---|---|---|
| `ServicesHero` | H1, copy, hint | Two-column with orbit |
| `OrbitSelector` | 9 planet buttons on 3 rings | `active`, `onSelect(index)`; keyboard tab order 1→9; `aria-label` per planet |
| `SectorExplorer` | 9 × `SectorPanel` (full variant) | Scroll-spy sets `is-on`; anchors `#sector-0X` |
| `SectorArt` | Per-discipline orbital diagram + ghost numeral | CSS/SVG; `aria-hidden` |
| `DeliverablesList` | "What you get" 3 items | Check/arrow glyphs |
| `CaseStudyLink` | "Built by us →" or "Case study · Coming soon" | Data-driven |
| `ModelsGrid` | 3 engagement cards | Middle emphasised |
| `Toolbox` | Grouped tech chips (~60) | Optional discipline filter |
| `ServicesCTA` | "Not sure where to start?" | — |

## 5. About page

| Component | Responsibility |
|---|---|
| `AboutHero` | Canvas radar field + copy block + HUD labels |
| `RadarCanvas` | Rings, sweep, pings, stars; pauses off-screen/reduced motion |
| `Manifesto` | Word-by-word reveal (shared with home) |
| `NumbersRow` | 4 stats |
| `PrincipleGrid` | 4 numbered cards |
| `DisciplineMarquee` | Two counter-scrolling rows of 9 disciplines |
| `BaseCard` | Coordinates, PKT clock, `KHI`, radar rings, map grid |
| `AboutCTA` | "Your idea. Our crew." |

## 6. Projects

| Component | Responsibility | Details |
|---|---|---|
| `ProjectsHero` | Eyebrow, H1 "Projects .", copy, back link | — |
| `ProjectSearch` | Controlled search input | Debounce 120ms; `Esc` clears; `aria-label` |
| `FilterTabs` | ALL / WEBSITES / CLOUD & DEVOPS / AI & ML | `role="tablist"`; arrow-key navigation; active pill |
| `ProjectRow` | Editorial row card | Alternating image side; `ProjectCard variant="row"` |
| `EmptyState` | "No projects match…" | Shown when filters yield 0 |

Client-side filter logic: `projects.filter(p => (group === 'all' || p.group === group) && matches(p, query))`.

## 7. Project detail

| Component | Responsibility | Details |
|---|---|---|
| `ProjectCrumbs` | Back link + `0X / 06` | — |
| `ProjectHead` | Category · year, H1, summary, external links, 3 stats, hero image | External links conditional |
| `OverviewBlock` | H2 + paragraphs + optional callout | `callout` for Fabric |
| `FeatureGrid` | 6 numbered feature cards | 3×2 desktop |
| `ProcessSteps` | 4-step horizontal rail | Vertical under 900px |
| `PreviewFigure` | Architecture diagram + optional lightbox | Only 03/05 |
| `TechStackGroups` | 2–3 groups of chips | H3 per group |
| `NextProject` | Next link card | Wrap 06→01 |

## 8. Contact / Products

| Component | Responsibility | Details |
|---|---|---|
| `ContactHead` | H1, intro, sticky left column | — |
| `ContactList` | 5 rows + location | `tel:`, `mailto:`, external `rel="noopener noreferrer"` |
| `ContactRow` | Label/value/arrow row | Hover fill + arrow slide |
| `PageDirectory` | 5 numbered page cards | Excludes `/contact` |
| `PageCard` | Split two-line title, blurb, `Open page →` | Big index watermark |
| `ComingSoon` | Products hero | Amber core glow |
| `NotifyForm` | Email capture | `type=email`, required, inline error/success; `aria-live="polite"` |

## 9. Class map (reference CSS → component)

| Reference class | Component |
|---|---|
| `.nav`, `.nav-brand`, `.nav-menu`, `.nav-link` | `SiteHeader`, `NavLink` |
| `.sm-overlay`, `.sm-primary`, `.sm-side`, `.sm-contact` | `MenuOverlay` |
| `.universe-section`, `.universe-stage` | `UniverseSection` |
| `.hero-overlay-root`, `.hero-title`, `.hero-word` | `HeroOverlay` |
| `.services-hud-root`, `.hud-flight-bar` | `ServicesHUD`, `FlightBar` |
| `.hands-section`, `.hands-sticky` | `HandsAct` |
| `.abl-section`, `.abl-sticky` | `ManifestoAct` |
| `.mb-section`, `.mb-zip*`, `.mb-curtain*` | `MarqueeBox` |
| `.fp-section`, `.fp-sticky`, `.fp-route*`, `.fp-phase*` | `ProcessFlightPlan`, `RouteMap`, `PhaseCard` |
| `.pa-hero`, `.pa-body` | `ProjectsHero`, `ProjectRow` |
| `.pj-page`, `.pd2-*` | Project detail components |
| `.sv-page`, `.sv-hero`, `.sv-explorer`, `.sv-panel`, `.sv-models`, `.sv-toolbox` | Services components |
| `.ab-page`, `.ab-hero`, `.ab-radar*`, `.ab-*` | About components |
| `.fq-section`, `.fq-receiver`, `.fq-stations`, `.fq-msg` | `FAQRadio` |
| `.ct-page`, `.ct-list`, `.ct-item`, `.ct-pages` | Contact components |
| `.ft`, `.ft-cta`, `.ft-cols`, `.ft-mark`, `.ft-bar` | `SiteFooter` |

## 10. State ownership

| State | Owner | Consumers |
|---|---|---|
| Scroll progress (0–1 per act) | `UniverseSection`, `ProcessFlightPlan`, `HandsAct`, `ManifestoAct` | Their children |
| Active sector | `ServicesHUD` (derived from progress) | `SectorPanel`, `SectorPlanet` |
| Menu open | `SiteHeader` / layout context | `MenuOverlay` |
| Active FAQ channel | `FAQRadio` | Dial, station list, transcript |
| Project filters/search | `ProjectsExplorer` (client) | Tabs, rows, count, empty state |
| Clock string | `KarachiClock` | Footer + About base card |
| Notify form status | `NotifyForm` | Input, button, message |

Keep scroll-derived state **out of React** where possible (write CSS variables / transform directly in `rAF`); only promote to state when it changes discrete UI (active sector index, active phase). This is the single biggest performance decision on the site.
