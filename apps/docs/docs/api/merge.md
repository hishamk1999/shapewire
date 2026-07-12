---
sidebar_position: 7
title: merge
---

# `merge`

Shallow-merges a second object into the pipeline value. Right-hand fields win.

```ts
const addPermissions = merge({role: 'admin', canEdit: true});

addPermissions({id: 1, role: 'viewer'});
// {id: 1, role: 'admin', canEdit: true}
```

The source can also be a zero-argument factory when it must be created at transform time:

```ts
const addMetadata = merge(() => ({processedAt: new Date().toISOString()}));
```

Both inputs remain unchanged. Nested objects are replaced rather than deeply merged.
