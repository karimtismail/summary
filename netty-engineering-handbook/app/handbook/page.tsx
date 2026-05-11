import Link from "next/link";
import { ArrowRight, FileText } from "lucide-react";
import { Sidebar } from "@/components/docs/Sidebar";
import { contentCurrentAsOf, sections } from "@/lib/navigation";

export default function HandbookIndexPage() {
  return (
    <main className="mx-auto grid max-w-[1440px] gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[280px_1fr] lg:px-8">
      <aside className="hidden lg:block">
        <div className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto pr-4">
          <Sidebar />
        </div>
      </aside>
      <section className="max-w-5xl">
        <h1 className="max-w-4xl text-5xl font-bold leading-[1.05] tracking-[0] text-text">A connected path through networking systems.</h1>
        <p className="mt-6 max-w-3xl text-lg leading-8 text-muted">
          This handbook is arranged as a learning sequence. Start with the cost of blocking IO, move through Java NIO and Netty, then use that model to design protocols, Kafka event streams, and production systems.
        </p>
        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          <Link href="/handbook/cheatsheets" className="group rounded-lg border border-border bg-panel p-4 transition hover:border-accent/50 hover:bg-card">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border bg-card text-accent">
                <FileText className="h-4 w-4" />
              </span>
              <div>
                <p className="font-medium text-text">All cheat sheets</p>
                <p className="mt-1 text-sm text-muted">Quick revision cards generated from every chapter.</p>
              </div>
              <ArrowRight className="ml-auto h-4 w-4 text-muted transition group-hover:text-accent" />
            </div>
          </Link>
          <div className="rounded-lg border border-border bg-panel p-4">
            <p className="text-sm font-medium text-text">Content currency</p>
            <p className="mt-1 text-sm leading-6 text-muted">Version-sensitive topics are written against the platform state current as of {contentCurrentAsOf}.</p>
          </div>
        </div>
        <div className="mt-12 space-y-8">
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <section key={section.slug} className="rounded-lg border border-border bg-panel p-5 shadow-inset">
                <div className="mb-5 flex items-start gap-4">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-border bg-card text-accent-secondary">
                    <Icon className="h-5 w-5" />
                  </span>
                  <div>
                    <h2 className="text-xl font-semibold tracking-[0] text-text">{section.title}</h2>
                    <p className="mt-1 text-sm leading-6 text-muted">{section.description}</p>
                  </div>
                </div>
                <div className="grid gap-2 md:grid-cols-2">
                  {section.chapters.map((chapter) => (
                    <Link
                      key={chapter.slug}
                      href={`/handbook/${section.slug}/${chapter.slug}`}
                      className="group rounded-md border border-border bg-card p-4 transition hover:border-accent/50 hover:bg-bg"
                    >
                      <div className="flex items-center justify-between gap-4">
                        <p className="font-medium text-text">{chapter.title}</p>
                        <ArrowRight className="h-4 w-4 shrink-0 text-muted transition group-hover:text-accent" />
                      </div>
                      <p className="mt-2 text-sm leading-6 text-muted">{chapter.description}</p>
                    </Link>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </section>
    </main>
  );
}
