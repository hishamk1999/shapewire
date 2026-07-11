import type { AnyRecord, Simplify } from "./types.js";

type RenameMap<Input extends AnyRecord> = Partial<Record<keyof Input, PropertyKey>>;

export type Renamed<Input extends AnyRecord, Map extends RenameMap<Input>> = Simplify<{
  [Key in keyof Input as Key extends keyof Map
    ? Map[Key] extends PropertyKey
      ? Map[Key]
      : Key
    : Key]: Input[Key];
}>;

/** Renames own enumerable fields without mutating the input. */
export function rename<const Map extends Readonly<Record<PropertyKey, PropertyKey>>>(map: Map) {
  return <Input extends AnyRecord>(obj: Input): Renamed<Input, Map> => {
    const result: Record<PropertyKey, unknown> = {};

    for (const key of Reflect.ownKeys(obj)) {
      if (!Object.prototype.propertyIsEnumerable.call(obj, key)) continue;
      result[map[key] ?? key] = obj[key];
    }

    return result as Renamed<Input, Map>;
  };
}
