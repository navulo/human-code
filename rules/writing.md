# Writing

These rules cover everything people read: commit messages, PR descriptions, docs, error messages, logs and comments.

## Language

Code, comments, commits, PRs, issues and docs are in English. User-facing text can be in any language. It lives in translation files, not in the logic.

## Style

Follow the spirit of Simplified Technical English (ASD-STE100):

- short sentences;
- the active voice and simple tenses;
- one idea per sentence;
- one name for each thing.

Be specific. Use the real names of functions, files and commands, and real numbers. "Fix crash when the config file is empty" says something. "Improve stability" does not.

Start with the problem or the visible behavior, then explain the implementation. Assume the reader has none of your context.

Describe the result, not how you got there. Leave out discarded attempts, intermediate edits, the tools you used and the chat. Say what you checked and what you did not. "Should work" is not a result.

Cut every sentence whose removal changes nothing. Do not repeat what the code or the diff already shows.

Keep the tone neutral. Use no hype, exclamation marks, apologies or emojis. Use lists for steps and enumerations, and prose for reasoning. Skip headings in short texts.

Some sentence shapes mark text as machine-written. Avoid them:

- announcing a point instead of making it: "Here's the thing", "The key insight is";
- a verbless fragment as an opener: "One caution." or "The fix.";
- a label, a colon, then the content: "The honest answer: ...". Write a plain sentence instead;
- "not X, but Y" as a habit, when nothing actually competes with Y;
- a closing sentence that only repeats what was already said.

## Banned words

These words add nothing:

- hype: powerful, seamless, robust, comprehensive, enhanced, cutting-edge, blazing fast, elegant, world-class, effortless;
- inflated verbs: leverage, utilize, facilitate, empower, streamline (write "use", "help" or "let");
- filler: "it's worth noting that", "in order to", "basically", "this ensures that", "simply", "just";
- vague hedging: "various", "some cases", "edge cases", "etc." (name the cases or drop the sentence).

## Error messages

An error message says what failed and with which input. If the fix is known, it says what to do.

- Bad: `Error: invalid config`
- Good: `Config file ~/.navulo.json is not valid JSON: unexpected "}" at line 3`

## Log messages

A log message says what happened and includes the identifiers needed to find it: `payment 8f3a declined by provider: insufficient_funds`. Do not write `Processing payment...` or `Successfully done!`.
