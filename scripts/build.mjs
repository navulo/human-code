import { existsSync, readFileSync, readdirSync, writeFileSync } from "node:fs";

const REPO = "https://github.com/navulo/human-code";
const RULES_DIR = "rules";
const OUTPUT = "AGENTS.md";
const SESSION_OUTPUT = "hooks/session-start.md";
const SESSION_FILES = ["principles.md", "ai-agents.md"];
// Claude Code cuts SessionStart hook output at 10,000 characters, and the hook prints a header line first.
const SESSION_LIMIT = 9_500;

// Setup docs (repository.md, releases.md) stay out of the bundle: agents need them rarely, and every line costs context.
const BUNDLED = [
  "principles.md",
  "ai-agents.md",
  "reuse.md",
  "architecture.md",
  "code-style.md",
  "typescript.md",
  "comments.md",
  "writing.md",
  "git.md",
];

const HEADER = `<!-- Generated from ${RULES_DIR}/ by \`npm run build\`. Edit the files in ${RULES_DIR}/ instead. -->

# human-code

Navulo's rules for AI coding agents, from ${REPO}. Where they disagree with this project's conventions, follow [When the rules and the project disagree](#when-the-rules-and-the-project-disagree).
`;

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

function shiftHeadings(markdown) {
  let inFence = false;
  return markdown
    .split("\n")
    .map((line) => {
      if (line.trimStart().startsWith("```")) inFence = !inFence;
      return !inFence && /^#{1,5}\s/.test(line) ? `#${line}` : line;
    })
    .join("\n");
}

function readRules() {
  return new Map(
    readdirSync(RULES_DIR)
      .filter((name) => name.endsWith(".md"))
      .map((name) => [name, readFileSync(`${RULES_DIR}/${name}`, "utf8")]),
  );
}

function bundle(rules) {
  const title = (file) => rules.get(file).match(/^# (.*)/)[1];
  const rewriteLink = (match, text, link) => {
    const [file, anchor] = link.split("#");
    if (!rules.has(file)) return match;
    if (!BUNDLED.includes(file)) return `[${text}](${REPO}/blob/main/${RULES_DIR}/${link})`;
    const label = text === file ? title(file) : text;
    return `[${label}](#${anchor ?? slugify(title(file))})`;
  };
  const sections = BUNDLED.map((file) => shiftHeadings(rules.get(file)).replace(LINK, rewriteLink));
  return [HEADER, ...sections].join("\n");
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
const outputs = new Map([
  [OUTPUT, bundle(rules)],
  [SESSION_OUTPUT, SESSION_FILES.map((file) => rules.get(file)).join("\n")],
]);

if (process.argv.includes("--check")) {
  const files = new Map([
    ["README.md", readFileSync("README.md", "utf8")],
    [OUTPUT, outputs.get(OUTPUT)],
    ...[...rules].map(([name, markdown]) => [`${RULES_DIR}/${name}`, markdown]),
  ]);
  const errors = brokenLinks(files);
  for (const [path, content] of outputs) {
    if (!existsSync(path) || readFileSync(path, "utf8") !== content) {
      errors.push(`${path} is out of date: run \`npm run build\``);
    }
  }
  if (outputs.get(SESSION_OUTPUT).length > SESSION_LIMIT) {
    errors.push(`${SESSION_OUTPUT} is over ${SESSION_LIMIT} characters: shorten ${SESSION_FILES.join(" or ")}`);
  }
  if (errors.length > 0) {
    console.error(errors.join("\n"));
    process.exit(1);
  }
} else {
  for (const [path, content] of outputs) writeFileSync(path, content);
}
