import React, { PropsWithChildren } from "react";

const PremiumBackground: React.FC<PropsWithChildren<{ className?: string }>> = ({ children, className = "" }) => {
  return (
    <div className={`relative min-h-screen w-full overflow-hidden bg-white ${className}`}>
      {/* Soft radial gradient wash */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(1200px 600px at 50% -10%, rgba(15, 23, 42, 0.06), transparent 60%),
                      radial-gradient(900px 500px at 100% 0%, rgba(59, 130, 246, 0.06), transparent 60%),
                      radial-gradient(900px 500px at 0% 0%, rgba(236, 72, 153, 0.05), transparent 60%)`,
        }}
      />
      {/* Subtle grid/dot pattern */}
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, #0f172a 1px, transparent 0)",
          backgroundSize: "22px 22px",
        }}
      />
      {/* Corner blurs */}
      <div className="pointer-events-none absolute -top-24 -right-24 w-[420px] h-[420px] rounded-full bg-blue-100 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 w-[420px] h-[420px] rounded-full bg-pink-100 blur-3xl" />

      <div className="relative z-10">{children}</div>
    </div>
  );
};

export default PremiumBackground;








