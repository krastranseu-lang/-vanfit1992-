import React from "react";
import { formatLDM } from "../ldm";

export interface LdmPanelProps {
  usedLdm: number;
  totalLdm: number;
  className?: string;
}

/**
 * Formats percentage of LDM usage based on used and total.
 * - Guards against NaN/Infinity
 * - Clamps to [0, 100]
 * - Returns integer percentage as string (no % sign)
 */
export function formatPercent(used: number, total: number): string {
  const u = Number.isFinite(used) ? used : 0;
  const t = Number.isFinite(total) ? total : 0;
  const raw = t > 0 ? (u / t) * 100 : 0;
  const clamped = Math.min(100, Math.max(0, raw));
  return clamped.toFixed(0);
}

/**
 * Simple LDM panel. Renders: "Zajętość: {used} LDM z {total} ({percent}%)".
 */
export const LdmPanel: React.FC<LdmPanelProps> = ({ usedLdm, totalLdm, className }) => {
  const pct = formatPercent(usedLdm, totalLdm);
  return (
    <div className={className} aria-label="LDM usage">
      <strong>Zajętość:</strong> {formatLDM(usedLdm)} LDM z {formatLDM(totalLdm)} ({pct}%)
    </div>
  );
};

export default LdmPanel;
