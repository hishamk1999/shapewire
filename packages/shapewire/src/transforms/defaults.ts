import type { AnyRecord, Simplify, TransformType, TypedTransform } from "../core/types.js";

type WithDefaults<Input extends AnyRecord, Defaults extends AnyRecord> = Simplify<
  Omit<Input, keyof Defaults> & {
    [Key in keyof Defaults]: Key extends keyof Input
      ? Exclude<Input[Key], null | undefined> | Defaults[Key]
      : Defaults[Key];
  }
>;

type DefaultsResult<Input, Fallbacks extends AnyRecord> = Input extends AnyRecord
  ? WithDefaults<Input, Fallbacks>
  : Input;

interface DefaultsType<Fallbacks extends AnyRecord> extends TransformType {
  readonly type: DefaultsResult<this["Input"], Fallbacks>;
}

type DefaultsTransform<Fallbacks extends AnyRecord> = TypedTransform<DefaultsType<Fallbacks>> & {
  <Input extends AnyRecord>(obj: Input): WithDefaults<Input, Fallbacks>;
};

/** Fills only nullish fields; falsy values such as false, 0, and "" are retained. */
export function defaults<const Defaults extends AnyRecord>(fallbacks: Defaults): DefaultsTransform<Defaults> {
  return (<Input extends AnyRecord>(obj: Input): WithDefaults<Input, Defaults> => {
    const result: Record<PropertyKey, unknown> = { ...obj };
    for (const key of Reflect.ownKeys(fallbacks)) {
      if (result[key] == null) result[key] = fallbacks[key];
    }
    return result as WithDefaults<Input, Defaults>;
  }) as DefaultsTransform<Defaults>;
}
