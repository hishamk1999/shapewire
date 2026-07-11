---
sidebar_position: 1
title: Installation
description: Install ShapeWire with your preferred package manager.
---

# Installation

Install the package in the application that receives your API data.

```bash npm2yarn
npm install shapewire
```

With pnpm:

```bash
pnpm add shapewire
```

With Yarn:

```bash
yarn add shapewire
```

## Requirements

- A modern JavaScript runtime with ES2020 support.
- Native ES modules or a modern frontend bundler.
- TypeScript is optional for consumers, but provides inferred output shapes.

## Import only what you use

```ts
import {pipe, rename, defaults, normalize} from 'shapewire';
```

The package is side-effect free and exposes a single ESM entry point, allowing modern bundlers to tree-shake unused exports.
