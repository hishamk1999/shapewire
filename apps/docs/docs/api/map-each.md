---
sidebar_position: 8
title: mapEach
---

# `mapEach`

Lifts one item transform into a list transform.

```ts
const toUser = rename({user_id: 'id'});
const toUsers = mapEach(toUser);

toUsers([{user_id: 1}, {user_id: 2}]);
// [{id: 1}, {id: 2}]
```

`null` and `undefined` inputs return an empty array:

```ts
toUsers(null); // []
```

The returned array is new, and each item is transformed in order. Inputs other than an array, `null`, or `undefined` are outside the function's contract.
