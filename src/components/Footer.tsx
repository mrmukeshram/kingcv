import React from "react";

interface FooterProps {
  variant?: "landing" | "main";
}

const linkedinUrl = "https://www.linkedin.com/in/mukeshram-g-08a09622b/";
const photoSrc = "/DeWatermark.ai_1752811203558~2.jpeg";

export const Footer: React.FC<FooterProps> = ({ variant = "main" }) => {
  return (
    <footer
      className={
        variant === "landing"
          ? "w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-10 flex flex-col items-center gap-4 shadow-lg"
          : "w-full bg-gray-100 text-gray-700 py-4 flex items-center justify-center border-t"
      }
    >
      <a
        href={linkedinUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={
          variant === "landing"
            ? "flex flex-col items-center gap-2 hover:scale-105 transition-transform"
            : "flex items-center gap-2 hover:underline"
        }
      >
        <span
          className={
            variant === "landing"
              ? "relative flex items-center justify-center mb-2"
              : "relative flex items-center justify-center"
          }
          style={{
            width: variant === "landing" ? 104 : 40,
            height: variant === "landing" ? 104 : 40,
          }}
        >
          {/* Outer blurred glow */}
          <span
            className={
              variant === "landing"
                ? "absolute inset-0 rounded-full pointer-events-none"
                : "absolute inset-0 rounded-full pointer-events-none"
            }
            style={{
              zIndex: 0,
              filter: 'blur(4px)',
              background: 'conic-gradient(at top left, #f43f5e, #f59e42, #fbbf24, #22d3ee, #6366f1, #a21caf, #f43f5e)'
            }}
            aria-hidden="true"
          ></span>
          {/* Animated gradient border */}
          <span
            className={
              variant === "landing"
                ? "absolute inset-0 rounded-full p-[2.5px] bg-[conic-gradient(at_top_left,_#f43f5e,_#f59e42,_#fbbf24,_#22d3ee,_#6366f1,_#a21caf,_#f43f5e)] animate-spin-slow border border-transparent"
                : "absolute inset-0 rounded-full p-[1.5px] bg-[conic-gradient(at_top_left,_#f43f5e,_#f59e42,_#fbbf24,_#22d3ee,_#6366f1,_#a21caf,_#f43f5e)] animate-spin-slow border border-transparent"
            }
            aria-hidden="true"
            style={{ zIndex: 1 }}
          ></span>
          {/* Profile image */}
          <img
            src={photoSrc}
            alt="Mukeshram G."
            className={
              variant === "landing"
                ? "relative rounded-full w-24 h-24 object-cover shadow-2xl z-10 bg-white"
                : "relative rounded-full w-8 h-8 object-cover z-10 bg-white"
            }
            style={{ zIndex: 2 }}
          />
        </span>
        <span
          className={
            variant === "landing"
              ? "text-lg font-semibold tracking-wide"
              : "text-sm font-medium"
          }
        >
          Connect on LinkedIn
        </span>
      </a>
      {variant === "landing" && (
        <p className="mt-2 text-sm opacity-80 max-w-md text-center">
          "Every great journey begins with a single step. Let your resume be the first step toward your dreams."
        </p>
      )}
      <style>{`
        @keyframes spin-slow {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 3.5s linear infinite;
        }
      `}</style>
    </footer>
  );
};

export default Footer;
