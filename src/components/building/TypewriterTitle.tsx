import React, { useEffect, useState } from "react";

export function TypewriterTitle({
  text,
  speed = 40,
  className = "",
}: {
  text: string;
  speed?: number;
  className?: string;
}) {
  const [shown, setShown] = useState(0);

  useEffect(() => {
    setShown(0);
    const id = setInterval(() => {
      setShown((prev) => (prev < text.length ? prev + 1 : prev));
    }, speed);
    return () => clearInterval(id);
  }, [text, speed]);

  return (
    <h2 className={"whitespace-pre-wrap " + className}>
      <span className="text-gradient-primary">{text.slice(0, shown)}</span>
      <span className="inline-block w-2 h-6 ml-1 align-middle bg-blue-600 animate-pulse" />
    </h2>
  );
}









