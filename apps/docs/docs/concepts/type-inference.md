---
sidebar_position: 1
title: Type inference
---

# Type inference

Each transform describes both a runtime operation and its output type. `pipe` carries that output into the next stage.

```ts
const toAccount = pipe(
  rename({account_id: 'id'}),
  defaults({status: 'pending' as const}),
  normalize({balance: 'number'}),
);

const account = toAccount({account_id: 1, balance: '4.50'});
// {
//   id: number;
//   status: 'pending';
//   balance: number | null;
// }
```

Use `as const` when a fallback should retain a literal type instead of widening to `string` or `number`.

The exported [`Transform`](../api/types.md#transform) type is useful when defining reusable custom steps. Typed `pipe` overloads currently cover one through four transforms.
