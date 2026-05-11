import { AlertTriangle, Compass, Target } from "lucide-react";
import type { ChapterCheatSheet } from "@/lib/handbook";

function GuideItem({
  label,
  value,
  icon: Icon
}: {
  label: string;
  value: string;
  icon: typeof Target;
}) {
  return (
    <div className="rounded-lg border border-border bg-panel p-4 shadow-inset">
      <div className="mb-3 flex items-center gap-2">
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border bg-card text-accent">
          <Icon className="h-4 w-4" />
        </span>
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">{label}</p>
      </div>
      <p className="text-sm leading-6 text-muted">{value}</p>
    </div>
  );
}

export function ChapterLearningGuide({
  title,
  section,
  sheet
}: {
  title: string;
  section: string;
  sheet: ChapterCheatSheet;
}) {
  const firstBug = sheet.commonBugs[0] ?? "Missing the operational boundary before choosing an API.";

  return (
    <section className="mb-8 rounded-xl border border-border bg-card/45 p-4 shadow-inset sm:p-5" aria-labelledby="learning-guide-title">
      <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent">Reading guide</p>
          <h2 id="learning-guide-title" className="mt-2 text-2xl font-semibold tracking-[0] text-text">
            How to read {title}
          </h2>
        </div>
        <p className="max-w-md text-sm leading-6 text-muted">
          Part of {section}. Read the problem first, then use the model to understand the API and production tradeoffs.
        </p>
      </div>
      <div className="grid gap-3 lg:grid-cols-3">
        <GuideItem label="Problem to solve" value={sheet.problem} icon={Target} />
        <GuideItem label="Mental model" value={sheet.mentalModel} icon={Compass} />
        <GuideItem label="First pitfall" value={firstBug} icon={AlertTriangle} />
      </div>
    </section>
  );
}
