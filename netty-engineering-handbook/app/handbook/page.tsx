import Link from "next/link";
import { ArrowRight, BookOpenCheck, FileText, Map } from "lucide-react";
import { Sidebar } from "@/components/docs/Sidebar";
import { contentCurrentAsOf, sections } from "@/lib/navigation";
import { studyTracks } from "@/lib/studyTracks";

export default function HandbookIndexPage() {
  return (
    <main id="main-content" className="mx-auto grid max-w-[1360px] gap-8 px-4 py-7 sm:px-6 sm:py-10 lg:grid-cols-[264px_minmax(0,1fr)] lg:gap-9 lg:px-8">
      <aside className="hidden lg:block">
        <div className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto pr-4">
          <Sidebar />
        </div>
      </aside>

      <section className="min-w-0">
        <h1 className="max-w-4xl text-3xl font-bold leading-[1.08] tracking-[0] text-text sm:text-5xl sm:leading-[1.06]">
          Choose one thing to study.
        </h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-muted sm:mt-6 sm:text-lg sm:leading-8">
          Use the study paths when you want to learn one subject from zero-confusion order. Use the reference map only when you already know the exact chapter you want.
        </p>

        <section className="mt-8 grid gap-4 xl:grid-cols-2">
          {studyTracks.map((track) => (
            <Link key={track.slug} href={`/handbook/study/${track.slug}`} className="group rounded-xl border border-accent/30 bg-accent/10 p-4 shadow-inset transition hover:border-accent/60 hover:bg-accent/15 sm:p-5">
              <div className="mb-4 flex items-center justify-between gap-4">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-accent/35 bg-panel text-accent">
                  <BookOpenCheck className="h-5 w-5" />
                </span>
                <ArrowRight className="h-4 w-4 text-muted transition group-hover:text-accent" />
              </div>
              <h2 className="text-xl font-semibold text-text">{track.title}</h2>
              <p className="mt-2 text-sm leading-6 text-muted">{track.description}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="rounded-md border border-border bg-panel px-2.5 py-1 text-xs text-accent">{track.steps.length} ordered lessons</span>
                <span className="rounded-md border border-border bg-panel px-2.5 py-1 text-xs text-muted">Prerequisites explained first</span>
              </div>
            </Link>
          ))}
        </section>

        <div className="mt-7 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          <Link href="/handbook/cheatsheets" className="group rounded-lg border border-border bg-panel p-4 transition hover:border-accent/50 hover:bg-card">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border bg-card text-accent">
                <FileText className="h-4 w-4" />
              </span>
              <div>
                <p className="font-medium text-text">Revision cards</p>
                <p className="mt-1 text-sm text-muted">Quick review after studying.</p>
              </div>
              <ArrowRight className="ml-auto h-4 w-4 text-muted transition group-hover:text-accent" />
            </div>
          </Link>
          <div className="rounded-lg border border-border bg-panel p-4">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border bg-card text-accent">
                <Map className="h-4 w-4" />
              </span>
              <div>
                <p className="font-medium text-text">{sections.length} reference groups</p>
                <p className="mt-1 text-sm text-muted">For search and revisit only.</p>
              </div>
            </div>
          </div>
          <div className="rounded-lg border border-border bg-panel p-4">
            <p className="text-sm font-medium text-text">Content currency</p>
            <p className="mt-1 text-sm leading-6 text-muted">Version-sensitive topics are written against the platform state current as of {contentCurrentAsOf}.</p>
          </div>
        </div>

        <section className="mt-10 rounded-xl border border-border bg-panel p-4 shadow-inset sm:p-5 lg:mt-12">
          <div className="mb-4 sm:mb-5">
            <h2 className="text-xl font-semibold tracking-[0] text-text">Reference map</h2>
            <p className="mt-1 text-sm leading-6 text-muted">
              This is not the best way to study from scratch. It is a lookup map for revisiting a specific idea after the study path gives you context.
            </p>
          </div>
          <div className="space-y-5 sm:space-y-6">
            {sections.map((section) => {
              const Icon = section.icon;
              return (
                <section key={section.slug} className="rounded-lg border border-border bg-card p-4">
                  <div className="mb-4 flex items-start gap-3 sm:mb-5 sm:gap-4">
                    <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-border bg-panel text-accent-secondary sm:h-10 sm:w-10">
                      <Icon className="h-5 w-5" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-lg font-semibold tracking-[0] text-text sm:text-xl">{section.title}</h3>
                      <p className="mt-1 text-sm leading-6 text-muted">{section.description}</p>
                    </div>
                  </div>
                  <div className="grid gap-2 sm:gap-3 md:grid-cols-2">
                    {section.chapters.map((chapter) => (
                      <Link
                        key={chapter.slug}
                        href={`/handbook/${section.slug}/${chapter.slug}`}
                        className="group rounded-md border border-border bg-panel p-3.5 transition hover:border-accent/50 hover:bg-bg sm:p-4"
                      >
                        <div className="flex items-center justify-between gap-4">
                          <p className="font-medium text-text">{chapter.title}</p>
                          <ArrowRight className="h-4 w-4 shrink-0 text-muted transition group-hover:text-accent" />
                        </div>
                        <p className="mt-2 text-sm leading-6 text-muted">{chapter.description}</p>
                      </Link>
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        </section>
      </section>
    </main>
  );
}
