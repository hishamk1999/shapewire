---
sidebar_position: 2
title: Quick start
description: Build a reusable API-to-UI transform pipeline.
---

# Quick start

Suppose an endpoint returns strings, snake-case keys, and nullable fields:

```ts
const apiUser = {
  user_id: 7,
  full_name: 'Ada Lovelace',
  created_at: '2025-01-02',
  balance: '12.50',
  verified: 'yes',
};
```

Create one reusable transform:

```ts
import {defaults, normalize, pipe, rename} from 'shapewire';

const toUser = pipe(
  rename({
    user_id: 'id',
    full_name: 'name',
    created_at: 'createdAt',
  }),
  defaults({role: 'viewer', verified: false}),
  normalize({
    createdAt: 'isoDate',
    balance: 'number',
    verified: 'boolean',
  }),
);

const user = toUser(apiUser);
```

The result is ready for UI code:

```ts
{
  id: 7,
  name: 'Ada Lovelace',
  createdAt: '2025-01-02T00:00:00.000Z',
  balance: 12.5,
  verified: true,
  role: 'viewer',
}
```

No input object is mutated. TypeScript also infers the renamed keys, defaults, and normalized value types. See [API-to-UI composition](../guides/api-to-ui.md) for a larger workflow.
