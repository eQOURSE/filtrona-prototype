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
