import { describe, expect, it } from "vitest";
import { omit } from "../index.js";

describe("omit", () => {
  it("omits one, multiple, every, or zero properties", () => {
    const input = { id: 1, name: "Ada", password: "secret" };
    expect(omit(["password"])(input)).toEqual({ id: 1, name: "Ada" });
    expect(omit(["name", "password"])(input)).toEqual({ id: 1 });
    expect(omit(["id", "name", "password"])(input)).toEqual({});
    const copy = omit([])(input);
    expect(copy).toEqual(input);
    expect(copy).not.toBe(input);
  });

  it("ignores unknown and duplicate omissions and preserves source enumeration order", () => {
    const input = { third: 3, first: 1, second: 2 };
    const result = omit(["missing", "first", "first"] as PropertyKey[])(input);
    expect(Reflect.ownKeys(result)).toEqual(["third", "second"]);
  });

  it("copies only own enumerable properties", () => {
    const input = Object.create({ inherited: "no" }) as Record<PropertyKey, unknown>;
    input.id = 1;
    Object.defineProperty(input, "hidden", { value: "no", enumerable: false });
    expect(omit([])(input)).toEqual({ id: 1 });
  });

  it("is shallow, immutable, and preserves all retained values", () => {
    const nested = { ok: true };
    const list = [1, 2];
    const fn = () => "ok";
    const input = { nested, list, fn, undefinedValue: undefined, nullValue: null, falseValue: false, zero: 0, empty: "", nan: NaN, secret: "remove" };
    const snapshot = { ...input };
    const result = omit(["secret"])(input);
    expect(result).not.toBe(input);
    expect(input).toEqual(snapshot);
    expect(result.nested).toBe(nested);
    expect(result.list).toBe(list);
    expect(result.fn).toBe(fn);
    expect(result).toHaveProperty("undefinedValue", undefined);
    expect(Number.isNaN(result.nan)).toBe(true);
  });

  it("preserves or omits own enumerable symbol and numeric keys", () => {
    const kept = Symbol("kept");
    const removed = Symbol("removed");
    const input = { 7: "seven", 8: "eight", [kept]: "yes", [removed]: "no" };
    expect(omit([8, removed])(input)).toEqual({ 7: "seven", [kept]: "yes" });
  });

  it("reads each retained getter once and does not read omitted getters", () => {
    let keptReads = 0;
    let omittedReads = 0;
    const input = {};
    Object.defineProperty(input, "kept", { enumerable: true, get: () => ++keptReads });
    Object.defineProperty(input, "omitted", { enumerable: true, get: () => ++omittedReads });
    const result = omit(["omitted"] as PropertyKey[])(input as Record<PropertyKey, unknown>);
    expect(result).toEqual({ kept: 1 });
    expect(keptReads).toBe(1);
    expect(omittedReads).toBe(0);
  });

  it("copies dangerous names safely when retained", () => {
    const input: Record<PropertyKey, unknown> = { safe: true };
    for (const key of ["__proto__", "constructor", "prototype"] as const) {
      Object.defineProperty(input, key, { value: `${key}-value`, enumerable: true });
    }
    const result = omit(["safe"])(input);
    expect(Object.getPrototypeOf(result)).toBe(Object.prototype);
    expect(Object.prototype.hasOwnProperty.call(result, "__proto__")).toBe(true);
    expect(result.__proto__).toBe("__proto__-value");
  });

  it("works with frozen and sealed inputs", () => {
    expect(omit(["secret"])(Object.freeze({ id: 1, secret: true }))).toEqual({ id: 1 });
    expect(omit(["secret"])(Object.seal({ id: 1, secret: true }))).toEqual({ id: 1 });
  });

  it("rejects nullish and primitive inputs but handles arrays and functions as objects", () => {
    const transform = omit(["extra"] as PropertyKey[]);
    for (const input of [null, undefined, "text", 1, true]) {
      expect(() => transform(input as never)).toThrow(TypeError);
    }
    const array = Object.assign(["first"], { extra: "no" });
    expect(transform(array as never)).toEqual({ 0: "first" });
    const fn = Object.assign(() => undefined, { extra: "no", kept: "yes" });
    expect(transform(fn as never)).toEqual({ kept: "yes" });
  });
});
