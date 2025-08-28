import { describe, it, expect } from "vitest";
import { formatPercent } from "../src/components/LdmPanel";

describe("formatPercent (edge cases)", () => {
  it("returns 0 for used=0 and total>0", () => {
    expect(formatPercent(0, 10)).toBe("0");
  });

  it("returns 0 for total=0 (avoid division by zero)", () => {
    expect(formatPercent(5, 0)).toBe("0");
  });
});

