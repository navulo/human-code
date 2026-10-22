# TypeScript

## Compiler

- Always use `"strict": true`. Also turn on `noUncheckedIndexedAccess`, `noImplicitOverride` and `exactOptionalPropertyTypes` where the project can afford it.
- Use ESM only (`"type": "module"`). New code has no CommonJS.
- The build fails on type errors. Do not use `// @ts-ignore`. Use `// @ts-expect-error` only with a comment that explains why.

## Types

- Do not use `any`. Use `unknown` and narrow it. If bad third-party types make `any` unavoidable, keep it in one place with a comment.
- Do not use non-null assertions (`value!`). Narrow with a check instead.
- Do not use type assertions (`as Foo`) to silence the compiler. They are fine right after runtime validation, and `as const` is always fine. To check that an object matches a type, use `satisfies`.
- Let TypeScript infer the types of local variables. Annotate the parameters and return types of exported functions.
- Keep types simple. Do not use conditional types, deep mapped types or chains of generics where a plain type works. People have to read types too.
- Use `type` by default. Use `interface` only when you need declaration merging or `extends`.
- Do not use `enum`. Use a union of string literals, or an `as const` object:

  ```ts
  type Status = "idle" | "loading" | "error";

  const Role = { Admin: "admin", Member: "member" } as const;
  type Role = (typeof Role)[keyof typeof Role];
  ```

- Model states with a discriminated union, not with several booleans or optional fields that "go together":

  ```ts
  // Good
  type Result = { ok: true; data: User } | { ok: false; error: string };

  // Bad
  type Result = { ok: boolean; data?: User; error?: string };
  ```

- Make every `switch` over a union exhaustive. End it with `const _exhaustive: never = value`.
- Prefer `readonly` for data that should not change.

## Runtime validation

Data from outside is `unknown` until a schema (Zod or Valibot) validates it at the boundary. This covers HTTP, env, files, `JSON.parse` and `localStorage`; see [code-style.md](code-style.md#errors-and-validation).

The schema is the source of truth. Derive the type from it with `z.infer<typeof Schema>`. Do not write the schema and the type separately by hand. Treat API types the same way: generate them or import them.

## Modules

- Use named exports only. Use `export default` only where a framework requires it, such as for Next.js pages.
- Apps have no barrel files (`index.ts` files that re-export everything). Import from the module itself. A library can have one public entry point.
- Use `import type` for type-only imports.
- Use the `@/` alias for the source root instead of `../../../`.

## Async

- Use `async/await`, not `.then()` chains.
- Await every promise, return it or mark it with `void`. Do not leave a promise floating.
- Run independent async work in parallel with `Promise.all`, not one by one in a `for ... await` loop.

## Small things

- Always use `===`.
- Use `??` instead of `||` for defaults when `0` or `""` are valid values.
- Use `const` by default and `let` only when you reassign. Never use `var`.
