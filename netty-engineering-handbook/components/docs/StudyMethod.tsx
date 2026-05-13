import { Activity, BookOpenCheck, CheckCircle2, FlaskConical, MessageSquareText } from "lucide-react";
import { studyRoutineSteps } from "@/lib/learningLoop";

const studyRoutineIcons = {
  read: BookOpenCheck,
  run: FlaskConical,
  observe: Activity,
  explain: MessageSquareText
} satisfies Record<(typeof studyRoutineSteps)[number]["id"], typeof BookOpenCheck>;

export function StudyMethod({ title }: { title: string }) {
  return (
    <section className="my-8 rounded-xl border border-border bg-panel p-4 shadow-inset sm:p-5" aria-labelledby="study-method-title">
      <div className="mb-5 flex items-start gap-3">
        <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-border bg-card text-accent">
          <CheckCircle2 className="h-4 w-4" />
        </span>
        <div className="min-w-0">
          <h2 id="study-method-title" className="text-xl font-semibold tracking-[0] text-text">
            How to study {title}
          </h2>
          <p dir="rtl" lang="ar" className="mt-2 max-w-3xl text-right text-sm leading-7 text-muted">
            امشيها كرحلة هادية: افهم القصة، جرّب حاجة صغيرة، راقب الدليل، وبعدها اشرحها لنفسك ببساطة.
          </p>
        </div>
      </div>

      <ol className="m-0 grid list-none gap-0 overflow-hidden rounded-lg border border-border bg-card/45 p-0 md:grid-cols-2 xl:grid-cols-4">
        {studyRoutineSteps.map((step, index) => {
          const Icon = studyRoutineIcons[step.id];
          return (
            <li key={step.label} className="m-0 min-w-0 border-border p-4 [overflow-wrap:anywhere] md:border-b xl:border-b-0 xl:border-r xl:last:border-r-0">
              <div className="flex items-start gap-3">
                <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-border bg-panel text-accent-secondary">
                  <Icon className="h-4 w-4" />
                </span>
                <div className="min-w-0">
                  <span className="block font-mono text-xs text-accent">{String(index + 1).padStart(2, "0")}</span>
                  <h3 className="mt-1 text-sm font-semibold text-text">{step.label}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted">{step.detail}</p>
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
