import type { AnyRecord, Transform, TransformType, TypedTransform } from "../core/types.js";

type KeysOfUnion<Input> = Input extends unknown ? keyof Input : never;

/** The distributive result of removing `Keys` from an object type. */
export type Omitted<Input extends AnyRecord, Keys extends KeysOfUnion<Input>> = Input extends unknown
  ? Omit<Input, Extract<Keys, keyof Input>>
  : never;

type InferredOmitted<Input extends AnyRecord, Keys extends PropertyKey> = PropertyKey extends Keys
  ? Partial<Input>
  : Input extends unknown
    ? Omit<Input, Extract<Keys, keyof Input>>
    : never;

type OmitResult<Input, Keys extends PropertyKey> = Input extends AnyRecord ? InferredOmitted<Input, Keys> : Input;

interface OmitType<Keys extends PropertyKey> extends TransformType {
  readonly type: OmitResult<this["Input"], Keys>;
}

type OmitTransform<Keys extends PropertyKey> = TypedTransform<OmitType<Keys>> & {
  <Input extends AnyRecord>(obj: Input): InferredOmitted<Input, Keys>;
};

function toRuntimeKey(key: PropertyKey): string | symbol {
  return typeof key === "number" ? String(key) : key;
}

function createOmit<const Keys extends readonly PropertyKey[]>(keys: Keys) {
  return (<Input extends AnyRecord>(obj: Input): InferredOmitted<Input, Keys[number]> => {
    const omitted = new Set(keys.map(toRuntimeKey));
    const result: Record<PropertyKey, unknown> = {};

    for (const key of Reflect.ownKeys(obj)) {
      if (omitted.has(key) || !Object.prototype.propertyIsEnumerable.call(obj, key)) continue;
      Object.defineProperty(result, key, {
        value: obj[key],
        enumerable: true,
        configurable: true,
        writable: true,
      });
    }

    return result as InferredOmitted<Input, Keys[number]>;
  }) as OmitTransform<Keys[number]>;
}

/**
 * Creates a shallow transform that copies all own enumerable properties except
 * the requested keys into a new object. Missing runtime keys are ignored, the
 * input is not mutated, and the transform composes normally with `pick`.
 */
export function omit<Input extends AnyRecord>(): <const Keys extends readonly KeysOfUnion<Input>[]>(
  keys: Keys,
) => Transform<Input, Omitted<Input, Keys[number]>>;
export function omit<const Keys extends readonly PropertyKey[]>(keys: Keys): ReturnType<typeof createOmit<Keys>>;
// The public overloads carry the precise types; this implementation dispatches
// between the direct and explicit-input forms.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function omit(keys?: readonly PropertyKey[]): any {
  if (keys === undefined) {
    return <const ExplicitKeys extends readonly PropertyKey[]>(explicitKeys: ExplicitKeys) => createOmit(explicitKeys);
  }
  return createOmit(keys);
}
