import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  FlaskConical,
  Hammer,
  Lightbulb,
  MessageSquareText,
  type LucideIcon
} from "lucide-react";
import { practiceLoopSteps } from "@/lib/learningLoop";
import type { PracticeLab } from "@/lib/practiceLabs";

type LabChecklistProps = {
  title: string;
  items: string[];
  icon: LucideIcon;
  tone: "accent" | "secondary" | "warning";
};

const toneStyles = {
  accent: "text-accent",
  secondary: "text-accent-secondary",
  warning: "text-warning"
} satisfies Record<LabChecklistProps["tone"], string>;

function LabChecklist({ title, items, icon: Icon, tone }: LabChecklistProps) {
  return (
    <div className="min-w-0 border-l border-border pl-3 [overflow-wrap:anywhere]">
      <div className="mb-3 flex items-center gap-2">
        <Icon className={`h-4 w-4 ${toneStyles[tone]}`} />
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

export function PracticeLabs({ labs }: { labs: PracticeLab[] }) {
  if (!labs.length) return null;

  return (
    <section className="mt-8 rounded-xl border border-border bg-panel p-4 shadow-inset sm:p-5" aria-labelledby="practice-labs-title">
      <div className="mb-5 flex items-start gap-3">
        <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-border bg-card text-accent-secondary">
          <FlaskConical className="h-4 w-4" />
        </span>
        <div>
          <h2 id="practice-labs-title" className="text-xl font-semibold tracking-[0] text-text">
            Practice labs
          </h2>
          <p className="mt-1 text-sm leading-6 text-muted">
            Do these after the lessons. Each lab follows the same calm loop, so practice feels predictable.
          </p>
        </div>
      </div>

      <ol className="mb-5 mt-0 grid list-none gap-px overflow-hidden rounded-lg border border-border bg-border p-0 sm:grid-cols-2 xl:grid-cols-5">
        {practiceLoopSteps.map((step, index) => (
          <li
            key={step.label}
            className="m-0 min-w-0 bg-card/80 px-3 py-3"
          >
            <span className="font-mono text-xs text-accent">{String(index + 1).padStart(2, "0")}</span>
            <p className="mt-1 text-sm font-semibold text-text">{step.label}</p>
            <p className="mt-1 text-xs leading-5 text-muted">{step.detail}</p>
          </li>
        ))}
      </ol>

      <div className="grid gap-3 xl:grid-cols-2">
        {labs.map((lab) => (
          <details key={lab.title} className="group rounded-lg border border-border bg-card p-4 [overflow-wrap:anywhere]">
            <summary className="flex cursor-pointer list-none items-start justify-between gap-3 rounded-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent">
              <span className="min-w-0">
                <span className="block text-base font-semibold text-text">{lab.title}</span>
                <span className="mt-1 block text-sm leading-6 text-muted">{lab.goal}</span>
              </span>
              <span className="mt-1 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-border bg-panel text-muted transition group-open:rotate-180 group-hover:text-text">
                <ChevronDown className="h-4 w-4" />
              </span>
            </summary>
            <div className="mt-4 border-t border-border pt-4">
              <div className="grid gap-3 md:grid-cols-2">
                <LabChecklist title="Build" items={lab.build} icon={Hammer} tone="accent" />
                <LabChecklist title="Break safely" items={lab.breakIt} icon={AlertTriangle} tone="warning" />
                <LabChecklist title="Observe" items={lab.observe} icon={Activity} tone="secondary" />
                <div className="min-w-0 border-l border-border pl-3 [overflow-wrap:anywhere]">
                  <div className="mb-3 flex items-center gap-2">
                    <MessageSquareText className="h-4 w-4 text-accent" />
                    <p className="text-sm font-semibold text-text">Explain</p>
                  </div>
                  <p className="text-sm leading-6 text-muted">{lab.explain}</p>
                </div>
              </div>
              <div className="mt-4 rounded-md border border-accent-secondary/30 bg-panel p-3">
                <div className="mb-2 flex items-center gap-2">
                  <Lightbulb className="h-4 w-4 text-accent-secondary" />
                  <p className="text-sm font-semibold text-text">Proof</p>
                </div>
                <p className="text-sm leading-6 text-muted">{lab.check}</p>
                {lab.after ? <p className="mt-2 text-xs leading-5 text-muted/85">{lab.after}</p> : null}
              </div>
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
