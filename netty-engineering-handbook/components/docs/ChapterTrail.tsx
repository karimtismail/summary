import Link from "next/link";
import { ArrowRight, Route } from "lucide-react";
import { allChapters, getAdjacentChapters } from "@/lib/navigation";

export function ChapterTrail({ section, slug }: { section: string; slug: string }) {
  const currentIndex = allChapters.findIndex((chapter) => chapter.section === section && chapter.slug === slug);
  const current = currentIndex >= 0 ? allChapters[currentIndex] : null;
  const adjacent = getAdjacentChapters(section, slug);
  const nearby = [adjacent.previous, current, adjacent.next].filter(Boolean);

  if (!current) return null;

  return (
    <nav aria-label="Learning path" className="mb-8 rounded-xl border border-border bg-card/45 p-4 shadow-inset sm:p-5">
      <div className="mb-4 flex items-center gap-3">
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border bg-panel text-accent">
          <Route className="h-4 w-4" />
        </span>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent">Learning path</p>
          <p className="mt-1 text-sm leading-6 text-muted">Understand where this lesson sits before reading the API.</p>
        </div>
      </div>
      <div className="grid gap-2 md:grid-cols-3">
        {nearby.map((chapter, index) => {
          if (!chapter) return null;
          const isCurrent = chapter.href === current.href;
          const label = chapter.href === adjacent.previous?.href ? "Previous" : chapter.href === adjacent.next?.href ? "Next" : "Current";

          return (
            <Link
              key={chapter.href}
              href={chapter.href}
              aria-current={isCurrent ? "page" : undefined}
              className={
                isCurrent
                  ? "rounded-lg border border-accent/45 bg-accent/10 p-3.5 shadow-inset"
                  : "group rounded-lg border border-border bg-panel p-3.5 transition hover:border-accent/50 hover:bg-card"
              }
            >
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">{label}</p>
                {index < nearby.length - 1 ? <ArrowRight className="hidden h-3.5 w-3.5 text-muted md:block" /> : null}
              </div>
              <p className="mt-2 font-medium text-text">{chapter.title}</p>
              <p className="mt-1 text-sm leading-6 text-muted">{chapter.sectionTitle}</p>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
