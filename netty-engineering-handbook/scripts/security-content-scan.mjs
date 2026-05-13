import fs from "node:fs";
import path from "node:path";

const roots = ["app", "components", "content", "lib", "scripts"];
const skippedDirs = new Set(["node_modules", ".next", "out", ".git"]);
const scannedExtensions = new Set([".js", ".jsx", ".ts", ".tsx", ".mjs", ".md", ".mdx", ".css", ".yml", ".yaml"]);
const allowList = [
  /mongodb:\/\/localhost/i,
  /mongodb:\/\/mongo/i,
  /redis:\/\/localhost/i,
  /postgres:\/\/localhost/i
];

const patterns = [
  { name: "private key", pattern: /-----BEGIN (RSA |EC |OPENSSH |DSA |)?PRIVATE KEY-----/ },
  { name: "github token", pattern: /gh[pousr]_[A-Za-z0-9_]{30,}/ },
  { name: "aws access key", pattern: /AKIA[0-9A-Z]{16}/ },
  { name: "openai key", pattern: /sk-[A-Za-z0-9]{32,}/ },
  { name: "wildcard websocket origin", pattern: /setAllowedOrigins\(\s*["'`]\*["'`]\s*\)/ },
  { name: "curl pipe shell", pattern: /curl\b[^\n|]*\|\s*(sh|bash)\b/ },
  { name: "privileged docker", pattern: /--privileged|privileged:\s*true/ },
  { name: "committed env secret", pattern: /^\s*[A-Z0-9_]*(SECRET|TOKEN|PASSWORD|PRIVATE_KEY)\s*=\s*.+$/m }
];

function walk(dir) {
  const files = [];
  if (!fs.existsSync(dir)) return files;

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (skippedDirs.has(entry.name)) continue;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...walk(fullPath));
    } else if (scannedExtensions.has(path.extname(entry.name))) {
      files.push(fullPath);
    }
  }
  return files;
}

const findings = [];

for (const root of roots) {
  for (const file of walk(path.join(process.cwd(), root))) {
    if (path.basename(file) === "security-content-scan.mjs") continue;
    const source = fs.readFileSync(file, "utf8");
    if (allowList.some((allowed) => allowed.test(source))) continue;

    for (const { name, pattern } of patterns) {
      const match = source.match(pattern);
      if (match) {
        const line = source.slice(0, match.index).split("\n").length;
        findings.push(`${path.relative(process.cwd(), file)}:${line} ${name}`);
      }
    }
  }
}

if (findings.length) {
  console.error(`Security content scan failed with ${findings.length} finding(s):`);
  for (const finding of findings) console.error(`- ${finding}`);
  process.exit(1);
}

console.log("Security content scan passed.");
