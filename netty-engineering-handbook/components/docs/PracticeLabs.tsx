import { CheckCircle2, FlaskConical, Hammer, Lightbulb } from "lucide-react";
import type { PracticeLab } from "@/lib/practiceLabs";

export function PracticeLabs({ labs }: { labs: PracticeLab[] }) {
  if (!labs.length) return null;

  return (
    <section className="mt-8 rounded-xl border border-border bg-panel p-4 shadow-inset sm:p-5" aria-labelledby="practice-labs-title">
      <div className="mb-5 flex items-start gap-3">
        <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-border bg-card text-accent-secondary">
          <FlaskConical className="h-4 w-4" />
        </span>
        <div>
          <h2 id="practice-labs-title" className="text-xl font-semibold tracking-[0] text-text">
            Practice labs
          </h2>
          <p className="mt-1 text-sm leading-6 text-muted">
            Do these after the lessons. They turn reading into proof that the idea is yours.
          </p>
        </div>
      </div>

      <div className="grid gap-3 lg:grid-cols-3">
        {labs.map((lab) => (
          <details key={lab.title} className="rounded-lg border border-border bg-card p-4">
            <summary className="cursor-pointer list-none">
              <span className="block text-base font-semibold text-text">{lab.title}</span>
              <span className="mt-1 block text-sm leading-6 text-muted">{lab.goal}</span>
            </summary>
            <div className="mt-4 border-t border-border pt-4">
              <div className="mb-3 flex items-center gap-2">
                <Hammer className="h-4 w-4 text-accent" />
                <p className="text-sm font-semibold text-text">Build</p>
              </div>
              <ul className="m-0 space-y-2 p-0">
                {lab.build.map((item) => (
                  <li key={item} className="m-0 flex items-start gap-2 text-sm leading-6 text-muted">
                    <CheckCircle2 className="mt-1 h-3.5 w-3.5 shrink-0 text-accent-secondary" />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="mt-4 rounded-md border border-accent-secondary/30 bg-panel p-3">
                <div className="mb-2 flex items-center gap-2">
                  <Lightbulb className="h-4 w-4 text-accent-secondary" />
                  <p className="text-sm font-semibold text-text">Check</p>
                </div>
                <p className="text-sm leading-6 text-muted">{lab.check}</p>
              </div>
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
