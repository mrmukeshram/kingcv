import React from "react";

interface GlowCardProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  glowColor?: "blue" | "purple" | "pink" | "green" | "cyan";
}

const glowColors: Record<NonNullable<GlowCardProps["glowColor"]>, string> = {
  blue: "shadow-[0_0_100px_rgba(59,130,246,0.4)] hover:shadow-[0_0_150px_rgba(59,130,246,0.6)]",
  purple: "shadow-[0_0_100px_rgba(147,51,234,0.4)] hover:shadow-[0_0_150px_rgba(147,51,234,0.6)]",
  pink: "shadow-[0_0_100px_rgba(236,72,153,0.4)] hover:shadow-[0_0_150px_rgba(236,72,153,0.6)]",
  green: "shadow-[0_0_100px_rgba(34,197,94,0.4)] hover:shadow-[0_0_150px_rgba(34,197,94,0.6)]",
  cyan: "shadow-[0_0_100px_rgba(6,182,212,0.4)] hover:shadow-[0_0_150px_rgba(6,182,212,0.6)]",
};

const GlowCard: React.FC<GlowCardProps> = ({ children, className = "", delay = 0, glowColor = "blue" }) => {
  return (
    <div
      className={`relative bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/30 group hover:scale-105 transition-all duration-700 before:absolute before:inset-0 before:rounded-3xl before:bg-gradient-to-r before:from-white/40 before:via-blue-100/30 before:to-purple-100/30 before:opacity-0 before:transition-opacity before:duration-500 hover:before:opacity-100 ${glowColors[glowColor]} animate-fade-in-up overflow-hidden ${className}`}
      style={{ animationDelay: `${delay}s` }}
    >
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse" />
      <div className="absolute inset-2 rounded-2xl bg-gradient-to-br from-white/60 to-white/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="relative z-10">{children}</div>
    </div>
  );
};

export default GlowCard;


