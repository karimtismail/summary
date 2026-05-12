import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";

const baseUrl = process.env.VISUAL_QA_BASE_URL ?? "http://localhost:3000";
const browserChannel = process.env.PLAYWRIGHT_CHANNEL ?? "chrome";
const contentRoot = path.join(process.cwd(), "content");
const outDir = path.join("/tmp", `netty-handbook-section-qa-${Date.now()}`);

const viewports = [
  { name: "desktop", width: 1440, height: 1100 },
  { name: "tablet", width: 834, height: 1112 },
  { name: "mobile", width: 390, height: 844 }
];

function getRoutes() {
  const routes = [
    "/",
    "/handbook",
    "/handbook/cheatsheets",
    "/handbook/study/netty",
    "/handbook/study/kafka",
    "/handbook/study/mongodb",
    "/handbook/study/redis",
    "/handbook/study/docker",
    "/handbook/study/websocket"
  ];

  for (const section of fs.readdirSync(contentRoot).sort()) {
    const sectionPath = path.join(contentRoot, section);
    if (!fs.statSync(sectionPath).isDirectory() || section.startsWith("_")) continue;

    for (const file of fs.readdirSync(sectionPath).sort()) {
      if (file.endsWith(".mdx")) {
        routes.push(`/handbook/${section}/${file.replace(/\.mdx$/, "")}`);
      }
    }
  }

  return routes;
}

function cleanName(value) {
  return (
    value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 80) || "section"
  );
}

function routeName(route) {
  return route === "/" ? "home" : cleanName(route);
}

function screenshotName(index, viewport, route, target) {
  return `${String(index).padStart(4, "0")}-${viewport}-${routeName(route)}-${cleanName(target)}.png`;
}

function summarizeIssues(report) {
  return report
    .flatMap((item) => item.issues.map((issue) => issue.type))
    .reduce((totals, type) => {
      totals[type] = (totals[type] ?? 0) + 1;
      return totals;
    }, {});
}

async function getTargets(page) {
  return page.evaluate(() => {
    const targets = [];
    const addTarget = (kind, selector, label) => {
      targets.push({ kind, selector, label });
    };

    if (document.querySelector("#main-content")) {
      addTarget("viewport", "#main-content", "main content");
    }

    document.querySelectorAll("main > section").forEach((section, index) => {
      const label = section.querySelector("h1,h2,h3")?.textContent?.trim() || `page section ${index + 1}`;
      addTarget("element", `main > section:nth-of-type(${index + 1})`, label);
    });

    document.querySelectorAll("article > section").forEach((section, index) => {
      const label = section.querySelector("h1,h2,h3,p")?.textContent?.trim() || `article section ${index + 1}`;
      addTarget("element", `article > section:nth-of-type(${index + 1})`, label);
    });

    document.querySelectorAll("article h2[id]").forEach((heading) => {
      addTarget("viewport", `#${CSS.escape(heading.id)}`, heading.id);
    });

    return targets;
  });
}

async function inspectViewport(page) {
  return page.evaluate(() => {
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const skippedTags = new Set(["SCRIPT", "STYLE", "NOSCRIPT", "SVG", "PATH", "CIRCLE", "RECT", "LINE", "POLYLINE"]);
    const viewportOverflow = [];
    const visibleElementOverflow = [];

    for (const element of Array.from(document.body.querySelectorAll("*"))) {
      if (skippedTags.has(element.tagName)) continue;

      const rect = element.getBoundingClientRect();
      const style = window.getComputedStyle(element);
      const classes = String(element.getAttribute("class") || "");
      if (classes.includes("sr-only")) continue;
      if (rect.width <= 0 || rect.height <= 0 || style.display === "none" || style.visibility === "hidden") continue;
      if (rect.bottom < 0 || rect.top > viewportHeight) continue;
      if (element.closest("pre, code, .overflow-x-auto")) continue;

      const text = (element.textContent || element.tagName).trim().replace(/\s+/g, " ");
      const isProgressBar = style.position === "fixed" && rect.height <= 4;
      if (!isProgressBar && rect.right > viewportWidth + 2 && rect.left < viewportWidth) {
        viewportOverflow.push({
          text: text.slice(0, 80),
          right: Math.round(rect.right),
          width: Math.round(rect.width)
        });
      }

      const allowsScroll = ["auto", "scroll"].includes(style.overflowX) || element.closest(".overflow-x-auto");
      const intentionallyHidden = ["hidden", "clip"].includes(style.overflowX) || style.whiteSpace === "nowrap" || classes.includes("truncate");
      if (element.scrollWidth > element.clientWidth + 4 && !allowsScroll && !intentionallyHidden) {
        visibleElementOverflow.push({
          text: text.slice(0, 80),
          scrollWidth: element.scrollWidth,
          clientWidth: element.clientWidth
        });
      }
    }

    return {
      viewportOverflow: viewportOverflow.slice(0, 5),
      visibleElementOverflow: visibleElementOverflow.slice(0, 5)
    };
  });
}

async function main() {
  fs.mkdirSync(outDir, { recursive: true });

  const routes = getRoutes();
  const browser = await chromium.launch({ channel: browserChannel });
  const report = [];

  for (const viewport of viewports) {
    const context = await browser.newContext({ viewport, deviceScaleFactor: 1, colorScheme: "dark" });

    for (const route of routes) {
      const page = await context.newPage();
      const consoleIssues = [];
      page.on("console", (message) => {
        if (["error", "warning"].includes(message.type())) {
          consoleIssues.push(`${message.type()}: ${message.text()}`);
        }
      });
      page.on("response", (response) => {
        if (response.status() >= 400) {
          consoleIssues.push(`response ${response.status()}: ${response.url()}`);
        }
      });

      try {
        const response = await page.goto(`${baseUrl}${route}`, { waitUntil: "networkidle", timeout: 45000 });
        await page.waitForSelector("#main-content", { timeout: 10000 });
        await page.waitForTimeout(200);

        const targets = await getTargets(page);
        const uniqueTargets = targets.filter((target, index, allTargets) => allTargets.findIndex((candidate) => candidate.selector === target.selector && candidate.label === target.label) === index);

        for (const target of uniqueTargets) {
          const item = {
            route,
            viewport: viewport.name,
            target: target.label,
            selector: target.selector,
            status: response?.status() ?? null,
            screenshot: "",
            issues: []
          };

          const locator = page.locator(target.selector).first();
          await locator.scrollIntoViewIfNeeded({ timeout: 10000 });
          await page.waitForTimeout(80);

          item.screenshot = path.join(outDir, screenshotName(report.length + 1, viewport.name, route, target.label));
          if (target.kind === "element") {
            await locator.screenshot({ path: item.screenshot });
          } else {
            await page.screenshot({ path: item.screenshot, fullPage: false });
          }

          const checks = await inspectViewport(page);
          if (item.status !== 200) item.issues.push({ type: "status", detail: item.status });
          if (checks.viewportOverflow.length) item.issues.push({ type: "viewport-overflow", detail: checks.viewportOverflow });
          if (checks.visibleElementOverflow.length) item.issues.push({ type: "visible-element-overflow", detail: checks.visibleElementOverflow });
          if (consoleIssues.length) item.issues.push({ type: "console", detail: consoleIssues.slice(0, 5) });
          report.push(item);
        }
      } catch (error) {
        report.push({
          route,
          viewport: viewport.name,
          target: "route setup",
          selector: "#main-content",
          status: null,
          screenshot: "",
          issues: [{ type: "exception", detail: String(error?.message || error) }]
        });
      } finally {
        await page.close();
      }
    }

    await context.close();
  }

  await browser.close();

  const summary = {
    generatedAt: new Date().toISOString(),
    baseUrl,
    outDir,
    routeCount: routes.length,
    viewportCount: viewports.length,
    screenshotCount: report.filter((item) => item.screenshot).length,
    targetCount: report.length,
    issueCount: report.reduce((total, item) => total + item.issues.length, 0),
    issuesByType: summarizeIssues(report),
    failing: report.filter((item) => item.issues.length)
  };

  fs.writeFileSync(path.join(outDir, "report.json"), JSON.stringify(report, null, 2));
  fs.writeFileSync(path.join(outDir, "summary.json"), JSON.stringify(summary, null, 2));
  console.log(JSON.stringify(summary, null, 2));

  if (summary.issueCount > 0) {
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
