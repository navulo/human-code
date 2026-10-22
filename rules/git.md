# Commits, branches and pull requests

## One change

A change is one branch, one pull request and one squash commit on `main`.

The PR title becomes the commit subject, and the PR description becomes the commit body. Write them as a permanent record. Years later, someone will search the history with only a vague memory of what the change did. Commits inside a branch are working notes. They get squashed, so they need no special format.

A change does one thing. Refactoring, formatting and behavior changes go in separate changes. If the title needs "and", make two changes.

## Title

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

## Description

A small, obvious change needs no description. Otherwise, cover these points in order:

1. The problem and its visible effect.
2. The fix: why you chose this approach, and the decisions the code does not show.
3. How you checked it: what you ran or clicked. Add screenshots for UI changes. Say what you did not check.
4. Limitations, risks and follow-ups, if there are any.

End with a footer such as `Closes #12`, `Refs #34` or `BREAKING CHANGE: ...`.

Write the description as instructions to the code ("make X do Y"), not as a story ("this PR makes...", "I changed..."). It must make sense without opening any link; links only add detail. Do not list the changed files or retell the diff. Do not mention the chat, discarded attempts or the tools you used. To refer to another change, give its 12-character hash and its subject: `a1b2c3d4e5f6 ("fix(sync): retry upload once on 502")`.

Write as described in [writing.md](writing.md), and wrap lines at 72 characters. Add no AI attribution: no `Co-Authored-By: <agent>` trailers and no "Generated with ..." lines.

## Examples

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

## Branches

`main` is the only long-lived branch, and it is always releasable. Every change reaches it through a pull request, never through a direct push. Branches live for days, not weeks.

Name a branch `<type>/<short-description>` in kebab-case, for example `feat/dry-run-flag` or `fix/42-session-refresh`.

## Size

Keep a change under about 400 changed lines, not counting lockfiles and generated code. Split bigger work into a series of changes, and make sure that each one leaves `main` working.

## Before opening a PR

- Bring the branch up to date with `main`.
- Make sure the project's checks pass locally; see [repository.md](repository.md#scripts).
- Read your own diff from top to bottom and check it for the [traps](ai-agents.md#traps), whoever wrote the code.

## Review

Look at the design first. Does this change belong here? Is it more complex than it needs to be? Then check correctness, names and security. The formatter handles style. Be especially strict about over-engineering, which means code that solves problems nobody has yet.

Start each review comment with a prefix that shows its weight: `blocker:`, `suggestion:`, `nit:` or `question:`. Comment on the code, not on the person. Explain why, and suggest an alternative.

## Merging

Squash and merge, and only when CI is green. Then delete the branch.

## Never commit

Never commit secrets, `.env`, build output or `node_modules`. If you commit a secret by mistake, rotate it. Rewriting the history is not enough.
