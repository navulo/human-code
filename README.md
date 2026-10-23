# human-code

Rules that make AI coding agents write code a person would write.

These are the engineering rules we use in every [Navulo](https://github.com/navulo) project. They are open, and you can use them in yours.

## The problem

Claude Code, Codex, Cursor and other agents write code that works but is hard to live with. They:

- add layers, files and abstractions that the task does not need;
- comment every line, often with traces of the chat;
- guard against states that cannot happen, and hide real failures behind fallbacks;
- write a new helper instead of finding the one that already exists.

The last habit shows up in the data. [GitClear's analysis of commit histories](https://devclass.com/2025/02/20/ai-is-eroding-code-quality-states-new-in-depth-report/) found that as coding assistants spread, copy-pasted code grew and refactored code shrank.

## Before and after

The task: show the user's name in the profile header.

Without the rules, an agent typically creates a new file:

```ts
// src/utils/userHelpers.ts
/**
 * Gets the display name for a user.
 * @param user - The user object
 * @returns The display name of the user
 */
export function getUserDisplayName(user: User | null | undefined): string {
  // Check if the user exists
  if (!user) {
    return "Unknown User";
  }
  try {
    // Combine the first and last name
    const fullName = `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim();
    // Fall back to the email if the name is empty
    return fullName || user.email || "Unknown User";
  } catch (error) {
    console.error("Error getting display name:", error);
    return "Unknown User";
  }
}
```

With the rules, the agent finds `formatFullName` in `src/lib/user.ts`, which four other screens already use:

```tsx
<h1>{formatFullName(user)}</h1>
```

Its report says: "Used `formatFullName` from `src/lib/user.ts`. `user` cannot be null here, because the route loader throws on 404."

The first version breaks six rules:

- it adds a new helper next to an existing one ([reuse](rules/reuse.md#before-writing-a-helper));
- it puts the helper in a file named `utils` ([naming](rules/code-style.md#naming));
- its doc comment repeats the signature, and its comments restate the code ([comments](rules/comments.md#what-not-to-write));
- it widens the type to accept `null`, then checks for `null` ([errors and validation](rules/code-style.md#errors-and-validation));
- it wraps code that cannot throw in `try/catch` (same rule);
- it hides missing data behind `"Unknown User"` (same rule).

## What is inside

| File | What it covers |
| --- | --- |
| [principles.md](rules/principles.md) | Priorities, simplicity, the least mechanism, and what wins when the rules and a project disagree |
| [ai-agents.md](rules/ai-agents.md) | How an agent works on a task, and a list of common traps |
| [reuse.md](rules/reuse.md) | Finding existing code, duplication, boilerplate |
| [architecture.md](rules/architecture.md) | Structure, abstractions, state, module boundaries, dependencies |
| [code-style.md](rules/code-style.md) | Formatting, naming, functions, files, errors, logging, security |
| [typescript.md](rules/typescript.md) | TypeScript |
| [comments.md](rules/comments.md) | When a comment is worth writing |
| [writing.md](rules/writing.md) | Language and tone for commits, PRs, docs, errors and logs |
| [git.md](rules/git.md) | What a change is, commit and PR format, branches, review |
| [repository.md](rules/repository.md) | What every repository contains |
| [releases.md](rules/releases.md) | Versions, changelog, releases |

## Use it

Copy the rules into your repository, then point your agents at them. The rule files link to each other, and the links work inside your repository. Agents load two files up front, about 2,000 tokens, and open the rest when a task needs them.

1. Copy the `rules/` folder of a release into `.agents/human-code/`:

   ```bash
   rm -rf .agents/human-code && mkdir -p .agents/human-code
   curl -fsSL https://github.com/navulo/human-code/archive/refs/tags/v0.2.0.tar.gz \
     | tar -xz -C .agents/human-code --strip-components=2 human-code-0.2.0/rules
   ```

   To update, run the same commands with a newer version. Do not edit the copied files: change the rules in this repository instead.

2. Add this section to your `AGENTS.md`. Codex, Cursor, GitHub Copilot and [other agents](https://agents.md) read that file.

   ```markdown
   ## Rules

   This repository follows the [human-code](https://github.com/navulo/human-code) rules in `.agents/human-code/`. Before changing code, read `principles.md` and `ai-agents.md` there. They link to the other rule files.
   ```

3. Claude Code reads `CLAUDE.md`, not `AGENTS.md`. Put these lines in your `CLAUDE.md`, so that the two core files are always in context:

   ```
   @AGENTS.md
   @.agents/human-code/principles.md
   @.agents/human-code/ai-agents.md
   ```

### Claude Code plugin

If you use only Claude Code and do not want to copy files into each repository, install the plugin instead. It loads the same two core files into every session, in any project on your machine. The other rule files ship with the plugin. Do not combine the plugin with a copy in the repository: the rules would load twice.

```
/plugin marketplace add navulo/human-code
/plugin install human-code@navulo
```

### Adapting the rules

Project conventions win over these rules: names, file layout, libraries and patterns. The quality rules apply to every new line. See [When the rules and the project disagree](rules/principles.md#when-the-rules-and-the-project-disagree).

To change the rules for your team, fork the repository and edit the files in `rules/`.

## Where the rules come from

- Google: [eng-practices](https://github.com/google/eng-practices) and the [Go style guide](https://google.github.io/styleguide/go/guide).
- Yandex: the [userver code review rules](https://github.com/userver-framework/userver/blob/develop/scripts/docs/en/userver/development/code_review.md), and the agent guides in [YDB](https://github.com/ydb-platform/ydb/blob/main/.agents/skills/ydb-agent-instructions/SKILL.md) and [Gravity UI](https://github.com/gravity-ui/uikit/blob/main/AGENTS.md).
- Anthropic: [prompting best practices](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices).
- Agent rules in large open-source projects: [Astro](https://github.com/withastro/astro/blob/main/.agents/skills/writing-comments/SKILL.md), [Bun](https://github.com/oven-sh/bun/blob/main/CLAUDE.md), [PostHog](https://github.com/PostHog/posthog/blob/master/AGENTS.md), [Ruff](https://github.com/astral-sh/ruff/blob/main/AGENTS.md), [uv](https://github.com/astral-sh/uv/blob/main/AGENTS.md), [Biome](https://github.com/biomejs/biome/blob/main/AGENTS.md), [Zed](https://github.com/zed-industries/zed/blob/main/.rules), [Pydantic AI](https://github.com/pydantic/pydantic-ai/blob/main/AGENTS.md), [Taiga UI](https://github.com/taiga-family/taiga-ui/blob/main/AGENTS.md), [Playwright](https://github.com/microsoft/playwright/blob/main/AGENTS.md).
- Older sources:
  - the [Linux kernel patch guide](https://docs.kernel.org/process/submitting-patches.html);
  - the [Ousterhout and Martin discussion](https://github.com/johnousterhout/aposd-vs-clean-code);
  - [Karpathy's notes on LLM coding](https://github.com/forrestchang/andrej-karpathy-skills);
  - [The Grug Brained Developer](https://grugbrain.dev/).

## Contributing

Edit the files in `rules/`. If you change `principles.md` or `ai-agents.md`, run `npm run build` to rebuild the plugin context. Open a pull request as described in [git.md](rules/git.md). When you write a rule:

- Keep it short and checkable. If removing a sentence changes nothing, remove it.
- Describe a trap to avoid, not the layout of some code.
- Write in a calm tone. Words like "CRITICAL" and "MUST" make agents overcorrect.
- Do not add a rule that a formatter or linter already enforces.

## License

[MIT](LICENSE)
