import React, { ReactNode } from "react";

export function TwoColLayout(p: { children: ReactNode }) {
  return (
    <div className="flex flex-col md:flex-row md:justify-center md:items-start pt-4 lg:pt-32 pl-4 lg:pl-32 pr-4 lg:pr-32 gap-5 max-w-7xl ml-auto mr-auto">
      {p.children}
    </div>
  );
}
