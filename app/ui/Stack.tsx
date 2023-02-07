import React, { ReactNode } from "react";

export function Stack({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-full flex-col justify-start gap-5">{children}</div>
  );
}
