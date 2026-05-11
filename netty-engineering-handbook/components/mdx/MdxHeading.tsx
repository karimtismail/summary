import type { ReactNode } from "react";
import { slugify } from "@/lib/handbook";

function toText(value: ReactNode): string {
  if (typeof value === "string" || typeof value === "number") return String(value);
  if (Array.isArray(value)) return value.map(toText).join("");
  return "";
}

const h2Numbers: Record<string, string> = {
  intuition: "01",
  "real-world-problem": "02",
  "mental-model": "03",
  "visual-explanation": "04",
  "runtime-behavior": "05",
  "code-example": "06",
  "production-implications": "07",
  "performance-implications": "08",
  "common-bugs": "09",
  summary: "10"
};

export function H2({ children }: { children: ReactNode }) {
  const id = slugify(toText(children));
  const sectionNumber = h2Numbers[id];

  return (
    <h2 id={id} className="scroll-mt-28">
      {sectionNumber ? <span className="mb-2 block font-mono text-sm font-semibold text-accent">{sectionNumber}</span> : null}
      {children}
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
