import { describe, expect, expectTypeOf, it } from "vitest";
import { defaults, mapEach, merge, normalize, pipe, rename } from "./index.js";

describe("transform pipeline", () => {
  it("infers output fields across transforms", () => {
    const transform = pipe(
      rename({ user_id: "id" }),
      defaults({ role: "viewer" as const }),
      normalize({ balance: "number" }),
      merge({ active: true as const }),
    );
    const result = transform({ user_id: 1, balance: "4.5" });

    expectTypeOf(result.id).toEqualTypeOf<number>();
    expectTypeOf(result.role).toEqualTypeOf<"viewer">();
    expectTypeOf(result.balance).toEqualTypeOf<number | null>();
    expectTypeOf(result.active).toEqualTypeOf<true>();
  });

  it("composes a UI-ready user transform", () => {
    const transform = pipe(
      rename({ user_id: "id", created_at: "createdAt" }),
      defaults({ role: "viewer", verified: false }),
      normalize({ createdAt: "isoDate", balance: "number", verified: "boolean" }),
    );

    expect(transform({ user_id: 7, created_at: "2025-01-02", balance: "12.50", verified: "yes" })).toEqual({
      id: 7,
      createdAt: "2025-01-02T00:00:00.000Z",
      balance: 12.5,
      role: "viewer",
      verified: true,
    });
  });

  it("is null-safe for defaults, normalizers, and arrays", () => {
    expect(defaults({ count: 3 })({ count: 0, label: null })).toEqual({ count: 0, label: null });
    expect(normalize({ value: "number", active: "boolean" })({ value: "nope", active: undefined })).toEqual({ value: null, active: null });
    expect(mapEach(rename({ user_id: "id" }))(null)).toEqual([]);
  });

  it("merges another source without mutating either input", () => {
    const left = { id: 1, name: "Old" };
    const right = { name: "New", role: "admin" as const };
    expect(merge(right)(left)).toEqual({ id: 1, name: "New", role: "admin" });
    expect(left).toEqual({ id: 1, name: "Old" });
  });
});
