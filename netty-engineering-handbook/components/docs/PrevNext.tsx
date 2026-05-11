import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { getAdjacentChapters } from "@/lib/navigation";

export function PrevNext({ section, slug }: { section: string; slug: string }) {
  const { previous, next } = getAdjacentChapters(section, slug);

  return (
    <nav className="mt-16 grid gap-4 border-t border-border pt-8 sm:grid-cols-2" aria-label="Previous and next chapters">
      {previous ? (
        <Link className="group rounded-lg border border-border bg-panel p-4 transition hover:border-accent/50 hover:bg-card" href={previous.href}>
          <div className="mb-2 flex items-center gap-2 text-xs uppercase tracking-[0.14em] text-muted">
            <ArrowLeft className="h-3.5 w-3.5" />
            Previous
          </div>
          <p className="font-medium text-text">{previous.title}</p>
          <p className="mt-1 text-sm text-muted">{previous.sectionTitle}</p>
        </Link>
      ) : (
        <div />
      )}
      {next ? (
        <Link className="group rounded-lg border border-border bg-panel p-4 text-right transition hover:border-accent/50 hover:bg-card" href={next.href}>
          <div className="mb-2 flex items-center justify-end gap-2 text-xs uppercase tracking-[0.14em] text-muted">
            Next
            <ArrowRight className="h-3.5 w-3.5" />
          </div>
          <p className="font-medium text-text">{next.title}</p>
          <p className="mt-1 text-sm text-muted">{next.sectionTitle}</p>
        </Link>
      ) : null}
    </nav>
  );
}
