import { Lightbulb, ShieldCheck, TriangleAlert } from "lucide-react";
import type { ChapterCheatSheet } from "@/lib/handbook";

export function ChapterTakeaways({ sheet }: { sheet: ChapterCheatSheet }) {
  const firstBug = sheet.commonBugs[0] ?? "Do not use the API before the failure mode is clear.";

  return (
    <section className="mt-12 rounded-xl border border-accent/30 bg-accent/10 p-4 shadow-inset sm:p-5" aria-labelledby="takeaways-title">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent">Key takeaways</p>
      <h2 id="takeaways-title" className="mt-2 text-2xl font-semibold tracking-[0] text-text">
        What should stick
      </h2>
      <div className="mt-5 grid gap-3 md:grid-cols-3">
        <div className="rounded-lg border border-border bg-panel p-4">
          <div className="mb-3 flex items-center gap-2">
            <Lightbulb className="h-4 w-4 text-accent" />
            <h3 className="text-sm font-semibold text-text">Core idea</h3>
          </div>
          <p className="text-sm leading-6 text-muted">{sheet.mentalModel}</p>
        </div>
        <div className="rounded-lg border border-border bg-panel p-4">
          <div className="mb-3 flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-accent-secondary" />
            <h3 className="text-sm font-semibold text-text">Production check</h3>
          </div>
          <p className="text-sm leading-6 text-muted">{sheet.production}</p>
        </div>
        <div className="rounded-lg border border-border bg-panel p-4">
          <div className="mb-3 flex items-center gap-2">
            <TriangleAlert className="h-4 w-4 text-warning" />
            <h3 className="text-sm font-semibold text-text">Watch for</h3>
          </div>
          <p className="text-sm leading-6 text-muted">{firstBug}</p>
        </div>
      </div>
    </section>
  );
}
