---
sidebar_position: 5
title: defaults
---

# `defaults`

Fills missing or nullish fields from a fallback object.

```ts
const withDefaults = defaults({role: 'viewer', verified: false});

withDefaults({name: 'Ada', role: null});
// {name: 'Ada', role: 'viewer', verified: false}
```

Only `null` and `undefined` trigger a fallback. Values such as `false`, `0`, `NaN`, and `''` remain unchanged.

Defaults are shallow and the input object is not mutated. When a field already has a non-nullish value, its inferred type is combined with the fallback type.
