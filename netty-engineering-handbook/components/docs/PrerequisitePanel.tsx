import Link from "next/link";
import { ArrowRight, BookOpenCheck } from "lucide-react";
import type { Prerequisite } from "@/lib/studyTracks";

export function PrerequisitePanel({
  items,
  title = "Before you start",
  intro = "You do not need to be an expert first. Just make these ideas clear enough, then continue.",
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
      className="mb-8 rounded-xl border border-accent-secondary/30 bg-accent-secondary/10 p-4 shadow-inset sm:p-5"
      aria-labelledby="prerequisite-title"
      open={defaultOpen}
    >
      <summary className="cursor-pointer list-none">
        <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-accent-secondary/35 bg-panel text-accent-secondary">
          <BookOpenCheck className="h-4 w-4" />
        </span>
        <span className="ml-3 inline-block align-middle">
          <span id="prerequisite-title" className="block text-base font-semibold text-text">
            {title}
          </span>
          <span className="mt-1 block text-sm leading-6 text-muted">
            <span dir="rtl" lang="ar">
              مصطلحات ممكن تحتاجها:
            </span>{" "}
            <span dir="ltr">{items.map((item) => item.term).join(", ")}</span>
            <span dir="rtl" lang="ar">
              . افتحهم لو أي كلمة مش واضحة.
            </span>
          </span>
        </span>
      </summary>
      <p className="mt-4 text-sm leading-6 text-muted">{intro}</p>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        {items.map((item) => (
          <div key={item.key} className="rounded-lg border border-border bg-panel p-4">
            <div className="mb-2 flex items-center justify-between gap-3">
              <h3 className="text-sm font-semibold text-text">{item.term}</h3>
              {item.href ? (
                <Link href={item.href} className="inline-flex shrink-0 items-center gap-1 text-xs font-medium text-accent transition hover:text-text">
                  Read
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
