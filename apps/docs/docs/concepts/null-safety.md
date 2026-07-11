---
sidebar_position: 2
title: Null safety
---

# Null safety

Null handling is explicit per operation:

- `defaults` replaces only `null` and `undefined`.
- Built-in normalizers return `null` for nullish, empty, or invalid values.
- `mapEach` turns a `null` or `undefined` list into `[]`.
- `rename`, `normalize`, `defaults`, and `merge` expect an object; they do not turn a null root value into an object.

Valid falsy values are preserved by defaults:

```ts
defaults({count: 10, enabled: true})({count: 0, enabled: false});
// {count: 0, enabled: false}
```

Normalization is intentionally different because it converts inconsistent external values:

```ts
normalize({count: 'number', active: 'boolean'})(
  {count: 'not-a-number', active: undefined},
);
// {count: null, active: null}
```
