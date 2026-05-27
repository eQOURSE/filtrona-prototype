# Filtrona Academy — Proposal Source of Truth

**Audit date:** 27 May 2026
**Audited by:** code-level walkthrough of `d:\equourse\filtrona`
**Scope:** Read-only forensic audit of the entire repository, plus a forward-looking production-capability + commercial reference for the client proposal.

---

## How to read this document

- **Part A** is a forensic audit of the prototype as it exists in code today. Every claim cites a file path.
- **Part B** is the production v1.0 delivery scope — what we would ship if Filtrona engages us for a full programme.
- **Part C** maps everything against NAVEX requirements honestly.
- **Part D** estimates effort.
- **Part E** lists commercial reference data (no invented numbers).
- **Part F** is the risk register.
- **Part G** is the differentiator list, every item backed by a file path.
- **Part H** is direct guidance for whoever is writing the client proposal.

Tags used:
- **`DISCOVERED`** — found via this audit, was not flagged in prior context.
- **`UNCLEAR — needs founder review`** — meaningful detail the audit cannot resolve alone.

---

# Part A — The Audit (Current Prototype Reality)

## A.1 Project Identity

| Field | Value |
|-------|-------|
| Name | `filtrona` |
| Version | `0.1.0` |
| Framework | Next.js 16.2.6 (App Router) — note: AGENTS.md flags this as a non-LTS, breaking-changes release |
| Language | TypeScript 5.9.3, strict mode |
| UI runtime | React 19.2.4, React DOM 19.2.4 |
| Styling | Tailwind CSS v4 (via `@tailwindcss/postcss@4.3.0`); CSS-variable theming in `src/app/globals.css` |
| Animations | `framer-motion@12.40.0` (used heavily) |
| Icons | `lucide-react@1.16.0` |
| State | `zustand@5.0.13` with `persist` middleware |
| AI SDK | `@google/genai@2.6.0` — **DISCOVERED**: the chatbot is Google Gemini, not Anthropic Claude as previously believed (`src/app/api/chat/route.ts`) |
| Lint/format | ESLint 9 + `eslint-config-next@16.2.6` |
| Total source files | 57 (11 `.ts` + 46 `.tsx`) under `src/` |
| Total source LOC | 9,044 (TS + TSX combined) |

### Top-level configuration files

| File | Notable contents |
|------|------------------|
| `package.json` | Scripts: `dev`, `build`, `start`, `lint`. No test runner configured. |
| `next.config.ts` | Empty `NextConfig` — no custom redirects, headers, image domains, or experimental flags. |
| `tsconfig.json` | Strict mode on, `paths` alias `@/* → ./src/*`, target ES2017, `moduleResolution: bundler`. |
| `eslint.config.mjs` | Composes `eslint-config-next/core-web-vitals` and `eslint-config-next/typescript`. |
| `postcss.config.mjs` | Tailwind v4 plugin only. |
| `AGENTS.md` | Workspace rule: this Next.js version has breaking API changes; consult `node_modules/next/dist/docs/` before writing code. |
| `CLAUDE.md` | Re-exports `AGENTS.md` for Claude-flavoured agents. |
| `README.md` | Default `create-next-app` boilerplate. No project-specific docs. |
| `.env.local` | Contains `GEMINI_API_KEY=<value>` — **flagged**: a live API key is committed to the working tree. The key value is intentionally not reproduced in this document. The key should be rotated and `.env.local` confirmed git-ignored before any external repo sharing. (`.gitignore` already lists `.env*`, so it is excluded from VCS, but the working copy on disk does hold a live secret.) |
| `.vscode/settings.json` | 4-byte file (workspace settings stub). |

### Folder structure (3 levels deep, excluding `node_modules` and `.next`)

```
filtrona/
├── public/
│   ├── 3d-models/           ← 5 standalone Three.js viewers (DISCOVERED)
│   │   ├── ccf.html         (15.4 KB, 357 lines)
│   │   ├── cor.html         (13.9 KB, 348 lines)
│   │   ├── corinthian.html  (14.9 KB, 357 lines)
│   │   ├── cps.html         (13.0 KB, 322 lines)
│   │   └── vortex.html      (16.0 KB, 389 lines)
│   ├── audio/
│   │   ├── filter-types/    ← 8 real narration MP3s
│   │   └── placeholder-narration.mp3
│   ├── images-filters/      ← product photos + gallery thumbs
│   │   └── gallery-thumbs/
│   ├── bg-pattern.png, filtorna_bg.png, filtrona-logo.webp, finallogo.webp, etc.
├── src/
│   ├── app/
│   │   ├── api/chat/route.ts
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── topics/
│   │       ├── page.tsx
│   │       └── [slug]/
│   │           ├── page.tsx
│   │           ├── audio/page.tsx
│   │           ├── chatbot/page.tsx
│   │           ├── flashcards/page.tsx
│   │           ├── gallery/page.tsx
│   │           ├── mindmap/page.tsx
│   │           ├── quiz/page.tsx
│   │           ├── slides/page.tsx
│   │           ├── video/page.tsx
│   │           └── [subModule]/page.tsx
│   ├── components/
│   │   ├── chat/{ChatInterface,MessageBubble,SuggestedPrompts}.tsx
│   │   ├── gallery/FilterModel3DModal.tsx
│   │   ├── mindmap/FilterTypesMindMap.tsx
│   │   ├── quiz/{HeartsIndicator,QuestionMatch,QuestionMCQ,QuestionMultiSelect,
│   │   │       QuestionTrueFalse,QuizModeSelector,QuizRapidFire,QuizResults,
│   │   │       QuizShell,QuizStreakMode,ScoreParticles,StreakIndicator,TimerRing}.tsx
│   │   ├── slides/{AudioPlayer,CoachDrawer,ConnectedActionsBar,FilterSlide,
│   │   │         FilterVisual,SlideDeck,SlideNavigation}.tsx
│   │   ├── submodule/{CompletionCTA,NonHistoryPlaceholder,SubModuleHeader}.tsx
│   │   ├── Flashcard.tsx, SubModuleCard.tsx, ThemeToggle.tsx,
│   │   ├── TopicCard.tsx, TopNav.tsx
│   └── lib/
│       ├── chatbot-knowledge.ts
│       ├── filter-3d-models.ts
│       ├── flashcard-content.ts
│       ├── progress-store.ts
│       ├── quiz-content.ts
│       ├── slide-content.ts
│       ├── sound-effects.ts
│       ├── sub-modules.ts
│       ├── theme-store.ts
│       └── topics.ts
```

### Unusual / custom infrastructure

- **`public/3d-models/*.html`** — five hand-written Three.js viewers, embedded into the React UI via `<iframe>`. Not a typical Next.js asset. **DISCOVERED**.
- **`public/audio/filter-types/*.mp3`** — eight real narration files. **DISCOVERED**: these play through both the standalone audio sub-module and through every slide in the deck.
- **No test runner**, no Jest/Vitest config, no `__tests__` folders. Test infrastructure must be set up for v1.0.
- **No CI/CD config files** (`.github/workflows`, `.gitlab-ci.yml`) found.



## A.2 Page-by-Page Audit (every route under `src/app/`)

### `/` — Landing page

- File: `src/app/page.tsx` (181 LOC)
- Renders: full-screen hero, animated gradient orbs, animated grid overlay, Filtrona logo, "Learn how the world filters." H1, CTA "Start Learning" routing to `/topics`, footer pill "~18 minutes · 1 module ready".
- Components used: inline only — no external components.
- Interactions: CTA click → `/topics`. Reduced-motion aware (`useReducedMotion`).
- Data sources: none (static).
- Advanced features: 3 drifting `motion.div` orb backgrounds with infinite loop animations; CSS grid overlay with radial mask; `staggerContainer`/`fadeSlideUp` Framer Motion variants on the hero copy.

### `/topics` — Topic catalogue

- File: `src/app/topics/page.tsx` (105 LOC)
- Renders: `TopNav` (sticky), "Choose your path" header, two grids — Unlocked topics (1 column) and "Up Next" locked topics (1/2/3 columns responsive).
- Components used: `TopNav`, `TopicCard`.
- Interactions: clicking an unlocked card navigates to `/topics/{slug}`; locked cards are visually disabled (`role="presentation"`, `aria-disabled`).
- Data sources: `src/lib/topics.ts`.
- Advanced features: stagger animation on card grid; SSR-safe mount gate for reduced-motion fallback.

### `/topics/[slug]` — Module landing

- File: `src/app/topics/[slug]/page.tsx` (137 LOC)
- Renders: per-topic header with back link, title, description, completion stats (`X / Y complete`, total minutes, sub-module count), animated progress bar, then a 1/2/3/4-column responsive grid of `SubModuleCard`s.
- Components used: `TopNav`, `SubModuleCard`.
- Interactions: gates locked topics (returns "Topic not available" placeholder); each sub-module card routes to `/topics/{slug}/{subModuleId}`.
- Data sources: `src/lib/topics.ts`, `src/lib/sub-modules.ts`, `src/lib/progress-store.ts` (Zustand).
- Advanced features: live completion percentage from persisted Zustand store; SSR-safe hydration via `mounted` flag.

### `/topics/[slug]/slides` — Slide deck

- File: `src/app/topics/[slug]/slides/page.tsx` (204 LOC)
- Renders: forks by slug.
  - **`filter-types`** → `<SlideDeck>` (carousel) with five filter slides.
  - **`history`** → `<LegacyTimeline>` (vertical milestone timeline with year nodes).
  - **other** → "Placeholder for {slug}" stub.
- Components used: `TopNav`, `SlideDeck`, `LegacyTimeline` (in-file).
- Interactions for `filter-types`: keyboard arrows / Home / End, drag-to-swipe, dot navigation, per-slide audio, "View 360° 3D Model" button, Connected Actions Bar, "Ask Coach" drawer.
- Data sources: `src/lib/slide-content.ts`, `src/lib/progress-store.ts`.
- Advanced features: AnimatePresence slide transitions, `motion.div` `drag="x"` with velocity-based swipe detection, intersection-observer-driven `whileInView` reveals on the legacy timeline.

### `/topics/[slug]/quiz` — Quiz hub

- File: `src/app/topics/[slug]/quiz/page.tsx` (38 LOC)
- Renders: thin shell that mounts `<QuizModeSelector>`.
- Components used: `TopNav`, `QuizModeSelector`.
- Interactions: choose between Classic, Streak, or Rapid Fire mode.
- Data sources: `src/lib/quiz-content.ts`, `src/lib/progress-store.ts`.

### `/topics/[slug]/video` — Related video

- File: `src/app/topics/[slug]/video/page.tsx` (244 LOC)
- Renders: `SubModuleHeader`, info banner, big 16:9 mock player with central play button, gradient overlay, "PREVIEW" pill, three chapter cards.
- Components used: `TopNav`, `SubModuleHeader`, `CompletionCTA`, `NonHistoryPlaceholder`.
- Interactions: clicking play / chapter swaps the player overlay for an info card ("Full video coming in v1.0"); chapters track viewed-state in local React state and unlock the completion CTA when all are viewed.
- Data sources: hardcoded `videoByTopic` chapter list (in-file).
- Advanced features: `AnimatePresence` overlay swap; AnimatePresence-gated completion CTA. **No real video element is rendered — this is a mockup.**

### `/topics/[slug]/mindmap` — Mind map

- File: `src/app/topics/[slug]/mindmap/page.tsx` (418 LOC)
- Renders: forks by slug.
  - **`filter-types`** → mounts `<FilterTypesMindMap>` (the rich, animated, hover-enabled custom mind map).
  - **`history`** → SVG-based 6-branch radial mind map with hand-positioned nodes, leaves, curved Bezier connector paths, hover state, dashed lines for "Future" branch, pop-in animations per branch.
  - **other** → `<NonHistoryPlaceholder>`.
- Components used: `TopNav`, `SubModuleHeader`, `CompletionCTA`, `NonHistoryPlaceholder`, `FilterTypesMindMap`.
- Data sources: hardcoded `BranchDef` arrays for both topics (in-file).
- Advanced features: SVG-rendered radial layout, programmatic Bezier connector generation (`curvePath`), `motion.g` per-node spring entrance, hover-driven highlight, multi-line text wrapping with `splitLabel`. Footer caption: "This is a static preview. Interactive zoom, drag, and search are in v1.0." — note: the `filter-types` mindmap goes much further than the `history` one (see Component Audit).

### `/topics/[slug]/flashcards` — Flashcards

- File: `src/app/topics/[slug]/flashcards/page.tsx` (253 LOC)
- Renders: header, optional "resume" banner, animated card area, action row with "Got it" / "Review again", completion card.
- Components used: `TopNav`, `Flashcard`.
- Interactions: tap to flip, Space (flip), → / G (Got it), ← / R (Review again). Cards marked Review get re-queued at the back.
- Data sources: `src/lib/flashcard-content.ts`, `src/lib/progress-store.ts`.
- Advanced features: directional AnimatePresence (forward / backward), keyboard shortcuts, persistent completion state, retry flow.

### `/topics/[slug]/audio` — Audio overview

- File: `src/app/topics/[slug]/audio/page.tsx` (302 LOC)
- Renders: `SubModuleHeader`, tip banner, full audio player card (gradient album art, current chapter, progress bar with click-to-seek, play/skip ±10s controls, chapter list with "Listened ✓" markers), completion CTA when all chapters listened.
- Components used: `TopNav`, `SubModuleHeader`, `CompletionCTA`, `NonHistoryPlaceholder`.
- Interactions: real `<audio>` element streams `/audio/filter-types/*.mp3`; click chapter to switch + auto-play; auto-advances on `onEnded`; click progress bar to seek; ±10s skip buttons.
- Data sources: hardcoded `audioByTopic` chapter list (in-file) referencing `/audio/filter-types/{intro,slide1..5,summary,closing}.mp3`.
- Advanced features: live audio playback, seek-by-click on the progress bar, chapter auto-advance, real-time `onTimeUpdate` and `onLoadedMetadata` synced UI, listened-state tracking unlocks completion gate.

### `/topics/[slug]/gallery` — 2D / 3D gallery

- File: `src/app/topics/[slug]/gallery/page.tsx` (314 LOC)
- Renders: `SubModuleHeader`, masonry-ish grid (sm:1 / sm:2 / lg:3 columns with `row-span` and `col-span` overrides) of cards. Each card: dark overlay over either a thumbnail PNG (filter-types) or a CSS gradient (history), "3D Model" badge, year/code pill.
- Components used: `TopNav`, `SubModuleHeader`, `CompletionCTA`, `NonHistoryPlaceholder`, `FilterModel3DModal`.
- Interactions: click a `filter-types` card → opens `<FilterModel3DModal>` showing the live Three.js viewer in an iframe. Click a `history` card → fallback gradient modal. ESC to close.
- Data sources: hardcoded `galleryByTopic` (in-file), `src/lib/filter-3d-models.ts`.
- Advanced features: live 3D model viewer (per filter), `whileInView` staggered card entrance, `whileHover` scale, body-scroll lock during modal.

### `/topics/[slug]/chatbot` — Ask the Coach (standalone)

- File: `src/app/topics/[slug]/chatbot/page.tsx` (108 LOC)
- Renders: header (back link, "08 · Chatbot" pill, "Ask the Coach", per-topic intro line) + `<ChatInterface topicSlug={...}>`.
- Components used: `TopNav`, `ChatInterface`, `NonHistoryPlaceholder` (in-file fork for unsupported topics).
- Interactions: full chat — see Component Audit for `ChatInterface`.
- Data sources: `src/lib/chatbot-knowledge.ts`, calls `POST /api/chat`.
- Advanced features: live AI conversation, localStorage history, mark-complete banner after 3 user turns.

### `/topics/[slug]/[subModule]` — Generic placeholder

- File: `src/app/topics/[slug]/[subModule]/page.tsx` (139 LOC)
- Renders: centered icon, "COMING NEXT" pill, sub-module title pulled from `subModules` array, body copy, back-links.
- Components used: `TopNav`.
- Purpose: catch-all for any sub-module slug not handled by a specific named route. Looks visually identical to `NonHistoryPlaceholder`.

### `/api/chat` — Chat API

- File: `src/app/api/chat/route.ts` (112 LOC)
- Runtime: `nodejs`.
- Method: `POST`. Body: `{ messages: [{role, content}], topicSlug, currentFilter? }`.
- Behaviour:
  - Validates `messages` and `topicSlug`.
  - Returns a graceful canned response when `topicSlug` is not in the knowledge base.
  - Reads `GEMINI_API_KEY` from env; returns 503 if absent.
  - Builds a system prompt that includes the topic's full knowledge base + an optional "currently viewing {filterName} slide" context line.
  - Calls Gemini `gemini-2.5-flash` (primary). On any error, falls back to `gemini-2.0-flash`.
  - Config: `maxOutputTokens: 600`, `temperature: 0.7`.
  - Logs failures via `console.warn` / `console.error`.
  - Returns `{ message: string }` or `{ error: string }` with appropriate HTTP code.

---

## A.3 Component-by-Component Audit (`src/components/`)

| File | LOC | What it does | Notable libs / patterns |
|------|-----|--------------|--------------------------|
| `TopNav.tsx` | 53 | Sticky 72-px header with logo, overall progress bar (mounted via Zustand `getOverallProgress`), profile avatar. | `next/image`, `next/link`, `useProgressStore`. |
| `TopicCard.tsx` | 201 | Topic catalogue card. Two states (unlocked button, locked div). Per-accent gradient theme with hover-shadow swap, decorative circles, animated diagonal sheen, mesh dot overlay, animated arrow CTA. | Lucide icons, accent map, hover-driven inline shadow change. |
| `SubModuleCard.tsx` | 227 | Sub-module tile inside a module. Three states (unavailable, available, completed) with rich gradients, animated icon rotation, completion ring, arrow hint. | Zustand `isComplete`, lucide icons, custom accent themes. |
| `Flashcard.tsx` | 117 | 3D-flip card (`transform-style: preserve-3d`, `rotateY`). Front shows question + optional hint, back shows answer. | CSS 3D transforms, Lucide icons, ARIA tabIndex/role. |
| `ThemeToggle.tsx` | 8 | Stub that returns `null` — theme is locked to light. (Imports kept for legacy.) | — |
| `chat/ChatInterface.tsx` | 383 | The full chat UI: hydration from `localStorage`, persistence on every change, auto-scroll on message/typing change, auto-grow textarea, optimistic send, error retry, mark-complete banner after 3 user turns, "Clear" with confirm, suggested prompts in empty state. | Web Fetch, localStorage, AnimatePresence, custom typing-dot CSS animation in `globals.css`. |
| `chat/MessageBubble.tsx` | 105 | Differentiates user vs assistant bubbles. Assistant messages get a tiny markdown renderer (escapes HTML, then handles `**bold**`, `*italic*`, `\n`). Error bubbles get a Retry button. | Hand-rolled markdown subset, `dangerouslySetInnerHTML` (assistant only — user content is rendered as plain text). |
| `chat/SuggestedPrompts.tsx` | 34 | 4 suggested-prompt buttons per topic. Override-able from props (used by the in-slide drawer). | — |
| `gallery/FilterModel3DModal.tsx` | 105 | Half-screen modal that loads `model.iframeSrc` (e.g. `/3d-models/cps.html`) inside a sandboxed iframe; bottom info panel with badge, code, full name, description; ESC-to-close, body-scroll lock, click-outside dismiss. | `framer-motion`, sandboxed iframe with `allow-scripts allow-same-origin`. |
| `mindmap/FilterTypesMindMap.tsx` | 399 | A purpose-built interactive mind map for Filter Types — see "Advanced Features Discovery" section A.6. | Lucide icons, custom CSS keyframes via inline `<style>`, multi-stage choreographed animation, mobile accordion fork, per-branch color theme, click-to-deep-link. **DISCOVERED**: this is far richer than the static SVG used for the History mind map. |
| `quiz/HeartsIndicator.tsx` | 65 | Renders 1–3 hearts; lost-heart shake animation via Framer keyframes; reduced-motion fallback. | AnimatePresence per heart, `useReducedMotion`. |
| `quiz/StreakIndicator.tsx` | 75 | Streak counter with tiered styling: 0 (muted), 1+ (orange), 3+ (green glow), 5+ (purple glow), 7+ (rainbow gradient text + breathing animation). | `useReducedMotion`, drop-shadow filter. |
| `quiz/TimerRing.tsx` | 131 | 64-px SVG ring with `requestAnimationFrame` per-frame countdown, color-tier transitions (blue → orange → red), pulse animation under 25%, pause/resume support. | `requestAnimationFrame` (not `setInterval`), inline CSS keyframes. |
| `quiz/ScoreParticles.tsx` | 95 | 12-particle burst on every correct answer; particles fly outward at random angles with random distances; reduced-motion fallback emits a single flash dot. | AnimatePresence, fixed-position overlay, math-based angle distribution. |
| `quiz/QuestionMCQ.tsx` | 84 | A/B/C/D MCQ. Unsubmitted: navy hover. Submitted: green correct, red wrong with check/cross. | Tailwind + CSS variables. |
| `quiz/QuestionTrueFalse.tsx` | 109 | Two big True/False buttons; full submit-state styling (green correct, red wrong). | — |
| `quiz/QuestionMultiSelect.tsx` | 101 | Checkbox list; submit-state shows `Missed` pill on un-selected correct answers, red on wrongly-selected. | — |
| `quiz/QuestionMatch.tsx` | 176 | Click-left-then-right pairing UI with live colored connector strokes, 4-tier pair color cycling, break-pair-by-clicking-existing logic. | Hand-rolled match interaction, no external lib. |
| `quiz/QuizShell.tsx` | 266 | The Classic quiz orchestrator: progress strip, current question render, AnimatePresence transition, submit/skip, post-submit explanation card, end-of-quiz `<QuizResults>` handoff. | AnimatePresence, controlled answer state. |
| `quiz/QuizStreakMode.tsx` | 714 | The gamified mode: hearts, streak, score, timer ring, particle burst, screen shake, sound effects, autoplay-advance progress, mute toggle, game-over screen with skull animation, finish screen with bronze/silver/gold ranks (≥80 silver, ≥140 gold, otherwise bronze). | All quiz primitives + `lib/sound-effects` + Web Audio API. **The biggest single component in the repo.** |
| `quiz/QuizRapidFire.tsx` | 435 | 60-second time-attack mode: questions cycle, no second chances, flash overlay on result, personal best to localStorage (`filtrona-rapidfire-best-{slug}`). | Performance-time-based smooth countdown, localStorage best-tracking. |
| `quiz/QuizResults.tsx` | 112 | Post-classic results: conic-gradient score ring, breakdown row per question (correct/wrong/skipped), retry / mark-complete actions. | CSS conic-gradient. |
| `quiz/QuizModeSelector.tsx` | 269 | Three-card picker (Classic / Streak / Rapid Fire). Streak is `recommended`. Pulls best result from store / localStorage. | `useProgressStore`, hover-y motion. |
| `slides/SlideDeck.tsx` | 195 | Filter-types carousel: AnimatePresence directional transitions, drag-to-swipe (`drag="x"` + velocity), keyboard navigation (arrows, Home, End), nav arrows, ConnectedActionsBar mount per slide, CoachDrawer trigger, FilterModel3DModal trigger, end-of-deck completion CTA. | Framer drag + AnimatePresence, gallery 3D modal reuse. |
| `slides/FilterSlide.tsx` | 128 | Two-column layout (45% visual / 55% content). Left: `FilterVisual`, "View 360° 3D Model" button. Right: tag pill, filter name, full name, italic tagline, embedded `<AudioPlayer>`, key-specs checklist with check icons, "How It Works" body. | — |
| `slides/FilterVisual.tsx` | 74 | Circular product image with 60-second auto-rotation animation; reduced-motion media-query halts the spin; per-accent radial glow; hover scale. | `next/image` with static imports, inline `<style jsx>` keyframes. |
| `slides/AudioPlayer.tsx` | 141 | Per-slide narration player: real `<audio>`, play/pause, rewind, decorative volume icon, time display, progress bar, auto-pause on slide change via `slideKey` effect. | Native HTML5 audio. |
| `slides/SlideNavigation.tsx` | 71 | Dot indicators (active dot widens to 24 px) + thin progress bar. Per-accent color. | — |
| `slides/ConnectedActionsBar.tsx` | 85 | Footer bar with 4 deep-link buttons (Video, Mind Map, Quiz, Flashcards) routed with query params (e.g. `?focus={slide.id}`, `?chapter={index}`, `?highlight={slide.id}`) + an "Ask Coach" button that triggers the in-slide drawer. | `next/link` with deep-link query strings. **DISCOVERED**: every slide cross-links to all other formats. |
| `slides/CoachDrawer.tsx` | 113 | Right-side drawer (max-width 420 px) that opens an in-slide `<ChatInterface compact currentFilter={...} suggestedPromptsOverride={...}>`. ESC-to-close, click-outside backdrop. Hardcoded per-filter prompt list (cps/cor/ccf/corinthian/vortex). | AnimatePresence slide-in, chat re-mount with filter-aware system prompt. |
| `submodule/SubModuleHeader.tsx` | 59 | Reusable header with back link, accent pill, H1, subtitle. | — |
| `submodule/CompletionCTA.tsx` | 78 | Reusable "Mark complete" card with `whileInView` reveal; respects already-complete state ("Revisit completed ✓"); navigates back to module page on click. | Zustand `markComplete` / `isComplete`. |
| `submodule/NonHistoryPlaceholder.tsx` | 109 | Standardized "COMING NEXT" placeholder for `video|mindmap|audio|gallery` on topics that aren't `filter-types` or `history`. | Used by 4 sub-module routes. |

### Particularly clever / advanced patterns worth highlighting

- `quiz/TimerRing.tsx`: `requestAnimationFrame` smooth countdown that pauses cleanly on phase change without time drift (`startValueRef` + `startTimeRef`). Better fidelity than a `setInterval`.
- `quiz/ScoreParticles.tsx`: angle-distributed particle burst with reduced-motion fallback in the same component.
- `slides/AudioPlayer.tsx`: `slideKey` prop drives an effect that auto-pauses the audio when the parent slide changes — clean separation of concerns.
- `slides/SlideDeck.tsx`: drag-to-swipe with velocity threshold (`velocity.x < -500`) is a polished UX detail that competes with native carousels.
- `mindmap/FilterTypesMindMap.tsx`: 5-stage choreographed entrance (center pulse → tag drop → line draw → node pop → interactive) plus a separate mobile-only accordion render path.
- `chat/ChatInterface.tsx`: cleans error bubbles from history before re-sending so the model doesn't replay them; persists to localStorage but skips the first SSR mount via a `hydrated` flag.

---

## A.4 Content & Data Audit (`src/lib/`)

| File | Path | Exports | Summary |
|------|------|---------|---------|
| `topics.ts` | `src/lib/topics.ts` | `Topic`, `topics` | 6 topics defined: `history` (locked), `filter-types` (unlocked), `materials`, `htp`, `sustainability`, `market` (all locked). Each: slug, title, description, sub-module count, estimated minutes, lucide icon name, accent. **Only `filter-types` has `unlocked: true`.** |
| `sub-modules.ts` | `src/lib/sub-modules.ts` | `SubModule`, `subModules` | 8 sub-modules: slides, quiz, video, mindmap, flashcards, audio, gallery, chatbot. All have `available: true`. |
| `slide-content.ts` | `src/lib/slide-content.ts` | `FilterSlide`, `TimelineMilestone`, `filterSlides`, `historyMilestones`, `getSlidesForTopic` | 5 fully-written filter slides for filter-types (CPS, COR, Coaxial Core, Corinthian, Vortex), each with tagline, 4 key specs, "How It Works" body, audio URL, video chapter index, related quiz IDs. 8 history milestones (1854 → 2024) for `history`. |
| `quiz-content.ts` | `src/lib/quiz-content.ts` | `QuizQuestion`, `historyQuestions`, `filterTypesQuestions`, `getQuestions` | **8 questions per topic** (16 total) across all 4 question types: 3× MCQ, 2× true/false, 1× multiselect, 2× match. Each question has full explanation copy. |
| `flashcard-content.ts` | `src/lib/flashcard-content.ts` | `Flashcard`, `historyFlashcards`, `filterTypesFlashcards`, `getFlashcards` | **8 flashcards per topic** (16 total). Each: front, back, optional hint, accent. |
| `chatbot-knowledge.ts` | `src/lib/chatbot-knowledge.ts` | `HISTORY_KNOWLEDGE_BASE`, `FILTER_TYPES_KNOWLEDGE_BASE`, `KNOWLEDGE_BY_TOPIC` | Two long markdown knowledge bases. The history KB covers 8 timeline milestones, key people, naming sequence, modern footprint, centenary detail. The filter-types KB covers all 5 filters with technology, primary use case, and a "How to Choose" decision matrix. The Coach is grounded only in these two strings. |
| `filter-3d-models.ts` | `src/lib/filter-3d-models.ts` | `FilterModel3D`, `filterModels`, `getFilterModelById` | 5 model entries (cps, cor, ccf, corinthian, vortex) — code badge, full name, subtitle, marketing description, badge color, theme color hex, thumbnail path, iframeSrc path to `/3d-models/{id}.html`. |
| `progress-store.ts` | `src/lib/progress-store.ts` | `SubModuleId`, `useProgressStore` | Zustand store with `persist` (key: `filtrona-progress`). Tracks per-topic `completed` array, `lastVisited`, optional `quizResult { score, total, mode, bestStreak }`. Methods: `markComplete`, `isComplete`, `getModuleCompletionPercent`, `getOverallProgress`, `saveQuizScore`, `getQuizScore`, `resetProgress`. The overall denominator is hardcoded to `UNLOCKED_TOPICS.length × 8 = 8`. |
| `theme-store.ts` | `src/lib/theme-store.ts` | `useThemeStore` | Persisted Zustand store, but `setTheme` and `toggleTheme` are no-ops — theme is locked to light. Vestigial. |
| `sound-effects.ts` | `src/lib/sound-effects.ts` | `playCorrect`, `playWrong`, `playStreakUp`, `playGameOver`, `isMuted`, `toggleMute` | **Web Audio API synthesis**: generates 4 distinct sound effects via oscillators (sine/sawtooth/triangle), 0.08 gain, with linear ramps. Mute preference persisted to `localStorage` under `filtrona-quiz-sound`. **No audio assets needed for quiz feedback.** **DISCOVERED**. |

### Content depth, quantified

| Topic | Slides | Quiz Qs | Flashcards | Chatbot KB chars | Audio MP3s | 3D models |
|-------|--------|---------|------------|------------------|------------|-----------|
| `history` | 8 milestones | 8 | 8 | ~5,000 | 0 | 0 |
| `filter-types` | 5 filters (full slide content) | 8 | 8 | ~2,000 | 8 | 5 |
| `materials` | 0 (locked) | 0 | 0 | 0 | 0 | 0 |
| `htp` | 0 (locked) | 0 | 0 | 0 | 0 | 0 |
| `sustainability` | 0 (locked) | 0 | 0 | 0 | 0 | 0 |
| `market` | 0 (locked) | 0 | 0 | 0 | 0 | 0 |

The prototype is genuinely complete for `filter-types` (8/8 sub-modules content-ready) and partially built for `history` (slides + quiz + flashcards + chatbot KB ready, but the topic itself is locked behind `topics.unlocked = false`).

---

## A.5 Assets Audit (`public/`)

### 3D models — `public/3d-models/` (DISCOVERED as live Three.js, not GLTF)

| File | Size | Lines | Three.js | OrbitControls | Annotations | ExtrudeGeometry | MeshPhysicalMaterial | Reflector | autoRotate |
|------|------|-------|----------|---------------|-------------|------------------|----------------------|-----------|------------|
| `cps.html` | 13.0 KB | 322 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| `cor.html` | 13.9 KB | 348 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| `ccf.html` | 15.4 KB | 357 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| `corinthian.html` | 14.9 KB | 357 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| `vortex.html` | 16.0 KB | 389 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |

Every viewer uses Three.js r128 from CDN (`https://cdnjs.cloudflare.com/.../three.min.js`), `OrbitControls` for drag-to-rotate / scroll-to-zoom, `Reflector` for ground reflection, `MeshPhysicalMaterial` for PBR shading, `ACESFilmicToneMapping`, multi-light rigs (ambient + directional + spot rim + point fill), `ExtrudeGeometry` for procedural cross-section shapes, `FogExp2` for atmospheric depth, **HTML annotation overlays** with dotted leader lines, "Drag to rotate, scroll to zoom" toast hints, and `autoRotate` that disengages on first user interaction.

These are **procedurally generated 3D filter cross-sections**, not loaded `.glb` files. There are **no `.glb` or `.gltf` files** in the repository.

### Audio — `public/audio/`

| File | Size | Used by |
|------|------|---------|
| `audio/filter-types/intro.mp3` | 884 KB | Audio sub-module chapter 1 |
| `audio/filter-types/slide1.mp3` | 497 KB | CPS slide narration + audio chapter 2 |
| `audio/filter-types/slide2.mp3` | 443 KB | COR slide narration + audio chapter 3 |
| `audio/filter-types/slide3.mp3` | 631 KB | Coaxial Core slide narration + audio chapter 4 |
| `audio/filter-types/slide4.mp3` | 623 KB | Corinthian slide narration + audio chapter 5 |
| `audio/filter-types/slide5.mp3` | 561 KB | Vortex slide narration + audio chapter 6 |
| `audio/filter-types/summary.mp3` | 329 KB | Audio sub-module chapter 7 |
| `audio/filter-types/closing.mp3` | 323 KB | Audio sub-module chapter 8 |
| `audio/placeholder-narration.mp3` | 0.4 KB | Stub fallback |

Total filter-types audio: **~4.3 MB** across 8 files. **DISCOVERED**: every audio file is real and wired through both `src/components/slides/AudioPlayer.tsx` (per-slide playback) and `src/app/topics/[slug]/audio/page.tsx` (full chapter player).

### Images — `public/images-filters/`

| File | Size |
|------|------|
| `cps.jpeg` | 132 KB |
| `cor.jpeg` | 131 KB |
| `corinthian.jpeg` | 180 KB |
| `ccf.jpeg` | 145 KB |
| `vortex.jpeg` | 120 KB |
| `gallery-thumbs/cps.png` | 729 KB |
| `gallery-thumbs/cor.png` | 750 KB |
| `gallery-thumbs/corinthian.png` | 713 KB |
| `gallery-thumbs/ccf.png` | 702 KB |
| `gallery-thumbs/vortex.png` | 856 KB |

Top-level: `bg-pattern.png` 2.3 MB, `filtorna_bg.png` 2.3 MB, `filtrona-logo.webp` 23 KB, `finallogo.webp` 47 KB, `next.svg`, `vercel.svg`, `globe.svg`, `window.svg`, `file.svg`.

**No fonts in `public/`** — `Inter` is loaded via `next/font/google` in `src/app/layout.tsx`.

### Other media

None — no `.glb`, no `.gltf`, no `.webm`, no `.mp4`.



## A.6 Advanced Features Discovery

This is the most important section for the proposal. Every item below is in the codebase right now and demoable.

### 3D Rendering (DISCOVERED — substantially more than expected)

- **Five live, interactive Three.js viewers** at `public/3d-models/{cps,cor,ccf,corinthian,vortex}.html`. Each is a procedurally modelled filter cross-section, not a static asset, with PBR materials, multi-light rigs, ground reflection, and a dotted-leader annotation system.
- **No GLTF/GLB files** — geometry is generated in JavaScript per file using `ExtrudeGeometry`, `CylinderGeometry`, custom `THREE.Shape` and `THREE.Vector2` paths.
- Embedded into the React app via `<iframe>` inside `src/components/gallery/FilterModel3DModal.tsx` with `sandbox="allow-scripts allow-same-origin"`.
- Triggered from two places:
  - The Gallery sub-module (`src/app/topics/[slug]/gallery/page.tsx`) — click any filter card.
  - **The Slide Deck** (`src/components/slides/SlideDeck.tsx` + `src/components/slides/FilterSlide.tsx`) — every slide has a "View 360° 3D Model" CTA that opens the same modal. **This cross-format integration is unusually deep for a prototype.**

### Interactive Graphics / Mind Map

- **Two distinct mind map implementations**, one per topic.
- **History (`src/app/topics/[slug]/mindmap/page.tsx`)** — static SVG with hand-positioned nodes, curved Bezier connectors generated by `curvePath()`, hover-driven highlight, dashed lines for the "Future" branch, multi-line label wrapping via `splitLabel`. Footer caption explicitly says "Interactive zoom, drag, and search are in v1.0."
- **Filter Types (`src/components/mindmap/FilterTypesMindMap.tsx`, 399 LOC)** — DISCOVERED. A purpose-built component with:
  - 5-stage choreographed entrance (center pulse → tag drop → line draw → node pop → interactive).
  - Per-branch theme color (`#005eb8`, `#009639`, `#702082`, `#ea7600`, `#00a3e0`).
  - Cubic-Bezier connector paths from the central "Filtrona" node out to 5 branch pills, plus per-branch sub-node connectors with dashed-line draw animation on hover.
  - Hover any branch → its 3 sub-node leaves animate in (scale + opacity + delay-staggered).
  - Click any branch → deep-link to `/topics/filter-types/slides`.
  - Mobile fork: vertical accordion tree with swap to per-branch expansion, smooth max-height transitions, "Explore Module" CTAs with branded color per filter.
  - Window resize listener swaps between desktop and mobile rendering.
  - Custom CSS keyframes injected via `<style dangerouslySetInnerHTML>` for line-drawing and pop-in animations.
  - Only the live SVG library used is none — the entire animation pipeline is hand-written.

### Audio (DISCOVERED)

- **Real narration MP3s** for the entire `filter-types` topic — 8 files totalling ~4.3 MB (`public/audio/filter-types/`).
- **Two-surface playback**:
  - Per-slide narration in `src/components/slides/AudioPlayer.tsx` (auto-pauses when user navigates between slides).
  - Full chapter player in `src/app/topics/[slug]/audio/page.tsx` (click-to-seek progress bar, ±10s skip, chapter list with "Listened ✓" markers, auto-advance on `onEnded`, completion gate when all 8 chapters listened).
- **Web Audio API synthesis** for the gamified quiz: `src/lib/sound-effects.ts` (124 LOC) generates `playCorrect` (rising 2-note chime), `playWrong` (descending sawtooth), `playStreakUp` (3-note arpeggio), `playGameOver` (long pad). No asset files needed. Mute persisted to `localStorage`.
- **No transcripts** or captions in code yet.

### Video

- **There is no real video element rendered in the prototype.** The route `/topics/[slug]/video/page.tsx` is a styled mockup: a 16:9 gradient panel with a big `<button>` play icon that, on click, swaps to an info card reading "Full video coming in v1.0".
- Three chapter cards per topic exist with timestamps and descriptions. Clicking a chapter just sets a "viewed" flag; nothing actually plays.
- This is honest: the file's `<Film>` icon and overlay text both call this out as a preview.

### AI / API Integration (DISCOVERED — Gemini, not Anthropic)

- **Provider:** Google Gemini via `@google/genai@2.6.0` (`src/app/api/chat/route.ts`).
- **Models:** `gemini-2.5-flash` (primary) → falls back to `gemini-2.0-flash` on error.
- **Config:** `maxOutputTokens: 600`, `temperature: 0.7`. System instruction is dynamically built per-call.
- **System prompt construction:** `buildSystemPrompt(topicSlug, currentFilter)` injects:
  - The topic name and the full markdown knowledge base for that topic (`src/lib/chatbot-knowledge.ts`).
  - An optional "the learner is currently viewing the {filterName} slide" context line — passed in from the in-slide drawer.
  - Tone guidelines: warm, concise (2–4 sentences), grounded in the knowledge base, refuses to invent, learner-aware.
- **Error handling:**
  - Invalid JSON body → 400.
  - Missing `messages` / `topicSlug` → 400.
  - Topic without a knowledge base → graceful 200 with a friendly "I'm only briefed on..." message.
  - No `GEMINI_API_KEY` → 503.
  - Empty model response → 500.
  - Catch-all → 500 with the error message.
- **Knowledge base scope:** only `history` and `filter-types` are wired. Everything else returns the canned response.

### Animations & Microinteractions

- **Framer Motion** is used in 31 components. Patterns include:
  - `motion.div` with `useReducedMotion` guards for accessibility.
  - `AnimatePresence` mode="wait" for slide transitions (`SlideDeck`, `QuizShell`, `QuizStreakMode`, `Flashcards`).
  - Custom variants: `enter` / `center` / `exit` with directional X offset based on swipe direction (`SlideDeck`, `Flashcards`).
  - `whileInView` reveals (timeline milestones, gallery cards).
  - `motion.div drag="x"` with velocity threshold for swipe (`SlideDeck`).
  - `whileHover` scale and y-translate (mode cards, sub-module cards, topic cards).
  - Spring transitions (`{ type: "spring", stiffness: 400, damping: 20 }` in `HeartsIndicator`).
  - Infinite-loop background orbs on the landing page (`src/app/page.tsx` — three drifting radial gradients with bespoke X/Y keyframes per orb, 35–44s durations).
- **CSS keyframes** in `src/app/globals.css`:
  - `coach-dot-wave` for the chat typing indicator.
- **Inline `<style jsx>` keyframes**:
  - `filter-rotate` (60s slow rotation on filter visuals; reduced-motion media query halts it).
  - `timer-pulse` (under-25% timer ring).
- **Inline `<style dangerouslySetInnerHTML>` keyframes** in `FilterTypesMindMap.tsx`:
  - `drawLine` (stroke-dashoffset line draw, 0.6–1s).
  - `popIn` (cubic-bezier overshoot for nodes).
- **Particle systems**: `quiz/ScoreParticles.tsx` — 12-particle radial burst on every correct answer.
- **Screen shake**: `quiz/QuizStreakMode.tsx` — wrong answers trigger an 8-keyframe X-shake on the question container.
- **Ring countdown**: `quiz/TimerRing.tsx` — `requestAnimationFrame` SVG circle with stroke-dashoffset animation, color tier transitions, scale-pulse below 25%.
- **Glow effects**: shadow tokens `--shadow-blue-glow` / `--shadow-blue-glow-hover` in `globals.css`, used on the landing CTA, completion buttons, and the streak finish-screen rank badge.
- **Auto-advance progress bars** during quiz feedback (`QuizStreakMode`).

### State Management

- **Zustand stores:**
  - `useProgressStore` — `src/lib/progress-store.ts`, persisted under localStorage key `filtrona-progress`. Tracks per-topic completed sub-modules, last visited, and quiz results.
  - `useThemeStore` — `src/lib/theme-store.ts`, persisted under `filtrona-theme`. Vestigial — methods are no-ops since theme is locked to light.
- **No React Context providers** in the project.
- **Other localStorage keys:**
  - `filtrona-chat-history:{topicSlug}` — full chat transcripts per topic.
  - `filtrona-rapidfire-best-{topicSlug}` — rapid fire personal best.
  - `filtrona-quiz-sound` — quiz mute preference.

### Theme System

- **Single light theme.** The `data-theme="light"` attribute is hardcoded on `<html>` in `src/app/layout.tsx`. No system-preference detection. No anti-flash script. The `ThemeToggle` component returns `null`.
- CSS variables defined once in `:root` (`src/app/globals.css`):
  - Surfaces: `--bg-base`, `--bg-surface`, `--bg-elevated`.
  - Borders: `--border-default`.
  - Text: `--text-primary`, `--text-secondary`, `--text-muted`.
  - Filtrona brand palette: `--accent-blue` (#188ece), `--accent-navy` (#1B4B8E), `--accent-green` (#8abd40), `--accent-sky` (#188ece), `--accent-red` (#d91f29), each with a `-soft` 10%-alpha variant.
  - `--grid-line`, plus shadow tokens via `@theme inline`.
- **`prefers-reduced-motion`** is honoured throughout: `useReducedMotion` from Framer Motion in 14+ components, plus a CSS rule in `globals.css` that disables `coach-dot-wave` and a media query inside `FilterVisual.tsx` that halts the slow rotation.

### Accessibility (current state)

- Every interactive control has an `aria-label`, role, or descriptive text. Examples: `aria-label` on play/pause, navigation arrows, mute toggle, gallery cards (`aria-label="${year} — ${label}"`), question containers, modal `role="dialog" aria-modal="true"`.
- Live regions: `role="status" aria-live="polite"` for quiz feedback, timer announcements, game-over.
- Keyboard support: arrow keys (slides, deck), Home/End (deck), Space/Enter (flashcard flip), A/B/C/D (MCQ shortcuts), T/F (true/false shortcuts), Enter (submit), G/R (Got it / Review), Escape (close modal/drawer).
- `tabIndex={0}` and keyboard handler on the flashcard.
- `prefers-reduced-motion` honoured (see Theme System).
- `suppressHydrationWarning` on `<html>` in `layout.tsx`.
- **Gaps:** no skip-link, no formal focus-trap inside modals (just ESC + click-outside), no documented WCAG conformance audit, no captions/transcripts for the audio narration, no automated a11y CI checks.

### Quiz Mechanics

- **Three modes** with a single shared question bank.
- **Question types**: MCQ (4 options), True/False, Multi-Select, Match (left-to-right pairing). All four are fully built and exercised in the question bank.
- **Hearts**: 3 hearts (`HeartsIndicator`). Lose one per wrong answer or expired timer.
- **Streak**: per-correct counter (`StreakIndicator`). Resets on wrong answer. Visual tiers at 1+, 3+, 5+, 7+ (rainbow).
- **Streak Mode scoring formula** (from `QuizStreakMode.tsx` lines 215–221):
  - `basePoints = 10` per correct.
  - `streakBonus = newStreak × 5`.
  - `timeBonus = 0` (the field exists; the time-bonus computation is stubbed at `timeBonusApplied = false`).
  - **Total per correct answer = `basePoints + streakBonus`** = `10 + (streak × 5)`.
- **Sound triggers**: `playStreakUp()` fires at streak === 3, 5, or 7.
- **Bronze / Silver / Gold thresholds** (`QuizStreakMode.tsx`):
  - **Gold (🥇)**: score ≥ 140 — "Filtrona scholar".
  - **Silver (🥈)**: score ≥ 80 — "Solid run".
  - **Bronze (🥉)**: score < 80 — "You made it through".
- **Timer**: 20 s per question (`TIME_PER_QUESTION = 20`). On expiry, lose a heart and skip to feedback.
- **Particle effects**: 12-particle burst on every correct submit, anchored at the submit button.
- **Screen shake**: 0.4 s X-shake on wrong answer.
- **Auto-advance**: 2.5 s after feedback shows, with a thin progress bar.
- **Rapid Fire**: 60 s total. Questions cycle. No second chances. Personal best stored to localStorage and surfaced in the mode selector.
- **Game over** (Streak): vibrating skull icon + "Out of hearts" screen + Try Again CTA.

### Chat / Coach Drawer

- **Standalone chatbot** at `/topics/{slug}/chatbot` — full-screen, 880 px max width.
- **In-slide drawer** at `/topics/filter-types/slides` — right-side drawer, 420 px max width, opened from the per-slide `ConnectedActionsBar` "Ask Coach" button.
- **Both surfaces share the same `<ChatInterface>`** — the drawer passes `compact` and `currentFilter={slide.filterName}`, which (a) suppresses the mark-complete banner and (b) routes through to the API as `currentFilter`, which Gemini receives as system prompt context.
- **Per-filter suggested prompts**: `CoachDrawer.tsx` ships hardcoded 4-prompt arrays per filter (cps, cor, ccf, corinthian, vortex). Each prompt is filter-specific (e.g. "Why is it called coaxial?", "How does the spiral change flavour?").
- **localStorage persistence**: per-topic transcript stored under `filtrona-chat-history:{topicSlug}`.
- **Mark-complete banner** appears after 3 user turns (only on the standalone surface).
- **Error retry**: error bubbles ship with a Retry button that re-sends the last user message after stripping any prior errors from history.
- **Auto-grow textarea** (max ~4 lines).
- **Lightweight markdown** in assistant responses (bold, italic, line breaks); user input is rendered as plain text.

### Slide Deck

- **Navigation**: keyboard arrows + Home/End, dot click, prev/next arrow buttons (desktop only), drag-to-swipe with velocity threshold.
- **Per-slide audio** wired (`AudioPlayer` re-mounts and auto-pauses on slide change via `slideKey`).
- **`ConnectedActionsBar`** appears on every filter slide with deep links:
  - `Video → /topics/filter-types/video?chapter={videoChapterIndex}`
  - `Mind Map → /topics/filter-types/mindmap?highlight={slide.id}`
  - `Quiz → /topics/filter-types/quiz?focus={slide.id}`
  - `Flashcards → /topics/filter-types/flashcards`
  - `Ask Coach → opens drawer`
  - **The query parameters are sent but not yet honoured by the destination routes** (e.g. `mindmap?highlight=cps` doesn't actually highlight CPS). The plumbing is there; the consumers are stubs. **DISCOVERED — partial.**
- **SVG filter visualisations**: `FilterVisual.tsx` actually displays the JPEG product photos from `public/images-filters/` in a circular frame with a slow auto-rotation animation, accent radial glow, and hover scale. **Not vector SVG art** — it's a styled image with CSS rotation. The original brief mentioned "SVG filter visualisations"; the current implementation is JPEG-based.

### Additional Features Discovered

- **Per-slide connected actions across all formats** (`ConnectedActionsBar.tsx`) — every filter slide has 5 outbound deep links to other formats. **Most e-learning prototypes don't ship this kind of horizontal navigation.**
- **Web Audio synthesis for quiz feedback** (`sound-effects.ts`) — uses `AudioContext.createOscillator` directly. No external sound asset files.
- **localStorage-backed personal best** for Rapid Fire mode.
- **Sandboxed iframe 3D viewers** — the `<iframe sandbox="allow-scripts allow-same-origin">` pattern keeps Three.js isolated from the React tree while still letting the modal pass close/escape from the parent.
- **Reduced-motion aware particle systems** — even the score particles have a graceful fallback (single flash dot) for users with `prefers-reduced-motion`.
- **Vestigial dark-mode store** — `theme-store.ts` is wired up with persistence and methods, but the methods are no-ops. Indicates a previous design that included a dark theme; cleanly removed without dead UI.

---

## A.7 What's Built vs What's Mocked

| Feature | Status | Evidence |
|---------|--------|----------|
| Topic catalogue (locked / unlocked gating) | **REAL & FUNCTIONAL** | `src/lib/topics.ts`, `src/components/TopicCard.tsx` |
| Module landing page with progress bar | **REAL & FUNCTIONAL** | `src/app/topics/[slug]/page.tsx`, persisted via Zustand |
| Slide deck — `filter-types` | **REAL & FUNCTIONAL** | 5 slides, swipe, keyboard, dots, audio per slide, 3D modal, Coach drawer, ConnectedActionsBar (`src/components/slides/SlideDeck.tsx`) |
| Slide deck — `history` (legacy timeline) | **REAL & FUNCTIONAL** | 8 milestones, intersection-observer reveals (`src/app/topics/[slug]/slides/page.tsx`) |
| Quiz — Classic mode | **REAL & FUNCTIONAL** | All 4 question types, explanations, retry, results ring (`QuizShell.tsx`) |
| Quiz — Streak mode | **REAL & FUNCTIONAL** | Hearts, streak, timer, particles, sounds, ranks, screen shake (`QuizStreakMode.tsx`) |
| Quiz — Rapid Fire mode | **REAL & FUNCTIONAL** | 60s timer, cycle, flash overlay, localStorage best (`QuizRapidFire.tsx`) |
| Flashcards | **REAL & FUNCTIONAL** | Flip animation, queue logic, keyboard, completion (`Flashcard.tsx` + page) |
| Audio overview (filter-types) | **REAL & FUNCTIONAL** | 8 real MP3s, click-to-seek, ±10s, chapter auto-advance, completion gate (`audio/page.tsx`) |
| Audio overview (history) | **PARTIAL** | UI exists but chapters have no `url` — clicking shows a toast "Audio narration is scoped for v1.0" |
| Gallery — filter-types 3D viewer | **REAL & FUNCTIONAL** | 5 procedural Three.js viewers via iframe modal (`FilterModel3DModal.tsx` + 5 HTML files) |
| Gallery — history | **PARTIAL** | Cards render, click opens fallback gradient modal with "Real images, 3D rotation, and zoom coming in v1.0" |
| Mind map — filter-types | **REAL & FUNCTIONAL** | 5-stage choreographed animation, hover sub-nodes, click-to-deep-link, mobile accordion fork (`FilterTypesMindMap.tsx`) |
| Mind map — history | **PARTIAL** | Static SVG with hover state, but no zoom/pan/drag — caption explicitly says "Interactive zoom, drag, and search are in v1.0" |
| Video sub-module | **MOCKUP** | No `<video>` element. Click play swaps overlay for "Full video coming in v1.0" info card |
| Coach chatbot — filter-types | **REAL & FUNCTIONAL** | Live Gemini API, knowledge-grounded, persistent transcript |
| Coach chatbot — history | **REAL & FUNCTIONAL** | Same engine, history KB |
| In-slide Coach drawer | **REAL & FUNCTIONAL** | Per-slide context-aware (`currentFilter`), filter-specific prompts |
| Connected Actions deep-linking | **PARTIAL** | URLs include `?focus=`, `?highlight=`, `?chapter=` query params, but destination routes don't yet read them |
| Progress tracking + completion CTAs | **REAL & FUNCTIONAL** | Zustand `persist`, mark-complete on every sub-module, overall progress bar in nav |
| Sound effects (quiz) | **REAL & FUNCTIONAL** | Web Audio API synthesis, mute toggle, persisted preference |
| Theme system | **PARTIAL** | Single light theme locked, dark-mode store is vestigial |
| Locked-topic placeholder pages | **REAL & FUNCTIONAL** | `[subModule]/page.tsx`, `NonHistoryPlaceholder.tsx` |
| LMS / SCORM / xAPI / AICC packaging | **NOT BUILT** | No packaging tooling, no manifest, no statement emission |
| SSO / learner identity | **NOT BUILT** | Hardcoded "F" avatar in `TopNav.tsx` |
| L&D admin dashboard | **NOT BUILT** | No admin routes |
| Test suite | **NOT BUILT** | No test runner config, no `__tests__`, no `.test.tsx` files |



---

# Part B — Full Production Capability (What We Can Deliver in v1.0)

The prototype demonstrates a slice. v1.0 is a complete induction programme covering the 6 modules in the Filtrona blueprint (`src/lib/topics.ts`).

## Format 1 — Slide Deck

**Prototype demonstrates** — `src/components/slides/SlideDeck.tsx`. Real five-slide carousel for `filter-types` with keyboard / swipe / dot navigation, per-slide narration audio, Connected Actions Bar, in-slide Coach drawer, and per-slide 3D model trigger. For `history`, an animated vertical-timeline alternative.

**Production v1.0 delivers**
- Per-slide professionally narrated audio (script + voice talent + studio production), like the existing `filter-types` MP3 set, replicated across all 6 modules.
- Closed captions and transcripts (WCAG 2.1 AA — see Part C).
- Branded visual templates locked to the Filtrona palette already encoded as CSS variables in `src/app/globals.css`.
- Mobile-responsive (already responsive in the prototype — verified in slide layout).
- Reader-mode fallback for low-bandwidth or assistive contexts (text + key specs only).
- Print-friendly summary export per slide deck (PDF render-on-demand).

## Format 2 — Knowledge Check (Quiz)

**Prototype demonstrates** — `src/components/quiz/*` (13 components). Three modes (Classic, Streak, Rapid Fire) with hearts, streaks, particles, screen shake, Web-Audio synthesised sound effects, ring countdown, bronze/silver/gold ranks, four question types (MCQ, T/F, multi-select, match), localStorage-backed personal best for Rapid Fire.

**Production v1.0 delivers**
- Full question bank per module: **20–30 questions** (the prototype has 8 per topic; this is a 3–4× expansion).
- Two-attempt limit configurable per LMS policy.
- Pass/fail thresholds reportable via xAPI / AICC Split.
- Adaptive remediation paths (a failed question surfaces a "Revisit slide" link to the source content).
- Animated transitions and microinteractions (already present).
- Achievement badge generation (gold/silver/bronze ranks already computed; tie to LMS badge issuance).

## Format 3 — Video Gallery

**Prototype demonstrates** — `src/app/topics/[slug]/video/page.tsx`. UI mockup only: a styled 16:9 panel, a big play button, three chapter cards. Clicking play swaps in an info card stating "Full video coming in v1.0".

**Production v1.0 delivers**
- 1080p presenter-led video, 3–5 min per module.
- Studio shoot or animated explainer (client choice).
- Full SRT/VTT subtitles.
- Searchable transcript embedded into the page.
- Chapter markers wired to the existing `videoChapterIndex` field on `FilterSlide` and to module navigation deep-links (`/topics/{slug}/video?chapter={n}`).

## Format 4 — Mind Map

**Prototype demonstrates** — Two implementations in code.
- `filter-types`: rich, animated, hover-driven, click-to-deep-link mind map at `src/components/mindmap/FilterTypesMindMap.tsx`. Already interactive at the level the brief calls for.
- `history`: static SVG with hover highlight. Caption itself flags interactive zoom/drag as v1.0 work.

**Production v1.0 delivers**
- Fully interactive node-link diagram for every module, matching the `FilterTypesMindMap` standard.
- Pan / zoom / drag (the `filter-types` map currently has hover but not pan/zoom/drag — see Risk F).
- Click-to-navigate (already wired for `filter-types`; extend across all 6 modules).
- Mobile-responsive collapsible tree (already present — `FilterTypesMindMap` ships a separate mobile fork).
- Optional: branch-by-branch reveal animation on first view (already present in `filter-types`; extend to all modules).

## Format 5 — Flashcards

**Prototype demonstrates** — `src/components/Flashcard.tsx` + `src/app/topics/[slug]/flashcards/page.tsx`. Real 3D-flip animation, queue + review logic, keyboard shortcuts, completion gate, "Got it / Review again" sorting, persistent completion state.

**Production v1.0 delivers**
- Per-module deck of 20–30 cards (currently 8 per topic).
- True spaced-repetition algorithm (SM-2 or similar) — the prototype uses simple "Got it / Review again" queueing, not a forgetting curve.
- Progress sync to LMS via xAPI statements.
- Audio pronunciation for technical terms.

## Format 6 — Audio Overview

**Prototype demonstrates** — `src/app/topics/[slug]/audio/page.tsx`. Real audio playback for `filter-types` (8 chapters, ~4.3 MB total), click-to-seek progress bar, ±10s skip, chapter auto-advance, listened tracking, completion gate.

**Production v1.0 delivers**
- Professionally narrated MP3, 6–8 min per module (extending the existing filter-types set).
- Chapter markers (already present).
- Companion transcript document (HTML and downloadable PDF).
- Variable playback speed (0.75× / 1× / 1.25× / 1.5×).
- Download for offline listening.

## Format 7 — 2D / 3D Gallery

**Prototype demonstrates** — `src/app/topics/[slug]/gallery/page.tsx` + `src/components/gallery/FilterModel3DModal.tsx` + 5 procedurally-generated Three.js viewers under `public/3d-models/`. Live drag-to-rotate, scroll-to-zoom, autoRotate, annotation overlays with dotted leader lines, ground reflection, PBR materials.

**Production v1.0 delivers**
- Real 3D filter cross-sections (already present for the 5 filter-types — built from procedural geometry, not GLB. We can either keep this approach or migrate to authored `.glb` for higher fidelity — see Part F risk).
- Hotspot annotations (already shipped — see `vortex.html` "Helical Twist" / "Airflow Aperture" labels with leader lines).
- Side-by-side product comparison (new — would require a multi-iframe layout or unified scene).
- High-resolution product photography (already 700 KB+ PNG thumbnails).
- AR-ready (`.glb` format works with `<model-viewer>`) — would require asset migration from procedural Three.js to authored GLB.

## Format 8 — Ask the Coach

**Prototype demonstrates** — `src/app/api/chat/route.ts` + `src/components/chat/ChatInterface.tsx` + `src/components/slides/CoachDrawer.tsx`. Live Google Gemini API integration with topic-scoped knowledge base, optional `currentFilter` context, per-filter suggested prompts, persistent transcripts in localStorage, error retry, mark-complete banner.

**Production v1.0 delivers**
- Per-module knowledge base (curated from source materials) — extend the existing `chatbot-knowledge.ts` pattern to the other 4 modules.
- Context-aware to active slide/section (already present — passes `currentFilter` to the API).
- Conversation history persistence (already present in localStorage; for production, sync to LMS or a backend store for cross-device continuity).
- L&D admin dashboard: interaction analytics, top questions, gap detection (new build).
- Multi-turn dialogue (already present — full message history goes to the model).
- Graceful fallback if learner asks out-of-scope (already present — see route handler's "I'm only briefed on..." canned response).
- Optional: voice input/output (Gemini supports it; prototype does not).



---

# Part C — NAVEX Compliance Reality

| NAVEX Requirement | Prototype Status | Production v1.0 Plan |
|--------------------|------------------|----------------------|
| Course format: AICC Split (RECOMMENDED by NAVEX) | NOT BUILT | Will deliver AICC Split as primary format. |
| Course format: CMI5 / xAPI (also supported) | NOT BUILT | Available as alternative if client prefers xAPI tracking. |
| SCORM 1.2 / 2004 fallback | NOT BUILT | Available on request. |
| Browser support | YES (Next.js 16 + modern React) | YES (matrix to be agreed; Chromium / Edge / Firefox / Safari latest two). |
| OS support | YES (web-based, OS-agnostic) | YES (tested on Windows / macOS / iOS / Android). |
| Mobile support | YES — every page in the prototype is responsive (verified across `TopicCard`, `SubModuleCard`, `SlideDeck`, `FilterTypesMindMap` — which has a dedicated mobile accordion fork) | YES (tested on devices). |
| Bandwidth optimization | PARTIAL — `next/image`, `priority` flag on first slide image, but the gallery thumbnails are 700–870 KB PNGs and the home `bg-pattern.png` is 2.3 MB. No adaptive streaming. | YES — adaptive video streaming for the new presenter video, image responsive sizes, lazy-loading audio, asset compression pass. |
| Accessibility WCAG 2.1 AA | PARTIAL — strong baseline (ARIA labels, reduced-motion, keyboard support, live regions throughout) but no formal audit, no captions on existing audio, no skip-link, no focus-trap in modals, no automated a11y CI | Full audit and remediation. |
| Single Sign-On / learner identity | NOT BUILT — `TopNav.tsx` shows a hardcoded "F" avatar | Wired through SSO via NAVEX SCORM Cloud or directly. |
| Progress reporting to NAVEX | NOT BUILT — progress is in localStorage only | Full xAPI / AICC Split statement emission for every meaningful learner event (slide viewed, quiz attempted, completion mark, chat turn). |

**Critical point about format choice for client conversation:**
NAVEX's documentation recommends **AICC Split** as the primary format. Earlier internal proposal drafts have suggested CMI5 as primary. The proposal should clarify with Filtrona which they want — both are supported, but **AICC Split aligns with NAVEX's recommended path**. Surface this as an early-call topic.

---

# Part D — Effort Estimation for v1.0

## Per-Module Effort (assuming the Filter Types pattern is replicated)

| Work Item | Dev | ID | Writer | Audio | Video | Days Total |
|-----------|-----|----|----|-------|-------|------------|
| Slide content (5 sections) | 1 | 3 | 2 | – | – | 6 |
| Quiz (25 questions, all 4 types) | 1 | 2 | 2 | – | – | 5 |
| Flashcards (25 cards) | 0.5 | 1 | 1 | – | – | 2.5 |
| Audio narration (~7 min ≈ 21 hr studio = ~2.5 d) | 0.5 | – | 1 | 2.5 | – | 4 |
| Video (3 min presenter ≈ 30 hr ≈ 4 d) | 0.5 | 1 | 1 | – | 4 | 6.5 |
| Mind map design + content | 1 | 1 | – | – | – | 2 |
| 3D gallery (5 filters; 1 modeller × 5 days) | 5 | – | – | – | – | 5 |
| Chatbot knowledge base | 1 | 1 | 2 | – | – | 4 |
| QA + revision rounds | 2 | 1 | 1 | – | – | 4 |
| **TOTAL PER MODULE** | **~12** | **~10** | **~10** | **~2.5** | **~4** | **~39 days** |

## Cross-Cutting Work (one-time, applies across the whole programme)

| Work Item | Days |
|-----------|------|
| CMI5 / AICC Split packaging system | 10 |
| NAVEX integration + sandbox testing | 5 |
| WCAG 2.1 AA audit + remediation | 8 |
| L&D admin dashboard (Ask the Coach analytics, completion reporting) | 8 |
| Multi-language pipeline (if needed) | 10 |
| Final QA across all browsers/devices | 6 |
| **CROSS-CUTTING TOTAL** | **47 days** |

## Programme Total — 6-module Filtrona induction blueprint

- **Per-module**: 39 days × 6 modules = **234 days**
- **Cross-cutting**: **47 days**
- **PROGRAMME TOTAL**: **281 days**

If multi-language is descoped (i.e. English only), the programme total drops to **271 days**.

Conversion at 1 senior FTE ≈ 220 productive days/year, the programme is ~**1.3 FTE-years** of effort, distributed across senior dev / instructional designer / writer / audio / video / 3D-modeller specialisms.

---

# Part E — Commercial Reference (No Invented Prices)

For the founder's reference only — do not paste these into the proposal verbatim.

**Industry benchmarks**

- Custom modular e-learning with AI integration: **$8,000 – $30,000 per finished hour**.
- Per-module pricing for comparable scope: **$15,000 – $40,000 per fully-built module**.
- CMI5 / AICC Split packaging premium: **+10–20%** on base build.
- Maintenance / post-deployment retainer: **15–20% of build cost annually**.
- Real 3D modelling: **$500 – $2,000 per high-quality cross-section model**.
- Voice talent + studio: **$200 – $800 per finished minute**.

**Three pricing structures the proposal could use**

1. **Per-module fixed price**
   - Predictable for client procurement; each of the 6 modules priced as a discrete line item at the per-module benchmark.
   - Easiest to phase if the client wants to pace ROI.
   - Trade-off: doesn't reward bulk; client may negotiate the 6th module price.

2. **Programme bundle (recommended for first-time engagements)**
   - Discounted total against the per-module sum, paid in milestones (e.g. 30% kick-off, 30% at module 3 sign-off, 30% at module 6 sign-off, 10% on NAVEX integration sign-off).
   - Includes the cross-cutting work as one fixed line.
   - Trade-off: ties Filtrona to the full programme; harder to descope mid-flight.

3. **Phased rollout (recommended if Filtrona wants risk-managed entry)**
   - Pilot module first (Filter Types & Performance — already 80% built), priced at the per-module rate to prove value.
   - Then a bulk discount on the remaining 5 modules contingent on pilot sign-off.
   - Trade-off: slower revenue, but lower commercial risk for both sides; gives the client an exit point.

Founder decides which structure to lead with based on (a) Filtrona's procurement style, (b) appetite for committing to the full programme, (c) whether multi-language is in scope.

---

# Part F — Risk Register

| # | Risk | Why it matters | Mitigation |
|---|------|----------------|------------|
| 1 | NAVEX format choice ambiguity (AICC vs CMI5) | Building the wrong primary format = rebuild | Surface in kick-off; recommend AICC Split per NAVEX docs |
| 2 | Scope creep on 3D modelling | Procedural Three.js is cheap; authored GLB hotspots can balloon | Lock the per-filter level of detail in writing before build |
| 3 | Multi-language scope not yet defined | Translation, voice talent, and asset re-rendering all add per-language cost | Confirm scope (English-only or +N) at kick-off |
| 4 | Voice talent availability and cost | Filter-types narration is already done by an existing voice; matching voice for 5 new modules may need recasting | Lock voice talent before content writing closes |
| 5 | Filtrona may want a bespoke admin dashboard | xAPI analytics can be served by NAVEX or built bespoke; bespoke = +8–15 days | Confirm "NAVEX reporting only" vs "Filtrona-branded dashboard" early |
| 6 | Post-deployment support model needs definition | Maintenance retainer scope (bug fix only? content updates? new modules?) varies in industry | Propose a tiered retainer (Bronze / Silver / Gold) |
| 7 | Revision rounds: 2 vs 3 | The effort table assumes 2; a 3rd round adds ~4 days per module | Lock at 2 with a per-day rate for additional |
| 8 | Content sign-off process needs SLA from client | Slow sign-off ripples into voice/video schedule | Insist on max 5 business days per round in the SOW |
| 9 | **Live Gemini API key in working tree** | `.env.local` holds a real `GEMINI_API_KEY`. Although `.gitignore` excludes `.env*`, the key should be rotated before any external repo handover, and rate-limited at the API provider | Rotate the key; add server-side request rate-limiting; consider routing through a Filtrona-controlled proxy in production |
| 10 | Connected-action deep-links accept query params but consumers don't read them | Slide → quiz `?focus=cps` works in URL but quiz page ignores `focus` | Wire each consumer in v1.0 implementation pass |
| 11 | History topic is locked but has full content | `topics.unlocked = false`, but `slide-content`, `quiz-content`, `flashcards`, and `chatbot-knowledge` all include history data | Decide whether to ship history as a 7th unlocked module or descope |
| 12 | No automated tests | Refactoring risk is high, regressions go undetected | Set up Vitest + Testing Library; cover progress store + chat API + quiz scoring formulas first |

---

# Part G — Why We Win (Differentiators Backed by Code)

Each item below is a real, demoable feature that sits in the prototype today. Cite the file path in any sales conversation.

| Differentiator | Evidence |
|----------------|----------|
| **Live AI API integration with model fallback** | `src/app/api/chat/route.ts` — Gemini 2.5 Flash → 2.0 Flash fallback, structured error responses, server-side env handling |
| **Context-aware AI grounded in custom knowledge** | `src/lib/chatbot-knowledge.ts` (~7 KB total markdown across 2 topics); system prompt builder injects the knowledge per call (`buildSystemPrompt` in `route.ts`); per-filter `currentFilter` context passed from the in-slide drawer |
| **Three quiz mechanics in one shell** | `src/components/quiz/QuizModeSelector.tsx` routes between Classic (`QuizShell.tsx`), Streak (`QuizStreakMode.tsx`, 714 LOC), and Rapid Fire (`QuizRapidFire.tsx`) — all sharing the same `QuizQuestion` schema |
| **Real-time particle / sound / screen-shake feedback** | `src/components/quiz/ScoreParticles.tsx` (12-particle burst), `src/lib/sound-effects.ts` (4 distinct Web-Audio synthesised tones, no asset files), `QuizStreakMode.tsx` lines 232–244 (8-keyframe X-shake) |
| **Live, procedurally-modelled 3D filter cross-sections** | `public/3d-models/{cps,cor,ccf,corinthian,vortex}.html` (5 hand-built Three.js scenes, ~1,800 LOC across files, full PBR + reflections + annotations), embedded via `src/components/gallery/FilterModel3DModal.tsx` |
| **Interactive mind map with 5-stage choreography** | `src/components/mindmap/FilterTypesMindMap.tsx` (399 LOC, multi-stage entrance, hover-driven sub-nodes, click-to-deep-link, mobile accordion fork) |
| **Reduced-motion accessibility throughout** | `useReducedMotion` from Framer Motion appears in 14+ components; CSS `@media (prefers-reduced-motion: reduce)` rules in `src/app/globals.css` and `src/components/slides/FilterVisual.tsx`; particle systems have a fallback path |
| **Connected actions across all sub-modules** | `src/components/slides/ConnectedActionsBar.tsx` — every slide cross-links to Video, Mind Map, Quiz, Flashcards, and Coach. Most prototypes silo formats; this prototype treats them as one flow |
| **Per-slide chatbot context-switching** | `src/components/slides/CoachDrawer.tsx` passes `currentFilter` to `ChatInterface`, which sends it to `/api/chat`, which injects it into the system prompt. The Coach changes its default focus per slide |
| **Three custom filter slide layouts unified by accent system** | `src/app/globals.css` defines the brand palette as CSS variables; `src/components/slides/FilterSlide.tsx`, `SubModuleCard.tsx`, `TopicCard.tsx`, `QuizModeSelector.tsx` all map a single `accent` prop to gradients, soft backgrounds, glow shadows, and text colours |
| **Web-Audio synthesised sound (no asset payload)** | `src/lib/sound-effects.ts` — 4 distinct cues built from oscillators with linear gain ramps; mute toggle persisted to localStorage; reduces asset bundle size to zero for quiz feedback |
| **localStorage-backed personal best leaderboard** | `src/components/quiz/QuizRapidFire.tsx` — per-topic PB stored under `filtrona-rapidfire-best-{slug}`, surfaced in `QuizModeSelector.tsx` |
| **`requestAnimationFrame` smooth countdown that pauses cleanly** | `src/components/quiz/TimerRing.tsx` — uses `performance.now()` deltas, not `setInterval`; survives state-pauses without time drift |
| **Drag-to-swipe carousel** | `src/components/slides/SlideDeck.tsx` — Framer `drag="x"` with velocity threshold (`velocity.x < -500`) for natural feel |
| **Per-slide narration auto-pause on navigation** | `src/components/slides/AudioPlayer.tsx` — `slideKey` prop drives an effect that pauses when the parent slide changes |
| **Sandboxed iframe 3D embedding** | `src/components/gallery/FilterModel3DModal.tsx` — `sandbox="allow-scripts allow-same-origin"` keeps Three.js isolated from the React tree |

---

# Part H — Recommendations for the Final Proposal

## Specific gaps to fix in the draft

1. **Correct the AI provider claim.** Any prior draft that says Anthropic/Claude needs to say **Google Gemini** (`gemini-2.5-flash` primary, `gemini-2.0-flash` fallback). Cite `src/app/api/chat/route.ts`.
2. **Quantify the existing 3D work.** Earlier drafts may have suggested 3D was placeholder; in fact there are five live, fully shaded, annotated Three.js viewers totalling ~1,800 LOC of hand-written scene code.
3. **Quantify the existing audio work.** The `filter-types` topic has 8 real narration MP3s already in `public/audio/filter-types/`. The audio sub-module is genuinely playable end-to-end.
4. **Be honest about video.** It is a styled mockup. The proposal should not claim a working video player.
5. **Be honest about the history topic.** It is locked behind `topics.unlocked = false`. The content (slides, quiz, flashcards, chatbot KB) exists but is not user-reachable in the demo. Either flip the flag for the demo or frame it as "module 2 already content-ready".
6. **Mark mind map honestly.** Two implementations — the filter-types one is genuinely interactive (hover, click-to-deep-link, choreographed entrance), the history one is static-with-hover. The history map's own caption admits this.
7. **Be careful with "WCAG 2.1 AA compliant" claims.** The prototype has a strong baseline but no formal audit. Phrase as "designed to WCAG 2.1 AA standards; full audit and remediation included in v1.0".

## Claims in the draft that don't match the code (and how to reframe)

| If the draft says... | Reframe to... |
|---|---|
| "Built on Anthropic Claude" | "Built on Google Gemini 2.5 Flash with automatic fallback to 2.0 Flash" |
| "Includes real 3D models" | "Includes five interactive procedurally-modelled 3D filter cross-sections, hand-built in Three.js with PBR materials, ground reflection, and annotation overlays" |
| "Pre-recorded audio overview" | "Eight real narration tracks (~4.3 MB) wired through both a per-slide player and a full-module chapter player with click-to-seek, ±10s skip, and listened-state tracking" |
| "WCAG 2.1 AA compliant" | "Built with WCAG 2.1 AA principles (ARIA labelling throughout, keyboard navigation, reduced-motion fallbacks, live regions on quiz feedback). Full audit and any remediation in v1.0." |
| "Working video player" | "Video sub-module designed and laid out; full presenter video and chapter wiring scoped for v1.0" |

## Strengths in the code that are under-sold in the draft

1. **Three quiz modes from one schema.** The same `QuizQuestion` definitions feed Classic, Streak, and Rapid Fire. Most vendors ship one mode.
2. **Web-Audio synthesised sound with mute persistence.** Zero-byte audio payload for quiz feedback, demonstrably accessible (mute toggle, persisted preference).
3. **The in-slide Coach drawer.** Per-filter context passed via `currentFilter` to the API, with hardcoded per-filter suggested prompts. This is a meaningful UX differentiator.
4. **The five-stage choreographed mind map.** The animation pipeline alone is a sales asset.
5. **Connected Actions Bar.** Cross-format deep-linking is rare in e-learning prototypes.
6. **Reduced-motion compliance throughout.** Not just a CSS rule — `useReducedMotion` is consulted in 14+ components, particles have a fallback path, and audio rotation has a media query halt.

## Key conversation points to surface with Filtrona before signing

1. **AICC Split vs CMI5/xAPI** — confirm primary packaging format. NAVEX recommends AICC Split.
2. **Multi-language scope** — English-only? +which languages? Affects Part D effort and Part F risk #3.
3. **Voice talent continuity** — keep the existing `filter-types` voice across all modules?
4. **Admin dashboard** — NAVEX-only reporting, or bespoke Filtrona dashboard? Adds 8–15 days if bespoke.
5. **Question-bank size** — confirm 25 per module vs reduce.
6. **3D fidelity** — keep the procedural Three.js approach (cheaper, lighter, already shipped) or migrate to authored GLB (heavier, AR-ready, higher fidelity, +$500–$2,000 per model).
7. **History topic decision** — ship as a 7th unlocked module, or descope?
8. **Maintenance / retainer model** — agree at signing to avoid post-launch friction.
9. **Content sign-off SLA** — propose 5 business days per round; lock revision rounds at 2.
10. **API key handling** — agree whether the production Gemini integration runs through a Filtrona-controlled proxy (recommended) or directly from the Next.js server runtime.

---

## Appendix — Quick Reference

### File counts
- Total `.ts` files: 11
- Total `.tsx` files: 46
- Total source files: 57
- Total source LOC (TS + TSX): **9,044**
- Largest single component: `src/components/quiz/QuizStreakMode.tsx` (714 LOC)
- Largest page route: `src/app/topics/[slug]/mindmap/page.tsx` (418 LOC)

### DISCOVERED features (found in audit, not expected from prior context)

These are the items the proposal team should give extra weight to:

1. **AI provider is Google Gemini** (`@google/genai@2.6.0`), not Anthropic. With model fallback. (`src/app/api/chat/route.ts`)
2. **Five live, hand-built Three.js viewers** with PBR materials, OrbitControls, ground reflection, HTML annotation overlays, autoRotate. No GLB files anywhere — all geometry is procedural. (`public/3d-models/*.html`)
3. **Eight real narration MP3s** for filter-types, totalling ~4.3 MB, wired through both surface playback paths. (`public/audio/filter-types/`)
4. **`FilterTypesMindMap`** — a 399-LOC custom mind map with 5-stage choreographed entrance, hover sub-nodes, click-to-deep-link, mobile accordion fork. Substantially more capable than the static history mind map. (`src/components/mindmap/FilterTypesMindMap.tsx`)
5. **Web-Audio API synthesised quiz sound effects** — no asset files, mute persistence in localStorage. (`src/lib/sound-effects.ts`)
6. **`QuizStreakMode`** — 714 LOC of Duolingo-style mechanics: hearts, streaks, particles, screen shake, sound, ring countdown, bronze/silver/gold ranks (≥80 silver, ≥140 gold), Web Audio synthesis, mute toggle, auto-advance with progress bar. (`src/components/quiz/QuizStreakMode.tsx`)
7. **`QuizRapidFire`** — 60-second time-attack mode with localStorage personal best per topic. (`src/components/quiz/QuizRapidFire.tsx`)
8. **`ConnectedActionsBar`** — every filter slide cross-links to all other formats with deep-link query params. (`src/components/slides/ConnectedActionsBar.tsx`)
9. **`CoachDrawer`** — in-slide chatbot drawer with per-filter context passing and hardcoded per-filter suggested prompts (cps/cor/ccf/corinthian/vortex). (`src/components/slides/CoachDrawer.tsx`)
10. **`AudioPlayer.slideKey`** auto-pause pattern — clean per-slide audio lifecycle. (`src/components/slides/AudioPlayer.tsx`)
11. **Procedural extrude geometry** in the 3D viewers — `THREE.Shape` with custom Vector2 paths plus `ExtrudeGeometry` for cross-sections, not loaded models.
12. **`TimerRing` `requestAnimationFrame`** smooth countdown with pause/resume integrity. (`src/components/quiz/TimerRing.tsx`)
13. **`Flashcards` keyboard shortcuts** (Space / G / R / arrows) and forward/backward AnimatePresence direction. (`src/app/topics/[slug]/flashcards/page.tsx`)
14. **`SlideDeck` drag-to-swipe** with velocity thresholding. (`src/components/slides/SlideDeck.tsx`)
15. **Vestigial dark-mode store** — `theme-store.ts` exists with persistence wired but methods are no-ops. Indicates careful cleanup of a previous design. (`src/lib/theme-store.ts`)
16. **`.env.local` contains a live Gemini API key** in the working tree (correctly excluded from git via `.gitignore`, but flagged here so it gets rotated before external handover).
17. **Hardcoded `UNLOCKED_TOPICS` denominator** for overall progress = 8 (one topic × 8 sub-modules). Will need extension when more topics ship. (`src/lib/progress-store.ts`)
18. **Per-slide narration is wired by URL string** (`audioUrl` field on `FilterSlide`) — content can be swapped without code changes.
19. **`FilterVisual` 60-second auto-rotation** on the circular product image, with a `prefers-reduced-motion` media-query halt. (`src/components/slides/FilterVisual.tsx`)
20. **History topic is fully content-ready but locked.** Setting `topics[0].unlocked = true` would expose 8 milestone slides + 8 quiz qs + 8 flashcards + a fully grounded chatbot, all already wired. (`src/lib/topics.ts`)
