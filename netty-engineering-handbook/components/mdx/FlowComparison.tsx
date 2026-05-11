import { ArrowDown, GitCompareArrows } from "lucide-react";

type FlowComparisonProps = {
  title: string;
  subtitle?: string;
  leftTitle: string;
  leftSubtitle?: string;
  leftFlow: string;
  rightTitle: string;
  rightSubtitle?: string;
  rightFlow: string;
  insight?: string;
};

function parseFlow(flow: string) {
  return flow
    .replace(/\n/g, " ")
    .replace(/→/g, "->")
    .split("->")
    .map((step) => step.trim())
    .filter(Boolean);
}

function FlowLane({
  title,
  subtitle,
  steps
}: {
  title: string;
  subtitle?: string;
  steps: string[];
}) {
  return (
    <section className="min-w-0 rounded-xl border border-border bg-card p-4 shadow-inset">
      <div className="mb-4 border-b border-border pb-3">
        <h3 className="m-0 text-base font-semibold tracking-[0] text-text">{title}</h3>
        {subtitle ? <p className="mt-1 text-sm leading-6 text-muted">{subtitle}</p> : null}
      </div>
      <ol className="m-0 list-none space-y-2 p-0">
        {steps.map((step, index) => (
          <li key={`${title}-${step}-${index}`} className="m-0">
            <div className="flex min-w-0 items-start gap-3 rounded-lg border border-border bg-panel px-3 py-3">
              <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-border bg-card font-mono text-[0.7rem] text-accent">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="min-w-0 text-sm font-medium leading-6 text-text [overflow-wrap:anywhere]">{step}</span>
            </div>
            {index < steps.length - 1 ? <ArrowDown className="mx-auto my-1 h-4 w-4 text-accent" /> : null}
          </li>
        ))}
      </ol>
    </section>
  );
}

export function FlowComparison({
  title,
  subtitle,
  leftTitle,
  leftSubtitle,
  leftFlow,
  rightTitle,
  rightSubtitle,
  rightFlow,
  insight
}: FlowComparisonProps) {
  const leftSteps = parseFlow(leftFlow);
  const rightSteps = parseFlow(rightFlow);

  return (
    <figure className="my-8 rounded-xl border border-border bg-panel p-4 shadow-inset sm:p-5">
      <figcaption className="mb-4 flex flex-col gap-3 border-b border-border pb-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm font-semibold text-text">
            <GitCompareArrows className="h-4 w-4 text-accent" />
            <span>{title}</span>
          </div>
          {subtitle ? <p className="mt-2 text-sm leading-6 text-muted">{subtitle}</p> : null}
        </div>
        <span className="w-fit rounded-sm border border-border bg-card px-2 py-1 font-mono text-[0.65rem] uppercase tracking-[0.14em] text-muted">
          Compare
        </span>
      </figcaption>
      <div className="grid min-w-0 gap-3 lg:grid-cols-2">
        <FlowLane title={leftTitle} subtitle={leftSubtitle} steps={leftSteps} />
        <FlowLane title={rightTitle} subtitle={rightSubtitle} steps={rightSteps} />
      </div>
      {insight ? (
        <p className="mt-4 rounded-lg border border-accent/25 bg-accent/10 px-4 py-3 text-sm font-medium leading-6 text-text">
          {insight}
        </p>
      ) : null}
    </figure>
  );
}
