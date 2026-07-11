---
sidebar_position: 5
title: Data-fetching selectors
---

# Data-fetching selectors

A completed pipeline is a plain function, so it can be passed to APIs that accept a selector.

## TanStack Query

```ts
const toUser = pipe(
  rename({user_id: 'id'}),
  defaults({role: 'viewer'}),
  normalize({created_at: 'isoDate'}),
);

const query = useQuery({
  queryKey: ['user', userId],
  queryFn: () => fetchUser(userId),
  select: toUser,
});
```

## SWR-style mapping

```ts
const {data: rawUser, ...state} = useSWR(`/api/users/${userId}`, fetcher);
const user = rawUser ? toUser(rawUser) : undefined;
```

Keep the transform defined outside component render functions when possible. This provides a stable function reference and keeps transport details separate from presentation logic.

These examples demonstrate integration shape only; the library does not depend on a fetching or UI framework.
