import type { Metadata } from "next";
import { compileMDX } from "next-mdx-remote/rsc";
import { notFound } from "next/navigation";
import { ChapterBrief } from "@/components/docs/ChapterBrief";
import { ChapterReview } from "@/components/docs/ChapterCheatSheet";
import { ChapterStoryGuide } from "@/components/docs/ChapterStoryGuide";
import { PrerequisitePanel } from "@/components/docs/PrerequisitePanel";
import { ReadingTools } from "@/components/docs/ReadingTools";
import { TableOfContents } from "@/components/docs/TableOfContents";
import { PrevNext } from "@/components/docs/PrevNext";
import { Sidebar } from "@/components/docs/Sidebar";
import { mdxComponents } from "@/components/mdx";
import { findChapter } from "@/lib/navigation";
import { getChapterSource, getStaticChapterParams } from "@/lib/mdx";
import { getChapterPrerequisites, getStudyTrackForChapter } from "@/lib/studyTracks";

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
  const prerequisites = getChapterPrerequisites(section, slug);
  const studyTrack = getStudyTrackForChapter(section, slug);

  return (
    <main
      data-chapter-layout="true"
      className="mx-auto grid max-w-[1360px] gap-8 px-4 py-7 sm:px-6 sm:py-10 lg:grid-cols-[264px_minmax(0,1fr)] lg:gap-9 lg:px-8 xl:grid-cols-[264px_minmax(0,1fr)_224px]"
    >
      <aside className="hidden lg:block" data-reading-nav="true">
        <div className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto pr-4">
          <Sidebar />
        </div>
      </aside>
      <article className="min-w-0" data-reading-region="true" id="main-content">
        <ChapterBrief
          title={chapterSource.frontmatter.title ?? chapter.title}
          description={chapterSource.frontmatter.description ?? chapter.description}
          sectionSlug={section}
          chapterSlug={slug}
          sectionTitle={chapter.sectionTitle}
        />
        <ChapterStoryGuide
          title={chapterSource.frontmatter.title ?? chapter.title}
          description={chapterSource.frontmatter.description ?? chapter.description}
          sectionSlug={section}
          chapterSlug={slug}
          sheet={chapterSource.cheatSheet}
        />
        <ReadingTools title={chapterSource.frontmatter.title ?? chapter.title} mentalModel={chapterSource.cheatSheet.mentalModel} terms={prerequisites} />
        <PrerequisitePanel
          items={prerequisites}
          title="Before you start"
          intro={
            studyTrack
              ? `This chapter appears in the ${studyTrack.shortTitle} study path. If any term below feels fuzzy, read the short explanation here, then continue.`
              : "If any term below feels fuzzy, read the short explanation here, then continue."
            }
        />
        <div className="mb-8 rounded-xl border border-border bg-panel p-4 shadow-inset xl:hidden" data-mobile-toc="true">
          <TableOfContents headings={chapterSource.headings} />
        </div>
        <div className="docs-prose">{content}</div>
        <ChapterReview sheet={chapterSource.cheatSheet} />
        <PrevNext section={section} slug={slug} />
      </article>
      <aside className="hidden xl:block" data-reading-toc="true">
        <div className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto">
          <TableOfContents headings={chapterSource.headings} />
        </div>
      </aside>
    </main>
  );
}
