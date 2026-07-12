import { expectTypeOf, test } from "vitest";
import { defaults, mapEach, merge, normalize, omit, pick, pipe, rename } from "../index.js";
import type { Omitted, Picked, Transform } from "../index.js";

const uniqueKey = Symbol("uniqueKey");

type User = {
  readonly id: 1;
  name: string;
  nickname?: string;
  nullable: string | null;
  maybe: number | undefined;
  7: "seven";
  [uniqueKey]: boolean;
};

test("pick and omit preserve exact field modifiers and value types", () => {
  const user = {} as User;
  expectTypeOf(pick(["id"])(user)).toEqualTypeOf<{ readonly id: 1 }>();
  expectTypeOf(pick(["id", "nickname", "nullable", "maybe"])(user)).toEqualTypeOf<{
    readonly id: 1;
    nickname?: string;
    nullable: string | null;
    maybe: number | undefined;
  }>();
  expectTypeOf(pick([])(user)).toEqualTypeOf<{}>();
  expectTypeOf(pick([7, uniqueKey] as const)(user)).toEqualTypeOf<{ 7: "seven"; [uniqueKey]: boolean }>();
  expectTypeOf(omit(["name"])(user)).toEqualTypeOf<Omit<User, "name">>();
  expectTypeOf(omit(["id", "name", "nickname", "nullable", "maybe", 7, uniqueKey] as const)(user)).toEqualTypeOf<{}>();
});

test("public utility types distribute over unions", () => {
  type Union = { kind: "a"; a: number; shared: string } | { kind: "b"; b: boolean; shared: string };
  type Selected = Picked<Union, "kind" | "a" | "b">;
  type Removed = Omitted<Union, "shared">;
  expectTypeOf<Selected>().toEqualTypeOf<{ kind: "a"; a: number } | { kind: "b"; b: boolean }>();
  expectTypeOf<Removed>().toEqualTypeOf<{ kind: "a"; a: number } | { kind: "b"; b: boolean }>();
});

test("supports index signatures, readonly arrays, and conservatively widened arrays", () => {
  const indexed = {} as { [key: string]: number; fixed: 1 };
  expectTypeOf(pick(["fixed"])(indexed)).toEqualTypeOf<{ fixed: 1 }>();
  const readonlyKeys = ["id", "name"] as const;
  expectTypeOf(pick(readonlyKeys)({ id: 1, name: "Ada", extra: true })).toEqualTypeOf<{ id: number; name: string }>();
  const mutableKeys: PropertyKey[] = ["id"];
  expectTypeOf(pick(mutableKeys)({ id: 1, name: "Ada" })).toEqualTypeOf<Partial<{ id: number; name: string }>>();
  expectTypeOf(omit(mutableKeys)({ id: 1, name: "Ada" })).toEqualTypeOf<Partial<{ id: number; name: string }>>();
});

test("explicit input forms validate keys", () => {
  const select = pick<{ id: number; name: string }>()(["id"]);
  const remove = omit<{ id: number; name: string }>()(["name"]);
  expectTypeOf(select).toEqualTypeOf<Transform<{ id: number; name: string }, { id: number }>>();
  expectTypeOf(remove).toEqualTypeOf<Transform<{ id: number; name: string }, { id: number }>>();
  // @ts-expect-error missing is not a key of the declared input
  pick<{ id: number; name: string }>()(["id", "missing"]);
  // @ts-expect-error missing is not a key of the declared input
  omit<{ id: number; name: string }>()(["missing"]);
});

test("composes exact types through every transform", () => {
  const renamed = pipe(pick(["user_id", "full_name"]), rename({ user_id: "id", full_name: "name" }))({ user_id: 1, full_name: "Ada", secret: true });
  expectTypeOf(renamed).toEqualTypeOf<{ id: number; name: string }>();

  const afterRename = pipe(rename({ user_id: "id" }), pick(["id", "name"]))({ user_id: 1, name: "Ada" });
  expectTypeOf(afterRename).toEqualTypeOf<{ id: number; name: string }>();

  const withDefault = pipe(omit(["password"]), defaults({ role: "viewer" as const }), pick(["id", "role"]))({ id: 1, password: "x" });
  expectTypeOf(withDefault).toEqualTypeOf<{ id: number; readonly role: "viewer" }>();

  const normalized = pipe(pick(["id", "balance"]), normalize({ balance: "number" }))({ id: 1, balance: "4.5", ignored: true });
  expectTypeOf(normalized).toEqualTypeOf<{ id: number; readonly balance: number | null }>();

  const merged = pipe(merge({ selected: true as const }), pick(["id", "selected"]))({ id: 1 });
  expectTypeOf(merged).toEqualTypeOf<{ id: number; readonly selected: true }>();

  const mapped = mapEach(pipe(omit(["secret"]), pick(["id"])))([{ id: 1, secret: "x" }]);
  expectTypeOf(mapped).toEqualTypeOf<Array<{ id: number }>>();
});

test("removed keys are unavailable to explicitly typed later stages", () => {
  type Input = { id: number; name: string; secret: string };
  const selected = pick<Input>()(["id", "name"]);
  // @ts-expect-error secret was removed by pick
  pipe(selected, pick<Picked<Input, "id" | "name">>()(["secret"]));
  const omitted = omit<Input>()(["secret"]);
  // @ts-expect-error secret was removed by omit
  pipe(omitted, pick<Omitted<Input, "secret">>()(["secret"]));
});
