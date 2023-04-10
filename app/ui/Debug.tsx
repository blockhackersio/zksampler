import { Textarea } from "flowbite-react";
import { LoadingButton } from "./LoadingButton";

export function Debug(p: { debug: string[]; onResetRequested?: () => void }) {
  return (
    <>
      <Textarea value={p.debug.join("\n")} rows={20} />
      {p.onResetRequested && (
        <LoadingButton onClick={p.onResetRequested}>Reset</LoadingButton>
      )}
    </>
  );
}
