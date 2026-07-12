/** A readonly object shape accepted by ShapeWire object transforms. */
export type AnyRecord = Readonly<Record<PropertyKey, unknown>>;

/** A synchronous transformation from one value to another. */
export type Transform<Input, Output> = (value: Input) => Output;

/** Flattens intersections into a readable object type. */
export type Simplify<Value> = { [Key in keyof Value]: Value[Key] } & {};
