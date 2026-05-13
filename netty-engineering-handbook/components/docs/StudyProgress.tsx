"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle2, Circle, RotateCcw } from "lucide-react";
import { useCallback, useMemo, useSyncExternalStore } from "react";
import { StudyLabCard } from "@/components/docs/StudyLabCard";
import type { PracticeLab } from "@/lib/practiceLabs";
import type { StudyPhase } from "@/lib/studyTracks";
import { safeGetStorageItem, safeSetStorageItem } from "@/lib/safeStorage";
import { cn } from "@/lib/utils";

export type StudyProgressStep = {
  id: string;
  href: string;
  title: string;
  phase: string;
  reason: string;
  checkpoint: string;
  position: number;
  optional?: boolean;
};

type ProgressState = Record<string, true>;
const STORAGE_EVENT = "handbook:study-progress-updated";
const EMPTY_PROGRESS: ProgressState = {};
const progressCache = new Map<string, { raw: string | null; value: ProgressState }>();
const LAB_PROGRESS_PREFIX = "lab:";

function readProgress(storageKey: string): ProgressState {
  if (typeof window === "undefined") return EMPTY_PROGRESS;

  try {
    const raw = safeGetStorageItem(storageKey);
    const cached = progressCache.get(storageKey);
    if (cached?.raw === raw) return cached.value;

    const parsed = raw ? JSON.parse(raw) : {};
    const value = parsed && typeof parsed === "object" ? (parsed as ProgressState) : {};
    progressCache.set(storageKey, { raw, value });
    return value;
  } catch {
    return EMPTY_PROGRESS;
  }
}

function getServerProgressSnapshot() {
  return EMPTY_PROGRESS;
}

function subscribeProgress(storageKey: string, callback: () => void) {
  if (typeof window === "undefined") return () => {};

  const handleStorage = (event: StorageEvent) => {
    if (event.key && event.key !== storageKey) return;
    callback();
  };
  const handleLocalUpdate = () => callback();

  window.addEventListener("storage", handleStorage);
  window.addEventListener(STORAGE_EVENT, handleLocalUpdate);
  queueMicrotask(callback);

  return () => {
    window.removeEventListener("storage", handleStorage);
    window.removeEventListener(STORAGE_EVENT, handleLocalUpdate);
  };
}

function writeProgress(storageKey: string, next: ProgressState) {
  const raw = JSON.stringify(next);
  safeSetStorageItem(storageKey, raw);
  progressCache.set(storageKey, { raw, value: next });
  window.dispatchEvent(new Event(STORAGE_EVENT));
}

function groupSteps(steps: StudyProgressStep[]) {
  return steps.reduce<Record<string, StudyProgressStep[]>>((groups, step) => {
    groups[step.phase] = groups[step.phase] ?? [];
    groups[step.phase].push(step);
    return groups;
  }, {});
}

function groupLabsByPhase(labs: PracticeLab[]) {
  return labs.reduce<Record<string, PracticeLab[]>>((groups, lab) => {
    groups[lab.phase] = groups[lab.phase] ?? [];
    groups[lab.phase].push(lab);
    return groups;
  }, {});
}

function labProgressId(lab: PracticeLab) {
  return `${LAB_PROGRESS_PREFIX}${lab.id}`;
}

function fallbackPhases(steps: StudyProgressStep[]): StudyPhase[] {
  return Object.keys(groupSteps(steps)).map((phase) => ({
    phase,
    label: phase,
    outcome: "Finish the lessons in this phase before moving on.",
    exitCheck: "You can explain the phase in your own words."
  }));
}

export function StudyProgress({ trackSlug, steps, labs = [], phases }: { trackSlug: string; steps: StudyProgressStep[]; labs?: PracticeLab[]; phases?: StudyPhase[] }) {
  const storageKey = `handbook:study-progress:v1:${trackSlug}`;
  const subscribe = useCallback((callback: () => void) => subscribeProgress(storageKey, callback), [storageKey]);
  const getSnapshot = useCallback(() => readProgress(storageKey), [storageKey]);
  const completed = useSyncExternalStore(subscribe, getSnapshot, getServerProgressSnapshot);
  const groupedSteps = useMemo(() => groupSteps(steps), [steps]);
  const groupedLabs = useMemo(() => groupLabsByPhase(labs), [labs]);
  const phaseGuides = useMemo(() => (phases?.length ? phases : fallbackPhases(steps)), [phases, steps]);
  const completedCount = useMemo(() => steps.filter((step) => completed[step.id]).length, [completed, steps]);
  const completedLabCount = useMemo(() => labs.filter((lab) => completed[labProgressId(lab)]).length, [completed, labs]);
  const progress = steps.length ? Math.round((completedCount / steps.length) * 100) : 0;

  function toggleProgressItem(itemId: string) {
    const next = { ...completed };
    if (next[itemId]) {
      delete next[itemId];
    } else {
      next[itemId] = true;
    }
    writeProgress(storageKey, next);
  }

  return (
    <div className="space-y-5">
      <div className="rounded-lg border border-border bg-card p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-text">Your study progress</p>
            <p className="mt-1 text-sm leading-6 text-muted" aria-live="polite">
              {completedCount} of {steps.length} lessons finished{labs.length ? `, ${completedLabCount} of ${labs.length} labs proven` : ""}. Mark only what you can explain back.
            </p>
          </div>
          {completedCount || completedLabCount ? (
            <button
              type="button"
              onClick={() => writeProgress(storageKey, {})}
              className="inline-flex w-fit items-center gap-2 rounded-md border border-border bg-panel px-3 py-2 text-sm font-semibold text-muted transition hover:border-danger/50 hover:text-text focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              <RotateCcw className="h-4 w-4" />
              Reset
            </button>
          ) : null}
        </div>
        <div
          className="mt-4 h-2 overflow-hidden rounded-full bg-panel"
          role="progressbar"
          aria-label="Lesson progress"
          aria-valuemin={0}
          aria-valuemax={steps.length}
          aria-valuenow={completedCount}
        >
          <div className="h-full rounded-full bg-accent-secondary transition-all" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {phaseGuides.map((phaseGuide, phaseIndex) => {
        const phaseSteps = groupedSteps[phaseGuide.phase] ?? [];
        const phaseLabs = groupedLabs[phaseGuide.phase] ?? [];
        if (!phaseSteps.length && !phaseLabs.length) return null;

        const phaseTitle = `Phase ${phaseIndex + 1}: ${phaseGuide.label}`;

        return (
          <div key={phaseGuide.phase} className="space-y-3">
            <section className="rounded-lg border border-border bg-card/70 p-3 sm:p-4">
              <div className="mb-4 flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                <div className="min-w-0">
                  <h3 className="text-sm font-semibold uppercase tracking-[0.1em] text-muted">{phaseTitle}</h3>
                  <p className="mt-1 text-sm leading-6 text-muted">{phaseGuide.outcome}</p>
                  <p className="mt-1 text-xs leading-5 text-muted/85">Exit check: {phaseGuide.exitCheck}</p>
                </div>
              </div>
              <ol className="m-0 list-none divide-y divide-border p-0">
                {phaseSteps.map((step) => {
                  const done = Boolean(completed[step.id]);
                  const stepLabs = phaseLabs.filter((lab) => lab.afterStepId === step.id);
                  return (
                    <li key={step.id} className={cn("m-0 py-3 transition sm:py-3.5", done && "bg-accent-secondary/5")}>
                      <div className="grid grid-cols-[2.75rem_minmax(0,1fr)] gap-3 sm:items-start">
                        <button
                          type="button"
                          onClick={() => toggleProgressItem(step.id)}
                          role="checkbox"
                          aria-checked={done}
                          aria-label={done ? `Mark ${step.title} as not finished` : `Mark ${step.title} as finished`}
                          className={cn(
                            "inline-flex h-11 w-11 items-center justify-center rounded-md border transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
                            done ? "border-accent-secondary/45 bg-accent-secondary text-bg" : "border-border bg-card text-muted hover:text-text"
                          )}
                        >
                          {done ? <CheckCircle2 className="h-4 w-4" /> : <Circle className="h-4 w-4" />}
                        </button>
                        <Link
                          href={step.href}
                          className="group grid min-w-0 grid-cols-[minmax(0,1fr)_auto] gap-3 rounded-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
                        >
                          <span className="min-w-0">
                            <span className="mb-1 flex flex-wrap items-center gap-2 font-mono text-xs text-accent">
                              {String(step.position).padStart(2, "0")}
                              {step.optional ? (
                                <span className="rounded-sm border border-border px-1.5 py-0.5 font-sans text-[0.65rem] font-semibold uppercase tracking-[0.08em] text-muted">
                                  Optional
                                </span>
                              ) : null}
                            </span>
                            <span className="block text-base font-semibold text-text transition group-hover:text-accent">{step.title}</span>
                            <span className="mt-1 block text-sm leading-6 text-muted">{step.reason}</span>
                            <span className="mt-2 flex items-start gap-2 text-xs leading-5 text-muted/85">
                              <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent-secondary" />
                              {step.checkpoint}
                            </span>
                          </span>
                          <span className="hidden rounded-md border border-border bg-card p-2 text-muted transition group-hover:border-accent/50 group-hover:text-accent sm:inline-flex">
                            <ArrowRight className="h-4 w-4" />
                          </span>
                        </Link>
                      </div>
                      {stepLabs.length ? (
                        <div className="mt-3 grid gap-3 pl-[3.5rem]">
                          {stepLabs.map((lab) => (
                            <StudyLabCard key={lab.id} lab={lab} done={Boolean(completed[labProgressId(lab)])} onToggle={() => toggleProgressItem(labProgressId(lab))} />
                          ))}
                        </div>
                      ) : null}
                    </li>
                  );
                })}
              </ol>
            </section>
          </div>
        );
      })}
    </div>
  );
}
