import { describe, it, expect } from "vitest"; // Works with Jest as well (API-compatible)
import { computeLDM, formatLDM } from "../src/ldm";

describe("computeLDM", () => {
  it("returns 0 for empty cargo", () => {
    const res = computeLDM([], 2.45);
    expect(res.usedLDM).toBe(0);
  });

  it("throws for non-positive trailer width", () => {
    expect(() => computeLDM([{ length: 1, width: 1 }], 0)).toThrow();
    expect(() => computeLDM([{ length: 1, width: 1 }], -2)).toThrow();
  });

  it("full width cargo -> LDM equals length", () => {
    const trailerW = 2.45;
    const res = computeLDM([{ length: 13.6, width: trailerW }], trailerW);
    expect(res.usedLDM).toBe(13.6);
  });

  it("half width cargo -> LDM is half of length", () => {
    const trailerW = 2.45;
    const half = trailerW / 2;
    const res = computeLDM([{ length: 10, width: half }], trailerW);
    expect(res.usedLDM).toBe(5);
  });

  it("sums across pieces", () => {
    const trailerW = 2.5;
    const res = computeLDM(
      [
        { length: 5, width: 2.5 }, // 5
        { length: 2, width: 1.25 }, // 1
      ],
      trailerW
    );
    expect(res.usedLDM).toBe(6);
  });

  it("different trailer widths affect LDM", () => {
    const cargo = [{ length: 10, width: 2.0 }];
    const resA = computeLDM(cargo, 2.50); // 10*2 / 2.5 = 8.00
    const resB = computeLDM(cargo, 2.45); // 10*2 / 2.45 ≈ 8.163 -> 8.16
    expect(resA.usedLDM).toBe(8);
    expect(resB.usedLDM).toBe(8.16);
  });

  it("rounds to 2 decimals", () => {
    const res = computeLDM([{ length: 1.234, width: 1.234 }], 2.0); // 1.234*1.234/2 = 0.761... -> 0.76
    expect(res.usedLDM).toBe(0.76);
  });

  it("ignores invalid/negative parts via clamp", () => {
    const res = computeLDM([
      { length: -5, width: 2.45 },
      { length: 3, width: 0 },
      { length: 2, width: 1 },
    ], 2.0);
    // Only last contributes: 2*1/2 = 1 -> 1.00
    expect(res.usedLDM).toBe(1);
  });
});

describe("formatLDM", () => {
  it("formats to two decimals", () => {
    expect(formatLDM(7.5)).toBe("7.50");
    expect(formatLDM(8)).toBe("8.00");
  });
});

