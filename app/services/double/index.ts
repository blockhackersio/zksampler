import * as Comlink from "comlink";
import { DoubleClient } from "./worker";

export function getService() {
  if (typeof Worker === "undefined") return undefined;

  return Comlink.wrap<DoubleClient>(
    new Worker(new URL("./worker.ts", import.meta.url))
  );
}
