import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";

const baseUrl = process.env.VISUAL_QA_BASE_URL ?? "http://localhost:3000";
const browserChannel = process.env.PLAYWRIGHT_CHANNEL ?? "chrome";
const contentRoot = path.join(process.cwd(), "content");
const outDir = path.join("/tmp", `netty-handbook-visual-qa-${Date.now()}`);

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

function screenshotName(index, viewport, route) {
  const routeSlug = route === "/" ? "home" : route.replace(/^\//, "").replace(/\//g, "__");
  return `${String(index).padStart(3, "0")}-${viewport}-${routeSlug}.png`;
}

function summarizeIssues(report) {
  return report
    .flatMap((item) => item.issues.map((issue) => issue.type))
    .reduce((totals, type) => {
      totals[type] = (totals[type] ?? 0) + 1;
      return totals;
    }, {});
}

async function inspectPage(page) {
  return page.evaluate(() => {
    const viewportWidth = window.innerWidth;
    const bodyText = document.body.innerText || "";
    const documentWidth = Math.max(document.documentElement.scrollWidth, document.body.scrollWidth);
    const skippedTags = new Set(["SCRIPT", "STYLE", "NOSCRIPT", "SVG", "PATH", "CIRCLE", "RECT", "LINE", "POLYLINE"]);
    const overflow = [];
    const elementOverflow = [];

    for (const element of Array.from(document.body.querySelectorAll("*"))) {
      if (skippedTags.has(element.tagName)) continue;

      const rect = element.getBoundingClientRect();
      const style = window.getComputedStyle(element);
      const classes = String(element.getAttribute("class") || "");
      if (classes.includes("sr-only")) continue;
      if (rect.width <= 0 || rect.height <= 0 || style.display === "none" || style.visibility === "hidden") continue;

      const isProgressBar = style.position === "fixed" && rect.height <= 4;
      if (!isProgressBar && rect.right > viewportWidth + 2 && rect.left < viewportWidth) {
        overflow.push({
          text: (element.textContent || element.tagName).trim().replace(/\s+/g, " ").slice(0, 80),
          right: Math.round(rect.right)
        });
      }

      const allowsScroll = ["auto", "scroll"].includes(style.overflowX) || element.closest(".overflow-x-auto");
      const intentionallyHidden = ["hidden", "clip"].includes(style.overflowX) || style.whiteSpace === "nowrap" || classes.includes("truncate");
      if (element.scrollWidth > element.clientWidth + 4 && !allowsScroll && !intentionallyHidden) {
        elementOverflow.push({
          text: (element.textContent || element.tagName).trim().replace(/\s+/g, " ").slice(0, 80),
          scrollWidth: element.scrollWidth,
          clientWidth: element.clientWidth
        });
      }
    }

    return {
      hasMainContent: Boolean(document.getElementById("main-content")),
      horizontalOverflow: documentWidth > viewportWidth + 2,
      overflow: overflow.slice(0, 5),
      elementOverflow: elementOverflow.slice(0, 5),
      frameworkOverlay: /Build Error|Unhandled Runtime Error|Application error|Module not found|This page could not be found/i.test(bodyText),
      blank: bodyText.trim().length < 80
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
      const item = {
        route,
        viewport: viewport.name,
        url: `${baseUrl}${route}`,
        status: null,
        screenshot: "",
        issues: []
      };

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
        const response = await page.goto(item.url, { waitUntil: "domcontentloaded", timeout: 45000 });
        item.status = response?.status() ?? null;
        await page.waitForSelector("#main-content", { timeout: 10000 });
        await page.waitForTimeout(200);

        item.screenshot = path.join(outDir, screenshotName(report.length + 1, viewport.name, route));
        await page.screenshot({ path: item.screenshot, fullPage: true });

        const checks = await inspectPage(page);
        if (item.status !== 200) item.issues.push({ type: "status", detail: item.status });
        if (!checks.hasMainContent) item.issues.push({ type: "missing-main-content" });
        if (checks.horizontalOverflow) item.issues.push({ type: "horizontal-overflow", detail: checks.overflow });
        if (checks.elementOverflow.length) item.issues.push({ type: "element-overflow", detail: checks.elementOverflow });
        if (checks.frameworkOverlay) item.issues.push({ type: "framework-overlay" });
        if (checks.blank) item.issues.push({ type: "blank-page" });
        if (consoleIssues.length) item.issues.push({ type: "console", detail: consoleIssues.slice(0, 5) });
      } catch (error) {
        item.issues.push({ type: "exception", detail: String(error?.message || error) });
      } finally {
        report.push(item);
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
