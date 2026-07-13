import { expectTypeOf, test } from "vitest";
import { at, defaults, mapEach, merge, normalize, omit, pick, pipe, rename } from "../index.js";

test("infers direct and multi-level nested output types", () => {
  const direct = at("profile", rename({ full_name: "name" }))({
    id: 1,
    profile: { full_name: "Hisham", active: true },
  });
  expectTypeOf(direct).toEqualTypeOf<{ id: number; profile: { name: string; active: boolean } }>();

  const nested = at("account.user.profile", merge({ selected: true as const }))({
    account: { user: { profile: { id: 1 }, sibling: "kept" }, plan: "pro" },
    root: true,
  });
  expectTypeOf(nested).toEqualTypeOf<{
    account: { user: { profile: { id: number; readonly selected: true }; sibling: string }; plan: string };
    root: boolean;
  }>();
});

test("preserves surrounding modifiers and non-object alternatives", () => {
  type Input = {
    readonly user?: {
      readonly profile: { readonly full_name: string; age?: number } | null;
    };
    readonly version: 1;
  };
  const result = at("user.profile", rename({ full_name: "name" }))({} as Input);
  expectTypeOf(result).toEqualTypeOf<{
    readonly user?: { readonly profile: { readonly name: string; age?: number } | null };
    readonly version: 1;
  }>();
});

test("infers every existing transform and nested pipelines", () => {
  expectTypeOf(at("value", defaults({ active: true as const }))({ value: { id: 1 } }))
    .toEqualTypeOf<{ value: { id: number; readonly active: true } }>();
  expectTypeOf(at("value", normalize({ count: "number" }))({ value: { count: "4", id: 1 } }))
    .toEqualTypeOf<{ value: { id: number; readonly count: number | null } }>();
  expectTypeOf(at("value", merge({ active: true as const }))({ value: { id: 1 } }))
    .toEqualTypeOf<{ value: { id: number; readonly active: true } }>();
  expectTypeOf(at("value", pick(["id"]))({ value: { id: 1, name: "Hisham" } }))
    .toEqualTypeOf<{ value: { id: number } }>();
  expectTypeOf(at("value", omit(["name"]))({ value: { id: 1, name: "Hisham" } }))
    .toEqualTypeOf<{ value: { id: number } }>();
  expectTypeOf(at("value", mapEach(rename({ user_id: "id" })))({ value: [{ user_id: 1 }] }))
    .toEqualTypeOf<{ value: Array<{ id: number }> }>();

  const piped = pipe(
    at("profile", pipe(rename({ full_name: "name" }), normalize({ score: "number" }))),
    merge({ ready: true as const }),
  )({ profile: { full_name: "Hisham", score: "5" } });
  expectTypeOf(piped).toEqualTypeOf<{
    profile: { name: string; readonly score: number | null };
    readonly ready: true;
  }>();
});

test("keeps the input type for missing and non-object paths", () => {
  const missing = at("user.profile", rename({ old: "current" }))({ user: { name: "Hisham" }, id: 1 });
  expectTypeOf(missing).toEqualTypeOf<{ user: { name: string }; id: number }>();

  const primitiveInput = {} as { profile: string | { old: number }; id: number };
  const primitive = at("profile", rename({ old: "current" }))(primitiveInput);
  expectTypeOf(primitive).toEqualTypeOf<{ profile: string | { current: number }; id: number }>();
});
