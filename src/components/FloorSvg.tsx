import type { VehicleGeometry, Rect } from "../geometry";

export type FloorSvgProps = {
  geometry: VehicleGeometry;
  /** Pixels per meter for rendered size (only affects outer width/height). Default: 100 */
  pxPerMeter?: number;
  /** Optional title for accessibility */
  title?: string;
};

/**
 * Simple SVG renderer for vehicle floor geometry.
 * - Scales world meters to SVG via viewBox
 * - Draws the floor as a light background rectangle
 * - Draws blocked zones (e.g., wheel arches) as darker rectangles
 */
export default function FloorSvg({ geometry, pxPerMeter = 100, title }: FloorSvgProps) {
  const floor = geometry.floor;
  const blocks: Rect[] = Array.isArray(geometry.blockedZones)
    ? geometry.blockedZones
    : [];

  const widthPx = Math.max(1, floor.w * pxPerMeter);
  const heightPx = Math.max(1, floor.h * pxPerMeter);

  // Map meters directly into SVG units using viewBox
  const viewBox = `${floor.x} ${floor.y} ${floor.w} ${floor.h}`;

  const bg = "#eef5ff"; // light floor fill
  const line = "#c8d6f2"; // light outline
  const blockedFill = "rgba(0,0,0,0.28)"; // dimmed overlay for blocked rects

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={widthPx}
      height={heightPx}
      viewBox={viewBox}
      role="img"
      aria-label={title || "Vehicle floor plan"}
      style={{ display: "block", maxWidth: "100%", height: "auto" }}
    >
      {title ? <title>{title}</title> : null}
      {/* Floor background */}
      <rect x={floor.x} y={floor.y} width={floor.w} height={floor.h} fill={bg} stroke={line} />

      {/* Blocked zones */}
      {blocks.map((b, i) => (
        <rect
          key={i}
          x={b.x}
          y={b.y}
          width={b.w}
          height={b.h}
          fill={blockedFill}
          stroke={line}
        />
      ))}
    </svg>
  );
}

