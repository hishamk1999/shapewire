import { describe, expect, it } from "vitest";
import { at, defaults, mapEach, merge, normalize, omit, pick, pipe, rename } from "../index.js";

describe("at", () => {
  it("transforms a direct nested object", () => {
    const input = {
      user_id: 1,
      profile: { full_name: "Hisham", created_at: "2026-07-13" },
    };

    expect(at("profile", rename({ full_name: "name" }))(input)).toEqual({
      user_id: 1,
      profile: { name: "Hisham", created_at: "2026-07-13" },
    });
  });

  it("transforms an object through multiple nesting levels", () => {
    const input = { account: { user: { profile: { full_name: "Hisham" } } }, active: true };
    expect(at("account.user.profile", rename({ full_name: "name" }))(input)).toEqual({
      account: { user: { profile: { name: "Hisham" } } },
      active: true,
    });
  });

  it("composes with pipe inside and outside at", () => {
    const transform = pipe(
      at(
        "profile",
        pipe(
          rename({ full_name: "name", created_at: "createdAt" }),
          normalize({ createdAt: "isoDate" }),
          merge({ visible: true as const }),
        ),
      ),
      defaults({ role: "viewer" as const }),
    );

    expect(transform({ profile: { full_name: "Hisham", created_at: "2026-07-13" } })).toEqual({
      profile: { name: "Hisham", createdAt: "2026-07-13T00:00:00.000Z", visible: true },
      role: "viewer",
    });
  });

  it("supports every existing transform", () => {
    expect(at("value", rename({ old: "current" }))({ value: { old: 1 } })).toEqual({ value: { current: 1 } });
    expect(at("value", defaults({ enabled: true }))({ value: { enabled: null } })).toEqual({ value: { enabled: true } });
    expect(at("value", normalize({ count: "number" }))({ value: { count: "4" } })).toEqual({ value: { count: 4 } });
    expect(at("value", merge({ selected: true }))({ value: { id: 1 } })).toEqual({ value: { id: 1, selected: true } });
    expect(at("value", pick(["id"]))({ value: { id: 1, secret: true } })).toEqual({ value: { id: 1 } });
    expect(at("value", omit(["secret"]))({ value: { id: 1, secret: true } })).toEqual({ value: { id: 1 } });
    expect(at("value", mapEach(rename({ user_id: "id" })))({ value: [{ user_id: 1 }, { user_id: 2 }] })).toEqual({
      value: [{ id: 1 }, { id: 2 }],
    });
  });

  it("returns the original object for missing paths", () => {
    const input = { user: { name: "Hisham" }, untouched: { stable: true } };
    const direct = at("profile", merge({ active: true }))(input);
    const nested = at("user.profile", merge({ active: true }))(input);
    expect(direct).toBe(input);
    expect(nested).toBe(input);
  });

  it("returns the original object for null and non-object target values", () => {
    const transform = at("profile", merge({ active: true }));
    for (const profile of [null, undefined, "text", 0, false, 1n, Symbol("profile")]) {
      const input = { profile };
      expect(transform(input as never)).toBe(input);
    }
  });

  it("does not mutate input and clones only objects along the path", () => {
    const profile = Object.freeze({ full_name: "Hisham", preferences: { theme: "dark" } });
    const user = Object.freeze({ profile, sessions: [{ id: 1 }] });
    const metadata = { requestId: "request-1" };
    const input = Object.freeze({ user, metadata });

    const result = at("user.profile", rename({ full_name: "name" }))(input);

    expect(result).not.toBe(input);
    expect(result.user).not.toBe(user);
    expect(result.user.profile).not.toBe(profile);
    expect(result.metadata).toBe(metadata);
    expect(result.user.sessions).toBe(user.sessions);
    expect(result.user.profile.preferences).toBe(profile.preferences);
    expect(input).toEqual({ user, metadata });
  });

  it("returns the original root when the nested transform returns its input", () => {
    const input = { profile: { name: "Hisham" }, stable: { value: true } };
    expect(at("profile", (value: object) => value)(input)).toBe(input);
  });

  it("handles unsupported paths, inherited fields, arrays, and dangerous own names safely", () => {
    const input = Object.create({ profile: { inherited: true } }) as { profile?: object; list: Array<{ old: number }> };
    input.list = [{ old: 1 }];

    expect(at("", merge({ active: true }))(input)).toBe(input);
    expect(at("user..profile", merge({ active: true }))(input)).toBe(input);
    expect(at("profile", merge({ active: true }))(input)).toBe(input);
    expect(at("list.0", rename({ old: "current" }))(input)).toEqual({ list: [{ current: 1 }] });

    const dangerous: Record<string, unknown> = {};
    Object.defineProperty(dangerous, "__proto__", { value: { old: 1 }, enumerable: true });
    const result = at("__proto__", rename({ old: "current" }))(dangerous);
    expect(Object.getPrototypeOf(result)).toBe(Object.prototype);
    expect(Object.prototype.hasOwnProperty.call(result, "__proto__")).toBe(true);
    expect(result.__proto__).toEqual({ current: 1 });
  });
});
