import React, { ReactNode } from "react";

export function TwoColLayoutCol(p: { children: ReactNode }) {
  return <div className="flex-1">{p.children}</div>;
}
