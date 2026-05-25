export type TimelineMilestone = {
  year: string;
  title: string;
  body: string;
  tag?: string;
  accent: "mint" | "violet" | "orange" | "blue";
};

export const historySlides: TimelineMilestone[] = [
  {
    year: "1854",
    tag: "Founding",
    accent: "mint",
    title: "The Bunzl story begins",
    body: "Moritz Bunzl opens a haberdashery in Bratislava under the Bunzl name. The seed of what would become a global filter business is planted in 19th-century textile trade.",
  },
  {
    year: "1924",
    tag: "Invention",
    accent: "violet",
    title: "Boris Aivaz patents the cigarette filter",
    body: "Aivaz patents the first cigarette filter tip with a manufacturing machine. He approaches Hugo Bunzl, who gives him R&D support at the Bunzl paper mills.",
  },
  {
    year: "1927",
    tag: "Innovation",
    accent: "mint",
    title: "First production filter",
    body: "Bunzl & Biach perfect the first production filter at the Ortmann factory. The crepe-paper filter goes from concept to manufacturable product.",
  },
  {
    year: "1948",
    tag: "Manufacturing",
    accent: "orange",
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
    accent: "violet",
    title: "Becomes Essentra plc",
    body: "The company rebrands as Essentra plc to reflect its diversification into industrial components, tapes, and packaging.",
  },
  {
    year: "2022",
    tag: "Return",
    accent: "mint",
    title: "Filtrona is back",
    body: "Centaury Management acquires the filters and tapes divisions and reverts to the Filtrona name, honouring the heritage of innovation.",
  },
  {
    year: "2024",
    tag: "Centenary",
    accent: "orange",
    title: "100 years of filters",
    body: "Filtrona celebrates 100 years since the first industrial filter was produced in the UK in 1924. Today: 11 manufacturing sites, 3 innovation centres, 2000+ employees, 120 countries served.",
  },
];
