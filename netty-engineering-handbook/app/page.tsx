import Link from "next/link";
import { ArrowRight, BookOpen, GitBranch, LibraryBig } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { contentCurrentAsOf, firstChapter, handbookStats, learningPaths, sections, upcomingTracks } from "@/lib/navigation";

export default function HomePage() {
  return (
    <main>
      <section className="mx-auto grid max-w-[1360px] items-center gap-8 px-4 py-10 sm:px-6 sm:py-14 lg:grid-cols-[1fr_0.92fr] lg:gap-12 lg:px-8 lg:py-18 xl:py-20">
        <div className="max-w-3xl">
          <div className="mb-6 inline-flex max-w-full items-center gap-2 rounded-md border border-border bg-panel px-3 py-2 text-sm leading-5 text-muted shadow-inset sm:mb-8">
            <LibraryBig className="h-4 w-4 text-accent-secondary" />
            <span>Updated for {contentCurrentAsOf}. General engineering. Problem first.</span>
          </div>
          <h1 className="max-w-4xl text-4xl font-bold leading-[1.06] tracking-[0] text-text min-[390px]:text-5xl sm:text-6xl lg:text-7xl">
            Understand how modern engineering systems actually work.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-7 text-muted sm:text-lg sm:leading-8">
            A long-form MDX handbook for systems design, runtime internals, distributed data, protocols, performance, operations, and production engineering. Netty and Kafka are the first deep tracks, not the boundary of the handbook.
          </p>
          <div className="mt-8 grid gap-3 sm:flex sm:flex-row">
            <ButtonLink href={firstChapter.href} className="w-full sm:w-auto">
              Start reading
              <ArrowRight className="h-4 w-4" />
            </ButtonLink>
            <ButtonLink href="/handbook" variant="secondary" className="w-full sm:w-auto">
              Browse topics
            </ButtonLink>
            <ButtonLink href="/handbook/cheatsheets" variant="secondary" className="w-full sm:w-auto">
              Cheat sheets
            </ButtonLink>
          </div>
        </div>

        <div className="rounded-lg border border-border bg-panel p-3 shadow-soft sm:p-4">
          <div className="rounded-md border border-border bg-card p-4 sm:p-5">
            <div className="mb-5 flex items-center gap-3">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-border bg-panel text-accent">
                <GitBranch className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-text">Learning flow</p>
                <p className="text-sm text-muted">One connected engineering model</p>
              </div>
            </div>
            <div className="grid gap-2.5">
              {["Systems foundations", "Runtime mechanics", "Framework internals", "Protocol contracts", "Distributed logs", "Performance pressure", "Production debugging", "Architecture judgment"].map((item, index) => (
                <div key={item} className="flex items-center gap-3">
                  <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-border bg-panel font-mono text-xs text-accent">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="min-w-0 text-sm text-muted">{item}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-3 grid grid-cols-3 gap-2 sm:mt-4 sm:gap-3">
            {handbookStats.map((stat) => (
              <div key={stat.label} className="rounded-md border border-border bg-card p-3 sm:p-4">
                <p className="text-2xl font-semibold text-text">{stat.value}</p>
                <p className="mt-1 text-[0.68rem] uppercase leading-4 tracking-[0.14em] text-muted sm:text-xs">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-panel/35">
        <div className="mx-auto max-w-[1360px] px-4 py-12 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
          <div className="mb-8 flex items-end justify-between gap-6 sm:mb-10">
            <div>
              <h2 className="text-2xl font-semibold tracking-[0] text-text sm:text-3xl">Active learning tracks</h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-muted sm:text-base">Each track follows the same MDX teaching structure: intuition, problem, mental model, visual explanation, behavior, examples, production impact, performance impact, bugs, cheat sheet, and summary.</p>
            </div>
            <BookOpen className="hidden h-8 w-8 text-accent md:block" />
          </div>
          <div className="grid gap-3 sm:gap-4 md:grid-cols-2 xl:grid-cols-3">
            {sections.map((section) => {
              const Icon = section.icon;
              return (
                <Link key={section.slug} href={`/handbook/${section.slug}/${section.chapters[0].slug}`} className="rounded-lg border border-border bg-panel p-4 transition hover:border-accent/50 hover:bg-card sm:p-5">
                  <div className="mb-4 flex items-center justify-between gap-3">
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
        <div className="mx-auto grid max-w-[1360px] gap-8 px-4 py-12 sm:px-6 sm:py-14 lg:grid-cols-[0.75fr_1.25fr] lg:gap-10 lg:px-8 lg:py-16">
          <div>
            <h2 className="text-2xl font-semibold tracking-[0] text-text sm:text-3xl">Study by outcome</h2>
            <p className="mt-3 max-w-xl text-sm leading-6 text-muted sm:text-base">Tracks can grow without making the sidebar noisy. Readers can follow a path, search a topic, or jump straight to the cheat sheets.</p>
          </div>
          <div className="grid gap-4">
            {learningPaths.map((path) => (
              <Link key={path.title} href={path.href} className="group rounded-lg border border-border bg-panel p-4 transition hover:border-accent/50 hover:bg-card sm:p-5">
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
        <div className="mx-auto max-w-[1360px] px-4 py-12 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
          <div className="mb-8 sm:mb-10">
            <h2 className="text-2xl font-semibold tracking-[0] text-text sm:text-3xl">Ready for more topics</h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-muted sm:text-base">Future tracks are visible as lanes, not broken pages. When you add a topic later, it can become a full MDX track with chapters, cheat sheets, and the same chapter structure.</p>
          </div>
          <div className="grid gap-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {upcomingTracks.map((track) => {
              const Icon = track.icon;
              return (
                <div key={track.title} className="rounded-lg border border-border bg-panel p-4 shadow-inset sm:p-5">
                  <div className="mb-4 flex items-center justify-between gap-3">
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
