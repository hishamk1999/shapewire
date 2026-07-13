import type { ApplyTransform, Transform, TransformType, TypedTransform } from "../core/types.js";

type MapEachResult<Input, Transformation> = Input extends readonly (infer Item)[]
  ? Array<ApplyTransform<Transformation, Item>>
  : Input extends null | undefined
    ? Array<ApplyTransform<Transformation, never>>
    : Input;

interface MapEachType<Transformation> extends TransformType {
  readonly type: MapEachResult<this["Input"], Transformation>;
}

type MapEachTransform<Transformation> = TypedTransform<MapEachType<Transformation>> & {
  <Items extends readonly unknown[] | null | undefined>(items: Items): MapEachResult<Items, Transformation>;
};

/** Applies a transform to each item. Nullish input becomes an empty array. */
export function mapEach<Input, Output, Transformation>(transform: Transform<Input, Output> & Transformation): MapEachTransform<Transformation> {
  return ((items: readonly Input[] | null | undefined): Output[] => items?.map(transform) ?? []) as MapEachTransform<Transformation>;
}
