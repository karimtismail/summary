import { AlertTriangle, CheckCircle2, Gauge, ListChecks, ServerCog, Workflow } from "lucide-react";
import type { ReactNode } from "react";
import type { ChapterCheatSheet as ChapterCheatSheetData } from "@/lib/handbook";

function SheetCard({
  title,
  children,
  icon
}: {
  title: string;
  children: ReactNode;
  icon: ReactNode;
}) {
  return (
    <div className="rounded-lg border border-border bg-panel p-4 shadow-inset">
      <div className="mb-3 flex items-center gap-2">
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border bg-card text-accent">{icon}</span>
        <h2 className="text-sm font-semibold text-text">{title}</h2>
      </div>
      <div className="text-sm leading-6 text-muted">{children}</div>
    </div>
  );
}

export function ChapterCheatSheet({ sheet }: { sheet: ChapterCheatSheetData }) {
  return (
    <details className="mt-10 rounded-xl border border-border bg-card/60 p-4 shadow-inset sm:p-5" aria-labelledby="cheat-sheet-title">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 rounded-lg border border-border bg-panel px-4 py-3 transition hover:border-accent/50">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent">Cheat sheet</p>
          <h2 id="cheat-sheet-title" className="mt-1 text-xl font-semibold tracking-[0] text-text">
            Open the one-page review
          </h2>
        </div>
        <span className="rounded-md border border-border bg-card px-2.5 py-1 text-xs font-medium text-muted">Review</span>
      </summary>
      <p className="mt-4 text-sm leading-6 text-muted">Use this after the lesson, then again when revising the chapter.</p>
      <div className="mt-5 grid gap-3 md:grid-cols-2">
        <SheetCard title="Problem" icon={<Workflow className="h-4 w-4" />}>
          {sheet.problem}
        </SheetCard>
        <SheetCard title="Mental model" icon={<ListChecks className="h-4 w-4" />}>
          {sheet.mentalModel}
        </SheetCard>
        <SheetCard title="Runtime behavior" icon={<ServerCog className="h-4 w-4" />}>
          {sheet.runtime}
        </SheetCard>
        <SheetCard title="Performance" icon={<Gauge className="h-4 w-4" />}>
          {sheet.performance}
        </SheetCard>
      </div>
      <div className="mt-3 grid gap-3 lg:grid-cols-[1fr_1.15fr]">
        <SheetCard title="Production check" icon={<CheckCircle2 className="h-4 w-4" />}>
          {sheet.production}
        </SheetCard>
        <SheetCard title="Bugs to watch" icon={<AlertTriangle className="h-4 w-4" />}>
          <ul className="m-0 space-y-2 p-0">
            {sheet.commonBugs.map((bug) => (
              <li key={bug} className="list-none">
                {bug}
              </li>
            ))}
          </ul>
        </SheetCard>
      </div>
    </details>
  );
}

export function ChapterSummary({ summary }: { summary: string }) {
  return (
    <section className="mt-14 rounded-xl border border-accent/30 bg-accent/10 p-5 shadow-inset" aria-labelledby="quick-summary-title">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent">Summary</p>
      <h2 id="quick-summary-title" className="mt-2 text-2xl font-semibold tracking-[0] text-text">
        What to keep
      </h2>
      <p className="mt-3 text-base leading-8 text-muted">{summary}</p>
    </section>
  );
}
