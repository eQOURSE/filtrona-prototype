export type QuizQuestion =
  | {
      id: string;
      type: "mcq";
      question: string;
      options: string[];
      correctIndex: number;
      explanation: string;
    }
  | {
      id: string;
      type: "truefalse";
      question: string;
      correct: boolean;
      explanation: string;
    }
  | {
      id: string;
      type: "multiselect";
      question: string;
      options: string[];
      correctIndices: number[];
      explanation: string;
    }
  | {
      id: string;
      type: "match";
      question: string;
      leftItems: string[];
      rightItems: string[];
      correctPairs: [number, number][];
      explanation: string;
    };

export const historyQuestions: QuizQuestion[] = [
  {
    id: "q1",
    type: "mcq",
    question: "In what year was the Bunzl haberdashery founded in Bratislava?",
    options: ["1824", "1854", "1879", "1924"],
    correctIndex: 1,
    explanation:
      "1854 — Moritz Bunzl opened a haberdashery in Bratislava under the Bunzl name.",
  },
  {
    id: "q2",
    type: "truefalse",
    question: "Boris Aivaz patented the first cigarette filter in 1924.",
    correct: true,
    explanation:
      "Correct. Aivaz then approached Hugo Bunzl, who gave him R&D support at the Bunzl paper mills.",
  },
  {
    id: "q3",
    type: "mcq",
    question: "Where did Filtrona's first dedicated filter facility open?",
    options: [
      "Bratislava",
      "Ortmann, Austria",
      "Jarrow, UK",
      "Greensboro, USA",
    ],
    correctIndex: 2,
    explanation:
      "Jarrow, UK in 1948. The Ortmann factory was where production was perfected in 1927 — different milestone.",
  },
  {
    id: "q4",
    type: "multiselect",
    question:
      "Which of the following are true about Filtrona today? (Select all that apply)",
    options: [
      "Headquartered in Singapore",
      "Has 11 manufacturing facilities globally",
      "Owned by the Bunzl family",
      "Serves customers across 120 countries",
    ],
    correctIndices: [0, 1, 3],
    explanation:
      "Filtrona is headquartered in Singapore, operates 11 manufacturing sites, and serves 120 countries. It's no longer owned by the Bunzl family — Centaury Management acquired the business in 2022.",
  },
  {
    id: "q5",
    type: "match",
    question: "Match each year to its milestone.",
    leftItems: ["1854", "1924", "1979", "2022"],
    rightItems: [
      "Filtrona name brought back",
      "Bunzl haberdashery founded",
      "Filtrona name first adopted",
      "Boris Aivaz patents the filter",
    ],
    correctPairs: [
      [0, 1],
      [1, 3],
      [2, 2],
      [3, 0],
    ],
    explanation:
      "1854 — founding. 1924 — Aivaz patents the filter. 1979 — Filtrona name adopted. 2022 — Centaury Management brings the name back.",
  },
  {
    id: "q6",
    type: "mcq",
    question: "Why did the company rebrand to Essentra in 2013?",
    options: [
      "To enter the Asian market",
      "To reflect diversification into industrial components",
      "To distance from tobacco regulation",
      "To prepare for an IPO",
    ],
    correctIndex: 1,
    explanation:
      "Essentra reflected the move beyond filters into industrial components, tapes, and packaging.",
  },
  {
    id: "q7",
    type: "truefalse",
    question:
      "The Filtrona name was created in 2022 when Centaury Management acquired the business.",
    correct: false,
    explanation:
      "The Filtrona name was first adopted in 1979. Centaury revived it in 2022 after the Essentra era — it wasn't new.",
  },
  {
    id: "q8",
    type: "match",
    question: "Match each Filtrona milestone to its decade.",
    leftItems: [
      "Bunzl founded",
      "Aivaz patents filter",
      "Jarrow facility opens",
      "Centenary celebration",
    ],
    rightItems: ["1940s", "2020s", "1850s", "1920s"],
    correctPairs: [
      [0, 2],
      [1, 3],
      [2, 0],
      [3, 1],
    ],
    explanation:
      "Founding 1850s, patent 1920s, Jarrow 1940s, centenary 2020s.",
  },
];

export const filterTypesQuestions: QuizQuestion[] = [
  {
    id: "ft-q1",
    type: "mcq",
    question: "Which Filtrona filter is specifically engineered to reduce tar retention through cross-flow technology?",
    options: ["COR", "CPS", "Vortex™", "Coaxial Core"],
    correctIndex: 1,
    explanation: "CPS — Combined Performance Superior. Cross-flow technology is its defining mechanism for tar reduction."
  },
  {
    id: "ft-q2",
    type: "truefalse",
    question: "The COR filter and the CPS filter both target the same regulatory problem.",
    correct: false,
    explanation: "Different problems. CPS targets tar reduction. COR targets carbon monoxide reduction through tip ventilation."
  },
  {
    id: "ft-q3",
    type: "mcq",
    question: "What is the defining patented feature of Corinthian™?",
    options: ["A spiral twist inside", "A coloured shaped core", "Precision-formed flutes in the cellulose acetate", "Cross-flow tar retention"],
    correctIndex: 2,
    explanation: "Flutes — precision-formed channels encircling the mouth-end segment. They give Corinthian its draw-resistance signature."
  },
  {
    id: "ft-q4",
    type: "multiselect",
    question: "Which of these filters are engineered with visual distinction as a primary goal? (Select all that apply)",
    options: ["CPS", "Coaxial Core (CCF)", "Vortex™", "COR"],
    correctIndices: [1, 2],
    explanation: "Coaxial Core (visible coloured core) and Vortex (visible spiral twist) are the two engineered for visual distinction. CPS and COR are functional/regulatory filters."
  },
  {
    id: "ft-q5",
    type: "match",
    question: "Match each filter to its defining mechanism.",
    leftItems: ["CPS", "COR", "Coaxial Core", "Vortex™"],
    rightItems: ["Spiral airflow inside the filter", "Cross-flow tar retention", "High tip ventilation for CO reduction", "Shaped coloured inner core"],
    correctPairs: [[0,1],[1,2],[2,3],[3,0]],
    explanation: "CPS — cross-flow. COR — tip ventilation for CO. Coaxial Core — coloured inner core. Vortex — spiral airflow."
  },
  {
    id: "ft-q6",
    type: "mcq",
    question: "A customer asks for a filter that enhances flavour delivery while reducing harshness, with a distinctive visual signature. Which is the best fit?",
    options: ["CPS", "Corinthian™", "Vortex™", "COR"],
    correctIndex: 2,
    explanation: "Vortex — the spiral structure enhances flavour delivery and reduces harshness, AND gives a distinctive 'twist inside' visual."
  },
  {
    id: "ft-q7",
    type: "truefalse",
    question: "Coaxial Core's tar retention is fixed regardless of the materials used.",
    correct: false,
    explanation: "False. Coaxial Core retention is highly dependent on the combination of tow materials used in the inner and outer parts."
  },
  {
    id: "ft-q8",
    type: "match",
    question: "Match each filter to its primary value proposition.",
    leftItems: ["CPS", "COR", "Corinthian™", "Vortex™"],
    rightItems: ["Sensory + visual signature", "Tar reduction at scale", "CO reduction via ventilation", "Patented draw-resistance feel"],
    correctPairs: [[0,1],[1,2],[2,3],[3,0]],
    explanation: "CPS — tar reduction. COR — CO reduction. Corinthian — patented draw resistance. Vortex — sensory + visual signature."
  }
];

export const questionsByTopic: Record<string, QuizQuestion[]> = {
  'history': historyQuestions,
  'filter-types': filterTypesQuestions
};

export const getQuestions = (slug: string) => questionsByTopic[slug] ?? [];
