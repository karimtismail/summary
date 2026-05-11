import Link from "next/link";
import { ArrowRight, FileText, Map } from "lucide-react";
import { Sidebar } from "@/components/docs/Sidebar";
import { contentCurrentAsOf, learningPaths, sections, upcomingTracks } from "@/lib/navigation";

export default function HandbookIndexPage() {
  return (
    <main className="mx-auto grid max-w-[1360px] gap-8 px-4 py-8 sm:px-6 sm:py-10 lg:grid-cols-[264px_minmax(0,1fr)] lg:gap-9 lg:px-8">
      <aside className="hidden lg:block">
        <div className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto pr-4">
          <Sidebar />
        </div>
      </aside>
      <section className="min-w-0">
        <h1 className="max-w-4xl text-4xl font-bold leading-[1.06] tracking-[0] text-text sm:text-5xl">A topic map for serious engineering systems.</h1>
        <p className="mt-5 max-w-3xl text-base leading-7 text-muted sm:mt-6 sm:text-lg sm:leading-8">
          This handbook is arranged as a scalable curriculum. Networking, Netty, and Kafka are active deep tracks; the same MDX structure can expand into system design, databases, JVM concurrency, cloud platforms, security, and observability.
        </p>
        <div className="mt-7 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          <Link href="/handbook/cheatsheets" className="group rounded-lg border border-border bg-panel p-4 transition hover:border-accent/50 hover:bg-card">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border bg-card text-accent">
                <FileText className="h-4 w-4" />
              </span>
              <div>
                <p className="font-medium text-text">All cheat sheets</p>
                <p className="mt-1 text-sm text-muted">Quick revision cards generated from every chapter.</p>
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
                <p className="font-medium text-text">{sections.length} active tracks</p>
                <p className="mt-1 text-sm text-muted">Grouped by domain and level.</p>
              </div>
            </div>
          </div>
          <div className="rounded-lg border border-border bg-panel p-4">
            <p className="text-sm font-medium text-text">Content currency</p>
            <p className="mt-1 text-sm leading-6 text-muted">Version-sensitive topics are written against the platform state current as of {contentCurrentAsOf}.</p>
          </div>
        </div>

        <section className="mt-10 rounded-lg border border-border bg-panel p-4 shadow-inset sm:p-5 lg:mt-12">
          <div className="mb-4 sm:mb-5">
            <h2 className="text-xl font-semibold tracking-[0] text-text">Recommended learning paths</h2>
            <p className="mt-1 text-sm leading-6 text-muted">Use paths when you want an outcome, not a table of contents.</p>
          </div>
          <div className="grid gap-3 lg:grid-cols-3">
            {learningPaths.map((path) => (
              <Link key={path.title} href={path.href} className="group rounded-md border border-border bg-card p-4 transition hover:border-accent/50 hover:bg-bg">
                <div className="flex items-center justify-between gap-4">
                  <h3 className="font-medium text-text">{path.title}</h3>
                  <ArrowRight className="h-4 w-4 shrink-0 text-muted transition group-hover:text-accent" />
                </div>
                <p className="mt-2 text-sm leading-6 text-muted">{path.description}</p>
              </Link>
            ))}
          </div>
        </section>

        <div className="mt-10 space-y-5 sm:space-y-6 lg:mt-12">
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <section key={section.slug} className="rounded-lg border border-border bg-panel p-4 shadow-inset sm:p-5">
                <div className="mb-4 flex items-start gap-3 sm:mb-5 sm:gap-4">
                  <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-border bg-card text-accent-secondary sm:h-10 sm:w-10">
                    <Icon className="h-5 w-5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-lg font-semibold tracking-[0] text-text sm:text-xl">{section.title}</h2>
                      <span className="rounded-md border border-border bg-card px-2 py-1 text-xs text-muted">{section.level}</span>
                      <span className="rounded-md border border-border bg-card px-2 py-1 text-xs text-accent">{section.domain}</span>
                    </div>
                    <p className="mt-1 text-sm leading-6 text-muted">{section.description}</p>
                  </div>
                </div>
                <div className="grid gap-2 sm:gap-3 md:grid-cols-2">
                  {section.chapters.map((chapter) => (
                    <Link
                      key={chapter.slug}
                      href={`/handbook/${section.slug}/${chapter.slug}`}
                      className="group rounded-md border border-border bg-card p-3.5 transition hover:border-accent/50 hover:bg-bg sm:p-4"
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

        <section className="mt-10 rounded-lg border border-border bg-panel p-4 shadow-inset sm:p-5 lg:mt-12">
          <div className="mb-4 sm:mb-5">
            <h2 className="text-xl font-semibold tracking-[0] text-text">Future topic lanes</h2>
            <p className="mt-1 text-sm leading-6 text-muted">These are planned slots for more MDX tracks. They are intentionally not links until real chapters exist.</p>
          </div>
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {upcomingTracks.map((track) => {
              const Icon = track.icon;
              return (
                <div key={track.title} className="rounded-md border border-border bg-card p-4">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <Icon className="h-4 w-4 text-accent-secondary" />
                    <span className="rounded-sm border border-border bg-panel px-1.5 py-0.5 text-xs text-muted">{track.domain}</span>
                  </div>
                  <h3 className="font-medium text-text">{track.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted">{track.description}</p>
                </div>
              );
            })}
          </div>
        </section>
      </section>
    </main>
  );
}
