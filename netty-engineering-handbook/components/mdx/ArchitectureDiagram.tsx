import type { ReactNode } from "react";
import { reactNodeToText } from "@/lib/reactNodeText";

export function ArchitectureDiagram({ children, title }: { children: ReactNode; title?: string }) {
  const code = reactNodeToText(children).trim();

  return (
    <figure className="my-8 overflow-hidden rounded-lg border border-border bg-[#11151d] shadow-inset">
      {title ? <figcaption className="border-b border-border bg-panel px-5 py-3 text-sm font-semibold text-text">{title}</figcaption> : null}
      <pre className="m-0 overflow-x-auto p-5 font-mono text-sm leading-7 text-muted">
        <code>{code}</code>
      </pre>
    </figure>
  );
}
