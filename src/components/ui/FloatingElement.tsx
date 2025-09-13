import React from "react";

interface FloatingElementProps {
  children?: React.ReactNode;
  delay?: number;
  className?: string;
}

const FloatingElement: React.FC<FloatingElementProps> = ({ children, delay = 0, className = "" }) => (
  <div
    className={`animate-float ${className}`}
    style={{
      animationDelay: `${delay}s`,
      animation: `float 6s ease-in-out infinite ${delay}s`,
    }}
  >
    {children}
  </div>
);

export default FloatingElement;


