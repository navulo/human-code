# Reuse and duplication

Agents rarely look for existing code before they write new code. So a codebase slowly fills with near-duplicates: `formatDate`, `formatDateTime`, `toDisplayDate` and `dateToString`, each one a little different. [GitClear's analysis of commit histories](https://devclass.com/2025/02/20/ai-is-eroding-code-quality-states-new-in-depth-report/) shows the same trend: as coding assistants spread, copy-pasted code grew and moved code shrank.

## Before writing a helper

Search for what the code does, not for the name you would give it: `Intl.NumberFormat`, `currency`, `debounce`, `fetch(`. Look in the order of the [least mechanism](principles.md#simplicity):

1. The project itself. Start with the shared modules listed in its `AGENTS.md` and with the current feature folder.
2. The platform. It already has `structuredClone`, `Intl.DateTimeFormat`, `Intl.NumberFormat`, `URL`, `URLSearchParams`, `AbortController`, `Object.groupBy`, `Array.prototype.toSorted` and `crypto.randomUUID`.
3. The dependencies in `package.json`.

If something fits, use it. If it almost fits, extend it without breaking its callers. Do not write `formatPrice2` next to it.

If nothing fits, put the new code where the next person will look. That is the feature folder when one feature uses it. When several features use it, that is a shared module named after its job, such as `src/lib/money.ts`.

In your report, say which you did: "used `formatMoney` from `src/lib/money.ts`", or "added `parseCsvRow`, because nothing existing handles quoted fields".

## One way per concern

A project has one API client, one logger, one way to format dates and money, and one way to read env. New code uses them. It does not add a second way.

## Two kinds of duplication

Duplicated knowledge is a business rule, a validation, a format, an API contract or a constant that appears twice. It belongs in one place from the second occurrence, because a change to it must reach every copy at the same time.

Similar-looking code is different. Two components can have similar markup, and two handlers can have the same shape. Leave them alone until a third copy appears. The copies may grow apart, and a wrong abstraction costs more than a copy. Code used once stays inline.

## Consolidate as you go

When a change would add a third copy of something, extract it instead and replace the existing copies.

When a bug sits in copied code, the copying is the cause. First merge the copies in a separate `refactor` change, then fix the bug once. Ask before you start a large merge.

If you find duplicates unrelated to your task, put them in your report, not in your change.

## Boilerplate

Sometimes every new endpoint, page or form starts with the same 20 lines of setup. Make that setup a shared function or component, at the latest by the third copy. The same goes for repeated `try/catch` blocks, fetch-and-parse sequences, and loading and error state.

When you copy a module as a starting point, delete everything the new module does not use: props, options, branches, imports and comments.

## Checks

An agent can skip a rule, but it cannot merge past a failing check. So the `lint` script ([repository.md](repository.md#scripts)) also runs these tools:

- [knip](https://knip.dev), which finds unused files, exports and dependencies;
- [jscpd](https://github.com/kucherenko/jscpd), which finds copy-pasted blocks;
- the ESLint rule `no-restricted-imports`, which keeps one way per concern. For example, it can ban `axios` outside `src/lib/api.ts`.
