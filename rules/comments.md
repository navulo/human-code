# Comments

Assume the reader sees only the code as it is now. They do not see the chat, the task, the pull request or the diff. A comment exists to tell that reader what the code itself cannot. That is almost always *why*, not *what*.

So the default is no comment. Before you write one, try these first:

- a better name;
- a well-named function or constant;
- simpler code.

Write the comment only if the reason is still not visible.

## Doc comments and inline comments

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

## What not to write

- What the next line does: `// Get the user` above `getUser()`.
- Section banners and step labels, like `// ===== Helpers =====` or `// Step 1: validate input`. If a file needs banners, split it.
- History: "now", "previously", "no longer", "new approach", "changed from", "fixed bug with". Git keeps the history.
- Notes to the reviewer: "this correctly handles", "as requested", "this ensures that".
- Traces of the chat or the task: "per the task", "as discussed", "AI:", "agent:", earlier attempts.
- Vague wording like "handles edge cases" or "for various reasons"; see the [banned words](writing.md#banned-words). Name the cases or drop the sentence.
- Doc comments that repeat the name or the types, such as `/** Compiles the styles. */` or `@param id - the id`.
- File headers with an author, a date or a summary of the obvious.
- Commented-out code.
- A `TODO` without an issue. Write `// TODO(#42): remove after migration`.
- A lint-disable without a reason. Write `// eslint-disable-next-line no-console -- CLI output`.

## Editing existing code

When you move or refactor code, keep its useful comments. If the behavior changes, correct the specific sentence. Do not replace it with something generic. If your change makes a comment false, fix the comment in the same change.

If the code around you is full of comments that restate it, do not copy the habit. Do not delete those comments outside your task either.

## Style

Keep comments plain and short; see [writing.md](writing.md). One line is normal, and three lines is a lot. Put the comment above the code it explains, not at the end of a long line.

## Self-check

Before you finish, read the comments in your diff on their own, without the code. Ask these questions about each comment:

1. Does it say something the code does not?
2. Does it mention the change, the chat or the reviewer?
3. If it describes a workaround, does it link the issue?
4. Would it make sense to someone who never saw the diff?

Fix or delete every comment that fails. When in doubt, delete it: a missing comment costs less than a misleading one.

## Example

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
