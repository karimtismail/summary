import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Compass } from "lucide-react";
import { PracticeLabs } from "@/components/docs/PracticeLabs";
import { PrerequisitePanel } from "@/components/docs/PrerequisitePanel";
import { Sidebar } from "@/components/docs/Sidebar";
import { StudyProgress, type StudyProgressStep } from "@/components/docs/StudyProgress";
import { findChapter } from "@/lib/navigation";
import { getPracticeLabs } from "@/lib/practiceLabs";
import { getStudyTrack, studyTracks } from "@/lib/studyTracks";

type PageProps = {
  params: Promise<{ track: string }>;
};

export function generateStaticParams() {
  return studyTracks.map((track) => ({ track: track.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { track: trackSlug } = await params;
  const track = getStudyTrack(trackSlug);
  if (!track) return {};

  return {
    title: track.title,
    description: track.description
  };
}

export default async function StudyTrackPage({ params }: PageProps) {
  const { track: trackSlug } = await params;
  const track = getStudyTrack(trackSlug);
  if (!track) notFound();

  const progressSteps: StudyProgressStep[] = track.steps.map((step, index) => {
    const chapter = findChapter(step.section, step.slug);
    return {
      id: `${step.section}/${step.slug}`,
      href: `/handbook/${step.section}/${step.slug}`,
      title: chapter?.title ?? step.slug,
      phase: step.phase,
      reason: step.reason,
      checkpoint: step.checkpoint,
      optional: step.optional,
      position: index + 1
    };
  });
  const labs = getPracticeLabs(track.slug);

  return (
    <main className="mx-auto grid max-w-[1360px] gap-8 px-4 py-7 sm:px-6 sm:py-10 lg:grid-cols-[264px_minmax(0,1fr)] lg:gap-9 lg:px-8">
      <aside className="hidden lg:block">
        <div className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto pr-4">
          <Sidebar />
        </div>
      </aside>

      <article id="main-content" className="min-w-0">
        <section className="rounded-xl border border-border bg-panel p-4 shadow-inset sm:p-6">
          <div className="mb-5 flex flex-wrap items-center gap-2 text-sm text-muted">
            <Link href="/handbook" className="transition hover:text-text">
              Handbook
            </Link>
            <span>/</span>
            <span>{track.title}</span>
          </div>

          <div className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(18rem,0.8fr)]">
            <div>
              <p className="mb-3 text-sm font-medium text-accent">Study path</p>
              <h1 className="max-w-3xl text-3xl font-bold leading-[1.08] tracking-[0] text-text sm:text-5xl sm:leading-[1.06]">
                {track.title}
              </h1>
              <p className="mt-4 max-w-3xl text-base leading-7 text-muted sm:text-lg sm:leading-8">{track.description}</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href={track.startHref}
                  className="inline-flex items-center gap-2 rounded-md border border-accent/45 bg-accent px-4 py-2.5 text-sm font-semibold text-bg transition hover:bg-accent-secondary"
                >
                  Start the path
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/handbook"
                  className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-4 py-2.5 text-sm font-semibold text-muted transition hover:border-accent/50 hover:text-text"
                >
                  Reference map
                </Link>
              </div>
            </div>

            <div className="rounded-lg border border-accent/30 bg-accent/10 p-4">
              <div className="mb-3 flex items-center gap-2">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-accent/35 bg-panel text-accent">
                  <Compass className="h-4 w-4" />
                </span>
                <p className="text-sm font-semibold text-text">What this path gives you</p>
              </div>
              <p className="text-sm leading-6 text-muted">{track.promise}</p>
            </div>
          </div>
        </section>

        <PrerequisitePanel
          items={track.prerequisites}
          title={`Before ${track.shortTitle}`}
          intro="Read these mini-explanations first. If one is unclear, open its linked chapter, then come back and continue the path."
        />

        <section className="rounded-xl border border-border bg-panel p-4 shadow-inset sm:p-5">
          <div className="mb-5 flex items-start gap-3">
            <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-border bg-card text-accent-secondary">
              <Compass className="h-4 w-4" />
            </span>
            <div>
              <h2 className="text-xl font-semibold tracking-[0] text-text">Study order</h2>
              <p className="mt-1 text-sm leading-6 text-muted">
                Follow this order when you are studying. Use the sidebar only when you already know what you want to revisit.
              </p>
            </div>
          </div>

          <StudyProgress trackSlug={track.slug} steps={progressSteps} />
        </section>

        <PracticeLabs labs={labs} />

        <section className="mt-8 rounded-xl border border-warning/35 bg-warning/10 p-4 shadow-inset sm:p-5">
          <h2 className="text-lg font-semibold text-text">When you feel lost</h2>
          <p className="mt-2 text-sm leading-6 text-muted">
            Stop at the first unclear word. Read its prerequisite card, open the linked chapter if needed, then return to the same step. The goal is not to finish pages fast; the goal is to keep the mental model connected.
          </p>
        </section>
      </article>
    </main>
  );
}
