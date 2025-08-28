// LDM utilities
// LDM = sum((length_i * width_i) / trailerWidth), where all units are meters

export type CargoPiece = { length: number; width: number };

function round2(n: number): number {
  return Math.round((n + Number.EPSILON) * 100) / 100;
}

function sane(n: unknown): number {
  const v = typeof n === "number" && Number.isFinite(n) ? n : 0;
  return v > 0 ? v : 0;
}

/**
 * Computes total LDM for given cargo pieces and trailer width (all in meters).
 * - Ignores non-positive/NaN dimensions by clamping to 0.
 * - Throws if trailerWidth <= 0 or not finite.
 * - Returns { usedLDM } rounded to 2 decimals.
 */
export function computeLDM(
  cargo: CargoPiece[],
  trailerWidth: number
): { usedLDM: number } {
  if (!Number.isFinite(trailerWidth) || trailerWidth <= 0) {
    throw new Error("trailerWidth must be a positive number in meters");
  }
  let sum = 0;
  for (const piece of cargo || []) {
    const L = sane(piece?.length);
    const W = sane(piece?.width);
    if (L === 0 || W === 0) continue;
    sum += (L * W) / trailerWidth;
  }
  return { usedLDM: round2(sum) };
}

/** Formats LDM value to 2 decimals, e.g. 7.5 -> "7.50" */
export function formatLDM(value: number): string {
  const v = Number.isFinite(value) ? value : 0;
  return v.toFixed(2);
}

export default computeLDM;

