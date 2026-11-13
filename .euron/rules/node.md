---
paths: ["**/*.js", "**/*.jsx", "**/*.ts", "**/*.tsx", "**/*.mjs", "**/*.cjs"]
---
- Use the package manager of the lockfile (npm, pnpm, yarn or bun); do not add dependencies without asking.
- Prefer `async`/`await`; always handle rejected promises and errors.
- In TypeScript keep types strict: no `any`, no `@ts-ignore` unless explained.
- Run the project's lint and type-check scripts after changes when they exist.
