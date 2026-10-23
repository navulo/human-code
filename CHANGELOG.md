# Changelog

All notable changes to the rules are listed here, newest first. The format follows [Keep a Changelog](https://keepachangelog.com/).

## [0.2.0] - 2026-10-23

### Changed

- The rules are copied into each repository as a folder, `.agents/human-code/`, instead of one generated `AGENTS.md`. Links between the rule files work inside your repository, and agents load only `principles.md` and `ai-agents.md` up front. The README shows the install commands and the lines to add to `AGENTS.md` and `CLAUDE.md`.

### Removed

- The generated `AGENTS.md` with all the rules in one file. Its links to `repository.md` and `releases.md` pointed to GitHub, where agents do not follow them.

## [0.1.0] - 2026-10-22

### Added

- Rules for AI coding agents in eleven files: principles, the agent's working process, reuse, architecture, code style, TypeScript, comments, writing, git, repositories and releases.
- `AGENTS.md`, which puts the nine files that agents need into one document for Codex, Cursor, Copilot and other agents that read it.
- A Claude Code plugin. It loads the principles and the agent's working process into every session, and the agent opens the other rule files when a task needs them.
