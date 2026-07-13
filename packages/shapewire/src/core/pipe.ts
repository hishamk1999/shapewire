import type { ApplyTransform, Transform, TransformType, TypedTransform } from "./types.js";

type ApplyPipeline<Transforms extends readonly unknown[], Input> = Transforms extends readonly [
  infer First,
  ...infer Rest,
]
  ? ApplyPipeline<Rest, ApplyTransform<First, Input>>
  : Input;

interface PipeType<Transforms extends readonly unknown[]> extends TransformType {
  readonly type: ApplyPipeline<Transforms, this["Input"]>;
}

type AnyTransform = Transform<any, any>;

type Compatible<Left, Right> = Left extends Transform<any, infer Output>
  ? Right extends Transform<infer Input, any>
    ? Output extends Input
      ? unknown
      : never
    : never
  : never;

type Piped<Transforms extends readonly unknown[]> = TypedTransform<PipeType<Transforms>> & {
  <Input>(input: Input): ApplyPipeline<Transforms, Input>;
};

export function pipe<AB extends AnyTransform>(ab: AB): Piped<[AB]>;
export function pipe<AB extends AnyTransform, BC extends AnyTransform>(ab: AB, bc: BC & Compatible<AB, BC>): Piped<[AB, BC]>;
export function pipe<AB extends AnyTransform, BC extends AnyTransform, CD extends AnyTransform>(ab: AB, bc: BC & Compatible<AB, BC>, cd: CD & Compatible<BC, CD>): Piped<[AB, BC, CD]>;
export function pipe<AB extends AnyTransform, BC extends AnyTransform, CD extends AnyTransform, DE extends AnyTransform>(ab: AB, bc: BC & Compatible<AB, BC>, cd: CD & Compatible<BC, CD>, de: DE & Compatible<CD, DE>): Piped<[AB, BC, CD, DE]>;
export function pipe(...transforms: ReadonlyArray<Transform<unknown, unknown>>) {
  return (input: unknown) => transforms.reduce((value, transform) => transform(value), input);
}
