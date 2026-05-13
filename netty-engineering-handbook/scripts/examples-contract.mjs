import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const exampleRoot = path.join(root, "examples", "systems-lab");
const failures = [];

const requiredFiles = [
  "README.md",
  ".dockerignore",
  "pom.xml",
  "Dockerfile",
  "docker-compose.yml",
  "src/main/resources/application.yml",
  "src/main/java/com/example/systemslab/SystemsLabApplication.java",
  "src/main/java/com/example/systemslab/kafka/OrderEventController.java",
  "src/main/java/com/example/systemslab/redis/ProductCacheService.java",
  "src/main/java/com/example/systemslab/mongo/MongoProofController.java",
  "src/main/java/com/example/systemslab/websocket/WebSocketConfig.java"
];

function assert(condition, message) {
  if (!condition) failures.push(message);
}

function read(relativePath) {
  return fs.readFileSync(path.join(exampleRoot, relativePath), "utf8");
}

for (const file of requiredFiles) {
  assert(fs.existsSync(path.join(exampleRoot, file)), `examples/systems-lab missing ${file}`);
}

if (fs.existsSync(exampleRoot)) {
  const readme = read("README.md");
  assert(readme.includes("docker compose up --build"), "examples README must include Docker Compose run command");
  assert(readme.includes("mvn -q -DskipTests package"), "examples README must include Maven compile command");
  assert(readme.includes("/kafka/orders"), "examples README must mention Kafka endpoint");
  assert(readme.includes("/redis/products"), "examples README must mention Redis endpoint");
  assert(readme.includes("/mongo/products"), "examples README must mention Mongo endpoint");

  const pom = read("pom.xml");
  for (const artifact of [
    "spring-boot-starter-data-mongodb",
    "spring-boot-starter-data-redis",
    "spring-boot-starter-kafka",
    "spring-boot-starter-websocket"
  ]) {
    assert(pom.includes(`<artifactId>${artifact}</artifactId>`), `pom.xml missing ${artifact}`);
  }

  const compose = read("docker-compose.yml");
  for (const service of ["kafka:", "redis:", "mongo:", "app:"]) {
    assert(compose.includes(service), `docker-compose.yml missing ${service}`);
  }
}

const realProjects = fs.readFileSync(path.join(root, "content", "mastery", "real-projects.mdx"), "utf8");
assert(realProjects.includes("examples/systems-lab"), "Real Projects chapter must point to examples/systems-lab");

if (failures.length) {
  console.error(`Examples contract failed with ${failures.length} issue(s):`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log("Examples contract passed for examples/systems-lab.");
