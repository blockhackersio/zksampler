import * as Comlink from "comlink";
import { PedersenClient } from "./worker";

export function getService() {
  if (typeof Worker === "undefined") return undefined;

  return Comlink.wrap<PedersenClient>(
    new Worker(new URL("./worker.ts", import.meta.url))
  );
}
