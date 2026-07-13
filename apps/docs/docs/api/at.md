---
sidebar_position: 2
title: at
---

# `at`

Applies a transform to the object at a dot-separated property path.

```ts
at(path, transform)
```

`transform` can be any ShapeWire transform, including a `pipe(...)`. The rest of the input is left unchanged.

## Direct nested object

```ts
import {at, rename} from 'shapewire';

const renameProfile = at('profile', rename({full_name: 'name'}));

renameProfile({
  user_id: 1,
  profile: {full_name: 'Hisham', locale: 'ar-EG'},
});
// {
//   user_id: 1,
//   profile: {name: 'Hisham', locale: 'ar-EG'},
// }
```

## Nested path and `pipe`

Compose multiple shallow operations for a deeper object without changing how those operations behave elsewhere:

```ts
import {at, merge, normalize, pipe, rename} from 'shapewire';

const toUser = pipe(
  at(
    'user.profile',
    pipe(
      rename({full_name: 'name', created_at: 'createdAt'}),
      normalize({createdAt: 'isoDate'}),
      merge({source: 'api' as const}),
    ),
  ),
);

toUser({
  user_id: 1,
  user: {
    profile: {full_name: 'Hisham', created_at: '2026-07-13'},
    permissions: {canEdit: true},
  },
});
// {
//   user_id: 1,
//   user: {
//     profile: {
//       name: 'Hisham',
//       createdAt: '2026-07-13T00:00:00.000Z',
//       source: 'api',
//     },
//     permissions: {canEdit: true},
//   },
// }
```

TypeScript infers the transformed nested shape, including renamed keys, normalized values, merged fields, and the unchanged surrounding fields.

## Missing and non-object targets

If any path segment is missing, is inherited rather than owned, or cannot be traversed, the transform is not called and the original input is returned. `null`, `undefined`, and primitive target values are also left unchanged instead of throwing.

```ts
const addStatus = at('user.profile', merge({status: 'ready'}));

addStatus({user: {name: 'Hisham'}}); // unchanged: profile is missing
addStatus({user: {profile: null}});  // unchanged: target is not an object
```

Arrays count as object targets, so `mapEach(...)` can be used at an array-valued path.

## Immutability and structural sharing

`at` never mutates its input. When the target changes, it clones only the objects along the selected path. Unchanged sibling branches retain their original references.

```ts
const input = {
  user: {
    profile: {full_name: 'Hisham'},
    permissions: {canEdit: true},
  },
  metadata: {requestId: 'request-1'},
};

const output = at('user.profile', rename({full_name: 'name'}))(input);

output !== input;                                      // true
output.user !== input.user;                            // true
output.user.profile !== input.user.profile;            // true
output.user.permissions === input.user.permissions;    // true
output.metadata === input.metadata;                    // true
```

When the path is missing, the target is not an object, or the nested transform returns the same reference, the original root reference is returned.

## Current limitations

- Paths are non-empty dot-separated string keys such as `profile` and `user.profile`.
- Bracket notation, escaped dots in property names, wildcards, and symbol path segments are not supported.
- Traversal follows own properties only.
- Behavior outside the selected path is shallow. `at` does not recursively walk siblings or make the nested transform itself deep.
