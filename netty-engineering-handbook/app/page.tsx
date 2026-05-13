import Link from "next/link";
import { ArrowRight, BookOpenCheck, GitBranch, LibraryBig } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { contentCurrentAsOf, handbookStats } from "@/lib/navigation";
import { studyTracks } from "@/lib/studyTracks";

export default function HomePage() {
  return (
    <main id="main-content">
      <section className="mx-auto grid max-w-[1360px] items-center gap-8 px-4 py-10 sm:px-6 sm:py-14 lg:grid-cols-[1fr_0.92fr] lg:gap-12 lg:px-8 lg:py-18 xl:py-20">
        <div className="max-w-3xl">
          <div className="mb-6 inline-flex max-w-full items-center gap-2 rounded-md border border-border bg-panel px-3 py-2 text-sm leading-5 text-muted shadow-inset sm:mb-8">
            <LibraryBig className="h-4 w-4 text-accent-secondary" />
            <span>Updated for {contentCurrentAsOf}. Study paths first. Reference second.</span>
          </div>
          <h1 className="max-w-4xl text-4xl font-bold leading-[1.06] tracking-[0] text-text min-[390px]:text-5xl sm:text-6xl lg:text-7xl">
            Pick one topic and follow one clear path.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-7 text-muted sm:text-lg sm:leading-8">
            This handbook is organized for studying, not wandering. Each path starts with the ideas you need first, explains confusing terms in place, then moves into the real chapters.
          </p>
          <div className="mt-8 grid gap-3 sm:flex sm:flex-row">
            <ButtonLink href="/handbook/study/netty" className="w-full sm:w-auto">
              Study Netty
              <ArrowRight className="h-4 w-4" />
            </ButtonLink>
            <ButtonLink href="/handbook/study/kafka" variant="secondary" className="w-full sm:w-auto">
              Study Kafka
            </ButtonLink>
            <ButtonLink href="/handbook" variant="secondary" className="w-full sm:w-auto">
              All paths
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
                <p className="text-sm font-semibold text-text">How to use it</p>
                <p className="text-sm text-muted">One subject, one ordered route</p>
              </div>
            </div>
            <div className="grid gap-2.5">
              {["Choose one study path", "Open the concept map when terms feel fuzzy", "Follow lessons in order", "Practice when a lab appears", "Use reference only for revisit"].map((item, index) => (
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
              <h2 className="text-2xl font-semibold tracking-[0] text-text sm:text-3xl">Study paths</h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-muted sm:text-base">
                Start here when you want to learn. Each path includes a concept map, an ordered lesson route, and checkpoints so you know why you are reading each chapter.
              </p>
            </div>
            <BookOpenCheck className="hidden h-8 w-8 text-accent md:block" />
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            {studyTracks.map((track) => (
              <Link key={track.slug} href={`/handbook/study/${track.slug}`} className="group rounded-xl border border-border bg-panel p-4 shadow-inset transition hover:border-accent/50 hover:bg-card sm:p-5">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-border bg-card text-accent">
                    <BookOpenCheck className="h-5 w-5" />
                  </span>
                  <ArrowRight className="h-4 w-4 text-muted transition group-hover:text-accent" />
                </div>
                <h3 className="text-xl font-semibold text-text">{track.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted">{track.description}</p>
                <p className="mt-4 text-sm font-medium text-accent">{track.steps.length} lessons · concept map included</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
