import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const contentRoot = path.join(process.cwd(), "content");
const requiredSections = [
  "Intuition",
  "Real-world problem",
  "Mental model",
  "Visual explanation",
  "Runtime behavior",
  "Code example",
  "Production implications",
  "Performance implications",
  "Common bugs",
  "Summary"
];

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function mdxFiles() {
  const files = [];
  for (const section of fs.readdirSync(contentRoot).sort()) {
    const sectionPath = path.join(contentRoot, section);
    if (!fs.statSync(sectionPath).isDirectory() || section.startsWith("_")) continue;

    for (const file of fs.readdirSync(sectionPath).sort()) {
      if (file.endsWith(".mdx")) files.push(path.join(sectionPath, file));
    }
  }
  return files;
}

const failures = [];

for (const file of mdxFiles()) {
  const source = fs.readFileSync(file, "utf8");
  const parsed = matter(source);
  const relative = path.relative(process.cwd(), file);

  if (!parsed.data.title || typeof parsed.data.title !== "string") failures.push(`${relative}: missing string title`);
  if (!parsed.data.description || typeof parsed.data.description !== "string") failures.push(`${relative}: missing string description`);

  for (const section of requiredSections) {
    const heading = new RegExp(`^##\\s+${escapeRegExp(section)}\\s*$`, "m");
    if (!heading.test(parsed.content)) failures.push(`${relative}: missing ## ${section}`);
  }

  if (/\b(TODO|FIXME)\b/i.test(parsed.content)) failures.push(`${relative}: contains TODO/FIXME`);
}

if (failures.length) {
  console.error(`Content contract failed with ${failures.length} issue(s):`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`Content contract passed for ${mdxFiles().length} chapters.`);
