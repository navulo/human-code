# Working rules for AI agents

Code written by agents goes wrong in predictable ways:

- it adds layers and files;
- it comments every line;
- it guards against things that cannot happen;
- it writes new helpers next to ones that already exist.

This file describes how an agent should work to avoid that. The rules for the code itself are in the other files, and the [traps](#traps) at the end link to them.

## Before writing code

Read the code around the change first, and make no claims about code you have not opened. Look at how the project already solves similar problems, and do it the same way. Before writing a helper, search for an existing one; see [reuse.md](reuse.md#before-writing-a-helper).

If the task is unclear or can be read more than one way, ask. Do not pick a reading on your own. If you see a simpler approach than the one requested, say so before you implement anything. For anything non-trivial, write a plan of three to five lines first.

## Scope

Change only what the task asks for or clearly requires.

- Fix the cause. If the right fix needs a large refactor, stop and ask. Do not patch around the problem, and do not start the refactor on your own.
- Keep a bug fix as narrow as the reproduced problem.
  - If the bug is in copied code, merge the copies first; see [reuse.md](reuse.md#consolidate-as-you-go).
  - If you only suspect the same bug elsewhere, report it.
- Review comments do not widen the task. Address what was raised.
- Leave code you did not need to change as it is. Add no comments or types to it. Do not rename, reformat or reorder its imports.
- Report unrelated problems, such as dead code or duplicates. Do not fix them in the same change.
- Remove the imports, variables and functions that your own change left unused.

## Writing code

- Write the least code that solves the task. If 200 lines could be 50, write 50.
- Follow the project's conventions; see [principles.md](principles.md#when-the-rules-and-the-project-disagree).
- Put new code in existing files. Create a new file only for a new, separate concept.
- Use the project's tools and standard ones. Do not write one-off scripts to get around a problem.
- Do not hardcode values to make a check pass. The code must work for every valid input.
- Do not use deprecated APIs.

## Finishing

Before you report the task as done:

1. Read the whole diff as a strict reviewer would, using the traps below. Fix what you introduced.
2. Delete every added line that the task does not need.
3. Check the comments in the diff; see [comments.md](comments.md#self-check).
4. Delete the temporary files, scripts and debug output you created.
5. Run the project's checks; see [repository.md](repository.md#scripts). If one fails, the task is not done. If you could not run one, say so.

Then report in a few lines: what changed, what you reused or added, what you checked and what you did not. Do not overstate the result, and do not retell the diff.

## Claims

Back every claim about the code with a file and line, or with a command you ran. If you are not sure, say so.

## Git and safety

- Commit, push, amend or open a PR only when asked. Then follow [git.md](git.md).
- Ask before anything destructive or hard to undo: deleting files, `reset --hard`, a force push, dropping data.
- Do not bypass hooks or checks with `--no-verify` or similar flags.

## Traps

These are the mistakes agents make most often. Each group links to the rules that cover it.

Structure ([architecture.md](architecture.md)):

- An abstraction with a single user: an interface with one implementation, a factory for one type, a base class with one child, a generic used with one type. Write concrete code.
- A function that only forwards a call, such as `const getUser = (id) => api.getUser(id)`. Call `api.getUser` directly.
- Layers added out of habit, such as a controller, a service, a repository and a manager around simple logic.
- Compatibility shims, re-exports and deprecated aliases in code with no outside users. Update the call sites.
- Options and config that nobody asked for. Hardcode the value until it needs to change.

Reuse ([reuse.md](reuse.md)):

- Your own version of something that the project, its dependencies or the platform already provides.
- A near-copy of an existing function: `formatDate2`, `parseUserNew`, a second API client.
- A helper for something that happens once.
- The same setup, `try/catch` or fetch-and-parse code repeated in every file.

Code ([code-style.md](code-style.md), [typescript.md](typescript.md)):

- Checks for states the types already rule out: null checks on non-null values, `try/catch` around code that cannot throw, `?? []` on required fields.
- Fallbacks that hide failures: `catch { return [] }`, `|| "unknown"`.
- Names like `EnhancedUserManager`, `SmartCache`, `handleProcessData`, `DataHelper`.
- `types.ts`, `constants.ts` or `helpers.ts` next to a 50-line module.
- Ten three-line functions, each called once, that only make sense when read in order.
- Nested ternaries, long `reduce` chains, type-level tricks.
- Logs like `Starting...`, emojis in logs, an error that is logged and then rethrown.
- Types written by hand that repeat a schema or an API type.
- Silenced checks: `as any`, `@ts-ignore`, `eslint-disable`, `--no-verify`.

Text ([comments.md](comments.md), [git.md](git.md)):

- Comments that restate the code, narrate its history or address the reviewer.
- A `SUMMARY.md`, an `IMPLEMENTATION_NOTES.md`, or README sections that describe the change. That belongs in the PR description.
- `// TODO: implement`, mock data or `throw new Error("Not implemented")` in delivered code. Finish it, or say that it is not finished.
