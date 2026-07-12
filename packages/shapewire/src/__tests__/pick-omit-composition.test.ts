import { describe, expect, expectTypeOf, it } from "vitest";
import { defaults, mapEach, merge, normalize, omit, pick, pipe, rename } from "../index.js";

describe("pick and omit composition", () => {
  it("composes in both orders", () => {
    const input = { id: 1, name: "Ada", password: "secret" };
    expect(pipe(pick(["id", "name", "password"]), omit(["password"]))(input)).toEqual({ id: 1, name: "Ada" });
    expect(pipe(omit(["password"]), pick(["id", "name"]))(input)).toEqual({ id: 1, name: "Ada" });
    expect(pipe(pick(["id", "name"]), omit(["name"]))(input)).toEqual({ id: 1 });
  });

  it("composes before and after rename", () => {
    const input = { user_id: 7, full_name: "Ada", email: "ada@example.com" };
    expect(pipe(pick(["user_id", "full_name"]), rename({ user_id: "id", full_name: "name" }))(input)).toEqual({ id: 7, name: "Ada" });
    expect(pipe(rename({ user_id: "id", full_name: "name" }), pick(["id", "name"]))(input)).toEqual({ id: 7, name: "Ada" });
  });

  it("composes with defaults, normalize, and merge", () => {
    expect(pipe(omit(["password_hash"]), defaults({ role: "viewer" as const }), pick(["id", "role"]))({ id: 1, password_hash: "secret" })).toEqual({ id: 1, role: "viewer" });
    expect(pipe(pick(["id", "balance"]), normalize({ balance: "number" }))({ id: 1, balance: "4.5", ignored: true })).toEqual({ id: 1, balance: 4.5 });
    expect(pipe(merge({ selected: true as const }), pick(["id", "selected"]))({ id: 1, name: "Ada" })).toEqual({ id: 1, selected: true });
  });

  it("applies independently through mapEach and preserves nullish list behavior", () => {
    const transform = mapEach(pipe(omit(["internal_notes"]), rename({ user_id: "id" })));
    expect(transform([{ user_id: 1, internal_notes: "x" }, { user_id: 2, internal_notes: "y" }])).toEqual([{ id: 1 }, { id: 2 }]);
    expect(transform(null)).toEqual([]);
    expect(transform(undefined)).toEqual([]);
  });

  it("infers composed output types", () => {
    const result = pipe(pick(["id", "name", "password"]), omit(["password"]))({ id: 1, name: "Ada", password: "secret" });
    expectTypeOf(result).toEqualTypeOf<{ id: number; name: string }>();
  });
});
