"use client";

import Link from "next/link";
import { ArrowRight, HelpCircle } from "lucide-react";
import { useId, useRef, useState, type FocusEvent } from "react";
import type { Prerequisite } from "@/lib/studyTracks";
import { cn } from "@/lib/utils";

export function GlossaryTerm({ item, compact = false }: { item: Prerequisite; compact?: boolean }) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLSpanElement>(null);
  const tooltipId = useId();

  function handleBlur(event: FocusEvent<HTMLSpanElement>) {
    const nextTarget = event.relatedTarget;
    if (nextTarget instanceof Node && wrapperRef.current?.contains(nextTarget)) return;
    setOpen(false);
  }

  return (
    <span ref={wrapperRef} className="relative inline-flex" onBlur={handleBlur}>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={open ? tooltipId : undefined}
        onClick={() => setOpen((value) => !value)}
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            setOpen(false);
            event.currentTarget.blur();
          }
        }}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-md border border-border bg-card text-muted shadow-inset transition hover:border-accent/50 hover:text-text focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
          compact ? "px-2 py-1 text-xs font-medium" : "px-2.5 py-1.5 text-sm font-semibold"
        )}
      >
        <HelpCircle className="h-3.5 w-3.5 text-accent-secondary" />
        <span dir="ltr">{item.term}</span>
      </button>

      {open ? (
        <span
          id={tooltipId}
          role="tooltip"
          className="absolute left-0 top-[calc(100%+0.45rem)] z-50 w-[min(19rem,calc(100vw-2rem))] rounded-lg border border-border bg-panel p-3 text-left shadow-soft"
        >
          <span className="block text-sm font-semibold text-text">{item.term}</span>
          <span className="mt-2 block text-sm leading-6 text-muted">{item.explanation}</span>
          <span className="mt-2 block text-xs leading-5 text-muted/85">{item.why}</span>
          {item.href ? (
            <Link href={item.href} className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-accent transition hover:text-text">
              Open short lesson
              <ArrowRight className="h-3 w-3" />
            </Link>
          ) : null}
        </span>
      ) : null}
    </span>
  );
}
