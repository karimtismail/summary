import { AlertTriangle, GitBranch, Play, ScrollText } from "lucide-react";
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
      <div className="mb-5 flex items-start gap-3">
        <span className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-accent/35 bg-accent/10 text-accent">
          <ScrollText className="h-4 w-4" />
        </span>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-text">Read it as one story</p>
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

      <div className="mt-5 rounded-lg border border-border bg-panel shadow-inset">
        <div className="flex flex-col gap-3 border-b border-border px-4 py-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <Play className="h-4 w-4 text-accent-secondary" />
              <p className="text-sm font-semibold text-text">{guide.practice.title}</p>
            </div>
            <p className="mt-1 text-xs leading-5 text-muted">{guide.practice.note}</p>
          </div>
          <span className="inline-flex w-fit shrink-0 items-center gap-1 rounded-sm border border-border bg-card px-2 py-1 font-mono text-[0.65rem] uppercase tracking-[0.14em] text-muted">
            <GitBranch className="h-3 w-3" />
            {guide.practice.language}
          </span>
        </div>
        <pre className="m-0 overflow-x-auto bg-[#0d1017] p-4 text-sm leading-7 text-[#d8dee9]">
          <code>{guide.practice.code}</code>
        </pre>
      </div>

      <div className="mt-4 flex items-start gap-2 rounded-md border border-warning/35 bg-warning/10 px-3 py-2">
        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-warning" />
        <p className="m-0 text-sm leading-6 text-muted">
          The detailed sections below still matter, but read them as evidence for this story instead of separate boxes to memorize.
        </p>
      </div>
    </section>
  );
}
