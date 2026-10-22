# Code style

## Formatting

A tool formats the code, never a person. Use Prettier or Biome, and do not merge code that the formatter would change.

Every repository has an `.editorconfig` with these settings: UTF-8, LF line endings, a final newline, no trailing whitespace, and a 2-space indent (4 for Python).

## Naming

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

## Functions

A function does one thing. If its name needs "and", split it.

Split off a piece when it has its own meaning and a good name, or when something else reuses it. Do not split a function only to make it shorter. A 40-line function that reads from top to bottom is better than six small functions that only make sense together.

- Return early. Put guard clauses first, and keep the main path unindented.
- Use an options object when there are more than three parameters.
- Do not pass booleans that switch behavior. `render(true)` hides its meaning at the call site. Write two functions or use a named option, such as `render({ mode: "preview" })`.
- Prefer pure functions: the same input gives the same output, with no hidden side effects.
- Write an `if` or a loop instead of nested ternaries, long `reduce` chains or one-liner tricks.

## Files

Keep one main concept per file. A file over about 300 lines is a signal to split it, but not a rule.

Small things stay in the file that uses them. Do not create `types.ts`, `constants.ts` or `helpers.ts` next to a small module.

## Errors and validation

Validate data where it enters the system: HTTP, env, files, external APIs, `localStorage`. Inside the system, trust the types. Do not check for states the types rule out.

- Never swallow an error with an empty `catch {}`. Handle the error or let it propagate.
- Do not hide failures behind fallbacks. Do not turn an error or missing data into an empty list, `"unknown"` or another default.
- Use `try/catch` only where you can handle the error, not around code that cannot throw.
- Throw `Error` objects, never strings. Write messages as described in [writing.md](writing.md#error-messages).

## Logging

Log only what helps debug a real problem: failures and important state changes, with the identifiers needed to find them. Do not log progress messages like `Starting...` or `Done!`.

Log an error once, where it is handled, not at every layer it passes through. Write messages as described in [writing.md](writing.md#log-messages).

## Magic values

Name the literals in logic: `const MAX_RETRIES = 3`, not `if (retries > 3)`. URLs, limits and keys come from config or env, not from constants spread across files.

## Security

- Keep secrets out of code, commits, logs and error messages. Secrets come from env. `.env` is gitignored, and `.env.example` is committed.
- Never log tokens, passwords or personal data.
- Never build SQL, shell commands or HTML by concatenating user input.
