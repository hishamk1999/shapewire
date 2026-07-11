import { describe, it, expect } from "vitest";
import { rename } from "./rename";

describe("rename", () => {
  it("renames keys based on the map", () => {
    const transform = rename({ user_id: "id", full_name: "name" });
    const result = transform({ user_id: 1, full_name: "Sara" });
    expect(result).toEqual({ id: 1, name: "Sara" });
  });

  it("leaves keys alone if not in the map", () => {
    const transform = rename({ user_id: "id" });
    const result = transform({ user_id: 1, email: "sara@example.com" });
    expect(result).toEqual({ id: 1, email: "sara@example.com" });
  });

  it("handles empty object", () => {
    const transform = rename({ user_id: "id" });
    const result = transform({});
    expect(result).toEqual({});
  });

  it("handles empty map", () => {
    const transform = rename({});
    const result = transform({ user_id: 1 });
    expect(result).toEqual({ user_id: 1 });
  });
});
