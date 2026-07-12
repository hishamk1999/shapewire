---
sidebar_position: 6
title: normalize
---

# `normalize`

Applies a named or custom normalizer to selected top-level fields.

```ts
normalize({
  createdAt: 'isoDate',
  balance: 'number',
  verified: 'boolean',
  total: 'currency:USD',
})(input);
```

## Built-in normalizers

| Spec | Accepted values | Output |
| --- | --- | --- |
| `isoDate` | `Date`, date string, timestamp | ISO string or `null` |
| `number` | Finite number or numeric value accepted by `Number()` | number or `null` |
| `boolean` | booleans, `1`/`0`, and case-insensitive `true`, `false`, `yes`, `no`, `'1'`, `'0'` | boolean or `null` |
| `currency:USD` | Finite number or numeric value | locale-formatted string or `null` |

Null, `undefined`, the empty string, and invalid built-in inputs normalize to `null`. Currency formatting uses the runtime's default locale, so exact punctuation and symbol placement can vary between environments. The currency code must be supported by `Intl.NumberFormat`.

## Custom normalizers

A callback receives the current field value and its key:

```ts
const transform = normalize({
  username: (value, key) =>
    typeof value === 'string' ? value.trim().toLowerCase() : null,
});
```

Custom callbacks control their own fallback and error behavior. They also run for a configured key that is absent from the input, receiving `undefined`.

Normalization is shallow and does not mutate the input.
