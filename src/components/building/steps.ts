import { BrainCircuit, FileSearch, PenSquare, Target, Sparkles } from "lucide-react";

export type StepDefinition = {
  text: string;
  duration: number;
  icon: any;
  color: string;
  glowColor: string;
};

export const steps: StepDefinition[] = [
  {
    text: "Analyzing job requirements and keywords...",
    duration: 3000,
    icon: FileSearch,
    color: "from-blue-400 to-cyan-400",
    glowColor: "rgba(96, 165, 250, 0.7)",
  },
  {
    text: "Identifying optimization opportunities...",
    duration: 3500,
    icon: BrainCircuit,
    color: "from-purple-400 to-fuchsia-400",
    glowColor: "rgba(167, 139, 250, 0.7)",
  },
  {
    text: "Crafting compelling, ATS-friendly content...",
    duration: 4500,
    icon: PenSquare,
    color: "from-rose-400 to-pink-400",
    glowColor: "rgba(244, 114, 182, 0.7)",
  },
  {
    text: "Adding strategic achievements and metrics...",
    duration: 3500,
    icon: Target,
    color: "from-amber-400 to-orange-400",
    glowColor: "rgba(251, 191, 36, 0.7)",
  },
  {
    text: "Finalizing your perfect resume...",
    duration: 2500,
    icon: Sparkles,
    color: "from-emerald-400 to-teal-400",
    glowColor: "rgba(52, 211, 153, 0.7)",
  },
];







