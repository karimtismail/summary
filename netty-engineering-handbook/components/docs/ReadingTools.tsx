"use client";

import { BookOpenCheck, Maximize2, Minimize2 } from "lucide-react";
import { useCallback, useEffect, useSyncExternalStore } from "react";
import { GlossaryTerm } from "@/components/docs/GlossaryTerm";
import type { Prerequisite } from "@/lib/studyTracks";
import { cn } from "@/lib/utils";

const FOCUS_KEY = "handbook:reading-focus";
const BEGINNER_KEY = "handbook:beginner-mode";
const FLAG_EVENT = "handbook:reading-flag-updated";
const flagCache = new Map<string, { raw: string | null; value: boolean }>();

function readFlagSnapshot(key: string) {
  if (typeof window === "undefined") return false;
  const raw = window.localStorage.getItem(key);
  const cached = flagCache.get(key);
  if (cached?.raw === raw) return cached.value;
  const value = raw === "1";
  flagCache.set(key, { raw, value });
  return value;
}

function getServerFlagSnapshot() {
  return false;
}

function subscribeFlag(key: string, callback: () => void) {
  if (typeof window === "undefined") return () => {};

  const handleStorage = (event: StorageEvent) => {
    if (event.key && event.key !== key) return;
    callback();
  };
  const handleLocalUpdate = () => callback();

  window.addEventListener("storage", handleStorage);
  window.addEventListener(FLAG_EVENT, handleLocalUpdate);
  queueMicrotask(callback);

  return () => {
    window.removeEventListener("storage", handleStorage);
    window.removeEventListener(FLAG_EVENT, handleLocalUpdate);
  };
}

function writeFlag(key: string, value: boolean) {
  const raw = value ? "1" : "0";
  window.localStorage.setItem(key, raw);
  flagCache.set(key, { raw, value });
  window.dispatchEvent(new Event(FLAG_EVENT));
}

export function ReadingTools({
  title,
  mentalModel,
  terms
}: {
  title: string;
  mentalModel: string;
  terms: Prerequisite[];
}) {
  const subscribeFocus = useCallback((callback: () => void) => subscribeFlag(FOCUS_KEY, callback), []);
  const subscribeBeginner = useCallback((callback: () => void) => subscribeFlag(BEGINNER_KEY, callback), []);
  const getFocusSnapshot = useCallback(() => readFlagSnapshot(FOCUS_KEY), []);
  const getBeginnerSnapshot = useCallback(() => readFlagSnapshot(BEGINNER_KEY), []);
  const focusEnabled = useSyncExternalStore(subscribeFocus, getFocusSnapshot, getServerFlagSnapshot);
  const beginnerEnabled = useSyncExternalStore(subscribeBeginner, getBeginnerSnapshot, getServerFlagSnapshot);

  useEffect(() => {
    document.documentElement.classList.toggle("reading-focus", focusEnabled);
  }, [focusEnabled]);

  return (
    <section className="mb-7 rounded-xl border border-border bg-panel p-3 shadow-inset sm:p-4" aria-label="Reading tools" suppressHydrationWarning>
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">Reading tools</p>
          <p className="mt-1 text-sm leading-6 text-muted">Use only when the page feels noisy or a word slows you down.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => writeFlag(FOCUS_KEY, !focusEnabled)}
            aria-pressed={focusEnabled}
            className={cn(
              "inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
              focusEnabled
                ? "border-accent/45 bg-accent text-bg hover:bg-accent-secondary"
                : "border-border bg-card text-muted hover:border-accent/50 hover:text-text"
            )}
          >
            {focusEnabled ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            {focusEnabled ? "Exit focus" : "Focus"}
          </button>
          <button
            type="button"
            onClick={() => writeFlag(BEGINNER_KEY, !beginnerEnabled)}
            aria-pressed={beginnerEnabled}
            className={cn(
              "inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
              beginnerEnabled
                ? "border-accent-secondary/45 bg-accent-secondary text-bg hover:bg-accent"
                : "border-border bg-card text-muted hover:border-accent-secondary/50 hover:text-text"
            )}
          >
            <BookOpenCheck className="h-4 w-4" />
            Explain simply
          </button>
        </div>
      </div>

      {terms.length ? (
        <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-border pt-3">
          <span className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">Quick words</span>
          {terms.map((term) => (
            <GlossaryTerm key={term.key} item={term} compact />
          ))}
        </div>
      ) : null}

      {beginnerEnabled ? (
        <div className="mt-3 rounded-lg border border-accent-secondary/30 bg-accent-secondary/10 p-3 text-sm leading-7 text-muted" dir="rtl" lang="ar">
          <strong className="text-text">اقرأ {title} ببساطة:</strong> ابدأ بالمشكلة، بعدين امسك الفكرة الرئيسية:{" "}
          <span dir="ltr" className="inline-block text-text">
            {mentalModel}
          </span>{" "}
          لو كلمة وقفتك، افتح المصطلح السريع وكمل من نفس المكان.
        </div>
      ) : null}
    </section>
  );
}
