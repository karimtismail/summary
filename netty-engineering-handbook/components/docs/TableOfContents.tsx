"use client";

import { useEffect, useState } from "react";
import type { TocHeading } from "@/lib/handbook";
import { cn } from "@/lib/utils";

export function TableOfContents({ headings }: { headings: TocHeading[] }) {
  const [activeId, setActiveId] = useState(headings[0]?.id);

  useEffect(() => {
    const elements = headings.map((heading) => document.getElementById(heading.id)).filter(Boolean) as HTMLElement[];
    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (visible?.target.id) setActiveId(visible.target.id);
      },
      { rootMargin: "-18% 0px -70% 0px", threshold: [0, 1] }
    );

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [headings]);

  if (!headings.length) return null;

  return (
    <nav aria-label="Table of contents" className="space-y-3">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">On this page</p>
      <div className="space-y-1">
        {headings.map((heading) => (
          <a
            key={heading.id}
            href={`#${heading.id}`}
            className={cn(
              "block border-l border-border py-1.5 pr-2 text-sm leading-5 text-muted transition hover:border-accent hover:text-text",
              heading.level === 3 ? "pl-5" : "pl-3",
              activeId === heading.id && "border-accent text-text"
            )}
          >
            {heading.text}
          </a>
        ))}
      </div>
    </nav>
  );
}
