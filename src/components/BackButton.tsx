import React from "react";
import { ArrowLeft } from "lucide-react";

type BackButtonSize = "sm" | "md";
type BackButtonVariant = "solid" | "soft";

interface BackButtonProps {
  onClick?: () => void;
  className?: string;
  label?: string;
  size?: BackButtonSize;
  variant?: BackButtonVariant;
}

const sizeClasses: Record<BackButtonSize, { btn: string; icon: string }> = {
  sm: { btn: "h-9 px-3 text-sm", icon: "w-4 h-4" },
  md: { btn: "h-10 px-4 text-base", icon: "w-5 h-5" },
};

const variantClasses: Record<BackButtonVariant, string> = {
  solid: "bg-gradient-to-tr from-blue-600 via-purple-600 to-pink-600 text-white shadow-lg hover:shadow-xl",
  soft: "bg-white/80 text-gray-800 border border-gray-200 hover:bg-white shadow",
};

const BackButton: React.FC<BackButtonProps> = ({
  onClick,
  className = "",
  label,
  size = "md",
  variant = "solid",
}) => {
  const sizing = sizeClasses[size];
  const withLabel = Boolean(label);
  return (
    <button
      onClick={onClick}
      aria-label={label ?? "Back"}
      className={`inline-flex items-center gap-2 rounded-full transition-all duration-300 ${sizing.btn} ${variantClasses[variant]} ${className} ${
        variant === "solid" ? "text-white" : "text-gray-800"
      } hover:scale-[1.03]`}
    >
      <ArrowLeft className={`${sizing.icon} ${variant === "solid" ? "text-white" : "text-gray-800"}`} />
      {withLabel && <span className="font-semibold">{label}</span>}
    </button>
  );
};

export default BackButton;
