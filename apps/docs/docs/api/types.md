---
sidebar_position: 9
title: Exported types
---

# Exported types

## `Transform`

Represents a synchronous step from one value to another.

```ts
type Transform<Input, Output> = (value: Input) => Output;
```

```ts
const selectName: Transform<{name: string}, string> = user => user.name;
```

## `Renamed`

Maps an input object type through a rename map.

```ts
type ApiUser = {user_id: number; full_name: string};
type User = Renamed<ApiUser, {user_id: 'id'; full_name: 'name'}>;
// {id: number; name: string}
```

## `Picked` and `Omitted`

These distributive types represent the object shapes returned by `pick` and `omit`. They preserve property modifiers and distribute across union inputs.

```ts
type PublicUser = Picked<ApiUser, 'user_id'>;
type WithoutName = Omitted<ApiUser, 'full_name'>;
```

## Normalizer types

- `BuiltInNormalizer` is the union of supported named specs.
- `Normalizer<Value, Output>` describes a custom callback receiving a value and property key.
- `NormalizerSpec` accepts either a built-in spec or custom callback.

```ts
const trim: Normalizer<unknown, string | null> = value =>
  typeof value === 'string' ? value.trim() : null;
```
