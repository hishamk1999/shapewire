---
sidebar_position: 1
title: API-to-UI composition
---

# API-to-UI composition

Keep transport inconsistencies at the boundary of your application. Define the transform beside the API client, then expose only the clean result to UI code.

```ts
import {defaults, mapEach, normalize, omit, pick, pipe, rename} from 'shapewire';

type ApiUser = {
  user_id: number;
  full_name: string;
  created_at: string;
  balance: string | number | null;
  verified?: string | boolean | null;
};

export const toUser = pipe(
  omit(['password_hash', 'internal_notes']),
  rename({
    user_id: 'id',
    full_name: 'name',
    created_at: 'createdAt',
  }),
  defaults({role: 'viewer' as const, verified: false}),
  normalize({
    createdAt: 'isoDate',
    balance: 'number',
    verified: 'boolean',
  }),
);

export async function getUser(id: number) {
  const response = await fetch(`/api/users/${id}`);
  if (!response.ok) throw new Error(`Could not load user ${id}`);
  return toUser(await response.json() as ApiUser);
}
```

The UI receives stable camel-case keys and normalized primitives. Fetching and HTTP error handling stay outside the transform because transforms are synchronous shaping functions, not request clients or validators.

For nested data, compose an explicit custom transform for the nested field rather than expecting recursive behavior.

## Selecting and removing fields

Use an allowlist for lightweight list items:

```ts
const toUserListItem = pipe(
  pick(['user_id', 'full_name', 'avatar_url']),
  rename({user_id: 'id', full_name: 'name', avatar_url: 'avatarUrl'}),
);
```

Apply the same public-user transform to an array response:

```ts
const toUsers = mapEach(
  pipe(
    omit(['password_hash', 'internal_notes']),
    rename({user_id: 'id', full_name: 'name'}),
  ),
);
```

`pick` and `omit` may be used together. This is not a configuration conflict; order follows ordinary left-to-right composition:

```ts
const toSafeSummary = pipe(
  pick(['id', 'name', 'email', 'token']),
  omit(['token']),
);
```
