---
sidebar_position: 4
title: Merge multiple sources
---

# Merge multiple sources

Normalize each external source independently, then use `merge` when one source is fixed or available through a zero-argument factory.

```ts
import {merge, pipe, rename} from 'shapewire';

const profile = {display_name: 'Ada'};
const permissions = {role: 'admin' as const, canEdit: true};

const toViewModel = pipe(
  rename({display_name: 'name'}),
  merge(permissions),
);

toViewModel(profile);
// {name: 'Ada', role: 'admin', canEdit: true}
```

Right-hand fields overwrite fields already present on the pipeline value. The merge is shallow.

When both sources arrive asynchronously, await them before constructing the final value:

```ts
const [profile, permissions] = await Promise.all([
  getProfile(),
  getPermissions(),
]);

const viewModel = pipe(
  rename({display_name: 'name'}),
  merge(permissions),
)(profile);
```
