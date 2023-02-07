import * as Comlink from "comlink";
import { BackendType } from "../../types";
import { CircomMultiplicationProover } from "./circom";
import { NoirMultiplicationProover } from "./noir";
import { IMultiplicationProver } from "./types";

function getProover(backend: BackendType): IMultiplicationProver {
  if (backend === "circom") return CircomMultiplicationProover.new();
  if (backend === "noir") return NoirMultiplicationProover.new();
  throw new Error("invalid backend");
}

export class MultiplicationClient {
  async generateProof(
    backend: BackendType,
    a: number,
    b: number,
    c: number
  ): Promise<string> {
    return getProover(backend).generateProof(a, b, c);
  }

  async verify(
    backend: BackendType,
    proof: string,
    pubOut: number
  ): Promise<boolean> {
    return getProover(backend).verify(proof, pubOut);
  }
}

Comlink.expose(new MultiplicationClient());
