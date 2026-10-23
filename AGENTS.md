# human-code

The rules live in `rules/`, and this repository follows them too. Before changing anything, read `rules/principles.md` and `rules/ai-agents.md`. They link to the other rule files.

## Working on this repository

- `hooks/session-start.md` is generated from `rules/principles.md` and `rules/ai-agents.md` for the Claude Code plugin. After editing either file, run `npm run build`.
- `npm run lint` checks the links between files, that `hooks/session-start.md` is current, and that it fits the 10,000-character limit of the plugin hook. CI runs it on every PR.
- Before adding a rule, read the "Contributing" section of `README.md`.
