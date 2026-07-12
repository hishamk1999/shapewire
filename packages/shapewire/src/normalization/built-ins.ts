import type { BuiltInNormalizer, Normalizer } from "./types.js";

type NamedBuiltIn = Exclude<BuiltInNormalizer, `currency:${string}`>;

const namedNormalizers: Record<NamedBuiltIn, Normalizer> = {
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

function createCurrencyNormalizer(code: string): Normalizer {
  const formatter = new Intl.NumberFormat(undefined, { style: "currency", currency: code });
  return (value) => {
    if (value == null || value === "") return null;
    const number = typeof value === "number" ? value : Number(value);
    return Number.isFinite(number) ? formatter.format(number) : null;
  };
}

export function resolveBuiltInNormalizer(spec: BuiltInNormalizer): Normalizer {
  if (spec.startsWith("currency:")) {
    return createCurrencyNormalizer(spec.slice("currency:".length));
  }

  return namedNormalizers[spec as NamedBuiltIn];
}
