import { useEffect } from "react";
import gsap from "gsap";

export function useGsapMount(container: React.RefObject<HTMLElement>, deps: any[] = []) {
  useEffect(() => {
    if (!container.current) return;
    const ctx = gsap.context(() => {
      gsap.from("[data-gsap=hero]", { y: 20, opacity: 0, duration: 0.6, ease: "power2.out" });
      gsap.from("[data-gsap=progress]", { y: 12, opacity: 0, duration: 0.5, delay: 0.1, ease: "power2.out" });
      gsap.from("[data-gsap=timeline]", { y: 16, opacity: 0, duration: 0.6, delay: 0.15, ease: "power2.out" });
    }, container);
    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}


