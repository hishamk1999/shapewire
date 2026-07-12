import type { AnyRecord, Simplify } from "../core/types.js";

type WithDefaults<Input extends AnyRecord, Defaults extends AnyRecord> = Simplify<
  Omit<Input, keyof Defaults> & {
    [Key in keyof Defaults]: Key extends keyof Input
      ? Exclude<Input[Key], null | undefined> | Defaults[Key]
      : Defaults[Key];
  }
>;

/** Fills only nullish fields; falsy values such as false, 0, and "" are retained. */
export function defaults<const Defaults extends AnyRecord>(fallbacks: Defaults) {
  return <Input extends AnyRecord>(obj: Input): WithDefaults<Input, Defaults> => {
    const result: Record<PropertyKey, unknown> = { ...obj };
    for (const key of Reflect.ownKeys(fallbacks)) {
      if (result[key] == null) result[key] = fallbacks[key];
    }
    return result as WithDefaults<Input, Defaults>;
  };
}
