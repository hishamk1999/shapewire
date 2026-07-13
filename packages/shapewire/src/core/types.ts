/** A readonly object shape accepted by ShapeWire object transforms. */
export type AnyRecord = Readonly<Record<PropertyKey, unknown>>;

/** A synchronous transformation from one value to another. */
export type Transform<Input, Output> = (value: Input) => Output;

/** Flattens intersections into a readable object type. */
export type Simplify<Value> = { [Key in keyof Value]: Value[Key] } & {};

/** Internal type-level contract used to apply generic transforms to a later input type. */
export interface TransformType {
  readonly Input: unknown;
  readonly type: unknown;
}

export declare const transformType: unique symbol;

/** Associates a callable transform with its generic type-level operation. */
export interface TypedTransform<Operation extends TransformType> {
  readonly [transformType]: Operation;
}

/** Applies either a ShapeWire generic transform or a concrete transform to `Input`. */
export type ApplyTransform<Transformation, Input> = Transformation extends TypedTransform<infer Operation>
  ? (Operation & { readonly Input: Input })["type"]
  : Transformation extends Transform<Input, infer Output>
    ? Output
    : Input;
