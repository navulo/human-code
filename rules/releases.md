# Releases

## Versioning

We follow [Semantic Versioning](https://semver.org/): `MAJOR.MINOR.PATCH`.

- `PATCH` covers bug fixes only (`fix`, `perf`).
- `MINOR` covers new features that do not break anything (`feat`).
- `MAJOR` covers breaking changes (`!` and `BREAKING CHANGE`).

Before `1.0.0`, the public API is not stable, and breaking changes bump `MINOR`. Changes follow [Conventional Commits](git.md#title), so the next version can be derived from the history automatically.

## Changelog

Keep `CHANGELOG.md` in the [Keep a Changelog](https://keepachangelog.com/) format, with the newest version on top. Write it for users: what changed for them, not which files moved. Use the sections `Added`, `Changed`, `Deprecated`, `Removed`, `Fixed` and `Security`. You can generate the changelog from the history, but a person reads and edits it before the release.

## Releasing

1. Merge all changes for the release into `main`, and wait for CI to pass.
2. Update `CHANGELOG.md` and the version in one change: `chore(release): v1.4.0`.
3. Tag it with an annotated tag that starts with `v`: `v1.4.0`.
4. Create a GitHub Release from the tag, and use the changelog section as the release notes.
5. Publish to npm or deploy from CI on the tag, not from a local machine.

## Deprecation

Before you remove something public, mark it as deprecated for at least one `MINOR` release. The deprecation message says what to use instead.
