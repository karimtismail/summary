import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Compass } from "lucide-react";
import { PrerequisitePanel } from "@/components/docs/PrerequisitePanel";
import { Sidebar } from "@/components/docs/Sidebar";
import { StudyMethod } from "@/components/docs/StudyMethod";
import { StudyProgress, type StudyProgressStep } from "@/components/docs/StudyProgress";
import { findChapter } from "@/lib/navigation";
import { getPracticeLabs } from "@/lib/practiceLabs";
import { getStudyTrack, studyTracks, withStudyPath } from "@/lib/studyTracks";

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
    if (!chapter) {
      throw new Error(`Study track "${track.slug}" references missing chapter "${step.section}/${step.slug}".`);
    }

    return {
      id: `${step.section}/${step.slug}`,
      href: `/handbook/${step.section}/${step.slug}`,
      title: chapter.title,
      phase: step.phase,
      reason: step.reason,
      checkpoint: step.checkpoint,
      optional: step.optional,
      position: index + 1
    };
  });
  const labs = getPracticeLabs(track.slug);
  const trackStepIds = new Set(progressSteps.map((step) => step.id));
  const trackPhaseIds = new Set(track.phases.map((phase) => phase.phase));
  const usedPhaseIds = new Set(progressSteps.map((step) => step.phase));
  const seenPhaseIds = new Set<string>();
  let activePhaseId: string | undefined;

  for (const phase of track.phases) {
    if (!usedPhaseIds.has(phase.phase)) {
      throw new Error(`Study track "${track.slug}" declares unused phase "${phase.phase}".`);
    }
  }

  for (const step of progressSteps) {
    if (!trackPhaseIds.has(step.phase)) {
      throw new Error(`Study track "${track.slug}" step "${step.id}" references undeclared phase "${step.phase}".`);
    }
    if (step.phase !== activePhaseId) {
      if (seenPhaseIds.has(step.phase)) {
        throw new Error(`Study track "${track.slug}" has non-contiguous phase "${step.phase}". Keep phases together or split the phase.`);
      }
      seenPhaseIds.add(step.phase);
      activePhaseId = step.phase;
    }
  }

  for (const lab of labs) {
    if (!trackPhaseIds.has(lab.phase)) {
      throw new Error(`Practice lab "${lab.id}" references missing phase "${lab.phase}" in study track "${track.slug}".`);
    }
    if (!trackStepIds.has(lab.afterStepId)) {
      throw new Error(`Practice lab "${lab.id}" references missing unlock step "${lab.afterStepId}" in study track "${track.slug}".`);
    }
    const unlockStep = progressSteps.find((step) => step.id === lab.afterStepId);
    if (unlockStep?.phase !== lab.phase) {
      throw new Error(`Practice lab "${lab.id}" unlocks after "${lab.afterStepId}" in phase "${unlockStep?.phase}", but lab phase is "${lab.phase}".`);
    }
    for (const coveredStepId of lab.coveredStepIds) {
      if (!trackStepIds.has(coveredStepId)) {
        throw new Error(`Practice lab "${lab.id}" references missing covered step "${coveredStepId}" in study track "${track.slug}".`);
      }
    }
  }

  return (
    <main className="mx-auto grid max-w-[1360px] gap-8 px-4 py-7 sm:px-6 sm:py-10 lg:grid-cols-[264px_minmax(0,1fr)] lg:gap-9 lg:px-8">
      <aside className="hidden lg:block">
        <div className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto pr-4">
          <Sidebar />
        </div>
      </aside>

      <article id="main-content" className="min-w-0">
        <section className="rounded-xl border border-border bg-panel p-4 shadow-inset sm:p-6">
          <nav className="mb-5 text-sm text-muted" aria-label="Breadcrumb">
            <ol className="m-0 flex list-none flex-wrap items-center gap-2 p-0">
              <li className="m-0">
                <Link href="/handbook" className="transition hover:text-text">
                  Handbook
                </Link>
              </li>
              <li className="m-0" aria-hidden="true">
                /
              </li>
              <li className="m-0 text-muted" aria-current="page">
                {track.title}
              </li>
            </ol>
          </nav>

          <div className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(18rem,0.8fr)]">
            <div>
              <p className="mb-3 text-sm font-medium text-accent">Study path</p>
              <h1 className="max-w-3xl text-3xl font-bold leading-[1.08] tracking-[0] text-text sm:text-5xl sm:leading-[1.06]">
                {track.title}
              </h1>
              <p className="mt-4 max-w-3xl text-base leading-7 text-muted sm:text-lg sm:leading-8">{track.description}</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  href="#lessons"
                  className="inline-flex items-center gap-2 rounded-md border border-accent/45 bg-accent px-4 py-2.5 text-sm font-semibold text-bg transition hover:bg-accent-secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                >
                  See the path
                  <ArrowRight className="h-4 w-4" />
                </a>
                <Link
                  href="/handbook"
                  className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-4 py-2.5 text-sm font-semibold text-muted transition hover:border-accent/50 hover:text-text focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                >
                  Topic library
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

        <StudyMethod title={track.shortTitle} />

        <PrerequisitePanel
          items={track.prerequisites}
          title={`Concept map for ${track.shortTitle}`}
          intro="This is not homework before you begin. It is the small map you come back to when a term interrupts the story."
        />

        <section id="lessons" className="scroll-mt-24 rounded-xl border border-border bg-panel p-4 shadow-inset sm:p-5">
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-start gap-3">
              <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-border bg-card text-accent-secondary">
                <Compass className="h-4 w-4" />
              </span>
              <div>
                <h2 className="text-xl font-semibold tracking-[0] text-text">Lessons in order</h2>
                <p className="mt-1 text-sm leading-6 text-muted">
                  Follow these from top to bottom. Use the topic library later when you already know what you want to revisit.
                </p>
              </div>
            </div>
            <Link
              href={withStudyPath(track.startHref, track.slug)}
              className="inline-flex w-fit shrink-0 items-center gap-2 rounded-md border border-accent/45 bg-card px-3 py-2 text-sm font-semibold text-accent transition hover:bg-accent hover:text-bg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              Start lesson 1
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <StudyProgress trackSlug={track.slug} steps={progressSteps} labs={labs} phases={track.phases} />
        </section>

        <section className="mt-8 rounded-xl border border-warning/35 bg-warning/10 p-4 shadow-inset sm:p-5">
          <h2 className="text-lg font-semibold text-text">When you feel lost</h2>
          <p className="mt-2 text-sm leading-6 text-muted">
            Stop at the first unclear word. Read its prerequisite card, open the linked chapter if needed, then return to the same step. The goal is not to finish pages fast; the goal is to keep the mental model connected.
          </p>
          <p dir="rtl" lang="ar" className="mt-2 text-sm leading-7 text-muted">
            لو كلمة وقفتك، متكملش بالعافية. افتح شرحها، ارجع لنفس المكان، وكمل كأنك بتبني خريطة واحدة مش بتجمع صفحات.
          </p>
        </section>
      </article>
    </main>
  );
}
