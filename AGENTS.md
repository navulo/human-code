<!-- Generated from rules/ by `npm run build`. Edit the files in rules/ instead. -->

# human-code

Navulo's rules for AI coding agents, from https://github.com/navulo/human-code. Where they disagree with this project's conventions, follow [When the rules and the project disagree](#when-the-rules-and-the-project-disagree).

## Principles

Code is read far more often than it is written, so we write it for the reader: someone who does not have our context. Often that reader is one of us, half a year later.

When goals conflict, they rank in this order:

1. Clarity. The reader understands what the code does and why.
2. Simplicity. The code reaches its goal in the simplest way that works.
3. Concision. Every line carries information.
4. Consistency. New code looks like the code around it.

### Simplicity

Solve the problem in front of you, not the one you expect later. By the time the later problem arrives, its real shape will be visible. A solution written then will fit it better than a guess written today.

Complexity is cheap to add and expensive to remove, so turn down features, options and abstractions that nobody needs yet. When complexity is necessary, add it on purpose and write down why. If a simple problem has complicated code, rewrite the code.

Fix the cause of a problem, not its symptom.

When choosing how to do something, take the first of these options that is enough. Other files call this list the least mechanism.

1. The way the project already does it.
2. The language or the platform.
3. A dependency the project already has.
4. A few lines of our own code.
5. A new dependency.

### Small changes

A change does one thing. Refactoring, formatting and behavior changes are separate changes; [Commits, branches and pull requests](#one-change) defines what a change is. Every changed line should trace back to the task.

Leave no dead code behind in what you add or edit. If you find dead code elsewhere, report it and remove it in its own change.

### Honest code

Errors surface instead of being hidden; see [Code style](#errors-and-validation). Code does what it claims to do. A function is not a no-op, an implementation is not a stub, and real code paths do not run on fake data.

### When the rules and the project disagree

Conventions come from the project. This covers names, file layout, libraries and patterns. Follow the project even where these rules say otherwise, and mention the difference.

Quality rules apply to every line you add or change, even if the code around it breaks them. This covers the [traps](#traps), comments, error handling and reuse. Do not fix existing code outside your task; report it.

### Open source by default

Write code, comments and commits as if strangers will read them, because they will. Leave out secrets, private links and personal data.

## Working rules for AI agents

Code written by agents goes wrong in predictable ways:

- it adds layers and files;
- it comments every line;
- it guards against things that cannot happen;
- it writes new helpers next to ones that already exist.

This file describes how an agent should work to avoid that. The rules for the code itself are in the other files, and the [traps](#traps) at the end link to them.

### Before writing code

Read the code around the change first, and make no claims about code you have not opened. Look at how the project already solves similar problems, and do it the same way. Before writing a helper, search for an existing one; see [Reuse and duplication](#before-writing-a-helper).

If the task is unclear or can be read more than one way, ask. Do not pick a reading on your own. If you see a simpler approach than the one requested, say so before you implement anything. For anything non-trivial, write a plan of three to five lines first.

### Scope

Change only what the task asks for or clearly requires.

- Fix the cause. If the right fix needs a large refactor, stop and ask. Do not patch around the problem, and do not start the refactor on your own.
- Keep a bug fix as narrow as the reproduced problem.
  - If the bug is in copied code, merge the copies first; see [Reuse and duplication](#consolidate-as-you-go).
  - If you only suspect the same bug elsewhere, report it.
- Review comments do not widen the task. Address what was raised.
- Leave code you did not need to change as it is. Add no comments or types to it. Do not rename, reformat or reorder its imports.
- Report unrelated problems, such as dead code or duplicates. Do not fix them in the same change.
- Remove the imports, variables and functions that your own change left unused.

### Writing code

- Write the least code that solves the task. If 200 lines could be 50, write 50.
- Follow the project's conventions; see [Principles](#when-the-rules-and-the-project-disagree).
- Put new code in existing files. Create a new file only for a new, separate concept.
- Use the project's tools and standard ones. Do not write one-off scripts to get around a problem.
- Do not hardcode values to make a check pass. The code must work for every valid input.
- Do not use deprecated APIs.

### Finishing

Before you report the task as done:

1. Read the whole diff as a strict reviewer would, using the traps below. Fix what you introduced.
2. Delete every added line that the task does not need.
3. Check the comments in the diff; see [Comments](#self-check).
4. Delete the temporary files, scripts and debug output you created.
5. Run the project's checks; see [repository.md](https://github.com/navulo/human-code/blob/main/rules/repository.md#scripts). If one fails, the task is not done. If you could not run one, say so.

Then report in a few lines: what changed, what you reused or added, what you checked and what you did not. Do not overstate the result, and do not retell the diff.

### Claims

Back every claim about the code with a file and line, or with a command you ran. If you are not sure, say so.

### Git and safety

- Commit, push, amend or open a PR only when asked. Then follow [Commits, branches and pull requests](#commits-branches-and-pull-requests).
- Ask before anything destructive or hard to undo: deleting files, `reset --hard`, a force push, dropping data.
- Do not bypass hooks or checks with `--no-verify` or similar flags.

### Traps

These are the mistakes agents make most often. Each group links to the rules that cover it.

Structure ([Architecture](#architecture)):

- An abstraction with a single user: an interface with one implementation, a factory for one type, a base class with one child, a generic used with one type. Write concrete code.
- A function that only forwards a call, such as `const getUser = (id) => api.getUser(id)`. Call `api.getUser` directly.
- Layers added out of habit, such as a controller, a service, a repository and a manager around simple logic.
- Compatibility shims, re-exports and deprecated aliases in code with no outside users. Update the call sites.
- Options and config that nobody asked for. Hardcode the value until it needs to change.

Reuse ([Reuse and duplication](#reuse-and-duplication)):

- Your own version of something that the project, its dependencies or the platform already provides.
- A near-copy of an existing function: `formatDate2`, `parseUserNew`, a second API client.
- A helper for something that happens once.
- The same setup, `try/catch` or fetch-and-parse code repeated in every file.

Code ([Code style](#code-style), [TypeScript](#typescript)):

- Checks for states the types already rule out: null checks on non-null values, `try/catch` around code that cannot throw, `?? []` on required fields.
- Fallbacks that hide failures: `catch { return [] }`, `|| "unknown"`.
- Names like `EnhancedUserManager`, `SmartCache`, `handleProcessData`, `DataHelper`.
- `types.ts`, `constants.ts` or `helpers.ts` next to a 50-line module.
- Ten three-line functions, each called once, that only make sense when read in order.
- Nested ternaries, long `reduce` chains, type-level tricks.
- Logs like `Starting...`, emojis in logs, an error that is logged and then rethrown.
- Types written by hand that repeat a schema or an API type.
- Silenced checks: `as any`, `@ts-ignore`, `eslint-disable`, `--no-verify`.

Text ([Comments](#comments), [Commits, branches and pull requests](#commits-branches-and-pull-requests)):

- Comments that restate the code, narrate its history or address the reviewer.
- A `SUMMARY.md`, an `IMPLEMENTATION_NOTES.md`, or README sections that describe the change. That belongs in the PR description.
- `// TODO: implement`, mock data or `throw new Error("Not implemented")` in delivered code. Finish it, or say that it is not finished.

## Reuse and duplication

Agents rarely look for existing code before they write new code. So a codebase slowly fills with near-duplicates: `formatDate`, `formatDateTime`, `toDisplayDate` and `dateToString`, each one a little different. [GitClear's analysis of commit histories](https://devclass.com/2025/02/20/ai-is-eroding-code-quality-states-new-in-depth-report/) shows the same trend: as coding assistants spread, copy-pasted code grew and moved code shrank.

### Before writing a helper

Search for what the code does, not for the name you would give it: `Intl.NumberFormat`, `currency`, `debounce`, `fetch(`. Look in the order of the [least mechanism](#simplicity):

1. The project itself. Start with the shared modules listed in its `CLAUDE.md` and with the current feature folder.
2. The platform. It already has `structuredClone`, `Intl.DateTimeFormat`, `Intl.NumberFormat`, `URL`, `URLSearchParams`, `AbortController`, `Object.groupBy`, `Array.prototype.toSorted` and `crypto.randomUUID`.
3. The dependencies in `package.json`.

If something fits, use it. If it almost fits, extend it without breaking its callers. Do not write `formatPrice2` next to it.

If nothing fits, put the new code where the next person will look. That is the feature folder when one feature uses it. When several features use it, that is a shared module named after its job, such as `src/lib/money.ts`.

In your report, say which you did: "used `formatMoney` from `src/lib/money.ts`", or "added `parseCsvRow`, because nothing existing handles quoted fields".

### One way per concern

A project has one API client, one logger, one way to format dates and money, and one way to read env. New code uses them. It does not add a second way.

### Two kinds of duplication

Duplicated knowledge is a business rule, a validation, a format, an API contract or a constant that appears twice. It belongs in one place from the second occurrence, because a change to it must reach every copy at the same time.

Similar-looking code is different. Two components can have similar markup, and two handlers can have the same shape. Leave them alone until a third copy appears. The copies may grow apart, and a wrong abstraction costs more than a copy. Code used once stays inline.

### Consolidate as you go

When a change would add a third copy of something, extract it instead and replace the existing copies.

When a bug sits in copied code, the copying is the cause. First merge the copies in a separate `refactor` change, then fix the bug once. Ask before you start a large merge.

If you find duplicates unrelated to your task, put them in your report, not in your change.

### Boilerplate

Sometimes every new endpoint, page or form starts with the same 20 lines of setup. Make that setup a shared function or component, at the latest by the third copy. The same goes for repeated `try/catch` blocks, fetch-and-parse sequences, and loading and error state.

When you copy a module as a starting point, delete everything the new module does not use: props, options, branches, imports and comments.

### Checks

An agent can skip a rule, but it cannot merge past a failing check. So the `lint` script ([repository.md](https://github.com/navulo/human-code/blob/main/rules/repository.md#scripts)) also runs these tools:

- [knip](https://knip.dev), which finds unused files, exports and dependencies;
- [jscpd](https://github.com/kucherenko/jscpd), which finds copy-pasted blocks;
- the ESLint rule `no-restricted-imports`, which keeps one way per concern. For example, it can ban `axios` outside `src/lib/api.ts`.

## Architecture

A new person should find where something lives within a minute and be able to change it without fear. Everything below serves that goal.

### Start flat

Start with the simplest structure that works, usually a few files per feature folder. Add structure when its absence starts to hurt.

Do not start with layers such as controllers, services, repositories and DTOs. Add a layer when the code without it has become hard to change, and write down why.

### Organize by feature

Keep everything about one feature together, in a folder like `src/billing/` or `src/editor/`. Do not split by kind into `src/services/`, `src/models/` and `src/helpers/`.

Code shared between features lives in one known place, split by job: `src/lib/money.ts`, `src/lib/api.ts`. It moves there when a second feature needs it.

### Abstractions

An abstraction earns its place by hiding something: a small interface in front of real work. A wrapper that only renames or forwards a call hides nothing. It only adds a layer to read.

An abstraction also needs more than one user. An interface with one implementation, a factory for one type or a base class with one child is concrete code in disguise. For when to extract shared code, see [Reuse and duplication](#two-kinds-of-duplication).

Name abstractions after the problem (`Invoice`, `Session`, `PriceCalculator`), not after the mechanics (`DataManager`, `BaseHandler`, `AbstractProcessor`).

Use a design pattern only when it makes the code clearly simpler, not because it is the textbook way. This applies to factories, strategies, observers, repositories and DI containers.

Prefer functions and plain objects to classes. A class is worth it when there is state with behavior. Do not use a class as a namespace or as a container for data.

### Data and state

Let data flow visibly: in through arguments, out through return values. Avoid hidden global state and mutable singletons. Do not put an event bus between parts that could call each other directly.

Give each piece of state one source of truth, and derive the rest from it. Do not keep copies in sync.

### Module boundaries

- Dependencies point one way, without cycles.
- A feature uses what another feature exports. It does not reach into that feature's internals.
- Code without outside users needs no compatibility layer. When you change it, update the call sites instead of adding shims, re-exports or deprecated aliases. Published libraries follow [releases.md](https://github.com/navulo/human-code/blob/main/rules/releases.md#deprecation).

### Dependencies

A new package is the last option in the [least mechanism](#simplicity), so it needs a reason: what does it save compared to 20–50 lines of our own code? Prefer small, maintained, widely used packages. Check the last release, the open issues and the license. Commit the lockfile.

### Decisions

Write down decisions that the code does not make obvious. A few lines in the README or in `docs/decisions.md` are enough: the context, the decision and the reason.

### Warning signs

- A simple change touches five or more files.
- A module cannot be described in one sentence.
- A config option only ever has one value.

## Code style

### Formatting

A tool formats the code, never a person. Use Prettier or Biome, and do not merge code that the formatter would change.

Every repository has an `.editorconfig` with these settings: UTF-8, LF line endings, a final newline, no trailing whitespace, and a 2-space indent (4 for Python).

### Naming

A name says what something is or does, not how it works: `activeUsers`, not `filteredArr`. Make a name long enough to be clear, and no longer. A short scope gets a short name (`i`, `user`). A wide scope gets a full one (`pendingInvoiceCount`).

- Booleans read as a yes/no question: `isLoading`, `hasAccess`, `canEdit`.
- Functions are verbs: `loadConfig`, `parseDate`, `sendInvite`. Event handlers are `handleClick`, and callback props are `onClick`.
- Numbers with a unit carry it in the name: `timeoutMs`, `sizeBytes`.
- Do not abbreviate. Universal abbreviations like `id`, `url`, `api` and `db` are fine; `usr`, `cfg` and `btn` are not.
- Some words add no meaning, so do not use them:
  - suffixes: `Data`, `Info`, `Manager`, `Helper`, `Util`, `Wrapper`;
  - adjectives: `Enhanced`, `Smart`, `Advanced`, `New`, `Improved`;
  - file and folder names: `utils`, `helpers`, `common`, `misc`, `core`, `manager`.

Casing:

- `camelCase` for variables, functions and methods;
- `PascalCase` for types, classes and components;
- `SCREAMING_SNAKE_CASE` for true constants and env vars;
- `kebab-case` for files and folders, unless a framework requires otherwise.

### Functions

A function does one thing. If its name needs "and", split it.

Split off a piece when it has its own meaning and a good name, or when something else reuses it. Do not split a function only to make it shorter. A 40-line function that reads from top to bottom is better than six small functions that only make sense together.

- Return early. Put guard clauses first, and keep the main path unindented.
- Use an options object when there are more than three parameters.
- Do not pass booleans that switch behavior. `render(true)` hides its meaning at the call site. Write two functions or use a named option, such as `render({ mode: "preview" })`.
- Prefer pure functions: the same input gives the same output, with no hidden side effects.
- Write an `if` or a loop instead of nested ternaries, long `reduce` chains or one-liner tricks.

### Files

Keep one main concept per file. A file over about 300 lines is a signal to split it, but not a rule.

Small things stay in the file that uses them. Do not create `types.ts`, `constants.ts` or `helpers.ts` next to a small module.

### Errors and validation

Validate data where it enters the system: HTTP, env, files, external APIs, `localStorage`. Inside the system, trust the types. Do not check for states the types rule out.

- Never swallow an error with an empty `catch {}`. Handle the error or let it propagate.
- Do not hide failures behind fallbacks. Do not turn an error or missing data into an empty list, `"unknown"` or another default.
- Use `try/catch` only where you can handle the error, not around code that cannot throw.
- Throw `Error` objects, never strings. Write messages as described in [Writing](#error-messages).

### Logging

Log only what helps debug a real problem: failures and important state changes, with the identifiers needed to find them. Do not log progress messages like `Starting...` or `Done!`.

Log an error once, where it is handled, not at every layer it passes through. Write messages as described in [Writing](#log-messages).

### Magic values

Name the literals in logic: `const MAX_RETRIES = 3`, not `if (retries > 3)`. URLs, limits and keys come from config or env, not from constants spread across files.

### Security

- Keep secrets out of code, commits, logs and error messages. Secrets come from env. `.env` is gitignored, and `.env.example` is committed.
- Never log tokens, passwords or personal data.
- Never build SQL, shell commands or HTML by concatenating user input.

## TypeScript

### Compiler

- Always use `"strict": true`. Also turn on `noUncheckedIndexedAccess`, `noImplicitOverride` and `exactOptionalPropertyTypes` where the project can afford it.
- Use ESM only (`"type": "module"`). New code has no CommonJS.
- The build fails on type errors. Do not use `// @ts-ignore`. Use `// @ts-expect-error` only with a comment that explains why.

### Types

- Do not use `any`. Use `unknown` and narrow it. If bad third-party types make `any` unavoidable, keep it in one place with a comment.
- Do not use non-null assertions (`value!`). Narrow with a check instead.
- Do not use type assertions (`as Foo`) to silence the compiler. They are fine right after runtime validation, and `as const` is always fine. To check that an object matches a type, use `satisfies`.
- Let TypeScript infer the types of local variables. Annotate the parameters and return types of exported functions.
- Keep types simple. Do not use conditional types, deep mapped types or chains of generics where a plain type works. People have to read types too.
- Use `type` by default. Use `interface` only when you need declaration merging or `extends`.
- Do not use `enum`. Use a union of string literals, or an `as const` object:

  ```ts
  type Status = "idle" | "loading" | "error";

  const Role = { Admin: "admin", Member: "member" } as const;
  type Role = (typeof Role)[keyof typeof Role];
  ```

- Model states with a discriminated union, not with several booleans or optional fields that "go together":

  ```ts
  // Good
  type Result = { ok: true; data: User } | { ok: false; error: string };

  // Bad
  type Result = { ok: boolean; data?: User; error?: string };
  ```

- Make every `switch` over a union exhaustive. End it with `const _exhaustive: never = value`.
- Prefer `readonly` for data that should not change.

### Runtime validation

Data from outside is `unknown` until a schema (Zod or Valibot) validates it at the boundary. This covers HTTP, env, files, `JSON.parse` and `localStorage`; see [Code style](#errors-and-validation).

The schema is the source of truth. Derive the type from it with `z.infer<typeof Schema>`. Do not write the schema and the type separately by hand. Treat API types the same way: generate them or import them.

### Modules

- Use named exports only. Use `export default` only where a framework requires it, such as for Next.js pages.
- Apps have no barrel files (`index.ts` files that re-export everything). Import from the module itself. A library can have one public entry point.
- Use `import type` for type-only imports.
- Use the `@/` alias for the source root instead of `../../../`.

### Async

- Use `async/await`, not `.then()` chains.
- Await every promise, return it or mark it with `void`. Do not leave a promise floating.
- Run independent async work in parallel with `Promise.all`, not one by one in a `for ... await` loop.

### Small things

- Always use `===`.
- Use `??` instead of `||` for defaults when `0` or `""` are valid values.
- Use `const` by default and `let` only when you reassign. Never use `var`.

## Comments

Assume the reader sees only the code as it is now. They do not see the chat, the task, the pull request or the diff. A comment exists to tell that reader what the code itself cannot. That is almost always *why*, not *what*.

So the default is no comment. Before you write one, try these first:

- a better name;
- a well-named function or constant;
- simpler code.

Write the comment only if the reason is still not visible.

### Doc comments and inline comments

A doc comment (`/** */`) sits above an exported function or type and describes its contract: what it does, what it returns, when it throws, and anything surprising. It does not describe how the function works. Write one only for a public API or a module boundary, and only when the name and the types do not already say it.

An inline comment (`//`) explains why the code is written the way it is. Typical reasons:

- The obvious approach does not work here.
  `// Sort before dedupe: the API returns duplicates out of order.`
- A library bug, an API quirk or browser behavior forces a workaround. Link the public issue. Without the link, a workaround looks like a mistake, and nobody can tell when it is safe to remove.
  `// Safari fires "resize" before layout settles: https://bugs.webkit.org/...`
- The next editor could easily break something.
  `// Must run before rateLimit(): it reads the user set by auth.`
- A regex or an algorithm is hard to read. One line on what it does is enough.

If a workaround needs a paragraph of justification, change the code instead.

### What not to write

- What the next line does: `// Get the user` above `getUser()`.
- Section banners and step labels, like `// ===== Helpers =====` or `// Step 1: validate input`. If a file needs banners, split it.
- History: "now", "previously", "no longer", "new approach", "changed from", "fixed bug with". Git keeps the history.
- Notes to the reviewer: "this correctly handles", "as requested", "this ensures that".
- Traces of the chat or the task: "per the task", "as discussed", "AI:", "agent:", earlier attempts.
- Vague wording like "handles edge cases" or "for various reasons"; see the [banned words](#banned-words). Name the cases or drop the sentence.
- Doc comments that repeat the name or the types, such as `/** Compiles the styles. */` or `@param id - the id`.
- File headers with an author, a date or a summary of the obvious.
- Commented-out code.
- A `TODO` without an issue. Write `// TODO(#42): remove after migration`.
- A lint-disable without a reason. Write `// eslint-disable-next-line no-console -- CLI output`.

### Editing existing code

When you move or refactor code, keep its useful comments. If the behavior changes, correct the specific sentence. Do not replace it with something generic. If your change makes a comment false, fix the comment in the same change.

If the code around you is full of comments that restate it, do not copy the habit. Do not delete those comments outside your task either.

### Style

Keep comments plain and short; see [Writing](#writing). One line is normal, and three lines is a lot. Put the comment above the code it explains, not at the end of a long line.

### Self-check

Before you finish, read the comments in your diff on their own, without the code. Ask these questions about each comment:

1. Does it say something the code does not?
2. Does it mention the change, the chat or the reviewer?
3. If it describes a workaround, does it link the issue?
4. Would it make sense to someone who never saw the diff?

Fix or delete every comment that fails. When in doubt, delete it: a missing comment costs less than a misleading one.

### Example

This version comments the obvious and leaks the history of the change:

```ts
/**
 * Fetches the user profile.
 * @param userId - The ID of the user
 * @returns The user profile
 */
async function fetchProfile(userId: string): Promise<Profile> {
  // Make the API request (now using v2 as requested)
  const response = await api.get(`/v2/users/${userId}`);
  // Return the profile data
  return response.data;
}
```

This version keeps the one fact the code cannot show:

```ts
async function fetchProfile(userId: string): Promise<Profile> {
  // v1 drops `avatarUrl` for users created before 2023: https://github.com/acme/api/issues/311
  const response = await api.get(`/v2/users/${userId}`);
  return response.data;
}
```

## Writing

These rules cover everything people read: commit messages, PR descriptions, docs, error messages, logs and comments.

### Language

Code, comments, commits, PRs, issues and docs are in English. User-facing text can be in any language. It lives in translation files, not in the logic.

### Style

Follow the spirit of Simplified Technical English (ASD-STE100):

- short sentences;
- the active voice and simple tenses;
- one idea per sentence;
- one name for each thing.

Be specific. Use the real names of functions, files and commands, and real numbers. "Fix crash when the config file is empty" says something. "Improve stability" does not.

Start with the problem or the visible behavior, then explain the implementation. Assume the reader has none of your context.

Describe the result, not how you got there. Leave out discarded attempts, intermediate edits, the tools you used and the chat. Say what you checked and what you did not. "Should work" is not a result.

Cut every sentence whose removal changes nothing. Do not repeat what the code or the diff already shows.

Keep the tone neutral. Use no hype, exclamation marks, apologies or emojis. Use lists for steps and enumerations, and prose for reasoning. Skip headings in short texts.

Some sentence shapes mark text as machine-written. Avoid them:

- announcing a point instead of making it: "Here's the thing", "The key insight is";
- a verbless fragment as an opener: "One caution." or "The fix.";
- a label, a colon, then the content: "The honest answer: ...". Write a plain sentence instead;
- "not X, but Y" as a habit, when nothing actually competes with Y;
- a closing sentence that only repeats what was already said.

### Banned words

These words add nothing:

- hype: powerful, seamless, robust, comprehensive, enhanced, cutting-edge, blazing fast, elegant, world-class, effortless;
- inflated verbs: leverage, utilize, facilitate, empower, streamline (write "use", "help" or "let");
- filler: "it's worth noting that", "in order to", "basically", "this ensures that", "simply", "just";
- vague hedging: "various", "some cases", "edge cases", "etc." (name the cases or drop the sentence).

### Error messages

An error message says what failed and with which input. If the fix is known, it says what to do.

- Bad: `Error: invalid config`
- Good: `Config file ~/.navulo.json is not valid JSON: unexpected "}" at line 3`

### Log messages

A log message says what happened and includes the identifiers needed to find it: `payment 8f3a declined by provider: insufficient_funds`. Do not write `Processing payment...` or `Successfully done!`.

## Commits, branches and pull requests

### One change

A change is one branch, one pull request and one squash commit on `main`.

The PR title becomes the commit subject, and the PR description becomes the commit body. Write them as a permanent record. Years later, someone will search the history with only a vague memory of what the change did. Commits inside a branch are working notes. They get squashed, so they need no special format.

A change does one thing. Refactoring, formatting and behavior changes go in separate changes. If the title needs "and", make two changes.

### Title

The title follows [Conventional Commits](https://www.conventionalcommits.org/): `<type>(<scope>): <subject>`.

Write the subject in the imperative mood, so that it completes the sentence "If applied, this change will ...". Write `add`, `fix` and `remove`, not `added`, `fixes` and `removing`. Start it with a lowercase letter, end it without a period, and keep the whole title under 72 characters. Someone skimming `git log --oneline` should understand what the change did from the title alone.

The scope is optional. It is one lowercase word for the area of the code, such as `auth`, `export` or `cli`.

| Type | Use for |
| --- | --- |
| `feat` | New functionality |
| `fix` | A bug fix |
| `perf` | A performance improvement |
| `refactor` | A code change that neither fixes a bug nor adds a feature |
| `docs` | Documentation only |
| `style` | Formatting only |
| `build` | The build system, dependencies, package config |
| `ci` | CI configuration |
| `chore` | Anything else outside the source code |
| `revert` | Reverting an earlier change |

A breaking change gets a `!` after the type or scope. It also gets a `BREAKING CHANGE:` footer that explains how to migrate.

### Description

A small, obvious change needs no description. Otherwise, cover these points in order:

1. The problem and its visible effect.
2. The fix: why you chose this approach, and the decisions the code does not show.
3. How you checked it: what you ran or clicked. Add screenshots for UI changes. Say what you did not check.
4. Limitations, risks and follow-ups, if there are any.

End with a footer such as `Closes #12`, `Refs #34` or `BREAKING CHANGE: ...`.

Write the description as instructions to the code ("make X do Y"), not as a story ("this PR makes...", "I changed..."). It must make sense without opening any link; links only add detail. Do not list the changed files or retell the diff. Do not mention the chat, discarded attempts or the tools you used. To refer to another change, give its 12-character hash and its subject: `a1b2c3d4e5f6 ("fix(sync): retry upload once on 502")`.

Write as described in [Writing](#writing), and wrap lines at 72 characters. Add no AI attribution: no `Co-Authored-By: <agent>` trailers and no "Generated with ..." lines.

### Examples

```
fix(parser): handle empty lines at end of file
```

```
fix(sync): retry upload once on 502 from storage

The storage API returns 502 for a few seconds during its deploys,
which failed whole sync runs. Retry once after 2 s: this covers every
case in the logs, and more retries would only delay real outages.

Checked by replaying the failed runs from the logs against a local
stub that returns 502 twice.
```

```
feat(api)!: rename `getUser` to `fetchUser`

BREAKING CHANGE: `getUser` is removed. Call `fetchUser` instead. It
takes the same arguments and returns a Promise.
```

And titles to avoid:

```
fix bug                          # what bug? what was done?
update                           # says nothing
feat: Added new Button.          # past tense, capital letter, period
refactor: phase 1                # meaningless without context
chore: move code from A to B     # what for?
feat(auth): add login, fix header and bump deps   # three changes
```

### Branches

`main` is the only long-lived branch, and it is always releasable. Every change reaches it through a pull request, never through a direct push. Branches live for days, not weeks.

Name a branch `<type>/<short-description>` in kebab-case, for example `feat/dry-run-flag` or `fix/42-session-refresh`.

### Size

Keep a change under about 400 changed lines, not counting lockfiles and generated code. Split bigger work into a series of changes, and make sure that each one leaves `main` working.

### Before opening a PR

- Bring the branch up to date with `main`.
- Make sure the project's checks pass locally; see [repository.md](https://github.com/navulo/human-code/blob/main/rules/repository.md#scripts).
- Read your own diff from top to bottom and check it for the [traps](#traps), whoever wrote the code.

### Review

Look at the design first. Does this change belong here? Is it more complex than it needs to be? Then check correctness, names and security. The formatter handles style. Be especially strict about over-engineering, which means code that solves problems nobody has yet.

Start each review comment with a prefix that shows its weight: `blocker:`, `suggestion:`, `nit:` or `question:`. Comment on the code, not on the person. Explain why, and suggest an alternative.

### Merging

Squash and merge, and only when CI is green. Then delete the branch.

### Never commit

Never commit secrets, `.env`, build output or `node_modules`. If you commit a secret by mistake, rotate it. Rewriting the history is not enough.
