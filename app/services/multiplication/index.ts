import * as Comlink from "comlink";
import { MultiplicationClient } from "./worker";

export function getService() {
  if (typeof Worker === "undefined") return undefined;

  return Comlink.wrap<MultiplicationClient>(
    new Worker(new URL("./worker.ts", import.meta.url))
  );
}
