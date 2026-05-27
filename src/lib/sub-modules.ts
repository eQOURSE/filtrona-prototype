import { SubModuleId } from "./progress-store";

export type SubModule = {
  id: SubModuleId;
  title: string;
  description: string;
  icon: string; // lucide icon name
  accent: "blue" | "navy" | "green" | "sky";
  available: boolean;
  estimatedMinutes: number;
};

export const subModules: SubModule[] = [
  {
    id: "slides",
    title: "Slide Deck",
    description: "A guided walkthrough of the topic.",
    icon: "Presentation",
    accent: "blue",
    available: true,
    estimatedMinutes: 5,
  },
  {
    id: "quiz",
    title: "Knowledge Check - Quiz",
    description: "Gamified questions to test what stuck.",
    icon: "Sparkles",
    accent: "navy",
    available: true,
    estimatedMinutes: 4,
  },
  {
    id: "video",
    title: "Video Gallery",
    description: "Short film with key moments.",
    icon: "Play",
    accent: "green",
    available: true,
    estimatedMinutes: 3,
  },
  {
    id: "mindmap",
    title: "Mind Map",
    description: "See how all the pieces connect.",
    icon: "Network",
    accent: "sky",
    available: true,
    estimatedMinutes: 2,
  },
  {
    id: "flashcards",
    title: "Flashcards",
    description: "Flip and review the essentials.",
    icon: "Layers2",
    accent: "blue",
    available: true,
    estimatedMinutes: 3,
  },
  {
    id: "audio",
    title: "Audio Overview",
    description: "Listen on the go.",
    icon: "Headphones",
    accent: "navy",
    available: true,
    estimatedMinutes: 4,
  },
  {
    id: "gallery",
    title: "2D / 3D Gallery",
    description: "Explore the products in three dimensions.",
    icon: "Box",
    accent: "green",
    available: true,
    estimatedMinutes: 3,
  },
  {
    id: "chatbot",
    title: "Ask the Coach",
    description: "Live Q&A with an AI that knows this topic.",
    icon: "MessageCircle",
    accent: "sky",
    available: true,
    estimatedMinutes: 0, // open-ended
  },
];
