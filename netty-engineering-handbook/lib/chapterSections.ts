export type ChapterSection = {
  id: string;
  label: string;
  displayLabel: string;
  navLabel: string;
  prompt: string;
  required: boolean;
};

export const chapterSections = [
  {
    id: "intuition",
    label: "Intuition",
    displayLabel: "The story starts here",
    navLabel: "Story",
    prompt: "نبدأ من الحكاية قبل المصطلحات.",
    required: true
  },
  {
    id: "real-world-problem",
    label: "Real-world problem",
    displayLabel: "Why it appeared",
    navLabel: "Why",
    prompt: "إيه المشكلة اللي خلت الناس تخترع الفكرة دي؟",
    required: true
  },
  {
    id: "mental-model",
    label: "Mental model",
    displayLabel: "What it really means",
    navLabel: "Meaning",
    prompt: "المعنى اللي تمسكه في دماغك من غير زحمة.",
    required: true
  },
  {
    id: "visual-explanation",
    label: "Visual explanation",
    displayLabel: "See it as a scene",
    navLabel: "Scene",
    prompt: "نشوفها كحركة بسيطة بدل كلام مجرد.",
    required: true
  },
  {
    id: "runtime-behavior",
    label: "Runtime behavior",
    displayLabel: "How it works inside",
    navLabel: "Inside",
    prompt: "الخطوات اللي بتحصل جوه السيستم واحدة واحدة.",
    required: true
  },
  {
    id: "code-example",
    label: "Code example",
    displayLabel: "Practice it in code",
    navLabel: "Code",
    prompt: "شوف الفكرة في كود أو أمر تقدر تربطه بالحكاية.",
    required: true
  },
  {
    id: "production-implications",
    label: "Production implications",
    displayLabel: "Where it helps",
    navLabel: "Helps",
    prompt: "الفكرة دي بتفيدك فين في مشروع حقيقي؟",
    required: true
  },
  {
    id: "performance-implications",
    label: "Performance implications",
    displayLabel: "Where it hurts",
    navLabel: "Limits",
    prompt: "إيه تمنها؟ وإمتى تبقى مزعجة؟",
    required: true
  },
  {
    id: "common-bugs",
    label: "Common bugs",
    displayLabel: "What came next",
    navLabel: "Next",
    prompt: "إيه اللي جه بعد كده يحل ألمها؟",
    required: true
  },
  {
    id: "summary",
    label: "Summary",
    displayLabel: "Hold this story",
    navLabel: "Remember",
    prompt: "الخلاصة اللي تفضل معاك وانت بتكمل.",
    required: true
  }
] as const satisfies readonly ChapterSection[];

export const chapterStructure = chapterSections.map((section) => section.displayLabel);

export const chapterSectionById: ReadonlyMap<string, ChapterSection> = new Map(chapterSections.map((section) => [section.id, section]));
export const chapterSectionByLabel: ReadonlyMap<string, ChapterSection> = new Map(chapterSections.map((section) => [section.label, section]));

function sectionSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/`/g, "")
    .replace(/&/g, "and")
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function getChapterSectionByHeading(heading: string) {
  const slug = sectionSlug(heading);
  return (
    chapterSectionById.get(slug) ??
    chapterSections.find((section) =>
      [section.label, section.displayLabel, section.navLabel].some((value) => sectionSlug(value) === slug)
    )
  );
}

export function getChapterDisplayLabel(heading: string) {
  return getChapterSectionByHeading(heading)?.displayLabel ?? heading;
}
