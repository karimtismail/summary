import type { ReactNode } from "react";
import { ArrowDown, ArrowRight } from "lucide-react";
import { reactNodeToText } from "@/lib/reactNodeText";

function parseSteps(children: ReactNode) {
  const text = reactNodeToText(children)
    .replace(/\n/g, " ")
    .replace(/→/g, "->");
  return text
    .split("->")
    .map((step) => step.trim())
    .filter(Boolean);
}

export function FlowDiagram({ children, title }: { children: ReactNode; title?: string }) {
  const steps = parseSteps(children);

  return (
    <figure className="my-8 rounded-xl border border-border bg-panel p-4 shadow-inset sm:p-5">
      {title ? (
        <figcaption className="mb-4 flex items-center justify-between gap-3 border-b border-border pb-3 text-sm font-semibold text-text">
          <span>{title}</span>
          <span className="rounded-sm border border-border bg-card px-2 py-1 font-mono text-[0.65rem] uppercase tracking-[0.14em] text-muted">Flow</span>
        </figcaption>
      ) : null}
      <div className="flex flex-col gap-3 md:flex-row md:items-stretch">
        {steps.map((step, index) => (
          <div key={`${step}-${index}`} className="flex flex-1 flex-col gap-2 md:flex-row md:items-center md:gap-3">
            <div className="flex min-h-16 flex-1 items-start gap-3 rounded-lg border border-border bg-card px-4 py-3 text-sm leading-6 text-text">
              <span className="mt-0.5 font-mono text-xs text-accent">{String(index + 1).padStart(2, "0")}</span>
              <span className="font-mono">{step}</span>
            </div>
            {index < steps.length - 1 ? (
              <>
                <ArrowDown className="mx-auto h-4 w-4 shrink-0 text-accent md:hidden" />
                <ArrowRight className="hidden h-4 w-4 shrink-0 text-accent md:block" />
              </>
            ) : null}
          </div>
        ))}
      </div>
    </figure>
  );
}
