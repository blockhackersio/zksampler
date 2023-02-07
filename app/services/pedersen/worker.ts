import * as Comlink from "comlink";
import { BackendType } from "../../types";
import { CircomPedersenProover } from "./circom";
import { NoirPedersenProover } from "./noir";
import { IPedersenProver } from "./types";

function getProover(backend: BackendType): IPedersenProver {
  if (backend === "circom") return CircomPedersenProover.new();
  if (backend === "noir") return NoirPedersenProover.new();
  throw new Error("invalid backend");
}

export class PedersenClient {
  async generateHash(backend: BackendType, secret: string): Promise<string> {
    const prover = getProover(backend);
    return await prover.generateHash(secret);
  }

  async generateProof(
    backend: BackendType,
    secret: string,
    hash: string
  ): Promise<string> {
    const prover = getProover(backend);
    return prover.generateProof(secret, hash);
  }

  async verify(
    backend: BackendType,
    proof: string,
    hash: string
  ): Promise<boolean> {
    return getProover(backend).verify(proof, hash);
  }
}

Comlink.expose(new PedersenClient());
