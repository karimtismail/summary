import Link from "next/link";
import { ArrowRight, BookOpen, GitBranch, Network } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { contentCurrentAsOf, firstChapter, handbookStats, sections } from "@/lib/navigation";

export default function HomePage() {
  return (
    <main>
      <section className="mx-auto grid max-w-[1440px] items-center gap-12 px-4 py-14 sm:px-6 sm:py-16 lg:grid-cols-[1fr_0.9fr] lg:px-8 lg:py-20">
        <div className="max-w-3xl">
          <div className="mb-8 inline-flex items-center gap-2 rounded-md border border-border bg-panel px-3 py-2 text-sm text-muted shadow-inset">
            <Network className="h-4 w-4 text-accent-secondary" />
            Updated for {contentCurrentAsOf}. Problem first. API last.
          </div>
          <h1 className="max-w-4xl text-5xl font-bold leading-[1.03] tracking-[0] text-text sm:text-6xl lg:text-7xl">
            Understand how modern networking systems actually work.
          </h1>
          <p className="mt-7 max-w-2xl text-lg leading-8 text-muted">
            A long-form engineering handbook for Java NIO, Netty, Kafka, TCP, UDP, protocol design, event-driven systems, and performance work in production.
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
                <p className="text-sm text-muted">One connected runtime model</p>
              </div>
            </div>
            <div className="space-y-3">
              {["Blocking IO problem", "Thread explosion", "Selectors", "Java NIO", "EventLoop", "Netty runtime", "Protocol engineering", "Kafka event logs"].map((item, index) => (
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
              <h2 className="text-3xl font-semibold tracking-[0] text-text">Handbook tracks</h2>
              <p className="mt-3 max-w-2xl text-muted">Each track follows the same teaching structure: intuition, problem, mental model, runtime behavior, code, production impact, performance impact, bugs, and summary.</p>
            </div>
            <BookOpen className="hidden h-8 w-8 text-accent md:block" />
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {sections.map((section) => {
              const Icon = section.icon;
              return (
                <Link key={section.slug} href={`/handbook/${section.slug}/${section.chapters[0].slug}`} className="rounded-lg border border-border bg-panel p-5 transition hover:border-accent/50 hover:bg-card">
                  <Icon className="mb-5 h-5 w-5 text-accent-secondary" />
                  <h3 className="text-lg font-semibold text-text">{section.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted">{section.description}</p>
                  <p className="mt-4 text-sm text-accent">{section.chapters.length} chapters</p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}
