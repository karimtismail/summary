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
    displayLabel: "Start simple",
    navLabel: "Start",
    prompt: "الفكرة ببساطة قبل أي أسماء أو APIs.",
    required: true
  },
  {
    id: "real-world-problem",
    label: "Real-world problem",
    displayLabel: "Why do we need it?",
    navLabel: "Why?",
    prompt: "المشكلة اللي خلت الموضوع ده مهم.",
    required: true
  },
  {
    id: "mental-model",
    label: "Mental model",
    displayLabel: "The main idea",
    navLabel: "Idea",
    prompt: "الموديل اللي تمسكه في دماغك وانت بتذاكر.",
    required: true
  },
  {
    id: "visual-explanation",
    label: "Visual explanation",
    displayLabel: "Picture it",
    navLabel: "Picture",
    prompt: "نشوفها كحركة أو رسمة صغيرة.",
    required: true
  },
  {
    id: "runtime-behavior",
    label: "Runtime behavior",
    displayLabel: "What actually happens?",
    navLabel: "Happens",
    prompt: "إيه اللي بيحصل جوه السيستم خطوة بخطوة.",
    required: true
  },
  {
    id: "code-example",
    label: "Code example",
    displayLabel: "Try it in code",
    navLabel: "Code",
    prompt: "الكود هنا عشان يثبت الفكرة، مش عشان تحفظ syntax.",
    required: true
  },
  {
    id: "production-implications",
    label: "Production implications",
    displayLabel: "In real projects",
    navLabel: "Real app",
    prompt: "إيه اللي هيفرق لما الموضوع يدخل production.",
    required: true
  },
  {
    id: "performance-implications",
    label: "Performance implications",
    displayLabel: "Speed notes",
    navLabel: "Speed",
    prompt: "ملحوظات الأداء من غير رغي.",
    required: true
  },
  {
    id: "common-bugs",
    label: "Common bugs",
    displayLabel: "Mistakes to avoid",
    navLabel: "Mistakes",
    prompt: "الحاجات اللي غالبا بتوقع الناس.",
    required: true
  },
  {
    id: "summary",
    label: "Summary",
    displayLabel: "Remember this",
    navLabel: "Remember",
    prompt: "الخلاصة اللي تاخدها معاك.",
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
