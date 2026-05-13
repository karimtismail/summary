"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { findChapter, getAdjacentChapters } from "@/lib/navigation";
import { getStudyTrack, withStudyPath } from "@/lib/studyTracks";

export function PrevNext({ section, slug }: { section: string; slug: string }) {
  const [studyPath, setStudyPath] = useState<string | null>(null);
  const { previous, next } = getAdjacentChapters(section, slug);
  const studyNavigation = useMemo(() => {
    if (!studyPath) return null;

    const track = getStudyTrack(studyPath);
    if (!track) return null;

    const currentIndex = track.steps.findIndex((step) => step.section === section && step.slug === slug);
    if (currentIndex < 0) return null;

    const toStudyItem = (index: number, label: string) => {
      const step = track.steps[index];
      const chapter = findChapter(step.section, step.slug);
      if (!chapter) return null;

      return {
        href: withStudyPath(chapter.href, track.slug),
        label,
        title: chapter.title,
        context: `${track.shortTitle} lesson ${index + 1} of ${track.steps.length}`
      };
    };

    return {
      previous:
        currentIndex > 0
          ? toStudyItem(currentIndex - 1, `Previous in ${track.shortTitle}`)
          : {
              href: `/handbook/study/${track.slug}`,
              label: `Back to ${track.shortTitle}`,
              title: track.title,
              context: "Study path overview"
            },
      next:
        currentIndex < track.steps.length - 1
          ? toStudyItem(currentIndex + 1, `Next in ${track.shortTitle}`)
          : {
              href: "/handbook/mastery/real-projects",
              label: `Finish ${track.shortTitle}`,
              title: "Build a real project",
              context: "Practice projects"
            }
    };
  }, [section, slug, studyPath]);

  useEffect(() => {
    const readStudyPath = () => {
      setStudyPath(new URLSearchParams(window.location.search).get("path"));
    };

    readStudyPath();
    window.addEventListener("popstate", readStudyPath);
    return () => window.removeEventListener("popstate", readStudyPath);
  }, []);

  const previousItem = studyNavigation?.previous ?? (previous ? { href: previous.href, label: "Previous", title: previous.title, context: previous.sectionTitle } : null);
  const nextItem = studyNavigation?.next ?? (next ? { href: next.href, label: "Next", title: next.title, context: next.sectionTitle } : null);

  return (
    <nav className="mt-16 grid gap-4 border-t border-border pt-8 sm:grid-cols-2" aria-label="Previous and next chapters">
      {previousItem ? (
        <Link
          className="group rounded-lg border border-border bg-panel p-4 transition hover:border-accent/50 hover:bg-card focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          href={previousItem.href}
        >
          <div className="mb-2 flex items-center gap-2 text-xs uppercase tracking-[0.14em] text-muted">
            <ArrowLeft className="h-3.5 w-3.5" />
            {previousItem.label}
          </div>
          <p className="font-medium text-text">{previousItem.title}</p>
          <p className="mt-1 text-sm text-muted">{previousItem.context}</p>
        </Link>
      ) : (
        <div />
      )}
      {nextItem ? (
        <Link
          className="group rounded-lg border border-border bg-panel p-4 text-right transition hover:border-accent/50 hover:bg-card focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          href={nextItem.href}
        >
          <div className="mb-2 flex items-center justify-end gap-2 text-xs uppercase tracking-[0.14em] text-muted">
            {nextItem.label}
            <ArrowRight className="h-3.5 w-3.5" />
          </div>
          <p className="font-medium text-text">{nextItem.title}</p>
          <p className="mt-1 text-sm text-muted">{nextItem.context}</p>
        </Link>
      ) : null}
    </nav>
  );
}
