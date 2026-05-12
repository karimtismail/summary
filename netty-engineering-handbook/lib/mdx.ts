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

function parseChapterFrontmatter(data: Record<string, unknown>, filePath: string): ChapterFrontmatter {
  const title = data.title;
  const description = data.description;
  const order = data.order;

  if (typeof title !== "string" || !title.trim()) {
    throw new Error(`Chapter frontmatter requires a title: ${filePath}`);
  }

  if (typeof description !== "string" || !description.trim()) {
    throw new Error(`Chapter frontmatter requires a description: ${filePath}`);
  }

  if (order !== undefined && typeof order !== "number") {
    throw new Error(`Chapter frontmatter order must be a number when provided: ${filePath}`);
  }

  return { title, description, order };
}

export async function getChapterSource(section: string, slug: string) {
  const filePath = path.join(contentRoot, section, `${slug}.mdx`);
  const raw = await fs.readFile(filePath, "utf8");
  const parsed = matter(raw);
  const frontmatter = parseChapterFrontmatter(parsed.data, filePath);

  return {
    source: parsed.content,
    frontmatter,
    headings: extractHeadings(parsed.content),
    cheatSheet: createCheatSheet(parsed.content, frontmatter.description)
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
