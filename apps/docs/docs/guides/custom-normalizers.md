---
sidebar_position: 3
title: Custom normalizers
---

# Custom normalizers

Use a callback when a field requires domain-specific shaping that the built-ins do not provide.

```ts
import {normalize} from 'shapewire';

const normalizeProfile = normalize({
  email: value =>
    typeof value === 'string' ? value.trim().toLowerCase() : null,
  tags: value =>
    Array.isArray(value) ? value.filter((tag): tag is string => typeof tag === 'string') : [],
});
```

The callback's return type becomes the inferred type of that field. It receives `undefined` when the configured key is absent, so define a fallback inside the callback when needed.

Custom normalizers are synchronous. Let thrown errors propagate when invalid input should fail the entire transform; otherwise return a sentinel such as `null` or `[]`.
