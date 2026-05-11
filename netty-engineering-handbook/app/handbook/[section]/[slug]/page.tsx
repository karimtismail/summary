import type { Metadata } from "next";
import { compileMDX } from "next-mdx-remote/rsc";
import { notFound } from "next/navigation";
import { ChapterCheatSheet, ChapterSummary } from "@/components/docs/ChapterCheatSheet";
import { TableOfContents } from "@/components/docs/TableOfContents";
import { PrevNext } from "@/components/docs/PrevNext";
import { Sidebar } from "@/components/docs/Sidebar";
import { mdxComponents } from "@/components/mdx";
import { contentCurrentAsOf, findChapter } from "@/lib/navigation";
import { getChapterSource, getStaticChapterParams } from "@/lib/mdx";

type PageProps = {
  params: Promise<{ section: string; slug: string }>;
};

export function generateStaticParams() {
  return getStaticChapterParams();
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { section, slug } = await params;
  const chapter = findChapter(section, slug);
  if (!chapter) return {};

  return {
    title: chapter.title,
    description: chapter.description
  };
}

export default async function ChapterPage({ params }: PageProps) {
  const { section, slug } = await params;
  const chapter = findChapter(section, slug);
  if (!chapter) notFound();

  let chapterSource;
  try {
    chapterSource = await getChapterSource(section, slug);
  } catch {
    notFound();
  }

  const { content } = await compileMDX({
    source: chapterSource.source,
    components: mdxComponents,
    options: { parseFrontmatter: false }
  });

  return (
    <main className="mx-auto grid max-w-[1440px] gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[280px_minmax(0,1fr)_240px] lg:px-8">
      <aside className="hidden lg:block">
        <div className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto pr-4">
          <Sidebar />
        </div>
      </aside>
      <article className="min-w-0">
        <div className="mb-10 rounded-lg border border-border bg-panel p-6 shadow-inset">
          <p className="mb-4 text-sm font-medium text-accent">{chapter.sectionTitle}</p>
          <div className="docs-prose">
            <h1>{chapterSource.frontmatter.title ?? chapter.title}</h1>
            <p>{chapterSource.frontmatter.description ?? chapter.description}</p>
          </div>
          <p className="mt-5 inline-flex rounded-md border border-border bg-card px-3 py-1.5 text-sm text-muted">
            Current as of {contentCurrentAsOf}. Explains the problem before the API.
          </p>
          <div className="mt-6 grid gap-2 border-t border-border pt-5 sm:grid-cols-5">
            {["Problem", "Model", "Runtime", "Code", "Production"].map((step, index) => (
              <div key={step} className="rounded-md border border-border bg-card px-3 py-2">
                <p className="font-mono text-xs text-accent">{String(index + 1).padStart(2, "0")}</p>
                <p className="mt-1 text-sm font-medium text-text">{step}</p>
              </div>
            ))}
          </div>
        </div>
        <ChapterCheatSheet sheet={chapterSource.cheatSheet} />
        <div className="docs-prose">{content}</div>
        <ChapterSummary summary={chapterSource.cheatSheet.summary} />
        <PrevNext section={section} slug={slug} />
      </article>
      <aside className="hidden xl:block">
        <div className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto">
          <TableOfContents headings={chapterSource.headings} />
        </div>
      </aside>
    </main>
  );
}
