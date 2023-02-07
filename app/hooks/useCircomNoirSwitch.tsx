import { useCallback, useState } from "react";
import { BackendType } from "@/types/index";
export function useCircomNoirSwitch(def: BackendType = "circom") {
  const [backend, setBackend] = useState<BackendType>(def);

  const onToggleChange = useCallback(async () => {
    setBackend((backend) => (backend === "circom" ? "noir" : "circom"));
  }, []);
  const toggleValue = backend === "noir";
  const toggleText = backend === "noir" ? "Noir" : "Circom";
  return [backend, onToggleChange, toggleValue, toggleText] as const;
}
