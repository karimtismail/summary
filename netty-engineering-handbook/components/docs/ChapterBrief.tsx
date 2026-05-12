import Link from "next/link";
import { BookOpenCheck, ChevronRight } from "lucide-react";
import type { ChapterCheatSheet } from "@/lib/handbook";
import { allChapters, contentCurrentAsOf, sections } from "@/lib/navigation";

export function ChapterBrief({
  title,
  description,
  sectionSlug,
  chapterSlug,
  sectionTitle,
  sheet
}: {
  title: string;
  description: string;
  sectionSlug: string;
  chapterSlug: string;
  sectionTitle: string;
  sheet: ChapterCheatSheet;
}) {
  const chapterIndex = allChapters.findIndex((chapter) => chapter.section === sectionSlug && chapter.slug === chapterSlug);
  const section = sections.find((item) => item.slug === sectionSlug);
  const trackIndex = section?.chapters.findIndex((chapter) => chapter.slug === chapterSlug) ?? -1;

  return (
    <section className="mb-7 rounded-xl border border-border bg-panel p-4 shadow-inset sm:p-6 lg:mb-9" aria-labelledby="chapter-title">
      <nav className="mb-5 flex flex-wrap items-center gap-2 text-sm text-muted [overflow-wrap:anywhere]" aria-label="Breadcrumb">
        <Link href="/handbook" className="transition hover:text-text">
          Study
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="min-w-0 [overflow-wrap:anywhere]">{sectionTitle}</span>
        <span className="rounded-md border border-border bg-card px-2 py-1 font-mono text-xs">
          {chapterIndex >= 0 ? `Chapter ${chapterIndex + 1} / ${allChapters.length}` : "Chapter"}
        </span>
      </nav>

      <div className="min-w-0">
        <p className="mb-3 text-sm font-medium text-accent">{section?.domain ?? sectionTitle}</p>
        <div className="docs-prose">
          <h1 id="chapter-title">{title}</h1>
          <p>{description}</p>
        </div>
        <div className="mt-5 flex flex-wrap gap-2">
          <span className="rounded-md border border-border bg-card px-3 py-1.5 text-sm leading-6 text-muted">
            Current as of {contentCurrentAsOf}
          </span>
          {section ? (
            <span className="rounded-md border border-border bg-card px-3 py-1.5 text-sm leading-6 text-muted">
              {trackIndex >= 0 ? `${trackIndex + 1} of ${section.chapters.length} in this topic` : section.focus}
            </span>
          ) : null}
        </div>
      </div>

      <div className="mt-6 rounded-lg border border-accent/30 bg-accent/10 p-4">
        <div className="mb-2 flex items-center gap-2">
          <BookOpenCheck className="h-4 w-4 text-accent" />
          <h2 className="text-sm font-semibold text-text">Why this lesson exists</h2>
        </div>
        <p className="text-sm leading-6 text-muted [overflow-wrap:anywhere]">{sheet.problem}</p>
      </div>
    </section>
  );
}
