import { describe, it, expect } from "vitest";
import { ExactNanoScheme } from "../../index";

// ---------------------------------------------------

describe("@x402nano/exact", () => {
  it("should export ExactNanoScheme", () => {
    expect(ExactNanoScheme).toBeDefined();
    expect(typeof ExactNanoScheme).toBe("function");
  });
});
