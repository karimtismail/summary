import Link from "next/link";
import { ArrowRight, BookOpen, GitBranch, LibraryBig } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { contentCurrentAsOf, firstChapter, handbookStats, learningPaths, sections, upcomingTracks } from "@/lib/navigation";

export default function HomePage() {
  return (
    <main>
      <section className="mx-auto grid max-w-[1440px] items-center gap-12 px-4 py-14 sm:px-6 sm:py-16 lg:grid-cols-[1fr_0.9fr] lg:px-8 lg:py-20">
        <div className="max-w-3xl">
          <div className="mb-8 inline-flex items-center gap-2 rounded-md border border-border bg-panel px-3 py-2 text-sm text-muted shadow-inset">
            <LibraryBig className="h-4 w-4 text-accent-secondary" />
            Updated for {contentCurrentAsOf}. General engineering. Problem first.
          </div>
          <h1 className="max-w-4xl text-5xl font-bold leading-[1.03] tracking-[0] text-text sm:text-6xl lg:text-7xl">
            Understand how modern engineering systems actually work.
          </h1>
          <p className="mt-7 max-w-2xl text-lg leading-8 text-muted">
            A long-form MDX handbook for systems design, runtime internals, distributed data, protocols, performance, operations, and production engineering. Netty and Kafka are the first deep tracks, not the boundary of the handbook.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href={firstChapter.href}>
              Start reading
              <ArrowRight className="h-4 w-4" />
            </ButtonLink>
            <ButtonLink href="/handbook" variant="secondary">
              Browse topics
            </ButtonLink>
            <ButtonLink href="/handbook/cheatsheets" variant="secondary">
              Cheat sheets
            </ButtonLink>
          </div>
        </div>

        <div className="rounded-lg border border-border bg-panel p-4 shadow-soft">
          <div className="rounded-md border border-border bg-card p-5">
            <div className="mb-6 flex items-center gap-3">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-border bg-panel text-accent">
                <GitBranch className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-text">Learning flow</p>
                <p className="text-sm text-muted">One connected engineering model</p>
              </div>
            </div>
            <div className="space-y-3">
              {["Systems foundations", "Runtime mechanics", "Framework internals", "Protocol contracts", "Distributed logs", "Performance pressure", "Production debugging", "Architecture judgment"].map((item, index) => (
                <div key={item} className="flex items-center gap-3">
                  <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-border bg-panel font-mono text-xs text-accent">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="text-sm text-muted">{item}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-3">
            {handbookStats.map((stat) => (
              <div key={stat.label} className="rounded-md border border-border bg-card p-4">
                <p className="text-2xl font-semibold text-text">{stat.value}</p>
                <p className="mt-1 text-xs uppercase tracking-[0.14em] text-muted">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-panel/35">
        <div className="mx-auto max-w-[1440px] px-4 py-16 sm:px-6 lg:px-8">
          <div className="mb-10 flex items-end justify-between gap-6">
            <div>
              <h2 className="text-3xl font-semibold tracking-[0] text-text">Active learning tracks</h2>
              <p className="mt-3 max-w-2xl text-muted">Each track follows the same MDX teaching structure: intuition, problem, mental model, visual explanation, behavior, examples, production impact, performance impact, bugs, cheat sheet, and summary.</p>
            </div>
            <BookOpen className="hidden h-8 w-8 text-accent md:block" />
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {sections.map((section) => {
              const Icon = section.icon;
              return (
                <Link key={section.slug} href={`/handbook/${section.slug}/${section.chapters[0].slug}`} className="rounded-lg border border-border bg-panel p-5 transition hover:border-accent/50 hover:bg-card">
                  <div className="mb-5 flex items-center justify-between gap-3">
                    <Icon className="h-5 w-5 text-accent-secondary" />
                    <span className="rounded-md border border-border bg-card px-2 py-1 text-xs text-muted">{section.level}</span>
                  </div>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-accent">{section.domain}</p>
                  <h3 className="text-lg font-semibold text-text">{section.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted">{section.description}</p>
                  <p className="mt-4 text-sm text-accent">{section.chapters.length} chapters · {section.focus}</p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="border-t border-border">
        <div className="mx-auto grid max-w-[1440px] gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:px-8">
          <div>
            <h2 className="text-3xl font-semibold tracking-[0] text-text">Study by outcome</h2>
            <p className="mt-3 max-w-xl text-muted">Tracks can grow without making the sidebar noisy. Readers can follow a path, search a topic, or jump straight to the cheat sheets.</p>
          </div>
          <div className="grid gap-4">
            {learningPaths.map((path) => (
              <Link key={path.title} href={path.href} className="group rounded-lg border border-border bg-panel p-5 transition hover:border-accent/50 hover:bg-card">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-semibold text-text">{path.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-muted">{path.description}</p>
                  </div>
                  <ArrowRight className="h-4 w-4 shrink-0 text-muted transition group-hover:text-accent" />
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {path.chapters.map((chapter) => (
                    <span key={chapter} className="rounded-md border border-border bg-card px-2 py-1 text-xs text-muted">
                      {chapter}
                    </span>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-panel/35">
        <div className="mx-auto max-w-[1440px] px-4 py-16 sm:px-6 lg:px-8">
          <div className="mb-10">
            <h2 className="text-3xl font-semibold tracking-[0] text-text">Ready for more topics</h2>
            <p className="mt-3 max-w-2xl text-muted">Future tracks are visible as lanes, not broken pages. When you add a topic later, it can become a full MDX track with chapters, cheat sheets, and the same chapter structure.</p>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            {upcomingTracks.map((track) => {
              const Icon = track.icon;
              return (
                <div key={track.title} className="rounded-lg border border-border bg-panel p-5 shadow-inset">
                  <div className="mb-5 flex items-center justify-between gap-3">
                    <Icon className="h-5 w-5 text-accent-secondary" />
                    <span className="rounded-md border border-border bg-card px-2 py-1 text-xs text-muted">Next</span>
                  </div>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-accent">{track.domain}</p>
                  <h3 className="text-base font-semibold text-text">{track.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted">{track.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}
