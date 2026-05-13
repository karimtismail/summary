"use client";

import { useEffect, useState } from "react";
import type { TocHeading } from "@/lib/handbook";
import { getChapterSectionByHeading } from "@/lib/chapterSections";
import { cn } from "@/lib/utils";

export function TableOfContents({ headings }: { headings: TocHeading[] }) {
  const [activeId, setActiveId] = useState(headings[0]?.id);
  const h2Headings = headings.filter((heading) => heading.level === 2);
  const journey = [
    { label: "Story", ids: ["intuition", "real-world-problem"] },
    { label: "Mechanics", ids: ["mental-model", "visual-explanation", "runtime-behavior"] },
    { label: "Code", ids: ["code-example"] },
    { label: "Tradeoffs", ids: ["production-implications", "performance-implications", "common-bugs"] },
    { label: "Remember", ids: ["summary"] }
  ]
    .map((step) => {
      const available = h2Headings.filter((heading) => {
        const section = getChapterSectionByHeading(heading.text);
        return section ? step.ids.includes(section.id) : step.ids.includes(heading.id);
      });
      const first = available[0];
      return first ? { ...step, href: `#${first.id}`, active: available.some((heading) => heading.id === activeId) } : null;
    })
    .filter(Boolean) as Array<{ label: string; ids: string[]; href: string; active: boolean }>;

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

  if (!h2Headings.length) return null;

  return (
    <nav aria-label="Lesson journey" className="space-y-4">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">Story path</p>
        <p dir="rtl" lang="ar" className="mt-1 text-xs leading-5 text-muted/80">
          امشيها كحكاية واحدة، مش كقائمة حفظ.
        </p>
      </div>
      <div className="space-y-1.5">
        {journey.map((step) => (
          <a
            key={step.label}
            href={step.href}
            aria-current={step.active ? "location" : undefined}
            className={cn(
              "block rounded-md border border-border bg-panel px-3 py-2 text-sm leading-5 text-muted transition hover:border-accent hover:text-text focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
              step.active && "border-accent bg-card text-text"
            )}
          >
            {step.label}
          </a>
        ))}
      </div>
      <details className="rounded-lg border border-border bg-panel/55 p-3">
        <summary className="cursor-pointer list-none rounded-sm text-xs font-medium text-muted transition hover:text-text focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent">
          Open detailed steps
        </summary>
        <div className="mt-3 space-y-1">
          {h2Headings.map((heading) => {
            const section = getChapterSectionByHeading(heading.text);
            return (
              <a
                key={heading.id}
                href={`#${heading.id}`}
                className={cn(
                  "block border-l border-border py-1 pl-3 pr-2 text-xs leading-5 text-muted transition hover:border-accent hover:text-text focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
                  activeId === heading.id && "border-accent text-text"
                )}
              >
                {section?.navLabel ?? heading.text}
              </a>
            );
          })}
        </div>
      </details>
    </nav>
  );
}
