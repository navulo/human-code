# Principles

Code is read far more often than it is written, so we write it for the reader: someone who does not have our context. Often that reader is one of us, half a year later.

When goals conflict, they rank in this order:

1. Clarity. The reader understands what the code does and why.
2. Simplicity. The code reaches its goal in the simplest way that works.
3. Concision. Every line carries information.
4. Consistency. New code looks like the code around it.

## Simplicity

Solve the problem in front of you, not the one you expect later. By the time the later problem arrives, its real shape will be visible. A solution written then will fit it better than a guess written today.

Complexity is cheap to add and expensive to remove, so turn down features, options and abstractions that nobody needs yet. When complexity is necessary, add it on purpose and write down why. If a simple problem has complicated code, rewrite the code.

Fix the cause of a problem, not its symptom.

When choosing how to do something, take the first of these options that is enough. Other files call this list the least mechanism.

1. The way the project already does it.
2. The language or the platform.
3. A dependency the project already has.
4. A few lines of our own code.
5. A new dependency.

## Small changes

A change does one thing. Refactoring, formatting and behavior changes are separate changes; [git.md](git.md#one-change) defines what a change is. Every changed line should trace back to the task.

Leave no dead code behind in what you add or edit. If you find dead code elsewhere, report it and remove it in its own change.

## Honest code

Errors surface instead of being hidden; see [code-style.md](code-style.md#errors-and-validation). Code does what it claims to do. A function is not a no-op, an implementation is not a stub, and real code paths do not run on fake data.

## When the rules and the project disagree

Conventions come from the project. This covers names, file layout, libraries and patterns. Follow the project even where these rules say otherwise, and mention the difference.

Quality rules apply to every line you add or change, even if the code around it breaks them. This covers the [traps](ai-agents.md#traps), comments, error handling and reuse. Do not fix existing code outside your task; report it.

## Open source by default

Write code, comments and commits as if strangers will read them, because they will. Leave out secrets, private links and personal data.
