// Basic geometry types for 2D vehicle floor planning
export type Rect = {
  x: number;
  y: number;
  w: number;
  h: number;
};

export type VehicleGeometry = {
  floor: Rect;
  blockedZones: Rect[];
};

// ---- Utilities ----
export function rectArea(r: Rect): number {
  const w = Math.max(0, r.w);
  const h = Math.max(0, r.h);
  return w * h;
}

export function rectsIntersect(a: Rect, b: Rect): boolean {
  // Strict overlap only (touching edges is not an intersection of positive area)
  return (
    a.x < b.x + b.w &&
    a.x + a.w > b.x &&
    a.y < b.y + b.h &&
    a.y + a.h > b.y
  );
}

function intersection(a: Rect, b: Rect): Rect | null {
  const x1 = Math.max(a.x, b.x);
  const y1 = Math.max(a.y, b.y);
  const x2 = Math.min(a.x + a.w, b.x + b.w);
  const y2 = Math.min(a.y + a.h, b.y + b.h);
  const w = x2 - x1;
  const h = y2 - y1;
  if (w > 0 && h > 0) return { x: x1, y: y1, w, h };
  return null;
}

/**
 * Subtracts a set of blocked rectangles from the floor rect and returns
 * a list of free rectangles that cover the remaining area without overlaps.
 */
export function subtractBlockedZones(floor: Rect, blocked: Rect[]): Rect[] {
  // Start with single free area = floor
  let free: Rect[] = [floor];
  for (const b of blocked || []) {
    const next: Rect[] = [];
    for (const f of free) {
      const inter = intersection(f, b);
      if (!inter) {
        next.push(f);
        continue;
      }
      // Split f around the intersection into up to 4 rectangles
      const fx2 = f.x + f.w;
      const fy2 = f.y + f.h;
      const ix2 = inter.x + inter.w;
      const iy2 = inter.y + inter.h;

      // Left slice
      if (inter.x > f.x) {
        next.push({ x: f.x, y: f.y, w: inter.x - f.x, h: f.h });
      }
      // Right slice
      if (ix2 < fx2) {
        next.push({ x: ix2, y: f.y, w: fx2 - ix2, h: f.h });
      }
      // Top slice (above inter)
      if (inter.y > f.y) {
        next.push({ x: Math.max(f.x, inter.x), y: f.y, w: Math.min(fx2, ix2) - Math.max(f.x, inter.x), h: inter.y - f.y });
      }
      // Bottom slice (below inter)
      if (iy2 < fy2) {
        next.push({ x: Math.max(f.x, inter.x), y: iy2, w: Math.min(fx2, ix2) - Math.max(f.x, inter.x), h: fy2 - iy2 });
      }
    }
    // Filter out any degenerate rectangles (zero area) possibly produced by numeric issues
    free = next.filter(r => r.w > 0 && r.h > 0);
  }
  return free;
}
