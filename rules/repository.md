# Repository checklist

## Files

Every repository has these files:

- [ ] `README.md`, which says what the project is, why it exists, and how to install, run and develop it. A stranger can go from clone to a running project in five minutes.
- [ ] `LICENSE`. Use MIT, unless the project has a reason to use another license.
- [ ] `.gitignore`, which covers `node_modules/`, build output, `.env*` (except `.env.example`), and OS and editor files.
- [ ] `.editorconfig`.
- [ ] `.env.example`, which lists every env variable the project reads, with a comment and a safe example value for each.
- [ ] `CHANGELOG.md`, for anything that gets released or published. See [releases.md](releases.md).
- [ ] `CLAUDE.md`, with short notes for AI agents: how to run and check the project, what is not obvious, and the shared modules with one line each (`src/lib/api.ts`: the only API client). It imports these rules instead of copying them.

## Scripts

Every project has the same commands, so anyone can work in any repository without reading its docs first.

| Command | What it does |
| --- | --- |
| `dev` | Runs the project locally in watch mode |
| `build` | Makes a production build |
| `lint` | Runs the linter, the formatter check, and the checks for unused code and duplicates ([reuse.md](reuse.md#checks)) |
| `typecheck` | Checks types without emitting code |
| `format` | Formats all files |

## CI

CI runs `lint`, `typecheck` and `build` on every PR and on every push to `main`. All three must pass before a merge.

## GitHub settings

- The default branch is `main`, and direct pushes to it are disabled.
- Only squash merge is enabled. The squash commit message is the PR title and description. Branches are deleted after the merge.
- The repository has a description and topics.
- Dependabot or Renovate is on, for dependency and security updates.
