/* ── Types ──────────────────────────────────────────────────────── */

export type FilterSlide = {
  id: string;
  filterName: string;
  fullName: string;
  tagline: string;
  accent: "blue" | "navy" | "green" | "sky";
  tag: string;
  keySpecs: string[];
  howItWorks: string;
  visualType: "intro" | "cps" | "cor" | "ccf" | "corinthian" | "vortex" | "thankyou";
  audioUrl: string;
  videoTimestamp: string;
  videoChapterIndex: number;
  quizQuestionIds: string[];
};

export type TimelineMilestone = {
  year: string;
  title: string;
  body: string;
  tag?: string;
  accent: "blue" | "navy" | "green" | "sky";
};

/* ── Filter Types slides (new carousel format) ─────────────────── */

export const filterSlides: FilterSlide[] = [
  {
    id: "intro",
    filterName: "Performance Range",
    fullName: "Filters That Make a Difference",
    tagline: "Regulation-Compliant Filters for Tar, CO & Vapour Reduction",
    accent: "blue",
    tag: "E-Learning Module",
    keySpecs: [
      "Five engineered filter solutions",
      "Tar, CO & vapour reduction technologies",
      "Regulation-compliant designs",
      "Brand differentiation through filter innovation",
    ],
    howItWorks: "",
    visualType: "intro",
    audioUrl: "/audio/filter-types/intro.mp3",
    videoTimestamp: "",
    videoChapterIndex: 0,
    quizQuestionIds: [],
  },
  {
    id: "cps",
    filterName: "CPS",
    fullName: "Combined Performance Superior",
    tagline: "Engineered for maximum tar retention through cross-flow technology.",
    accent: "blue",
    tag: "Tar Reduction",
    keySpecs: [
      "Cross-flow filtration mechanism",
      "Increased tar retention efficiency",
      "Standard mouth-feel preserved",
      "Drop-in replacement for conventional filters",
    ],
    howItWorks:
      "CPS uses Filtrona's proprietary cross-flow technology to route smoke through more filter material per draw. The result is significantly higher tar retention without changing the consumer-facing experience — a key advantage when meeting tightening regulatory targets.",
    visualType: "cps",
    audioUrl: "/audio/filter-types/slide1.mp3",
    videoTimestamp: "0:54–1:22",
    videoChapterIndex: 1,
    quizQuestionIds: ["q1", "q2"],
  },
  {
    id: "cor",
    filterName: "COR",
    fullName: "Carbon Monoxide Reducing",
    tagline: "High tip ventilation engineered to lower CO in smoke.",
    accent: "blue",
    tag: "CO Reduction",
    keySpecs: [
      "High tip ventilation design",
      "Targets carbon monoxide specifically",
      "Separate from tar reduction strategy",
      "Maintains smoke balance",
    ],
    howItWorks:
      "Where CPS targets tar, COR targets carbon monoxide — a separate regulatory pressure point. Tip ventilation dilutes smoke with air drawn in through perforations near the filter tip, reducing CO concentration in each puff.",
    visualType: "cor",
    audioUrl: "/audio/filter-types/slide2.mp3",
    videoTimestamp: "1:23–1:47",
    videoChapterIndex: 2,
    quizQuestionIds: ["q3", "q4"],
  },
  {
    id: "ccf",
    filterName: "Coaxial Core",
    fullName: "Coaxial Core Filter",
    tagline: "When the cross-section becomes part of the brand.",
    accent: "green",
    tag: "Visual Distinction",
    keySpecs: [
      "Shaped, coloured inner core",
      "Inner and outer materials can differ",
      "Retention depends on tow combination",
      "Visually distinctive cross-section",
    ],
    howItWorks:
      "Coaxial Core constructs the filter as two concentric tubes — an inner core and an outer ring — each with potentially different materials and colours. The visible coloured core becomes a brand signature, while the material choices tune retention to spec.",
    visualType: "ccf",
    audioUrl: "/audio/filter-types/slide3.mp3",
    videoTimestamp: "1:48–2:23",
    videoChapterIndex: 3,
    quizQuestionIds: ["q5"],
  },
  {
    id: "corinthian",
    filterName: "Corinthian™",
    fullName: "Corinthian Patented Filter",
    tagline: "Precision-formed flutes — a draw-resistance signature.",
    accent: "navy",
    tag: "Patented Tech",
    keySpecs: [
      "Patented fluted cellulose structure",
      "Flutes encircle the mouth-end segment",
      "Good draw resistance at high ventilation",
      "Distinct mouth-feel",
    ],
    howItWorks:
      "Corinthian's defining feature is precision-formed 'flutes' in the cellulose acetate — channels that encircle the mouth-end segment. The flute geometry creates a recognisable draw resistance even when paired with high ventilation levels, giving the filter a signature feel.",
    visualType: "corinthian",
    audioUrl: "/audio/filter-types/slide4.mp3",
    videoTimestamp: "2:24–2:58",
    videoChapterIndex: 4,
    quizQuestionIds: ["q6", "q7"],
  },
  {
    id: "vortex",
    filterName: "Vortex™",
    fullName: "Vortex Spiral Filter",
    tagline: "A twist inside — engineered for flavour delivery.",
    accent: "blue",
    tag: "Sensory Design",
    keySpecs: [
      "Distinctive spiral 'twist inside' design",
      "Swirling airflow within the filter",
      "Enhances flavour delivery",
      "Reduces perceived harshness",
    ],
    howItWorks:
      "Vortex's spiral structure forces smoke through a swirling airflow path inside the filter. This both creates a visually distinctive cross-section and modifies how flavour and harshness reach the consumer — a sensory engineering choice as much as a visual one.",
    visualType: "vortex",
    audioUrl: "/audio/filter-types/slide5.mp3",
    videoTimestamp: "2:59–3:29",
    videoChapterIndex: 5,
    quizQuestionIds: ["q8"],
  },
  {
    id: "thankyou",
    filterName: "Thank You",
    fullName: "Module Complete",
    tagline: "You've explored all five performance filters in the Filtrona range.",
    accent: "blue",
    tag: "Completed",
    keySpecs: [],
    howItWorks: "",
    visualType: "thankyou",
    audioUrl: "/audio/filter-types/closing.mp3",
    videoTimestamp: "",
    videoChapterIndex: 0,
    quizQuestionIds: [],
  },
];

/* ── History slides (legacy timeline format) ───────────────────── */

export const historyMilestones: TimelineMilestone[] = [
  {
    year: "1854",
    tag: "Founding",
    accent: "blue",
    title: "The Bunzl story begins",
    body: "Moritz Bunzl opens a haberdashery in Bratislava under the Bunzl name. The seed of what would become a global filter business is planted in 19th-century textile trade.",
  },
  {
    year: "1924",
    tag: "Invention",
    accent: "navy",
    title: "Boris Aivaz patents the cigarette filter",
    body: "Aivaz patents the first cigarette filter tip with a manufacturing machine. He approaches Hugo Bunzl, who gives him R&D support at the Bunzl paper mills.",
  },
  {
    year: "1927",
    tag: "Innovation",
    accent: "blue",
    title: "First production filter",
    body: "Bunzl & Biach perfect the first production filter at the Ortmann factory. The crepe-paper filter goes from concept to manufacturable product.",
  },
  {
    year: "1948",
    tag: "Manufacturing",
    accent: "green",
    title: "Jarrow facility opens",
    body: "The first dedicated filter facility opens in Jarrow, UK. Filter-tipped cigarettes become a postwar global phenomenon and demand explodes.",
  },
  {
    year: "1979",
    tag: "Rebrand",
    accent: "blue",
    title: "The Filtrona name is adopted",
    body: "After decades operating as Bunzl Filter Group, the business adopts the Filtrona name — a marker of identity that would survive multiple ownership changes.",
  },
  {
    year: "2013",
    tag: "Diversification",
    accent: "navy",
    title: "Becomes Essentra plc",
    body: "The company rebrands as Essentra plc to reflect its diversification into industrial components, tapes, and packaging.",
  },
  {
    year: "2022",
    tag: "Return",
    accent: "blue",
    title: "Filtrona is back",
    body: "Centaury Management acquires the filters and tapes divisions and reverts to the Filtrona name, honouring the heritage of innovation.",
  },
  {
    year: "2024",
    tag: "Centenary",
    accent: "green",
    title: "100 years of filters",
    body: "Filtrona celebrates 100 years since the first industrial filter was produced in the UK in 1924. Today: 11 manufacturing sites, 3 innovation centres, 2000+ employees, 120 countries served.",
  },
];

/* ── Backward-compat: flat list for old timeline component ─────── */
export const historySlides = historyMilestones;
export const filterTypesSlides: TimelineMilestone[] = filterSlides.map((s) => ({
  year: s.filterName,
  title: `${s.filterName} — ${s.fullName}`,
  body: s.howItWorks,
  tag: s.tag,
  accent: s.accent,
}));

export const slidesByTopic: Record<string, TimelineMilestone[]> = {
  history: historySlides,
  "filter-types": filterTypesSlides,
};

export const getSlides = (slug: string) => slidesByTopic[slug] ?? [];

/* ── New helpers ───────────────────────────────────────────────── */
export const getSlidesForTopic = (
  slug: string
): FilterSlide[] | TimelineMilestone[] => {
  if (slug === "filter-types") return filterSlides;
  if (slug === "history") return historyMilestones;
  return [];
};
