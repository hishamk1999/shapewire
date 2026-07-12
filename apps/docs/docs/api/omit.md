---
sidebar_position: 4
title: omit
---

# `omit`

`omit` creates a synchronous transform that copies every own enumerable field except selected keys.

```ts
import {omit, pipe, rename} from 'shapewire';

const toPublicUser = pipe(
  omit(['password_hash', 'internal_notes']),
  rename({user_id: 'id', full_name: 'name'}),
);
```

## Signature and inference

```ts
omit(keys)(input);
omit<Input>()(keys)(input);
```

Inline arrays infer precise output shapes, readonly arrays are accepted, and the explicit-input form rejects unknown keys at compile time. Optional, readonly, literal, numeric, and symbol fields retain their TypeScript semantics.

## Pipelines and ordering

`omit` can appear before or after `pick`; every stage receives the previous stage's output:

```ts
const toSafeSummary = pipe(
  pick(['id', 'name', 'email', 'token']),
  omit(['token']),
);
```

Order matters. `pipe(pick(['id', 'name']), omit(['name']))` returns only `id`; a later strongly typed stage cannot use a removed field. If `rename` runs first, omit the new name rather than the transport name.

## Behavior and edge cases

- Returns a new normal plain object, preserves source enumeration order, and never clones then deletes from the input.
- Is shallow and preserves retained values and references exactly, including falsy and nullish values.
- Ignores missing and duplicate omitted keys; inherited and non-enumerable fields are never copied.
- Supports string, numeric, and symbol keys.
- Reads each retained getter once, never reads omitted getters, and stores retained values as data properties.
- Safely handles `__proto__`, `constructor`, and `prototype` without prototype pollution.
- Frozen and sealed inputs are supported.
- The typed API is for object records. At runtime, nullish values and string/number/boolean primitives throw `TypeError`; arrays and functions are treated as objects.

Use `omit` when most response fields are useful and a small known set is private or internal. Prefer `pick` for allowlist-style boundaries. Do not use either transform for deep deletion, validation, asynchronous work, or descriptor-preserving clones.
