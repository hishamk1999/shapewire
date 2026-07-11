export type AnyRecord = Readonly<Record<PropertyKey, unknown>>;

export type Transform<Input, Output> = (value: Input) => Output;

export type Simplify<T> = { [K in keyof T]: T[K] } & {};
