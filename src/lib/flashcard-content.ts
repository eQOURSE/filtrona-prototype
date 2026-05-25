export type Flashcard = {
  id: string;
  front: string;
  back: string;
  hint?: string;
  accent: "mint" | "violet" | "orange" | "blue";
};

export const historyFlashcards: Flashcard[] = [
  {
    id: "fc-1",
    front: "When and where did the Bunzl story begin?",
    back: "1854, in Bratislava — Moritz Bunzl opened a haberdashery under the Bunzl name.",
    accent: "mint",
  },
  {
    id: "fc-2",
    front: "Who patented the first cigarette filter?",
    hint: "Year matters too",
    back: "Boris Aivaz, in 1924. He approached Hugo Bunzl for R&D support at the Bunzl paper mills.",
    accent: "violet",
  },
  {
    id: "fc-3",
    front: "What was the first production filter made from?",
    back: "Crepe paper. Bunzl & Biach perfected production at the Ortmann factory in 1927.",
    accent: "mint",
  },
  {
    id: "fc-4",
    front: "Where did Filtrona's first dedicated facility open?",
    back: "Jarrow, UK — in 1948, just as filter-tipped cigarettes became a postwar global phenomenon.",
    accent: "orange",
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
    accent: "violet",
  },
  {
    id: "fc-7",
    front: "Who brought back the Filtrona name and when?",
    back: "Centaury Management, in November 2022 — they acquired the filters and tapes divisions and reverted to Filtrona.",
    accent: "mint",
  },
  {
    id: "fc-8",
    front: "What did Filtrona celebrate in 2024?",
    back: "100 years since the first industrial filter was produced in the UK in 1924. Today: 11 sites, 3 innovation centres, 2000+ employees, 120 countries.",
    accent: "orange",
  },
];
