---
sidebar_position: 2
title: Transform arrays
---

# Transform arrays

Build an item transform once, then lift it over a list with `mapEach`.

```ts
import {mapEach, normalize, pipe, rename} from 'shapewire';

const toOrder = pipe(
  rename({order_id: 'id', created_at: 'createdAt'}),
  normalize({createdAt: 'isoDate', total: 'number'}),
);

const toOrders = mapEach(toOrder);

toOrders(response.orders);
```

If the endpoint omits the collection or returns `null`, `toOrders` produces `[]`. This removes repeated optional chaining from rendering code.

`mapEach` does not coerce a single object into a one-item list. If an endpoint can return either form, resolve that transport inconsistency explicitly before calling the list transform.
