import type { AnyRecord, Simplify } from "../core/types.js";

type Merged<Left extends AnyRecord, Right extends AnyRecord> = Simplify<Omit<Left, keyof Right> & Right>;

/** Shallow-merges a source object or a source factory; right-hand fields win. */
export function merge<const Right extends AnyRecord>(source: Right | (() => Right)) {
  return <Left extends AnyRecord>(left: Left): Merged<Left, Right> => ({
    ...left,
    ...(typeof source === "function" ? source() : source),
  }) as Merged<Left, Right>;
}
