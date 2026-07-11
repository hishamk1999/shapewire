---
sidebar_position: 1
title: API-to-UI composition
---

# API-to-UI composition

Keep transport inconsistencies at the boundary of your application. Define the transform beside the API client, then expose only the clean result to UI code.

```ts
import {defaults, normalize, pipe, rename} from 'shapewire';

type ApiUser = {
  user_id: number;
  full_name: string;
  created_at: string;
  balance: string | number | null;
  verified?: string | boolean | null;
};

export const toUser = pipe(
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
