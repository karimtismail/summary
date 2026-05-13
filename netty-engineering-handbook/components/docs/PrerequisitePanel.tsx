import Link from "next/link";
import { ArrowRight, BookOpenCheck, ChevronDown } from "lucide-react";
import type { Prerequisite } from "@/lib/studyTracks";

export function PrerequisitePanel({
  items,
  title = "Concept map",
  intro = "You do not need to memorize these first. Use them as a map when a word starts to feel blurry.",
  defaultOpen = false
}: {
  items: Prerequisite[];
  title?: string;
  intro?: string;
  defaultOpen?: boolean;
}) {
  if (!items.length) return null;

  return (
    <details
      className="group mb-8 rounded-xl border border-accent-secondary/30 bg-accent-secondary/10 p-4 shadow-inset sm:p-5"
      aria-labelledby="prerequisite-title"
      open={defaultOpen}
    >
      <summary className="flex cursor-pointer list-none items-start gap-3 rounded-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent">
        <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-accent-secondary/35 bg-panel text-accent-secondary">
          <BookOpenCheck className="h-4 w-4" />
        </span>
        <span className="min-w-0 flex-1">
          <span id="prerequisite-title" className="block text-base font-semibold text-text">
            {title}
          </span>
          <span dir="rtl" lang="ar" className="mt-1 block text-right text-sm leading-7 text-muted">
            مصطلحات هتقابلك أثناء الرحلة. افتح الكارت المناسب لما كلمة توقفك.
          </span>
          <span className="mt-2 flex flex-wrap gap-1.5" aria-label="Concept terms">
            {items.map((item) => (
              <bdi key={item.key} dir="ltr" className="rounded-sm border border-border bg-panel px-2 py-1 text-xs text-muted">
                {item.term}
              </bdi>
            ))}
          </span>
        </span>
        <span className="inline-flex shrink-0 items-center gap-2 text-xs font-medium text-muted">
          {items.length} terms
          <ChevronDown className="h-4 w-4 transition group-open:rotate-180" />
        </span>
      </summary>
      <p className="mt-4 text-sm leading-6 text-muted">{intro}</p>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        {items.map((item) => (
          <div key={item.key} className="rounded-lg border border-border bg-panel p-4">
            <div className="mb-2 flex items-center justify-between gap-3">
              <h3 className="text-sm font-semibold text-text">{item.term}</h3>
              {item.href ? (
                <Link
                  href={item.href}
                  className="inline-flex shrink-0 items-center gap-1 rounded-sm text-xs font-medium text-accent transition hover:text-text focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                >
                  Open
                  <ArrowRight className="h-3 w-3" />
                </Link>
              ) : null}
            </div>
            <p className="text-sm leading-6 text-muted">{item.explanation}</p>
            <p className="mt-2 text-xs leading-5 text-muted/85">{item.why}</p>
          </div>
        ))}
      </div>
    </details>
  );
}
