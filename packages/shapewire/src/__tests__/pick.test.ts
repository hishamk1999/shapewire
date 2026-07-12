import { describe, expect, it } from "vitest";
import { pick } from "../index.js";

describe("pick", () => {
  it("picks one, multiple, every, or zero properties in requested order", () => {
    const input = { id: 1, name: "Ada", email: "ada@example.com" };
    expect(pick(["id"])(input)).toEqual({ id: 1 });
    expect(pick(["email", "id"])(input)).toEqual({ email: "ada@example.com", id: 1 });
    expect(Reflect.ownKeys(pick(["name", "id", "email"])(input))).toEqual(["name", "id", "email"]);
    expect(pick([])(input)).toEqual({});
  });

  it("ignores unknown, duplicate, inherited, and non-enumerable keys", () => {
    const input = Object.create({ inherited: "no" }) as Record<PropertyKey, unknown>;
    input.id = 1;
    Object.defineProperty(input, "hidden", { value: "no", enumerable: false });
    expect(pick(["id", "missing", "id", "inherited", "hidden"] as PropertyKey[])(input)).toEqual({ id: 1 });
  });

  it("is shallow, immutable, and preserves values exactly", () => {
    const nested = { ok: true };
    const list = [1, 2];
    const fn = () => "ok";
    const valueSymbol = Symbol("value");
    const input = { nested, list, fn, undefinedValue: undefined, nullValue: null, falseValue: false, zero: 0, empty: "", nan: NaN, valueSymbol };
    const snapshot = { ...input };
    const result = pick(Object.keys(input) as Array<keyof typeof input>)(input);

    expect(result).not.toBe(input);
    expect(result).toEqual(input);
    expect(input).toEqual(snapshot);
    expect(result.nested).toBe(nested);
    expect(result.list).toBe(list);
    expect(result.fn).toBe(fn);
    expect(result.valueSymbol).toBe(valueSymbol);
    expect(result).toHaveProperty("undefinedValue", undefined);
    expect(Number.isNaN(result.nan)).toBe(true);
  });

  it("supports own enumerable symbol and numeric keys", () => {
    const symbol = Symbol("field");
    const input = { 7: "seven", [symbol]: "symbol", name: "Ada" };
    const result = pick([symbol, 7])(input);
    expect(result).toEqual({ [symbol]: "symbol", 7: "seven" });
    expect(Reflect.ownKeys(result)).toEqual(["7", symbol]);
  });

  it("reads a selected getter once and creates a data property", () => {
    let reads = 0;
    const input = Object.defineProperty({}, "value", { enumerable: true, get: () => ++reads });
    const result = pick(["value"] as PropertyKey[])(input as Record<PropertyKey, unknown>);
    expect(result).toEqual({ value: 1 });
    expect(reads).toBe(1);
    expect(Object.getOwnPropertyDescriptor(result, "value")?.get).toBeUndefined();
  });

  it("copies dangerous names without changing the result prototype", () => {
    const input: Record<PropertyKey, unknown> = {};
    for (const key of ["__proto__", "constructor", "prototype"] as const) {
      Object.defineProperty(input, key, { value: `${key}-value`, enumerable: true });
    }
    const result = pick(["__proto__", "constructor", "prototype"])(input);
    expect(Object.getPrototypeOf(result)).toBe(Object.prototype);
    expect(Object.prototype.hasOwnProperty.call(result, "__proto__")).toBe(true);
    expect(result.__proto__).toBe("__proto__-value");
    expect(result.constructor).toBe("constructor-value");
    expect(result.prototype).toBe("prototype-value");
  });

  it("works with frozen and sealed inputs", () => {
    expect(pick(["id"])(Object.freeze({ id: 1, secret: true }))).toEqual({ id: 1 });
    expect(pick(["id"])(Object.seal({ id: 1, secret: true }))).toEqual({ id: 1 });
  });

  it("rejects nullish and primitive inputs but handles arrays and functions as objects", () => {
    const transform = pick(["0", "extra"] as PropertyKey[]);
    for (const input of [null, undefined, "text", 1, true]) {
      expect(() => transform(input as never)).toThrow(TypeError);
    }
    const array = Object.assign(["first"], { extra: "yes" });
    expect(transform(array as never)).toEqual({ 0: "first", extra: "yes" });
    const fn = Object.assign(() => undefined, { extra: "yes" });
    expect(transform(fn as never)).toEqual({ extra: "yes" });
  });
});
