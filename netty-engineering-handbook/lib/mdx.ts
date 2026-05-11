import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { createCheatSheet, extractHeadings } from "@/lib/handbook";
import { allChapters, sections } from "@/lib/navigation";

const contentRoot = path.join(process.cwd(), "content");

export type ChapterFrontmatter = {
  title: string;
  description: string;
  order?: number;
};

export async function getChapterSource(section: string, slug: string) {
  const filePath = path.join(contentRoot, section, `${slug}.mdx`);
  const raw = await fs.readFile(filePath, "utf8");
  const parsed = matter(raw);

  return {
    source: parsed.content,
    frontmatter: parsed.data as ChapterFrontmatter,
    headings: extractHeadings(parsed.content),
    cheatSheet: createCheatSheet(parsed.content, (parsed.data.description as string | undefined) ?? "")
  };
}

export function getStaticChapterParams() {
  return allChapters.map((chapter) => ({
    section: chapter.section,
    slug: chapter.slug
  }));
}

export function getSection(slug: string) {
  return sections.find((section) => section.slug === slug);
}
