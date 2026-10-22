# human-code

This repository holds the rules. They apply to work on the repository itself too:

@AGENTS.md

## Working on this repository

- The rules live in `rules/`. `AGENTS.md` is generated from them: edit `rules/`, then run `npm run build`.
- `npm run lint` checks the links between files and that `AGENTS.md` is up to date. CI runs it on every PR.
- `repository.md` and `releases.md` are not part of `AGENTS.md`. Links to them become links to GitHub.
- Before adding a rule, read the "Contributing" section of `README.md`.
