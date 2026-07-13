import type { AnyRecord, ApplyTransform, Transform, TransformType, TypedTransform } from "../core/types.js";

type ApplyObjectTransform<Transformation, Value> = Value extends object
  ? ApplyTransform<Transformation, Value>
  : Value;

type ReplaceAtPath<Value, Path extends string, Transformation> = Value extends object
  ? Path extends `${infer Head}.${infer Tail}`
    ? Head extends keyof Value
      ? { [Key in keyof Value]: Key extends Head ? ReplaceAtPath<Value[Key], Tail, Transformation> : Value[Key] }
      : Value
    : Path extends keyof Value
      ? { [Key in keyof Value]: Key extends Path ? ApplyObjectTransform<Transformation, Value[Key]> : Value[Key] }
      : Value
  : Value;

/** The inferred result of applying `Transformation` at a dot-separated property path. */
export type TransformedAt<Input, Path extends string, Transformation> = string extends Path
  ? Input
  : ReplaceAtPath<Input, Path, Transformation>;

interface AtType<Path extends string, Transformation> extends TransformType {
  readonly type: TransformedAt<this["Input"], Path, Transformation>;
}

type AtTransform<Path extends string, Transformation> = TypedTransform<AtType<Path, Transformation>> & {
  <Input extends AnyRecord>(input: Input): TransformedAt<Input, Path, Transformation>;
};

function isObject(value: unknown): value is object {
  return typeof value === "object" && value !== null;
}

function cloneWithValue(container: object, key: string, value: unknown): object {
  if (Array.isArray(container)) {
    const clone = container.slice();
    Object.defineProperty(clone, key, {
      value,
      enumerable: Object.prototype.propertyIsEnumerable.call(container, key),
      configurable: true,
      writable: true,
    });
    return clone;
  }

  const descriptors = Object.getOwnPropertyDescriptors(container);
  const descriptor = descriptors[key];
  descriptors[key] = {
    value,
    enumerable: descriptor?.enumerable ?? true,
    configurable: descriptor?.configurable ?? true,
    writable: descriptor && "writable" in descriptor ? descriptor.writable : true,
  };
  return Object.create(Object.getPrototypeOf(container), descriptors) as object;
}

/**
 * Applies a transform to the object at a dot-separated own-property path.
 * Missing, invalid, and non-object targets return the original input.
 */
export function at<const Path extends string, Transformation extends Transform<never, unknown>>(
  path: Path,
  transform: Transformation,
): AtTransform<Path, Transformation> {
  const segments = path.split(".");
  const validPath = segments.every((segment) => segment.length > 0);

  return (<Input extends AnyRecord>(input: Input): TransformedAt<Input, Path, Transformation> => {
    if (!validPath) return input as TransformedAt<Input, Path, Transformation>;

    const update = (container: unknown, index: number): unknown => {
      if (!isObject(container)) return container;

      const key = segments[index];
      if (key === undefined || !Object.prototype.hasOwnProperty.call(container, key)) return container;

      const current = (container as Record<string, unknown>)[key];
      const next = index === segments.length - 1
        ? isObject(current)
          ? transform(current as never)
          : current
        : update(current, index + 1);

      return Object.is(next, current) ? container : cloneWithValue(container, key, next);
    };

    return update(input, 0) as TransformedAt<Input, Path, Transformation>;
  }) as AtTransform<Path, Transformation>;
}
