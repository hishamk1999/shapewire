---
sidebar_position: 1
slug: /intro
title: Overview
description: Shape inconsistent API responses into clean, typed data for your UI.
---

# ShapeWire

**ShapeWire — Type-safe pipelines for turning API responses into UI-ready data.**

ShapeWire is a small, framework-agnostic transformation layer between an API response and the code that renders it. It turns repeated mapping logic into declarative, reusable transforms.

```ts
import {defaults, normalize, pipe, rename} from 'shapewire';

const toUser = pipe(
  rename({user_id: 'id', full_name: 'name', created_at: 'createdAt'}),
  defaults({role: 'viewer', verified: false}),
  normalize({createdAt: 'isoDate', balance: 'number'}),
);

const user = toUser(apiResponse);
```

## What it handles

- Field renaming without mutating the input.
- Nullish defaults that preserve valid falsy values.
- Date, number, boolean, and currency normalization.
- Shallow merging from another source.
- Applying the same transform to every item in a list.
- TypeScript inference across composed transforms.

## Design boundaries

Transforms are shallow and synchronous. They return new objects and do not validate business rules or fetch data. Typed `pipe` overloads currently cover one through four stages, although the runtime reducer accepts more.

Continue with [Installation](./getting-started/installation.md) or jump directly to the [Quick start](./getting-started/quick-start.md).
