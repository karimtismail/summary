import type { ReactNode } from "react";
import { AlertTriangle, Flame, Lightbulb, ScrollText } from "lucide-react";
import { cn } from "@/lib/utils";

type CalloutProps = {
  title?: string;
  children: ReactNode;
};

function Callout({
  title,
  children,
  tone,
  icon
}: CalloutProps & {
  tone: "story" | "highlight" | "warning" | "danger";
  icon: ReactNode;
}) {
  const styles = {
    story: "border-accent/35 bg-accent/8",
    highlight: "border-accent-secondary/35 bg-accent-secondary/8",
    warning: "border-warning/40 bg-warning/8",
    danger: "border-danger/45 bg-danger/8"
  };

  return (
    <aside className={cn("my-8 rounded-lg border p-5 shadow-inset", styles[tone])}>
      <div className="mb-3 flex items-center gap-2">
        <div className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-current/20 text-current">{icon}</div>
        {title ? <p className="m-0 text-sm font-semibold text-text">{title}</p> : null}
      </div>
      <div className="callout-content text-muted">{children}</div>
    </aside>
  );
}

export function StoryBlock(props: CalloutProps) {
  return <Callout {...props} tone="story" icon={<ScrollText className="h-4 w-4 text-accent" />} />;
}

export function Highlight(props: CalloutProps) {
  return <Callout {...props} tone="highlight" icon={<Lightbulb className="h-4 w-4 text-accent-secondary" />} />;
}

export function Warning(props: CalloutProps) {
  return <Callout {...props} tone="warning" icon={<AlertTriangle className="h-4 w-4 text-warning" />} />;
}

export function Danger(props: CalloutProps) {
  return <Callout {...props} tone="danger" icon={<Flame className="h-4 w-4 text-danger" />} />;
}
