import type { AnyRecord, Transform } from "../core/types.js";

type KeysOfUnion<Input> = Input extends unknown ? keyof Input : never;

/** The distributive result of selecting `Keys` from an object type. */
export type Picked<Input extends AnyRecord, Keys extends KeysOfUnion<Input>> = Input extends unknown
  ? Pick<Input, Extract<Keys, keyof Input>>
  : never;

type InferredPicked<Input extends AnyRecord, Keys extends PropertyKey> = PropertyKey extends Keys
  ? Partial<Input>
  : Input extends unknown
    ? Pick<Input, Extract<Keys, keyof Input>>
    : never;

function toRuntimeKey(key: PropertyKey): string | symbol {
  return typeof key === "number" ? String(key) : key;
}

function createPick<const Keys extends readonly PropertyKey[]>(keys: Keys) {
  return <Input extends AnyRecord>(obj: Input): InferredPicked<Input, Keys[number]> => {
    const enumerableKeys = new Set(
      Reflect.ownKeys(obj).filter((key) => Object.prototype.propertyIsEnumerable.call(obj, key)),
    );
    const result: Record<PropertyKey, unknown> = {};

    for (const requestedKey of keys) {
      const key = toRuntimeKey(requestedKey);
      if (!enumerableKeys.has(key) || Object.prototype.hasOwnProperty.call(result, key)) continue;
      Object.defineProperty(result, key, {
        value: obj[key],
        enumerable: true,
        configurable: true,
        writable: true,
      });
    }

    return result as InferredPicked<Input, Keys[number]>;
  };
}

/**
 * Creates a shallow transform that copies selected own enumerable properties
 * into a new object. Missing runtime keys are ignored, the input is not
 * mutated, and the transform composes normally with `omit` and other stages.
 */
export function pick<Input extends AnyRecord>(): <const Keys extends readonly KeysOfUnion<Input>[]>(
  keys: Keys,
) => Transform<Input, Picked<Input, Keys[number]>>;
export function pick<const Keys extends readonly PropertyKey[]>(keys: Keys): ReturnType<typeof createPick<Keys>>;
// The public overloads carry the precise types; this implementation dispatches
// between the direct and explicit-input forms.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function pick(keys?: readonly PropertyKey[]): any {
  if (keys === undefined) {
    return <const ExplicitKeys extends readonly PropertyKey[]>(explicitKeys: ExplicitKeys) => createPick(explicitKeys);
  }
  return createPick(keys);
}
