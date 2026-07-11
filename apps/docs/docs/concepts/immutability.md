---
sidebar_position: 3
title: Immutability and depth
---

# Immutability and depth

Every built-in transform returns a new top-level value. The original object or array remains unchanged.

```ts
const source = {user_id: 1, profile: {theme: 'dark'}};
const result = rename({user_id: 'id'})(source);

source.user_id; // 1
result.id;      // 1
```

Transforms are shallow. Nested object references are preserved unless you explicitly transform them in a custom step. `merge` is also shallow, so a right-hand nested object replaces the left-hand nested object rather than combining their children.

This makes each operation predictable and keeps hidden recursive work out of large API responses.
