import { SubModuleId } from "./progress-store";

export type SubModule = {
  id: SubModuleId;
  title: string;
  description: string;
  icon: string; // lucide icon name
  accent: "mint" | "violet" | "orange" | "blue";
  available: boolean;
  estimatedMinutes: number;
};

export const subModules: SubModule[] = [
  {
    id: "slides",
    title: "Slide Deck",
    description: "A guided walkthrough of the topic.",
    icon: "Presentation",
    accent: "mint",
    available: true,
    estimatedMinutes: 5,
  },
  {
    id: "quiz",
    title: "Quiz",
    description: "Gamified questions to test what stuck.",
    icon: "Sparkles",
    accent: "violet",
    available: true,
    estimatedMinutes: 4,
  },
  {
    id: "video",
    title: "Related Video",
    description: "Short film with key moments.",
    icon: "Play",
    accent: "orange",
    available: false,
    estimatedMinutes: 3,
  },
  {
    id: "mindmap",
    title: "Mind Map",
    description: "See how all the pieces connect.",
    icon: "Network",
    accent: "blue",
    available: false,
    estimatedMinutes: 2,
  },
  {
    id: "flashcards",
    title: "Flashcards",
    description: "Flip and review the essentials.",
    icon: "Layers2",
    accent: "mint",
    available: true,
    estimatedMinutes: 3,
  },
  {
    id: "audio",
    title: "Audio Overview",
    description: "Listen on the go.",
    icon: "Headphones",
    accent: "violet",
    available: false,
    estimatedMinutes: 4,
  },
  {
    id: "gallery",
    title: "2D / 3D Gallery",
    description: "Explore the products in three dimensions.",
    icon: "Box",
    accent: "orange",
    available: false,
    estimatedMinutes: 3,
  },
  {
    id: "chatbot",
    title: "Ask the Coach",
    description: "Live Q&A with an AI that knows this topic.",
    icon: "MessageCircle",
    accent: "blue",
    available: false,
    estimatedMinutes: 0, // open-ended
  },
];
