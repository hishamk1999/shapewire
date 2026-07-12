# ShapeWire

**Type-safe pipelines for turning API responses into UI-ready data.**

![TypeScript](https://img.shields.io/badge/TypeScript-first-3178c6)
![Modules](https://img.shields.io/badge/modules-native%20ESM-f7df1e)
![License](https://img.shields.io/badge/license-MIT-3178c6)
![Status](https://img.shields.io/badge/status-pre--release-f97316)

API responses rarely match the shape a frontend actually needs. Keys use the wrong naming convention, primitives arrive as inconsistent strings, optional values are missing, and related data comes from separate endpoints. ShapeWire turns that repeated boundary code into small, declarative transforms that compose from left to right.

```ts
import { defaults, normalize, omit, pipe, rename } from "shapewire";

const toUser = pipe(
  omit(["password_hash", "internal_notes"]),
  rename({ user_id: "id", full_name: "name", created_at: "createdAt" }),
  defaults({ role: "viewer", verified: false }),
  normalize({ createdAt: "isoDate", balance: "number", verified: "boolean" }),
);
```

ShapeWire is framework-agnostic, immutable at the top level, side-effect free, and designed to preserve useful TypeScript inference across a transformation pipeline.

> [!IMPORTANT]
> ShapeWire is currently pre-release and the `shapewire` package has not been published to npm. The package-manager commands below will become available with the first public release.

## Why ShapeWire?

- Rename API fields declaratively without mutating the source.
- Keep only the fields a consumer needs, or omit private and internal fields.
- Fill only `null` and `undefined` values while preserving `false`, `0`, and `''`.
- Normalize dates, numbers, booleans, currencies, and custom formats.
- Merge UI metadata or a second data source with predictable precedence.
- Apply the same transform safely to arrays and nullish lists.
- Infer renamed keys and normalized output types in TypeScript.
- Use the resulting plain function anywhere JavaScript runs.

## Installation

After the first npm release, install ShapeWire with your preferred package manager:

```bash
pnpm add shapewire
```

```bash
npm install shapewire
```

```bash
yarn add shapewire
```

For development today, clone this repository using GitHub's **Code** menu, open the checkout, and install the workspace:

```bash
pnpm install
pnpm typecheck
pnpm test:run
```

## Quick start

Suppose an endpoint returns snake-case keys and inconsistent primitive values:

```ts
const apiUser = {
  user_id: 7,
  full_name: "Ada Lovelace",
  created_at: "2025-01-02",
  balance: "12.50",
  verified: "yes",
};
```

Define a reusable boundary transform:

```ts
import { defaults, normalize, omit, pipe, rename } from "shapewire";

const toUser = pipe(
  omit(["password_hash", "internal_notes"]),
  rename({
    user_id: "id",
    full_name: "name",
    created_at: "createdAt",
  }),
  defaults({ role: "viewer" as const, verified: false }),
  normalize({
    createdAt: "isoDate",
    balance: "number",
    verified: "boolean",
  }),
);

const user = toUser(apiUser);
```

The resulting object is ready for UI code:

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

The original response remains unchanged. TypeScript infers the renamed fields, the literal default, and normalized values such as `number | null`.

Read the [documentation overview](apps/docs/docs/intro.md), [quick-start guide](apps/docs/docs/getting-started/quick-start.md), or complete [API-to-UI composition guide](apps/docs/docs/guides/api-to-ui.md).

## API at a glance

| Export              | Purpose                                                       |
| ------------------- | ------------------------------------------------------------- |
| `pipe`              | Compose synchronous transforms from left to right.            |
| `rename`            | Rename selected own enumerable keys.                          |
| `pick`              | Keep only selected own enumerable fields.                     |
| `omit`              | Remove selected own enumerable fields.                        |
| `defaults`          | Fill fields whose values are `null` or `undefined`.           |
| `normalize`         | Apply built-in or custom field normalizers.                   |
| `merge`             | Shallow-merge an object or zero-argument source factory.      |
| `mapEach`           | Apply an item transform to a list; nullish lists become `[]`. |
| `Transform`         | Type for a synchronous input-to-output transform.             |
| `Renamed`           | Type-level representation of a renamed object shape.          |
| `Picked`            | Type-level representation of a selected object shape.         |
| `Omitted`           | Type-level representation of an object with removed fields.   |
| `BuiltInNormalizer` | Union of supported built-in normalizer specifications.        |
| `Normalizer`        | Type for a custom field-normalizer callback.                  |
| `NormalizerSpec`    | Type accepted by a `normalize` field specification.           |

See the handwritten [API reference](apps/docs/docs/api/pipe.md) for detailed behavior and examples.

For example, a public model can remove sensitive transport fields before renaming:

```ts
const toPublicUser = pipe(
  omit(["password_hash", "internal_notes"]),
  rename({ user_id: "id", full_name: "name" }),
);
```

## Built-in normalization

```ts
normalize({
  createdAt: "isoDate",
  quantity: "number",
  enabled: "boolean",
  total: "currency:USD",
});
```

Built-in normalizers return `null` for nullish, empty, or invalid values. Currency output uses the runtime's current locale, so punctuation and symbol placement may vary. Custom callbacks can implement domain-specific behavior.

Learn more in the [`normalize` reference](apps/docs/docs/api/normalize.md) and [custom-normalizer guide](apps/docs/docs/guides/custom-normalizers.md).

## Framework integration

A completed ShapeWire pipeline is an ordinary function:

- Use it in React, Vue, or Svelte before data enters rendering state.
- Pass it directly to TanStack Query's `select` option.
- Apply it to SWR data after the fetcher resolves.
- Use it in loaders, stores, service modules, workers, or Node.js code.

ShapeWire does not depend on a UI framework, state manager, fetch client, or validation library. See [data-fetching selectors](apps/docs/docs/guides/query-selectors.md) for integration examples.

## Current limitations

- Object transforms are shallow; nested values are not recursively transformed.
- All operations are synchronous.
- Public `pipe` overloads infer one through four stages. The runtime reducer accepts more, but those calls do not have a public typed overload.
- `merge` is shallow and right-hand fields take precedence.
- `mapEach` accepts arrays, `null`, or `undefined`; it does not coerce a single object into an array.
- Invalid built-in normalization produces `null` rather than throwing.
- Currency strings are locale-sensitive.

These boundaries are documented in more detail under [core concepts](apps/docs/docs/concepts/immutability.md).

## Repository structure

```text
.
├── apps/
│   └── docs/          # Docusaurus documentation site (@shapewire/docs)
├── packages/
│   └── shapewire/     # Publishable ShapeWire package
├── package.json       # Workspace commands
└── pnpm-workspace.yaml
```

## Development

Run commands from the repository root:

```bash
pnpm typecheck    # Type-check the library and documentation site
pnpm test:run     # Run the library test suite once
pnpm build        # Build the package and Docusaurus site
pnpm docs:start   # Start the documentation development server
pnpm docs:build   # Build the documentation site
pnpm docs:serve   # Serve the built documentation locally
pnpm pack:lib     # Create a local package archive
```

The library source is organized by responsibility:

```text
src/
├── core/           # Dependency-free transform contracts and pipeline composition
├── normalization/  # Normalizer contracts, built-ins, and field orchestration
├── transforms/     # Focused object and collection transforms
├── __tests__/      # Public-API behavior and type-inference tests
└── index.ts        # Stable public package boundary
```

Keep shared contracts in `core`, implementation details inside their feature directory, and consumer-facing exports in `index.ts`. Tests import from `index.ts` so internal restructuring cannot accidentally change the public API.

The publishable source is in [`packages/shapewire`](packages/shapewire), and the documentation source is in [`apps/docs/docs`](apps/docs/docs).

## Project status

ShapeWire is under active development and has not reached its first public npm release. APIs and package metadata may still change before publication.

## License

ShapeWire is available under the [ISC License](LICENSE).
