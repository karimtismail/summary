import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  Clock3,
  FlaskConical,
  Hammer,
  MessageSquareText,
  PackageCheck,
  ShieldCheck,
  type LucideIcon
} from "lucide-react";
import type { PracticeLab } from "@/lib/practiceLabs";
import { cn } from "@/lib/utils";

function LabChecklist({ title, items, icon: Icon, tone }: { title: string; items: string[]; icon: LucideIcon; tone: "accent" | "secondary" | "warning" }) {
  const toneClass = {
    accent: "text-accent",
    secondary: "text-accent-secondary",
    warning: "text-warning"
  }[tone];

  return (
    <div className="min-w-0 border-l border-border pl-3 [overflow-wrap:anywhere]">
      <div className="mb-2 flex items-center gap-2">
        <Icon className={`h-4 w-4 ${toneClass}`} />
        <p className="text-sm font-semibold text-text">{title}</p>
      </div>
      <ul className="m-0 space-y-2 p-0">
        {items.map((item) => (
          <li key={item} className="m-0 flex items-start gap-2 text-sm leading-6 text-muted">
            <CheckCircle2 className="mt-1 h-3.5 w-3.5 shrink-0 text-accent-secondary" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function StudyLabCard({ lab, done, onToggle }: { lab: PracticeLab; done: boolean; onToggle: () => void }) {
  return (
    <div className={cn("rounded-lg border border-border bg-card p-3 transition sm:p-4", done && "border-accent-secondary/40 bg-accent-secondary/5")}>
      <div className="grid grid-cols-[2.75rem_minmax(0,1fr)] gap-3">
        <button
          type="button"
          role="checkbox"
          aria-checked={done}
          aria-label={done ? `Mark ${lab.title} lab as not proven` : `Mark ${lab.title} lab as proven`}
          onClick={onToggle}
          className={cn(
            "inline-flex h-11 w-11 items-center justify-center rounded-md border transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
            done ? "border-accent-secondary/45 bg-accent-secondary text-bg" : "border-border bg-panel text-muted hover:text-text"
          )}
        >
          {done ? <CheckCircle2 className="h-4 w-4" /> : <FlaskConical className="h-4 w-4" />}
        </button>

        <details className="group min-w-0">
          <summary className="grid cursor-pointer list-none grid-cols-[minmax(0,1fr)_auto] gap-3 rounded-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent">
            <span className="min-w-0">
              <span className="mb-1 flex flex-wrap items-center gap-2 text-xs leading-5 text-muted">
                <span className="font-semibold uppercase tracking-[0.08em] text-accent">Practice lab</span>
                <span className="inline-flex items-center gap-1">
                  <Clock3 className="h-3.5 w-3.5" />
                  {lab.estimatedMinutes} min
                </span>
                <span className="rounded-sm border border-border px-1.5 py-0.5 font-semibold">{lab.difficulty}</span>
              </span>
              <span className="block text-base font-semibold text-text transition group-hover:text-accent">{lab.title}</span>
              <span className="mt-1 block text-sm leading-6 text-muted">{lab.goal}</span>
              <span className="mt-2 flex items-start gap-2 text-xs leading-5 text-muted/85">
                <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent-secondary" />
                Practice after: {lab.timing}
              </span>
            </span>
            <span className="mt-1 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-border bg-panel text-muted transition group-open:rotate-180 group-hover:text-text">
              <ChevronDown className="h-4 w-4" />
            </span>
          </summary>

          <div className="mt-4 border-t border-border pt-4">
            <div className="grid gap-3 lg:grid-cols-3">
              <LabChecklist title="Build" items={lab.build} icon={Hammer} tone="accent" />
              <LabChecklist title="Break safely" items={lab.breakIt} icon={AlertTriangle} tone="warning" />
              <LabChecklist title="Observe" items={lab.observe} icon={Activity} tone="secondary" />
            </div>

            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <div className="rounded-md border border-border bg-panel p-3">
                <div className="mb-2 flex items-center gap-2">
                  <PackageCheck className="h-4 w-4 text-accent" />
                  <p className="text-sm font-semibold text-text">Deliverable</p>
                </div>
                <p className="text-sm leading-6 text-muted">{lab.deliverable}</p>
              </div>
              <div className="rounded-md border border-border bg-panel p-3">
                <div className="mb-2 flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-accent-secondary" />
                  <p className="text-sm font-semibold text-text">Evidence</p>
                </div>
                <p className="text-sm leading-6 text-muted">{lab.evidence}</p>
              </div>
            </div>

            <div className="mt-4 rounded-md border border-accent-secondary/30 bg-panel p-3">
              <div className="mb-2 flex items-center gap-2">
                <MessageSquareText className="h-4 w-4 text-accent-secondary" />
                <p className="text-sm font-semibold text-text">Explain it back</p>
              </div>
              <p className="text-sm leading-6 text-muted">{lab.explain}</p>
              <p className="mt-2 text-sm leading-6 text-muted">{lab.check}</p>
              {lab.after ? <p className="mt-2 text-xs leading-5 text-muted/85">{lab.after}</p> : null}
            </div>
          </div>
        </details>
      </div>
    </div>
  );
}
