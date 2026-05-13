import { chapterStructure, getChapterSectionByHeading } from "@/lib/chapterSections";

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/`/g, "")
    .replace(/&/g, "and")
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export type TocHeading = {
  id: string;
  text: string;
  level: 2 | 3;
};

export type ChapterCheatSheet = {
  problem: string;
  mentalModel: string;
  runtime: string;
  production: string;
  performance: string;
  commonBugs: string[];
  summary: string;
};

export function extractHeadings(source: string): TocHeading[] {
  const headings: TocHeading[] = [];
  const matcher = /^(##|###)\s+(.+)$/gm;
  let match: RegExpExecArray | null;

  while ((match = matcher.exec(source)) !== null) {
    const level = match[1] === "##" ? 2 : 3;
    const text = match[2].replace(/<[^>]+>/g, "").replace(/[`*_{}[\]()#+.!]/g, "").trim();
    if (text) {
      headings.push({ id: slugify(text), text, level });
    }
  }

  return headings;
}

function stripMdx(value: string) {
  return value
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/<ArchitectureDiagram[\s\S]*?<\/ArchitectureDiagram>/g, " ")
    .replace(/<FlowDiagram[\s\S]*?<\/FlowDiagram>/g, " ")
    .replace(/<\/?[\w.]+[^>]*>/g, " ")
    .replace(/\{[^}]*\}/g, " ")
    .replace(/[`*_>#]/g, "")
    .replace(/\[(.*?)\]\([^)]*\)/g, "$1")
    .replace(/\s+/g, " ")
    .trim();
}

function extractSections(source: string) {
  const matches = [...source.matchAll(/^##\s+(.+)$/gm)];
  const sections = new Map<string, string>();

  matches.forEach((match, index) => {
    const title = match[1].trim();
    const section = getChapterSectionByHeading(title);
    const start = match.index ?? 0;
    const contentStart = start + match[0].length;
    const next = matches[index + 1];
    const contentEnd = next?.index ?? source.length;
    const body = source.slice(contentStart, contentEnd).trim();
    sections.set(title, body);
    if (section) {
      sections.set(section.id, body);
      sections.set(section.label, body);
      sections.set(section.displayLabel, body);
    }
  });

  return sections;
}

function firstSentences(value: string, fallback: string, maxSentences = 2) {
  const cleaned = stripMdx(value);
  if (!cleaned) return fallback;

  const sentences = cleaned.match(/[^.!?]+[.!?]+/g);
  if (!sentences?.length) return cleaned.split(" ").slice(0, 26).join(" ");

  return sentences.slice(0, maxSentences).join(" ").trim();
}

function bulletItems(value: string) {
  const items = value
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => /^[-*]\s+/.test(line))
    .map((line) => stripMdx(line.replace(/^[-*]\s+/, "")))
    .filter(Boolean);

  return items.slice(0, 4);
}

export function createCheatSheet(source: string, fallbackDescription: string): ChapterCheatSheet {
  const sections = extractSections(source);
  const commonBugs = bulletItems(sections.get("common-bugs") ?? sections.get("Common bugs") ?? "");

  return {
    problem: firstSentences(sections.get("real-world-problem") ?? sections.get("Real-world problem") ?? "", fallbackDescription),
    mentalModel: firstSentences(sections.get("mental-model") ?? sections.get("Mental model") ?? "", "Identify the runtime boundary, then choose the API that matches it."),
    runtime: firstSentences(sections.get("runtime-behavior") ?? sections.get("Runtime behavior") ?? "", "Observe how the system behaves while bytes, records, or events move through it."),
    production: firstSentences(sections.get("production-implications") ?? sections.get("Production implications") ?? "", "Make the operational boundary visible with metrics, limits, and failure policy."),
    performance: firstSentences(sections.get("performance-implications") ?? sections.get("Performance implications") ?? "", "Measure queueing, allocation, batching, and latency before tuning."),
    commonBugs: commonBugs.length ? commonBugs : ["Explaining the API before the failure mode is understood.", "Missing ownership, ordering, or backpressure boundaries."],
    summary: firstSentences(sections.get("summary") ?? sections.get("Summary") ?? "", fallbackDescription, 3)
  };
}

export function createChapterScaffold(topic: string) {
  return chapterStructure.map((heading) => `## ${heading}\n\n${topic} needs this section.\n`).join("\n");
}
