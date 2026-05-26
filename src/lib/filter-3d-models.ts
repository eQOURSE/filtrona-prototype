export interface FilterModel3D {
  id: string;
  /** Short badge code shown on the card (e.g. "CPS", "COR"). */
  code: string;
  /** Full product name. */
  fullName: string;
  /** Category subtitle shown above the title in the info panel. */
  subtitle: string;
  /** Marketing description for the info panel. */
  description: string;
  /** Tailwind bg-color class for the badge pill. */
  badgeColor: string;
  /** Hex theme accent color used in the 3D viewer annotations. */
  themeColor: string;
  /** Path to the product thumbnail in /public/images-filters/. */
  thumbnail: string;
  /** Path to the standalone 3D viewer HTML in /public/3d-models/. */
  iframeSrc: string;
}

export const filterModels: FilterModel3D[] = [
  {
    id: "cps",
    code: "CPS",
    fullName: "Combined Performance Superior",
    subtitle: "Filtrona's Cross-Flow Technology",
    description:
      '"More Tar. Retained." Instead of air passing straight through, CPS routes airflow across multiple tow layers — increasing surface contact and trapping significantly more tar.',
    badgeColor: "bg-slate-800",
    themeColor: "#0ea5e9",
    thumbnail: "/images-filters/gallery-thumbs/cps.jpeg",
    iframeSrc: "/3d-models/cps.html",
  },
  {
    id: "cor",
    code: "COR",
    fullName: "Carbon Monoxide Reducing",
    subtitle: "Tip Ventilation Designed for Compliance",
    description:
      '"Less CO. Every breath." Tiny perforations at the COR filter tip allow fresh air to dilute the smoke at the last moment before inhalation — significantly reducing the CO concentration that reaches the smoker.',
    badgeColor: "bg-emerald-600",
    themeColor: "#10b981",
    thumbnail: "/images-filters/gallery-thumbs/cor.jpeg",
    iframeSrc: "/3d-models/cor.html",
  },
  {
    id: "ccf",
    code: "CCF",
    fullName: "Coaxial Core Filter",
    subtitle: "Coaxial Customisable Core",
    description:
      '"See the Difference. Inside Out." Two distinct layers: an outer standard layer and an inner core that is purposefully shaped. From the outside it looks normal. Inside, it\'s unmistakably premium and visually distinct.',
    badgeColor: "bg-rose-600",
    themeColor: "#e11d48",
    thumbnail: "/images-filters/gallery-thumbs/ccf.jpeg",
    iframeSrc: "/3d-models/ccf.html",
  },
  {
    id: "corinthian",
    code: "CRN",
    fullName: "Corinthian™ Filter",
    subtitle: "Precision-Engineered for High Ventilation",
    description:
      '"Patented Flutes. Perfect Draw." Precision-formed grooves engineered directly into the cellulose acetate create controlled airflow channels. This maintains consistent draw resistance and eliminates the loose feel typical of high-ventilation filters.',
    badgeColor: "bg-amber-500",
    themeColor: "#f59e0b",
    thumbnail: "/images-filters/gallery-thumbs/corinthian.jpeg",
    iframeSrc: "/3d-models/corinthian.html",
  },
  {
    id: "vortex",
    code: "VTX",
    fullName: "Vortex™ — Taste the Twist",
    subtitle: "The Premium Sensory Filter",
    description:
      '"Twisted Design. Smoother Experience." The Vortex™ houses a unique spiral structure that creates a swirling airflow as smoke passes through — the helical design fundamentally changes how smoke is delivered, enhancing flavour contact while dispersing harsher elements.',
    badgeColor: "bg-purple-600",
    themeColor: "#a855f7",
    thumbnail: "/images-filters/gallery-thumbs/vortex.jpeg",
    iframeSrc: "/3d-models/vortex.html",
  },
];

/** Look up a filter model by its short id (e.g. "cps", "cor"). */
export function getFilterModelById(id: string): FilterModel3D | undefined {
  return filterModels.find((m) => m.id === id);
}
