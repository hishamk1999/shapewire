import type { Transform } from "./types.js";

export function pipe<A, B>(ab: Transform<A, B>): Transform<A, B>;
export function pipe<A, B, C>(ab: Transform<A, B>, bc: Transform<B, C>): Transform<A, C>;
export function pipe<A, B, C, D>(ab: Transform<A, B>, bc: Transform<B, C>, cd: Transform<C, D>): Transform<A, D>;
export function pipe<A, B, C, D, E>(ab: Transform<A, B>, bc: Transform<B, C>, cd: Transform<C, D>, de: Transform<D, E>): Transform<A, E>;
export function pipe(...transforms: ReadonlyArray<Transform<unknown, unknown>>) {
  return (input: unknown) => transforms.reduce((value, transform) => transform(value), input);
}
