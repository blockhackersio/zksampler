import { Button, Spinner } from "flowbite-react";
import React, { ReactNode } from "react";

export function LoadingButton(p: {
  children: ReactNode;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  loading?: boolean;
  fallback?: ReactNode;
}) {
  return (
    <Button onClick={p.onClick}>
      {p.loading ? (
        <>
          <Spinner />
          &nbsp; {p.fallback}
        </>
      ) : (
        p.children
      )}
    </Button>
  );
}
