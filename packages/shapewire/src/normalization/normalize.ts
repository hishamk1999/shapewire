import type { AnyRecord, Simplify } from "../core/types.js";
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

/** Applies built-in or custom normalizers to selected object fields. */
export function normalize<const Specs extends Readonly<Record<PropertyKey, NormalizerSpec>>>(specs: Specs) {
  return <Input extends AnyRecord>(obj: Input): Normalized<Input, Specs> => {
    const result: Record<PropertyKey, unknown> = { ...obj };

    for (const key of Reflect.ownKeys(specs)) {
      const spec = specs[key];
      if (!spec) continue;
      const normalizer = typeof spec === "function" ? spec : resolveBuiltInNormalizer(spec);
      result[key] = normalizer(result[key], key);
    }

    return result as Normalized<Input, Specs>;
  };
}
