import type { Transform } from "../core/types.js";

/** Applies a transform to each item. Nullish input becomes an empty array. */
export function mapEach<Input, Output>(transform: Transform<Input, Output>) {
  return (items: readonly Input[] | null | undefined): Output[] => items?.map(transform) ?? [];
}
