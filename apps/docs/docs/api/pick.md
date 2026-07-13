---
sidebar_position: 4
title: pick
---

# `pick`

`pick` creates a synchronous transform that keeps selected own enumerable fields.

```ts
import {pick, pipe, rename} from 'shapewire';

const selectUser = pick(['user_id', 'full_name']);
selectUser({user_id: 7, full_name: 'Ada', email: 'ada@example.com'});
// {user_id: 7, full_name: 'Ada'}
```

## Signature and inference

```ts
pick(keys)(input);
pick<Input>()(keys)(input);
```

Inline arrays infer precise keys without `as const`; mutable and readonly arrays are accepted. The explicit-input form validates keys immediately:

```ts
type ApiUser = {user_id: number; full_name: string; email: string};
const toListItem = pick<ApiUser>()(['user_id', 'full_name']);
// Transform<ApiUser, {user_id: number; full_name: string}>
```

## Pipelines and ordering

```ts
const toUserListItem = pipe(
  pick(['user_id', 'full_name', 'avatar_url']),
  rename({user_id: 'id', full_name: 'name', avatar_url: 'avatarUrl'}),
);
```

Place `pick` after `rename` when selecting renamed keys. It can also be combined with `omit`; this is normal composition, not a configuration conflict:

```ts
pipe(pick(['id', 'name', 'email', 'token']), omit(['token']));
```

## Behavior and edge cases

- Returns a new normal plain object and never mutates the input.
- Is shallow: nested objects, arrays, functions, and other values are retained exactly.
- Ignores missing runtime keys, duplicates, inherited fields, and non-enumerable fields.
- Supports string, numeric, and symbol property keys. Requested order is used, subject to JavaScript's integer-key enumeration rules.
- Reads a retained getter once and stores its value as a data property; descriptors are not preserved.
- Safely copies `__proto__`, `constructor`, and `prototype` without changing the result prototype.
- Frozen and sealed inputs are supported.
- The typed API is for object records. At runtime, nullish values and string/number/boolean primitives throw `TypeError`; arrays and functions are treated as objects.

Use `pick` for intentionally small view models or allowlist-style public boundaries. Do not use it for deep selection, validation, asynchronous work, or descriptor-preserving clones.
