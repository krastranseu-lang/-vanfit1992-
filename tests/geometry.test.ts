import { describe, it, expect } from "vitest";
import { Rect, subtractBlockedZones, rectArea, rectsIntersect } from "../src/geometry";

describe("subtractBlockedZones - basics", () => {
  it("no overlap returns original floor", () => {
    const floor: Rect = { x: 0, y: 0, w: 10, h: 2 };
    const blocked: Rect[] = [{ x: 11, y: 1, w: 1, h: 1 }];
    const free = subtractBlockedZones(floor, blocked);
    expect(free).toHaveLength(1);
    expect(free[0]).toEqual(floor);
  });

  it("full cover returns empty", () => {
    const floor: Rect = { x: 0, y: 0, w: 2, h: 1 };
    const blocked: Rect[] = [{ x: 0, y: 0, w: 2, h: 1 }];
    const free = subtractBlockedZones(floor, blocked);
    expect(free).toHaveLength(0);
  });
});

describe("edge cases – geometry", () => {
  it("blokada całkowicie na zewnątrz floor → wynik bez zmian", () => {
    const floor: Rect = { x: 0, y: 0, w: 5, h: 2 };
    // Completely outside to the right
    const blocked: Rect[] = [{ x: 6, y: 0.5, w: 1, h: 1 }];
    const free = subtractBlockedZones(floor, blocked);
    expect(free).toHaveLength(1);
    expect(free[0]).toEqual(floor);
  });

  it("blokady zachodzące na siebie – sekwencyjne odejmowanie równe scałkowaniu", () => {
    const floor: Rect = { x: 0, y: 0, w: 10, h: 5 };
    const A: Rect = { x: 2, y: 1, w: 4, h: 2 }; // area 8
    const B: Rect = { x: 4, y: 2, w: 4, h: 2 }; // area 8
    // Overlap: [4..6] × [2..3] => 2 × 1 = 2
    const overlapArea = 2 * 1;
    const unionArea = rectArea(A) + rectArea(B) - overlapArea; // 14
    const expectedFree = rectArea(floor) - unionArea; // 50 - 14 = 36

    const free = subtractBlockedZones(floor, [A, B]);
    // No free rect intersects blocked ones
    for (const f of free) {
      expect(rectsIntersect(f, A)).toBe(false);
      expect(rectsIntersect(f, B)).toBe(false);
    }
    const totalFree = free.reduce((s, r) => s + rectArea(r), 0);
    const EPS = 1e-9;
    expect(Math.abs(totalFree - expectedFree) < EPS).toBe(true);
  });
});

describe("subtractBlockedZones - two wheel arches (nadkola)", () => {
  it("free area excludes both arches and area matches floor minus blocked", () => {
    // Trailer floor (meters)
    const floor: Rect = { x: 0, y: 0, w: 13.6, h: 2.45 };
    // Two wheel arches: each 0.60m (length) x 0.25m (width), starting at x=3.00m from front wall
    const archLen = 0.60;
    const archWidth = 0.25;
    const startX = 3.0;
    const arch1: Rect = { x: startX, y: 0, w: archLen, h: archWidth }; // left side
    const arch2: Rect = { x: startX, y: floor.h - archWidth, w: archLen, h: archWidth }; // right side
    const blocked = [arch1, arch2];

    const free = subtractBlockedZones(floor, blocked);

    // 1) Ensure no free rect intersects with any blocked zone
    for (const f of free) {
      for (const b of blocked) {
        expect(rectsIntersect(f, b)).toBe(false);
      }
    }

    // 2) Area check: free area == floor area - sum(blocked within floor)
    const totalFree = free.reduce((s, r) => s + rectArea(r), 0);
    const floorArea = rectArea(floor);
    const blockedArea = rectArea(arch1) + rectArea(arch2);
    // Small epsilon due to float ops
    const EPS = 1e-9;
    expect(Math.abs(totalFree - (floorArea - blockedArea)) < EPS).toBe(true);
  });

  it("4.20×2.05 floor with two arches 0.60×0.25 at x=3.00 — no collisions; free area = floor - blocked", () => {
    const floor: Rect = { x: 0, y: 0, w: 4.20, h: 2.05 };
    const archLen = 0.60;
    const archWidth = 0.25;
    const startX = 3.0;
    const archLeft: Rect = { x: startX, y: 0, w: archLen, h: archWidth };
    const archRight: Rect = { x: startX, y: floor.h - archWidth, w: archLen, h: archWidth };
    const blocked = [archLeft, archRight];

    const free = subtractBlockedZones(floor, blocked);

    // No free rect overlaps blocked ones
    for (const f of free) {
      for (const b of blocked) {
        expect(rectsIntersect(f, b)).toBe(false);
      }
    }

    // Area equality within small epsilon
    const totalFree = free.reduce((s, r) => s + rectArea(r), 0);
    const eps = 1e-9;
    const floorArea = rectArea(floor);
    const blockedArea = rectArea(archLeft) + rectArea(archRight);
    expect(Math.abs(totalFree - (floorArea - blockedArea)) < eps).toBe(true);
  });
});
