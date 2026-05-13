import { ArrowRight, GitBranch, Play, ScrollText } from "lucide-react";
import type { ChapterCheatSheet } from "@/lib/handbook";
import { getChapterStoryGuide } from "@/lib/storyGuides";

export function ChapterStoryGuide({
  title,
  description,
  sectionSlug,
  chapterSlug,
  sheet
}: {
  title: string;
  description: string;
  sectionSlug: string;
  chapterSlug: string;
  sheet: ChapterCheatSheet;
}) {
  const guide = getChapterStoryGuide({ title, description, sectionSlug, chapterSlug, sheet });

  return (
    <section className="mb-8 border-y border-border py-5 sm:py-6" aria-label="Story reading guide">
      <div className="mb-4 flex items-start gap-3">
        <span className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-accent/35 bg-accent/10 text-accent">
          <ScrollText className="h-4 w-4" />
        </span>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-text">Story map</p>
          <p dir="rtl" lang="ar" className="mt-1 text-sm leading-7 text-muted">
            {guide.arabic}
          </p>
        </div>
      </div>

      <ol className="m-0 list-none space-y-3 p-0">
        {guide.beats.map((beat, index) => (
          <li key={beat.label} className="grid gap-2 border-l border-border pl-3 sm:grid-cols-[10.5rem_1fr] sm:gap-4 sm:pl-4">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-accent">{String(index + 1).padStart(2, "0")}</span>
              <span className="text-sm font-semibold text-text">{beat.label}</span>
            </div>
            <p className="m-0 text-sm leading-6 text-muted [overflow-wrap:anywhere]">{beat.text}</p>
          </li>
        ))}
      </ol>

      <div className="mt-4 flex flex-wrap gap-2">
        <a
          href="#intuition"
          className="inline-flex items-center gap-2 rounded-md border border-accent/35 bg-accent/10 px-3 py-2 text-sm font-semibold text-text transition hover:border-accent/60 hover:bg-accent/15"
        >
          Start reading
          <ArrowRight className="h-4 w-4" />
        </a>
        <a
          href="#code-example"
          className="inline-flex items-center gap-2 rounded-md border border-border bg-panel px-3 py-2 text-sm font-semibold text-muted transition hover:border-accent-secondary/50 hover:text-text"
        >
          Practice section
        </a>
      </div>

      <details className="mt-4 rounded-lg border border-border bg-panel shadow-inset">
        <summary className="flex cursor-pointer list-none flex-col gap-3 px-4 py-3 transition hover:bg-card/50 sm:flex-row sm:items-start sm:justify-between">
          <span className="min-w-0">
            <span className="flex items-center gap-2 text-sm font-semibold text-text">
              <Play className="h-4 w-4 text-accent-secondary" />
              {guide.practice.title}
            </span>
            <span className="mt-1 block text-xs leading-5 text-muted">{guide.practice.note}</span>
          </span>
          <span className="inline-flex w-fit shrink-0 items-center gap-1 rounded-sm border border-border bg-card px-2 py-1 font-mono text-[0.65rem] uppercase tracking-[0.14em] text-muted">
            <GitBranch className="h-3 w-3" />
            {guide.practice.language}
          </span>
        </summary>
        <pre className="m-0 overflow-x-auto border-t border-border bg-[#0d1017] p-4 text-sm leading-7 text-[#d8dee9]">
          <code>{guide.practice.code}</code>
        </pre>
      </details>
    </section>
  );
}
