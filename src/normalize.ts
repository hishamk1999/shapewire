import type { AnyRecord, Simplify } from "./types";

export type Normalizer<Value = unknown, Output = unknown> = (value: Value, key: PropertyKey) => Output;
export type BuiltInNormalizer = "isoDate" | "number" | "boolean" | `currency:${string}`;
export type NormalizerSpec = BuiltInNormalizer | Normalizer;

type NormalizedValue<Spec> = Spec extends "isoDate" ? string | null
  : Spec extends "number" ? number | null
  : Spec extends "boolean" ? boolean | null
  : Spec extends `currency:${string}` ? string | null
  : Spec extends Normalizer<never, infer Output> ? Output
  : unknown;

type Normalized<Input extends AnyRecord, Specs extends Readonly<Record<PropertyKey, NormalizerSpec>>> = Simplify<
  Omit<Input, keyof Specs> & { [Key in keyof Specs]: NormalizedValue<Specs[Key]> }
>;

const builtIns: Record<Exclude<BuiltInNormalizer, `currency:${string}`>, Normalizer> = {
  isoDate(value) {
    if (value == null || value === "") return null;
    const date = value instanceof Date ? value : new Date(value as string | number);
    return Number.isNaN(date.getTime()) ? null : date.toISOString();
  },
  number(value) {
    if (value == null || value === "") return null;
    const number = typeof value === "number" ? value : Number(value);
    return Number.isFinite(number) ? number : null;
  },
  boolean(value) {
    if (value == null || value === "") return null;
    if (typeof value === "boolean") return value;
    if (value === 1 || (typeof value === "string" && ["true", "1", "yes"].includes(value.toLowerCase()))) return true;
    if (value === 0 || (typeof value === "string" && ["false", "0", "no"].includes(value.toLowerCase()))) return false;
    return null;
  },
};

function currency(code: string): Normalizer {
  const formatter = new Intl.NumberFormat(undefined, { style: "currency", currency: code });
  return (value) => {
    if (value == null || value === "") return null;
    const number = typeof value === "number" ? value : Number(value);
    return Number.isFinite(number) ? formatter.format(number) : null;
  };
}

export function normalize<const Specs extends Readonly<Record<PropertyKey, NormalizerSpec>>>(specs: Specs) {
  return <Input extends AnyRecord>(obj: Input): Normalized<Input, Specs> => {
    const result: Record<PropertyKey, unknown> = { ...obj };
    for (const key of Reflect.ownKeys(specs)) {
      const spec = specs[key];
      if (!spec) continue;
      const normalizer = typeof spec === "function"
        ? spec
        : spec.startsWith("currency:")
          ? currency(spec.slice("currency:".length))
          : builtIns[spec];
      result[key] = normalizer(result[key], key);
    }
    return result as Normalized<Input, Specs>;
  };
}
