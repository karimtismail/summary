import { Activity, AlertTriangle, CheckCircle2, Gauge, HelpCircle, ListChecks, Search, ServerCog, ShieldCheck, Workflow } from "lucide-react";
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
    <div className="min-w-0 rounded-lg border border-border bg-panel p-4 shadow-inset [overflow-wrap:anywhere]">
      <div className="mb-3 flex items-center gap-2">
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border bg-card text-accent">{icon}</span>
        <h2 className="text-sm font-semibold text-text">{title}</h2>
      </div>
      <div className="text-sm leading-6 text-muted">{children}</div>
    </div>
  );
}

export function ChapterReview({ sheet }: { sheet: ChapterCheatSheetData }) {
  const firstBug = sheet.commonBugs[0] ?? "Missing the failure mode before choosing an API.";
  const prompts = [
    "What problem does this solve in a real system?",
    "What happens at runtime?",
    "What would you measure before tuning?",
    "What mistake will you avoid in production?"
  ];

  return (
    <section className="mt-12 rounded-xl border border-border bg-panel p-4 shadow-inset sm:p-5" aria-labelledby="chapter-review-title">
      <div className="mb-5 flex flex-col gap-2 border-b border-border pb-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent">Senior engineering review</p>
          <h2 id="chapter-review-title" className="mt-2 text-2xl font-semibold tracking-[0] text-text">
            Prove you can operate this idea
          </h2>
        </div>
        <p className="max-w-md text-sm leading-6 text-muted">
          Do this review after reading. The goal is not recall; it is whether you can explain, debug, and defend the design.
        </p>
      </div>

      <div className="mb-4 rounded-lg border border-accent-secondary/35 bg-accent-secondary/10 p-4">
        <div className="mb-3 flex items-center gap-2">
          <HelpCircle className="h-4 w-4 text-accent-secondary" />
          <p className="text-sm font-semibold text-text">Answer before you move on</p>
        </div>
        <ol className="m-0 grid list-none gap-2 p-0 md:grid-cols-2">
          {prompts.map((prompt, index) => (
            <li key={prompt} className="m-0 min-w-0 rounded-md border border-border bg-panel p-3 text-sm leading-6 text-muted [overflow-wrap:anywhere]">
              <span className="mr-2 font-mono text-xs text-accent-secondary">{String(index + 1).padStart(2, "0")}</span>
              {prompt}
            </li>
          ))}
        </ol>
        <p className="mt-3 text-sm leading-6 text-muted" dir="rtl" lang="ar">
          جاوبهم بصوتك. لو الإجابة بتتلخبط، ارجع للجزء المناسب بس، مش للدرس كله.
        </p>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <SheetCard title="Model" icon={<ListChecks className="h-4 w-4" />}>
          {sheet.mentalModel}
        </SheetCard>
        <SheetCard title="Runtime" icon={<ServerCog className="h-4 w-4" />}>
          {sheet.runtime}
        </SheetCard>
        <SheetCard title="Operate" icon={<ShieldCheck className="h-4 w-4" />}>
          {sheet.production}
        </SheetCard>
        <SheetCard title="Avoid first" icon={<AlertTriangle className="h-4 w-4" />}>
          {firstBug}
        </SheetCard>
      </div>

      <details className="mt-4 rounded-lg border border-border bg-card/60 p-3 sm:p-4">
        <summary className="cursor-pointer list-none text-sm font-semibold text-text transition hover:text-accent">Open production drill</summary>
        <p className="mt-3 text-sm leading-6 text-muted">{sheet.summary}</p>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <SheetCard title="Problem" icon={<Workflow className="h-4 w-4" />}>
            {sheet.problem}
          </SheetCard>
          <SheetCard title="Measure" icon={<Gauge className="h-4 w-4" />}>
            {sheet.performance}
          </SheetCard>
          <SheetCard title="Debug first" icon={<Search className="h-4 w-4" />}>
            <ul className="m-0 space-y-2 p-0">
              {sheet.commonBugs.map((bug) => (
                <li key={bug} className="list-none">
                  {bug}
                </li>
              ))}
            </ul>
          </SheetCard>
          <SheetCard title="Guardrail" icon={<CheckCircle2 className="h-4 w-4" />}>
            Keep ownership, queues, timeouts, retries, and resource limits explicit before traffic grows.
          </SheetCard>
        </div>
        <div className="mt-4 rounded-lg border border-accent/30 bg-accent/10 p-4">
          <div className="mb-2 flex items-center gap-2">
            <Activity className="h-4 w-4 text-accent" />
            <p className="text-sm font-semibold text-text">Incident mindset</p>
          </div>
          <p className="text-sm leading-6 text-muted">
            Start with evidence at the boundary: request shape, thread or queue state, memory ownership, downstream latency, and the exact failure signal. Change one thing only after the failure story is clear.
          </p>
        </div>
      </details>
    </section>
  );
}
