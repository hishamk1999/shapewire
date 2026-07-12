export type Normalizer<Value = unknown, Output = unknown> = (value: Value, key: PropertyKey) => Output;

export type BuiltInNormalizer = "isoDate" | "number" | "boolean" | `currency:${string}`;

export type NormalizerSpec = BuiltInNormalizer | Normalizer;
