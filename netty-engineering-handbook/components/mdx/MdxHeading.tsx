import type { ReactNode } from "react";
import { getChapterDisplayLabel, getChapterSectionByHeading } from "@/lib/chapterSections";
import { slugify } from "@/lib/handbook";

function toText(value: ReactNode): string {
  if (typeof value === "string" || typeof value === "number") return String(value);
  if (Array.isArray(value)) return value.map(toText).join("");
  return "";
}

export function H2({ children }: { children: ReactNode }) {
  const text = toText(children);
  const id = slugify(text);
  const section = getChapterSectionByHeading(text);

  return (
    <h2 id={id} className="scroll-mt-28">
      {getChapterDisplayLabel(text)}
      {section?.prompt ? (
        <span dir="rtl" lang="ar" className="mt-2 block max-w-2xl text-sm font-normal leading-6 text-muted">
          {section.prompt}
        </span>
      ) : null}
    </h2>
  );
}

export function H3({ children }: { children: ReactNode }) {
  const id = slugify(toText(children));
  return (
    <h3 id={id} className="scroll-mt-28">
      {children}
    </h3>
  );
}
