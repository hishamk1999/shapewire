import type { AnyRecord, Simplify, TransformType, TypedTransform } from "../core/types.js";

type Merged<Left extends AnyRecord, Right extends AnyRecord> = Simplify<Omit<Left, keyof Right> & Right>;

type MergeResult<Input, Right extends AnyRecord> = Input extends AnyRecord ? Merged<Input, Right> : Input;

interface MergeType<Right extends AnyRecord> extends TransformType {
  readonly type: MergeResult<this["Input"], Right>;
}

type MergeTransform<Right extends AnyRecord> = TypedTransform<MergeType<Right>> & {
  <Left extends AnyRecord>(left: Left): Merged<Left, Right>;
};

/** Shallow-merges a source object or a source factory; right-hand fields win. */
export function merge<const Right extends AnyRecord>(source: Right | (() => Right)): MergeTransform<Right> {
  const transform = <Left extends AnyRecord>(left: Left): Merged<Left, Right> => ({
    ...left,
    ...(typeof source === "function" ? source() : source),
  }) as Merged<Left, Right>;
  return transform as MergeTransform<Right>;
}
