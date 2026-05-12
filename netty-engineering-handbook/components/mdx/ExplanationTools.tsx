import type { ReactNode } from "react";
import { AlertTriangle, Brain, CheckCircle2, Eye, ListChecks, MessageSquareText } from "lucide-react";
import { reactNodeToText } from "@/lib/reactNodeText";

function parseTrace(children: ReactNode) {
  return reactNodeToText(children)
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line, index) => {
      const [label, ...detailParts] = line.split("|").map((part) => part.trim());
      return {
        label: detailParts.length ? label : `Step ${index + 1}`,
        detail: detailParts.length ? detailParts.join(" ") : label
      };
    });
}

export function TracePrompt({ children }: { children: ReactNode }) {
  return (
    <aside className="my-5 rounded-lg border border-accent/30 bg-accent/10 p-4 shadow-inset">
      <div className="mb-2 flex items-center gap-2">
        <Eye className="h-4 w-4 text-accent" />
        <p className="text-sm font-semibold text-text">Trace focus</p>
      </div>
      <div className="callout-content text-sm leading-6 text-muted">{children}</div>
    </aside>
  );
}

export function ConceptSketch({ children, title }: { children: ReactNode; title: string }) {
  const panels = parseTrace(children);

  return (
    <figure className="my-8 rounded-xl border border-border bg-panel p-4 shadow-inset sm:p-5">
      <figcaption className="mb-4 flex items-center justify-between gap-3 border-b border-border pb-3">
        <div className="flex items-center gap-2">
          <Eye className="h-4 w-4 text-accent-secondary" />
          <span className="text-sm font-semibold text-text">{title}</span>
        </div>
        <span className="rounded-sm border border-border bg-card px-2 py-1 font-mono text-[0.65rem] uppercase tracking-[0.14em] text-muted">
          Sketch
        </span>
      </figcaption>
      <ol className="m-0 grid list-none gap-3 p-0 md:grid-cols-3">
        {panels.map((panel, index) => (
          <li key={`${panel.label}-${index}`} className="m-0 min-w-0 rounded-lg border border-border bg-card p-4">
            <div className="mb-3 flex items-center justify-between gap-3">
              <span className="font-mono text-xs text-accent-secondary">{String(index + 1).padStart(2, "0")}</span>
              <span className="h-px flex-1 bg-border" aria-hidden="true" />
            </div>
            <p className="mb-2 text-sm font-semibold text-text [overflow-wrap:anywhere]">{panel.label}</p>
            <p className="text-sm leading-6 text-muted [overflow-wrap:anywhere]">{panel.detail}</p>
          </li>
        ))}
      </ol>
    </figure>
  );
}

export function ComicStrip({ children, title }: { children: ReactNode; title: string }) {
  const panels = parseTrace(children);

  return (
    <figure className="my-8 rounded-xl border border-accent-secondary/30 bg-accent-secondary/10 p-4 shadow-inset sm:p-5">
      <figcaption className="mb-4 flex items-center justify-between gap-3 border-b border-accent-secondary/20 pb-3">
        <div className="flex items-center gap-2">
          <MessageSquareText className="h-4 w-4 text-accent-secondary" />
          <span className="text-sm font-semibold text-text">{title}</span>
        </div>
        <span className="rounded-sm border border-accent-secondary/25 bg-panel px-2 py-1 font-mono text-[0.65rem] uppercase tracking-[0.14em] text-muted">
          Scene
        </span>
      </figcaption>
      <ol className="m-0 grid list-none gap-3 p-0 md:grid-cols-3">
        {panels.map((panel, index) => (
          <li key={`${panel.label}-${index}`} className="m-0 rounded-lg border border-border bg-panel p-4">
            <div className="mb-3 flex items-center gap-2">
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-accent-secondary/35 bg-accent-secondary/10 font-mono text-xs text-accent-secondary">
                {index + 1}
              </span>
              <p className="text-sm font-semibold text-text [overflow-wrap:anywhere]">{panel.label}</p>
            </div>
            <p className="relative rounded-md border border-border bg-card p-3 text-sm leading-6 text-muted [overflow-wrap:anywhere]">{panel.detail}</p>
          </li>
        ))}
      </ol>
    </figure>
  );
}

export function Misconception({
  soundsLike,
  actually,
  whyItMatters
}: {
  soundsLike: string;
  actually: string;
  whyItMatters?: string;
}) {
  return (
    <aside className="my-8 rounded-xl border border-warning/35 bg-warning/10 p-4 shadow-inset sm:p-5">
      <div className="mb-4 flex items-center gap-2">
        <Brain className="h-4 w-4 text-warning" />
        <p className="text-sm font-semibold text-text">Common misconception</p>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        <div className="rounded-lg border border-warning/25 bg-panel p-4">
          <div className="mb-2 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-warning" />
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">Sounds like</p>
          </div>
          <p className="text-sm leading-6 text-muted">{soundsLike}</p>
        </div>
        <div className="rounded-lg border border-accent-secondary/30 bg-panel p-4">
          <div className="mb-2 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-accent-secondary" />
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">Actually</p>
          </div>
          <p className="text-sm leading-6 text-muted">{actually}</p>
        </div>
      </div>
      {whyItMatters ? <p className="mt-4 text-sm font-medium leading-6 text-text">{whyItMatters}</p> : null}
    </aside>
  );
}

export function RuntimeTrace({ children, title }: { children: ReactNode; title: string }) {
  const steps = parseTrace(children);

  return (
    <figure className="my-8 rounded-xl border border-border bg-panel p-4 shadow-inset sm:p-5">
      <figcaption className="mb-4 flex items-center justify-between gap-3 border-b border-border pb-3">
        <div className="flex items-center gap-2">
          <ListChecks className="h-4 w-4 text-accent" />
          <span className="text-sm font-semibold text-text">{title}</span>
        </div>
        <span className="rounded-sm border border-border bg-card px-2 py-1 font-mono text-[0.65rem] uppercase tracking-[0.14em] text-muted">
          Trace
        </span>
      </figcaption>
      <ol className="m-0 list-none space-y-2 p-0">
        {steps.map((step, index) => (
          <li key={`${step.label}-${index}`} className="m-0 grid gap-2 rounded-lg border border-border bg-card p-3 sm:grid-cols-[9rem_1fr] sm:gap-4">
            <div className="flex items-center gap-2">
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-md border border-border bg-panel font-mono text-[0.7rem] text-accent">
                {String(index + 1).padStart(2, "0")}
              </span>
              <p className="text-sm font-semibold text-text">{step.label}</p>
            </div>
            <p className="text-sm leading-6 text-muted">{step.detail}</p>
          </li>
        ))}
      </ol>
    </figure>
  );
}

export function RecallPrompt({ children, question }: { children: ReactNode; question: string }) {
  return (
    <details className="my-8 rounded-xl border border-accent-secondary/35 bg-accent-secondary/10 p-4 shadow-inset sm:p-5">
      <summary className="cursor-pointer list-none text-sm font-semibold text-text transition hover:text-accent-secondary">
        Before moving on: {question}
      </summary>
      <div className="callout-content mt-3 text-sm leading-6 text-muted">{children}</div>
    </details>
  );
}
