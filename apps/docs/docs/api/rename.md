---
sidebar_position: 3
title: rename
---

# `rename`

Renames selected own enumerable keys and copies every other key unchanged.

```ts
const transform = rename({user_id: 'id', full_name: 'name'});

transform({user_id: 1, full_name: 'Ada', email: 'ada@example.com'});
// {id: 1, name: 'Ada', email: 'ada@example.com'}
```

The input is not mutated. String and symbol keys are supported. The operation is shallow, and values keep their original references.

The [`Renamed`](./types.md#renamed) utility type represents the same key mapping at the type level.
