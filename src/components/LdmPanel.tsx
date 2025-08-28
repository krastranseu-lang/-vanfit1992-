import React from "react";
import { formatLDM } from "../ldm";

export interface LdmPanelProps {
  usedLdm: number;
  totalLdm: number;
  className?: string;
}

/**
 * Simple LDM panel. Renders: "Zajętość: {used} LDM z {total} ({percent}%)".
 */
export const LdmPanel: React.FC<LdmPanelProps> = ({ usedLdm, totalLdm, className }) => {
  const pct = totalLdm > 0 ? Math.min(100, Math.max(0, (usedLdm / totalLdm) * 100)) : 0;
  return (
    <div className={className} aria-label="LDM usage">
      <strong>Zajętość:</strong> {formatLDM(usedLdm)} LDM z {formatLDM(totalLdm)} ({pct.toFixed(0)}%)
    </div>
  );
};

export default LdmPanel;

