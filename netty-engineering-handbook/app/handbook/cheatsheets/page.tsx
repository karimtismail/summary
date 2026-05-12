import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, FileText } from "lucide-react";
import { Sidebar } from "@/components/docs/Sidebar";
import { allChapters, contentCurrentAsOf, sections } from "@/lib/navigation";
import { getChapterSource } from "@/lib/mdx";

export const metadata: Metadata = {
  title: "Cheat Sheets",
  description: "Quick revision cards for every chapter in the Engineering Systems Handbook."
};

export default async function CheatSheetsPage() {
  const sheets = await Promise.all(
    allChapters.map(async (chapter) => {
      const source = await getChapterSource(chapter.section, chapter.slug);
      return { chapter, sheet: source.cheatSheet };
    })
  );

  return (
    <main id="main-content" className="mx-auto grid max-w-[1440px] gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[280px_1fr] lg:px-8">
      <aside className="hidden lg:block">
        <div className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto pr-4">
          <Sidebar />
        </div>
      </aside>
      <section className="min-w-0">
        <div className="mb-10 rounded-xl border border-border bg-panel p-6 shadow-inset [overflow-wrap:anywhere]">
          <div className="mb-5 inline-flex h-10 w-10 items-center justify-center rounded-md border border-border bg-card text-accent">
            <FileText className="h-5 w-5" />
          </div>
          <h1 className="max-w-4xl text-5xl font-bold leading-[1.05] tracking-[0] text-text">Cheat sheets for every topic.</h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-muted">
            Fast review cards generated from the same chapter structure: problem, mental model, behavior, production concerns, performance concerns, bugs, and summary. Current as of {contentCurrentAsOf}.
          </p>
        </div>

        <div className="space-y-10">
          {sections.map((section) => {
            const sectionSheets = sheets.filter(({ chapter }) => chapter.section === section.slug);
            const Icon = section.icon;

            return (
              <section key={section.slug} className="space-y-4">
                <div className="flex min-w-0 items-center gap-3 [overflow-wrap:anywhere]">
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border bg-panel text-accent-secondary">
                    <Icon className="h-4 w-4" />
                  </span>
                  <div>
                    <h2 className="text-xl font-semibold tracking-[0] text-text">{section.title}</h2>
                    <p className="text-sm text-muted">{section.chapters.length} cheat sheets</p>
                  </div>
                </div>

                <div className="grid gap-3 xl:grid-cols-2">
                  {sectionSheets.map(({ chapter, sheet }) => (
                    <Link
                      key={chapter.href}
                      href={chapter.href}
                      className="group min-w-0 rounded-lg border border-border bg-panel p-5 shadow-inset transition hover:border-accent/50 hover:bg-card [overflow-wrap:anywhere]"
                    >
                      <div className="mb-4 flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-accent">{chapter.sectionTitle}</p>
                          <h3 className="mt-1 text-lg font-semibold text-text">{chapter.title}</h3>
                        </div>
                        <ArrowRight className="h-4 w-4 shrink-0 text-muted transition group-hover:text-accent" />
                      </div>
                      <p className="mb-4 rounded-md border border-accent-secondary/30 bg-accent-secondary/10 px-3 py-2 text-sm leading-6 text-muted [overflow-wrap:anywhere]">
                        Before opening the chapter: what problem, runtime rule, and common bug belong here?
                      </p>
                      <div className="grid gap-3 sm:grid-cols-2">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">Problem</p>
                          <p className="mt-1 text-sm leading-6 text-muted [overflow-wrap:anywhere]">{sheet.problem}</p>
                        </div>
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">Keep</p>
                          <p className="mt-1 text-sm leading-6 text-muted [overflow-wrap:anywhere]">{sheet.summary}</p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </section>
    </main>
  );
}
