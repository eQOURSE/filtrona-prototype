export type Topic = {
  slug: string;
  title: string;
  description: string;
  subModules: number;
  estimatedMinutes: number;
  icon: string; // lucide icon name
  accent: 'blue' | 'navy' | 'green' | 'sky';
  unlocked: boolean;
};

export const topics: Topic[] = [
  {
    slug: "history",
    title: "The Filtrona Story",
    description: "From 1854 haberdashery to 100 years of filter innovation.",
    subModules: 8,
    estimatedMinutes: 24,
    icon: "BookOpen",
    accent: "blue",
    unlocked: false,
  },
  {
    slug: "filter-types",
    title: "Filter Types & Performance",
    description: "Five engineered filter solutions — CPS, COR, Coaxial Core, Corinthian, Vortex — what each does and when to use it.",
    subModules: 8,
    estimatedMinutes: 18,
    icon: "Layers",
    accent: "navy",
    unlocked: true,
  },
  {
    slug: "materials",
    title: "Materials & Production",
    description: "Cellulose acetate tow, plugwrap, plasticisers, adhesives.",
    subModules: 4,
    estimatedMinutes: 10,
    icon: "Atom",
    accent: "sky",
    unlocked: false,
  },
  {
    slug: "htp",
    title: "Heated Tobacco Products",
    description: "The Boreas range and the future of heated formats.",
    subModules: 5,
    estimatedMinutes: 14,
    icon: "Flame",
    accent: "green",
    unlocked: false,
  },
  {
    slug: "sustainability",
    title: "Sustainability & ECO Range",
    description: "Crimped paper filters, biodegradability, the EU SUP directive.",
    subModules: 4,
    estimatedMinutes: 11,
    icon: "Leaf",
    accent: "blue",
    unlocked: false,
  },
  {
    slug: "market",
    title: "Market & Industry",
    description: "Four segments, $940bn total addressable market, where it's heading.",
    subModules: 3,
    estimatedMinutes: 8,
    icon: "TrendingUp",
    accent: "navy",
    unlocked: false,
  },
];
