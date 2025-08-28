import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { LdmPanel } from "../src/components/LdmPanel";

describe("LdmPanel (RTL)", () => {
  it("renders 'Zajętość: 7.50 LDM z 13.60 (55%)' for used=7.5, total=13.6", () => {
    render(<LdmPanel usedLdm={7.5} totalLdm={13.6} />);
    const region = screen.getByLabelText(/LDM usage/i);
    // Check entire string presence (percent rounded to 0 decimals)
    expect(region.textContent || "").toContain("Zajętość: 7.50 LDM z 13.60 (55%)");
  });
});
