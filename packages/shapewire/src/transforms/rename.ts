import type { AnyRecord, Simplify, TransformType, TypedTransform } from "../core/types.js";

type RenameMap<Input extends AnyRecord> = Partial<Record<keyof Input, PropertyKey>>;

export type Renamed<Input extends AnyRecord, Map extends RenameMap<Input>> = Simplify<{
  [Key in keyof Input as Key extends keyof Map
    ? Map[Key] extends PropertyKey
      ? Map[Key]
      : Key
    : Key]: Input[Key];
}>;

type RenameResult<Input, Map extends Readonly<Record<PropertyKey, PropertyKey>>> = Input extends AnyRecord
  ? Renamed<Input, Map>
  : Input;

interface RenameType<Map extends Readonly<Record<PropertyKey, PropertyKey>>> extends TransformType {
  readonly type: RenameResult<this["Input"], Map>;
}

type RenameTransform<Map extends Readonly<Record<PropertyKey, PropertyKey>>> = TypedTransform<RenameType<Map>> & {
  <Input extends AnyRecord>(obj: Input): Renamed<Input, Map>;
};

/** Renames own enumerable fields without mutating the input. */
export function rename<const Map extends Readonly<Record<PropertyKey, PropertyKey>>>(map: Map): RenameTransform<Map> {
  return (<Input extends AnyRecord>(obj: Input): Renamed<Input, Map> => {
    const result: Record<PropertyKey, unknown> = {};

    for (const key of Reflect.ownKeys(obj)) {
      if (!Object.prototype.propertyIsEnumerable.call(obj, key)) continue;
      result[map[key] ?? key] = obj[key];
    }

    return result as Renamed<Input, Map>;
  }) as RenameTransform<Map>;
}
