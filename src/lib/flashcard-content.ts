export type Flashcard = {
  id: string;
  front: string;
  back: string;
  hint?: string;
  accent: "blue" | "navy" | "green" | "sky";
};

export const historyFlashcards: Flashcard[] = [
  {
    id: "fc-1",
    front: "When and where did the Bunzl story begin?",
    back: "1854, in Bratislava — Moritz Bunzl opened a haberdashery under the Bunzl name.",
    accent: "blue",
  },
  {
    id: "fc-2",
    front: "Who patented the first cigarette filter?",
    hint: "Year matters too",
    back: "Boris Aivaz, in 1924. He approached Hugo Bunzl for R&D support at the Bunzl paper mills.",
    accent: "navy",
  },
  {
    id: "fc-3",
    front: "What was the first production filter made from?",
    back: "Crepe paper. Bunzl & Biach perfected production at the Ortmann factory in 1927.",
    accent: "blue",
  },
  {
    id: "fc-4",
    front: "Where did Filtrona's first dedicated facility open?",
    back: "Jarrow, UK — in 1948, just as filter-tipped cigarettes became a postwar global phenomenon.",
    accent: "green",
  },
  {
    id: "fc-5",
    front: "When was the Filtrona name first adopted?",
    back: "1979 — after decades operating as Bunzl Filter Group.",
    accent: "blue",
  },
  {
    id: "fc-6",
    front: "Why did the company rebrand to Essentra in 2013?",
    back: "To reflect diversification into industrial components, tapes, and packaging — beyond just filters.",
    accent: "navy",
  },
  {
    id: "fc-7",
    front: "Who brought back the Filtrona name and when?",
    back: "Centaury Management, in November 2022 — they acquired the filters and tapes divisions and reverted to Filtrona.",
    accent: "blue",
  },
  {
    id: "fc-8",
    front: "What did Filtrona celebrate in 2024?",
    back: "100 years since the first industrial filter was produced in the UK in 1924. Today: 11 sites, 3 innovation centres, 2000+ employees, 120 countries.",
    accent: "green",
  },
];

export const filterTypesFlashcards: Flashcard[] = [
  {
    id: "fc-ft-1",
    front: "What does CPS stand for, and what's its main job?",
    back: "Combined Performance Superior. CPS™ increases tar retention using Filtrona's cross-flow technology.",
    accent: "blue",
  },
  {
    id: "fc-ft-2",
    front: "Which Filtrona filter is built specifically to reduce carbon monoxide?",
    hint: "Not the same as tar reduction",
    back: "COR — Carbon Monoxide Reducing. It uses high levels of tip ventilation to reduce CO in smoke.",
    accent: "blue",
  },
  {
    id: "fc-ft-3",
    front: "What makes Coaxial Core (CCF) visually unique?",
    back: "The core is shaped and coloured separately from the outer part, giving an extremely visually distinctive cross-section.",
    accent: "green",
  },
  {
    id: "fc-ft-4",
    front: "What patented feature defines Corinthian™?",
    back: "Precision-formed 'flutes' in the cellulose acetate that encircle the mouth-end segment — providing good draw resistance even at high ventilation.",
    accent: "navy",
  },
  {
    id: "fc-ft-5",
    front: "What does Vortex™ do to airflow?",
    back: "Its 'twist inside' spiral structure creates swirling airflow inside the filter — enhancing flavour delivery while reducing harshness.",
    accent: "blue",
  },
  {
    id: "fc-ft-6",
    front: "Tar reduction vs CO reduction — which filter handles which?",
    back: "CPS targets tar retention. COR targets carbon monoxide. They solve different regulatory problems with different engineering approaches.",
    accent: "blue",
  },
  {
    id: "fc-ft-7",
    front: "If a brand wants a filter customers will recognise on sight, which two are good fits?",
    back: "Coaxial Core (visible coloured core) and Vortex (visible spiral twist). Both are engineered for visual distinction.",
    accent: "green",
  },
  {
    id: "fc-ft-8",
    front: "Which filter uses 'flutes' as its defining structural feature?",
    back: "Corinthian™ — patented precision-formed flutes in the cellulose acetate around the mouth-end segment.",
    accent: "navy",
  },
];

export const flashcardsByTopic: Record<string, Flashcard[]> = {
  'history': historyFlashcards,
  'filter-types': filterTypesFlashcards
};

export const getFlashcards = (slug: string) => flashcardsByTopic[slug] ?? [];
