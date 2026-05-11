"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { sections } from "@/lib/navigation";
import { cn } from "@/lib/utils";

export function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const [query, setQuery] = useState("");
  const normalizedQuery = query.trim().toLowerCase();
  const visibleSections = useMemo(() => {
    if (!normalizedQuery) return sections;

    return sections
      .map((section) => ({
        ...section,
        chapters: section.chapters.filter((chapter) => {
          const searchable = `${section.title} ${section.description} ${chapter.title} ${chapter.description}`.toLowerCase();
          return searchable.includes(normalizedQuery);
        })
      }))
      .filter((section) => section.chapters.length > 0);
  }, [normalizedQuery]);

  return (
    <nav aria-label="Handbook navigation" className="space-y-5">
      <label className="relative block">
        <span className="sr-only">Search handbook</span>
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          className="h-10 w-full rounded-md border border-border bg-panel pl-9 pr-3 text-sm text-text outline-none transition placeholder:text-muted focus:border-accent/60"
          placeholder="Search topics"
          type="search"
        />
      </label>

      <div className="space-y-3">
      {visibleSections.map((section) => {
        const Icon = section.icon;
        const activeSection = pathname.includes(`/handbook/${section.slug}`);

        return (
          <details key={`${section.slug}-${activeSection}-${normalizedQuery}`} className="group rounded-lg border border-border bg-panel/55 p-2 shadow-inset" open={activeSection || Boolean(normalizedQuery)}>
            <summary className="flex cursor-pointer list-none items-center gap-2 rounded-md px-2 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-muted transition hover:bg-card hover:text-text">
              <Icon className="h-4 w-4 text-accent-secondary" />
              <span className="min-w-0 flex-1 truncate">{section.title}</span>
              <span className="ml-auto rounded-sm border border-border bg-card px-1.5 py-0.5 font-mono text-[0.65rem] tracking-[0] text-muted">
                {section.chapters.length}
              </span>
              <ChevronDown className={cn("h-3.5 w-3.5 transition group-open:rotate-180", activeSection && "text-accent")} />
            </summary>
            <div className="mx-2 mb-2 flex flex-wrap gap-1.5">
              <span className="rounded-sm border border-border bg-card px-1.5 py-0.5 text-[0.65rem] text-accent">{section.domain}</span>
              <span className="rounded-sm border border-border bg-card px-1.5 py-0.5 text-[0.65rem] text-muted">{section.level}</span>
            </div>
            <div className="mt-2 space-y-1 border-l border-border pl-3">
              {section.chapters.map((chapter) => {
                const href = `/handbook/${section.slug}/${chapter.slug}`;
                const active = pathname === href;

                return (
                  <Link
                    key={chapter.slug}
                    href={href}
                    onClick={onNavigate}
                    className={cn(
                      "block rounded-md px-3 py-2 text-sm leading-5 text-muted transition hover:bg-card hover:text-text",
                      active && "bg-card text-text shadow-inset"
                    )}
                  >
                    <span className="block">{chapter.title}</span>
                    <span className="mt-1 hidden text-xs leading-5 text-muted/80 group-open:block">{chapter.description}</span>
                  </Link>
                );
              })}
            </div>
          </details>
        );
      })}
      </div>
      {!visibleSections.length ? (
        <div className="rounded-lg border border-border bg-panel p-4 text-sm leading-6 text-muted">No matching topics yet.</div>
      ) : null}
    </nav>
  );
}
