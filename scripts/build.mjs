import { existsSync, readFileSync, readdirSync, writeFileSync } from "node:fs";

const RULES_DIR = "rules";
const SESSION_OUTPUT = "hooks/session-start.md";
const SESSION_FILES = ["principles.md", "ai-agents.md"];
// Claude Code cuts SessionStart hook output at 10,000 characters, and the hook prints a header line first.
const SESSION_LIMIT = 9_500;

const LINK = /\[([^\]]*)\]\(([^)\s]+)\)/g;

function slugify(heading) {
  return heading
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s_-]/gu, "")
    .replace(/\s/g, "-");
}

// GitHub adds -1, -2 to repeated headings, so the first occurrence keeps the plain slug.
function headingAnchors(markdown) {
  const anchors = [];
  const seen = new Map();
  let inFence = false;
  for (const line of markdown.split("\n")) {
    if (line.trimStart().startsWith("```")) inFence = !inFence;
    const match = !inFence && line.match(/^#{1,6}\s+(.*)/);
    if (!match) continue;
    const slug = slugify(match[1]);
    const count = seen.get(slug) ?? 0;
    seen.set(slug, count + 1);
    anchors.push(count === 0 ? slug : `${slug}-${count}`);
  }
  return anchors;
}

function readRules() {
  return new Map(
    readdirSync(RULES_DIR)
      .filter((name) => name.endsWith(".md"))
      .map((name) => [`${RULES_DIR}/${name}`, readFileSync(`${RULES_DIR}/${name}`, "utf8")]),
  );
}

function brokenLinks(files) {
  const errors = [];
  for (const [path, markdown] of files) {
    const dir = path.includes("/") ? path.slice(0, path.lastIndexOf("/") + 1) : "";
    for (const [, , link] of markdown.matchAll(LINK)) {
      if (/^[a-z]+:/.test(link)) continue;
      const [file, anchor] = link.split("#");
      const target = file ? dir + file : path;
      if (!files.has(target) && !existsSync(target)) {
        errors.push(`${path}: missing file ${link}`);
      } else if (anchor && !headingAnchors(files.get(target) ?? "").includes(anchor)) {
        errors.push(`${path}: missing anchor ${link}`);
      }
    }
  }
  return errors;
}

const rules = readRules();
const sessionContext = SESSION_FILES.map((file) => rules.get(`${RULES_DIR}/${file}`)).join("\n");

if (process.argv.includes("--check")) {
  const files = new Map([
    ["README.md", readFileSync("README.md", "utf8")],
    ["AGENTS.md", readFileSync("AGENTS.md", "utf8")],
    ...rules,
  ]);
  const errors = brokenLinks(files);
  if (!existsSync(SESSION_OUTPUT) || readFileSync(SESSION_OUTPUT, "utf8") !== sessionContext) {
    errors.push(`${SESSION_OUTPUT} is out of date: run \`npm run build\``);
  }
  if (sessionContext.length > SESSION_LIMIT) {
    errors.push(`${SESSION_OUTPUT} is over ${SESSION_LIMIT} characters: shorten ${SESSION_FILES.join(" or ")}`);
  }
  if (errors.length > 0) {
    console.error(errors.join("\n"));
    process.exit(1);
  }
} else {
  writeFileSync(SESSION_OUTPUT, sessionContext);
}
