---
sidebar_position: 1
title: pipe
---

# `pipe`

Composes transforms from left to right and returns one reusable transform.

```ts
function pipe<A, B>(ab: Transform<A, B>): Transform<A, B>;
// Typed overloads continue through four stages.
```

```ts
const toUser = pipe(
  rename({ user_id: "id" }),
  defaults({ role: "viewer" }),
  normalize({ balance: "number" }),
);

const user = toUser({ user_id: 1, balance: "9.50" });
```

The output of each stage becomes the input to the next stage. Runtime composition uses a synchronous reducer and does not catch transform errors.

:::note
Type inference is defined for one through four stages. Passing more stages is supported by the runtime implementation but is not represented by a public overload.
:::
