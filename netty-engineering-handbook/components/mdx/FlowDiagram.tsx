import type { ReactNode } from "react";
import { ArrowRight } from "lucide-react";
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
    <figure className="my-8 rounded-lg border border-border bg-panel p-5 shadow-inset">
      {title ? <figcaption className="mb-4 text-sm font-semibold text-text">{title}</figcaption> : null}
      <div className="flex flex-col gap-3 md:flex-row md:items-stretch">
        {steps.map((step, index) => (
          <div key={`${step}-${index}`} className="flex flex-1 items-center gap-3">
            <div className="flex min-h-16 flex-1 items-center rounded-md border border-border bg-card px-4 py-3 font-mono text-sm leading-6 text-text">
              {step}
            </div>
            {index < steps.length - 1 ? <ArrowRight className="hidden h-4 w-4 shrink-0 text-accent md:block" /> : null}
          </div>
        ))}
      </div>
    </figure>
  );
}
