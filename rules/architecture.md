# Architecture

A new person should find where something lives within a minute and be able to change it without fear. Everything below serves that goal.

## Start flat

Start with the simplest structure that works, usually a few files per feature folder. Add structure when its absence starts to hurt.

Do not start with layers such as controllers, services, repositories and DTOs. Add a layer when the code without it has become hard to change, and write down why.

## Organize by feature

Keep everything about one feature together, in a folder like `src/billing/` or `src/editor/`. Do not split by kind into `src/services/`, `src/models/` and `src/helpers/`.

Code shared between features lives in one known place, split by job: `src/lib/money.ts`, `src/lib/api.ts`. It moves there when a second feature needs it.

## Abstractions

An abstraction earns its place by hiding something: a small interface in front of real work. A wrapper that only renames or forwards a call hides nothing. It only adds a layer to read.

An abstraction also needs more than one user. An interface with one implementation, a factory for one type or a base class with one child is concrete code in disguise. For when to extract shared code, see [reuse.md](reuse.md#two-kinds-of-duplication).

Name abstractions after the problem (`Invoice`, `Session`, `PriceCalculator`), not after the mechanics (`DataManager`, `BaseHandler`, `AbstractProcessor`).

Use a design pattern only when it makes the code clearly simpler, not because it is the textbook way. This applies to factories, strategies, observers, repositories and DI containers.

Prefer functions and plain objects to classes. A class is worth it when there is state with behavior. Do not use a class as a namespace or as a container for data.

## Data and state

Let data flow visibly: in through arguments, out through return values. Avoid hidden global state and mutable singletons. Do not put an event bus between parts that could call each other directly.

Give each piece of state one source of truth, and derive the rest from it. Do not keep copies in sync.

## Module boundaries

- Dependencies point one way, without cycles.
- A feature uses what another feature exports. It does not reach into that feature's internals.
- Code without outside users needs no compatibility layer. When you change it, update the call sites instead of adding shims, re-exports or deprecated aliases. Published libraries follow [releases.md](releases.md#deprecation).

## Dependencies

A new package is the last option in the [least mechanism](principles.md#simplicity), so it needs a reason: what does it save compared to 20–50 lines of our own code? Prefer small, maintained, widely used packages. Check the last release, the open issues and the license. Commit the lockfile.

## Decisions

Write down decisions that the code does not make obvious. A few lines in the README or in `docs/decisions.md` are enough: the context, the decision and the reason.

## Warning signs

- A simple change touches five or more files.
- A module cannot be described in one sentence.
- A config option only ever has one value.
