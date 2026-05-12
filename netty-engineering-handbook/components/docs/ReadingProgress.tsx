"use client";

import { useEffect, useState } from "react";

export function ReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const update = () => {
      const readingRegion = document.querySelector<HTMLElement>("[data-reading-region='true']");
      if (!readingRegion) {
        const pageHeight = document.documentElement.scrollHeight - window.innerHeight;
        setProgress(pageHeight > 0 ? Math.min(100, Math.max(0, (window.scrollY / pageHeight) * 100)) : 0);
        return;
      }

      const start = readingRegion.offsetTop;
      const end = start + readingRegion.offsetHeight - window.innerHeight;
      const distance = end - start;
      setProgress(distance > 0 ? Math.min(100, Math.max(0, ((window.scrollY - start) / distance) * 100)) : 0);
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <div className="fixed inset-x-0 top-0 z-50 h-1 bg-transparent">
      <div className="h-full bg-accent transition-[width] duration-150" style={{ width: `${progress}%` }} />
    </div>
  );
}
