import type { AnyRecord, Simplify, TransformType, TypedTransform } from "../core/types.js";
import { resolveBuiltInNormalizer } from "./built-ins.js";
import type { Normalizer, NormalizerSpec } from "./types.js";

type NormalizedValue<Spec> = Spec extends "isoDate" ? string | null
  : Spec extends "number" ? number | null
  : Spec extends "boolean" ? boolean | null
  : Spec extends `currency:${string}` ? string | null
  : Spec extends Normalizer<never, infer Output> ? Output
  : unknown;

type Normalized<Input extends AnyRecord, Specs extends Readonly<Record<PropertyKey, NormalizerSpec>>> = Simplify<
  Omit<Input, keyof Specs> & { [Key in keyof Specs]: NormalizedValue<Specs[Key]> }
>;

type NormalizeResult<Input, Specs extends Readonly<Record<PropertyKey, NormalizerSpec>>> = Input extends AnyRecord
  ? Normalized<Input, Specs>
  : Input;

interface NormalizeType<Specs extends Readonly<Record<PropertyKey, NormalizerSpec>>> extends TransformType {
  readonly type: NormalizeResult<this["Input"], Specs>;
}

type NormalizeTransform<Specs extends Readonly<Record<PropertyKey, NormalizerSpec>>> = TypedTransform<NormalizeType<Specs>> & {
  <Input extends AnyRecord>(obj: Input): Normalized<Input, Specs>;
};

/** Applies built-in or custom normalizers to selected object fields. */
export function normalize<const Specs extends Readonly<Record<PropertyKey, NormalizerSpec>>>(specs: Specs): NormalizeTransform<Specs> {
  return (<Input extends AnyRecord>(obj: Input): Normalized<Input, Specs> => {
    const result: Record<PropertyKey, unknown> = { ...obj };

    for (const key of Reflect.ownKeys(specs)) {
      const spec = specs[key];
      if (!spec) continue;
      const normalizer = typeof spec === "function" ? spec : resolveBuiltInNormalizer(spec);
      result[key] = normalizer(result[key], key);
    }

    return result as Normalized<Input, Specs>;
  }) as NormalizeTransform<Specs>;
}
