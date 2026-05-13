import type { ReactNode } from "react";
import { reactNodeToText } from "@/lib/reactNodeText";

export function ArchitectureDiagram({ children, title }: { children: ReactNode; title?: string }) {
  const code = reactNodeToText(children).trim();

  return (
    <figure className="my-8 overflow-hidden rounded-xl border border-border bg-[#11151d] shadow-inset">
      {title ? (
        <figcaption className="flex items-center justify-between gap-3 border-b border-border bg-panel px-5 py-3 text-sm font-semibold text-text">
          <span>{title}</span>
          <span className="rounded-sm border border-border bg-card px-2 py-1 font-mono text-[0.65rem] uppercase tracking-[0.14em] text-muted">Diagram</span>
        </figcaption>
      ) : null}
      <pre
        className="m-0 overflow-x-auto p-5 font-mono text-sm leading-7 text-muted [tab-size:2] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        tabIndex={0}
        aria-label={title ? `Scrollable diagram: ${title}` : "Scrollable architecture diagram"}
      >
        <code>{code}</code>
      </pre>
    </figure>
  );
}
