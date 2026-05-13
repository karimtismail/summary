import { Activity, BookOpenCheck, CheckCircle2, FlaskConical, MessageSquareText } from "lucide-react";

const studyMethodSteps = [
  {
    title: "Read the story",
    detail: "Start with why the idea exists and what problem forced engineers to invent it.",
    icon: BookOpenCheck
  },
  {
    title: "Run one thing",
    detail: "Use the smallest example that proves the concept instead of jumping into a big project.",
    icon: FlaskConical
  },
  {
    title: "Watch the evidence",
    detail: "Look at logs, thread names, offsets, indexes, latency, or container state.",
    icon: Activity
  },
  {
    title: "Explain it back",
    detail: "Close the page only when you can say the idea, the failure, and the fix simply.",
    icon: MessageSquareText
  }
];

export function StudyMethod({ title }: { title: string }) {
  return (
    <section className="my-8 rounded-xl border border-border bg-panel p-4 shadow-inset sm:p-5" aria-labelledby="study-method-title">
      <div className="mb-5 flex items-start gap-3">
        <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-border bg-card text-accent">
          <CheckCircle2 className="h-4 w-4" />
        </span>
        <div>
          <h2 id="study-method-title" className="text-xl font-semibold tracking-[0] text-text">
            How to study {title}
          </h2>
          <p dir="rtl" lang="ar" className="mt-1 text-sm leading-7 text-muted">
            امشيها كرحلة هادية: افهم القصة، جرّب حاجة صغيرة، راقب الدليل، وبعدها اشرحها لنفسك ببساطة.
          </p>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {studyMethodSteps.map((step) => {
          const Icon = step.icon;
          return (
            <div key={step.title} className="min-w-0 rounded-lg border border-border bg-card p-4 [overflow-wrap:anywhere]">
              <Icon className="h-4 w-4 text-accent-secondary" />
              <h3 className="mt-3 text-sm font-semibold text-text">{step.title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted">{step.detail}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
