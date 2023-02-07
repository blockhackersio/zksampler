import * as Comlink from "comlink";
import { BackendType } from "../../types";
import { CircomDoubleProover } from "./circom";
import { NoirDoubleProover } from "./noir";
import { IDoubleProver } from "./types";

function getProover(backend: BackendType): IDoubleProver {
  if (backend === "circom") return CircomDoubleProover.new();
  if (backend === "noir") return NoirDoubleProover.new();
  throw new Error("invalid backend");
}

export class DoubleClient {
  async generateProof(
    backend: BackendType,
    a: number,
    b: number,
    c: number,
    d: number
  ): Promise<string> {
    return getProover(backend).generateProof(a, b, c, d);
  }

  async verify(
    backend: BackendType,
    proof: string,
    pubOut: number
  ): Promise<boolean> {
    return getProover(backend).verify(proof, pubOut);
  }
}

Comlink.expose(new DoubleClient());
